/* Puente nativo (solo dentro del APK de Capacitor). Se carga DESPUÉS de app.js y sustituye lo que no funciona en un WebView:
   inicio de sesión de Google (PKCE + navegador del sistema), recordatorios con la app cerrada, descargas, huella y carpetas. */
(function () {
  const C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;
  const P = C.Plugins, FS = P.Filesystem, LN = P.LocalNotifications, BA = P.BiometricAuth, APP = P.App, BR = P.Browser;
  window.NATIVE_APP = true;
  const REDIRECT = 'com.ecourtade.audiomanager:/oauth2redirect';

  // --- Service worker: dentro del APK los archivos ya van empaquetados, y una caché vieja pisaría las actualizaciones
  try { navigator.serviceWorker.register = () => Promise.resolve(); navigator.serviceWorker.getRegistration = () => Promise.resolve(undefined); } catch (e) {}
  // La copia JSON automática no necesita un toque del usuario para guardar el archivo
  try { Object.defineProperty(navigator, 'userActivation', { get: () => ({ isActive: true, hasBeenActive: true }) }); } catch (e) {}

  // --- Descargas / exportaciones: se guardan en Documentos/AudioManager
  const blobToB64 = blob => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(blob); });
  window.download = async function (name, blob) {
    try {
      await FS.writeFile({ path: 'AudioManager/' + name, data: await blobToB64(blob), directory: 'DOCUMENTS', recursive: true });
      toast('Guardado en Documentos/AudioManager/' + name);
    } catch (e) { toast('No se pudo guardar el archivo: ' + (e.message || e)); }
  };
  // showDirectoryPicker no existe en el WebView (dirSupported() da false): las copias van a Documentos/AudioManager

  // --- Inicio de sesión de Google: navegador del sistema + PKCE + redirección por esquema propio.
  // Con "access_type=offline" Google devuelve un token de refresco: las siguientes veces se renueva en silencio, sin pantalla de acceso.
  const b64url = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const tokenPost = async params => {
    const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(params) });
    const j = await r.json(); if (!r.ok || j.error) { const e = new Error(j.error_description || j.error || 'Error de Google'); e.code = j.error; throw e; }
    return j;
  };
  const setTok = j => { gToken = j.access_token; gExp = Date.now() + j.expires_in * 1000; if (j.refresh_token) pref('g_refresh', j.refresh_token); return gToken; };
  let pendingAuth = null;
  APP.addListener('appUrlOpen', ev => {
    if (!pendingAuth || !ev.url || !ev.url.startsWith('com.ecourtade.audiomanager:')) return;
    const u = new URL(ev.url), p = pendingAuth; pendingAuth = null; try { BR.close(); } catch (e) {}
    u.searchParams.get('code') ? p.res(u.searchParams.get('code')) : p.rej(new Error(u.searchParams.get('error') || 'Cancelaste el inicio de sesión'));
  });
  window.getToken = async function (auto, force) {
    if (!force && gToken && Date.now() < gExp - 60000) return gToken;
    const cid = pref('gclient'); if (!cid) throw new Error('noclient');
    const rt = pref('g_refresh');
    if (rt && !force) {
      try { return setTok(await tokenPost({ client_id: cid, grant_type: 'refresh_token', refresh_token: rt })); }
      catch (e) { if (e.code === 'invalid_grant') pref('g_refresh', ''); else if (auto) throw e; }
    }
    if (auto) throw new Error('needtoken');
    const verifier = b64url(crypto.getRandomValues(new Uint8Array(48))), challenge = b64url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
    const q = new URLSearchParams({ client_id: cid, redirect_uri: REDIRECT, response_type: 'code', scope: 'https://www.googleapis.com/auth/drive.appdata', code_challenge: challenge, code_challenge_method: 'S256', access_type: 'offline', prompt: force || !pref('g_refresh') ? 'consent select_account' : '' });
    if (pref('gemail')) q.set('login_hint', pref('gemail'));
    const code = await new Promise((res, rej) => { pendingAuth = { res, rej }; BR.open({ url: 'https://accounts.google.com/o/oauth2/v2/auth?' + q }).catch(rej); });
    return setTok(await tokenPost({ client_id: cid, code, code_verifier: verifier, redirect_uri: REDIRECT, grant_type: 'authorization_code' }));
  };
  // El navegador del sistema se cierra sin avisar si el usuario vuelve atrás: no dejar la promesa colgada
  APP.addListener('appStateChange', s => { if (s.isActive && pendingAuth) setTimeout(() => { if (pendingAuth) { const p = pendingAuth; pendingAuth = null; p.rej(new Error('Cancelaste el inicio de sesión')); } }, 4000); });
  const so = window.googleSignOut; if (typeof so === 'function') window.googleSignOut = async function () { pref('g_refresh', ''); return so.apply(this, arguments); };

  // --- Huella / patrón / PIN del teléfono (en lugar de WebAuthn, que el WebView no ofrece)
  bio.available = async () => { try { const r = await BA.checkBiometry(); return !!(r.isAvailable || r.deviceIsSecure); } catch (e) { return false; } };
  bio.register = async () => { pref('bio_cred', 'native'); };
  bio.assert = async () => {
    try { await BA.authenticate({ reason: 'Desbloquear', cancelTitle: 'Cancelar', allowDeviceCredential: true, androidTitle: 'Audio Manager', androidSubtitle: 'Confirma que eres tú' }); }
    catch (e) { const err = new Error(e.message || 'Cancelado'); err.name = 'NotAllowedError'; throw err; }
    return { prf: null };
  };
  window.recVerify = async function () {
    if (!(await bio.available())) return await confirmD('Este teléfono no tiene huella, PIN ni patrón de bloqueo, así que no puedo pedirlo. ¿Continuar igualmente?');
    try { await bio.assert(); return true; } catch (e) { return false; }
  };

  // --- Recordatorios con la app cerrada (notificaciones locales programadas)
  let remBusy = false;
  const rid = id => { let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h) % 2147483000 + 1; };
  async function scheduleReminders() {
    if (remBusy) return; remBusy = true;
    try {
      let perm = await LN.checkPermissions(); if (perm.display === 'prompt' || perm.display === 'prompt-with-rationale') perm = await LN.requestPermissions();
      if (perm.display !== 'granted') return;
      const pend = await LN.getPending(); if (pend.notifications.length) await LN.cancel({ notifications: pend.notifications.map(n => ({ id: n.id })) });
      const now = Date.now(), list = S.notes.filter(n => n.reminder && !n.fired && !n.deleted && n.reminder > now).slice(0, 60);
      if (list.length) await LN.schedule({ notifications: list.map(n => ({ id: rid(n.id), title: 'Recordatorio', body: noteTitle(n), schedule: { at: new Date(n.reminder), allowWhileIdle: true } })) });
    } catch (e) { /* sin permiso o sin alarmas exactas: queda el aviso con la app abierta */ } finally { remBusy = false; }
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) scheduleReminders(); });
  APP.addListener('pause', scheduleReminders);
  setTimeout(scheduleReminders, 4000);
})();
