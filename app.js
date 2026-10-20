'use strict';
/* ============ Utilidades ============ */
const $ = id => document.getElementById(id);
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
const pref = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; };
function el(tag, props = {}, ...kids) {
  const e = Object.assign(document.createElement(tag), props);
  kids.flat().forEach(k => k != null && e.append(k));
  return e;
}
const fmtDate = t => new Date(t).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const loadScript = src => new Promise((res, rej) => {
  if (document.querySelector(`script[data-src="${src}"]`)) return res();
  const sc = document.createElement('script'); sc.src = src; sc.dataset.src = src; sc.onload = res; sc.onerror = () => { sc.remove(); rej(new Error('No se pudo cargar ' + src + ' (¿sin conexión?)')); }; document.head.append(sc);
});

const ICONS = {
  plus: '<path d="M12 5v14M5 12h14"/>', search: '<circle cx="10" cy="10" r="6"/><path d="M15 15l6 6"/>',
  more: '<circle cx="12" cy="5" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="19" r="1.6" fill="currentColor"/>',
  back: '<path d="M20 12H5M11 6l-6 6 6 6"/>', close: '<path d="M6 6l12 12M18 6L6 18"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',
  share: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="7.5" r=".6" fill="currentColor"/>',
  folder: '<path d="M3 6h7l2 2h9v11H3z"/>', check: '<path d="M4 12l5 5L20 6"/>',
  checks: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 12l4 4 6-8"/>',
  palette: '<path d="M12 3a9 9 0 100 18c1.6 0 2.2-1 1.6-2.2s0-2.3 1.4-2.3h2a3.2 3.2 0 003-3.3C20 7 16 3 12 3z"/><circle cx="8" cy="11" r="1" fill="currentColor"/><circle cx="12" cy="7.5" r="1" fill="currentColor"/><circle cx="16" cy="10" r="1" fill="currentColor"/>',
  down: '<path d="M12 5v14M6 13l6 6 6-6"/>', up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
  play: '<path d="M7 4l13 8-13 8z" fill="currentColor"/>', stop: '<rect x="6" y="6" width="12" height="12" fill="currentColor"/>',
  rec: '<circle cx="12" cy="12" r="8" fill="currentColor"/>', undo: '<path d="M9 14L4 9l5-5M4 9h10a6 6 0 010 12h-3"/>',
  bell: '<path d="M6 16v-5a6 6 0 0112 0v5l2 2H4zM10 21h4"/>', lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
  sync: '<path d="M20 11a8 8 0 00-14-4M4 4v4h4M4 13a8 8 0 0014 4M20 20v-4h-4"/>', brush: '<path d="M4 20l5-1 9-9-4-4-9 9zM14 6l4 4"/>',
  redo: '<path d="M15 14l5-5-5-5M20 9H10a6 6 0 000 12h3"/>',
  tag: '<path d="M3 12V4h8l9 9-8 8z"/><circle cx="7.5" cy="8" r="1" fill="currentColor"/>', filter: '<path d="M3 5h18l-7 8v6l-4-2v-4z"/>',
  link: '<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>',
  sort: '<path d="M4 6h16M4 12h11M4 18h6"/>', selall: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 12l4 4 6-8"/>',
  move: '<path d="M3 6h7l2 2h9v11H3z"/><path d="M9 14h7M13 11l3 3-3 3"/>',
};
const ic = n => `<svg class="ic" viewBox="0 0 24 24">${ICONS[n]}</svg>`;
const setIcons = () => {
  const map = { selTag: 'tag', searchFilter: 'filter', ckUndo: 'undo', ckRedo: 'redo', syncBtn: 'sync', addBtn: 'plus', folderBtn: 'folder', searchBtn: 'search', moreBtn: 'more', selClose: 'close', selAll: 'selall', selMove: 'move', selDel: 'trash',
    edBack: 'back', edDel: 'trash', edShare: 'share', edInfo: 'info', edMore: 'more', findPrev: 'up', findNext: 'down', addItem: 'plus', addMic: 'mic', addSort: 'sort', fdBack: 'back', fdMore: 'more', stBack: 'back' };
  for (const [id, n] of Object.entries(map)) $(id).innerHTML = ic(n);
};
const TYPE_ICON = {
  text: '<svg class="ti" viewBox="0 0 34 34"><rect x="7" y="3" width="20" height="28" rx="2" fill="#e8e8e8" stroke="#888"/><path d="M11 10h12M11 15h12M11 20h12M11 25h8" stroke="#999" stroke-width="1.6"/></svg>',
  check: '<svg class="ti" viewBox="0 0 34 34"><rect x="7" y="3" width="20" height="28" rx="2" fill="#e8e8e8" stroke="#888"/><path d="M10 10l2 2 3-4M10 18l2 2 3-4M10 26l2 2 3-4" stroke="#2a58b8" stroke-width="1.8" fill="none"/><path d="M17 11h7M17 19h7M17 27h7" stroke="#999" stroke-width="1.6"/></svg>',
  voice: '<svg class="ti" viewBox="0 0 34 34"><rect x="13" y="4" width="8" height="16" rx="4" fill="#8a96a8" stroke="#556"/><path d="M8 16a9 9 0 0018 0M17 25v5" stroke="#8a96a8" stroke-width="2.4" fill="none"/></svg>',
  draw: '<svg class="ti" viewBox="0 0 34 34"><path d="M5 29c5-1 3-6 8-8l11-13 3 3-13 11c-2 4-6 4-9 7z" fill="#5aa2ff" stroke="#2a58b8"/><path d="M24 8l3 3" stroke="#ddd" stroke-width="3"/></svg>',
  photo: '<svg class="ti" viewBox="0 0 34 34"><rect x="4" y="6" width="26" height="22" rx="2" fill="#6cb04a" stroke="#365"/><circle cx="12" cy="14" r="3" fill="#fff"/><path d="M5 27l8-8 6 5 4-4 6 6z" fill="#2f6a2f"/></svg>',
  folder: '<svg class="ti" viewBox="0 0 34 34"><path d="M3 8h10l3 3h15v17H3z" fill="#3d7be6" stroke="#2a58b8"/></svg>',
};
const TYPE_NAME = { text: 'Texto', check: 'Lista de tareas', voice: 'Nota de voz', draw: 'Dibujo', photo: 'Foto' };
const NOTE_COLORS = ['', '#ef5350', '#ffb300', '#ffee00', '#66bb6a', '#00e5ff', '#4a8af0', '#ab47bc', '#ec407a'];

/* ============ Diálogos y menús ============ */
function toast(msg, action, fn) {
  const t = $('toast'); t.replaceChildren(msg);
  if (action) t.append(el('button', { textContent: action, onclick: () => { t.hidden = true; fn(); } }));
  t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, action ? 6000 : 3000);
}
function overlay(node) {
  const o = $('overlay'); o.replaceChildren(node); o.hidden = false;
  return () => { o.hidden = true; o.replaceChildren(); };
}
function menu(items) {
  return new Promise(res => {
    const close = overlay(el('div', { className: 'menu' }, items.filter(Boolean).map(it => it === '-' ? el('div', { className: 'sep' }) :
      el('button', { textContent: it.t, onclick: () => { close(); res(); it.fn && it.fn(); } }))));
    $('overlay').onclick = e => { if (e.target.id === 'overlay') { close(); res(); } };
  });
}
function dialog(title, content, buttons) {
  return new Promise(res => {
    let close;
    const done = v => { close(); res(v); };
    const btns = el('div', { className: 'btns' }, buttons.map(b => el('button', { textContent: b.t, onclick: () => done(b.v) })));
    close = overlay(el('div', { className: 'dlg' }, title ? el('h3', { textContent: title }) : null, content, btns));
    $('overlay').onclick = e => { if (e.target.id === 'overlay') done(null); };
  });
}
async function ask(title, value = '', type = 'text') {
  const inp = el('input', { type, value });
  const p = dialog(title, inp, [{ t: 'Cancelar', v: null }, { t: 'Aceptar', v: true }]);
  setTimeout(() => { inp.focus(); inp.select && inp.select(); }, 50);
  inp.onkeydown = e => { if (e.key === 'Enter') $('overlay').querySelector('.btns button:last-child').click(); };
  return (await p) ? inp.value : null;
}
const confirmD = async msg => !!(await dialog(null, el('p', { textContent: msg }), [{ t: 'Cancelar', v: false }, { t: 'Aceptar', v: true }]));
const info = (title, text) => dialog(title, el('p', { textContent: text }), [{ t: 'Cerrar', v: 1 }]);

/* ============ Almacenamiento ============ */
const DB = {
  idb: null, mem: { notes: {}, folders: {}, backups: {}, meta: {} },
  async open() {
    try {
      this.idb = await Promise.race([new Promise((res, rej) => {
        const r = indexedDB.open('notas', 3);
        r.onupgradeneeded = () => { for (const s of ['notes', 'folders', 'backups', 'meta']) if (!r.result.objectStoreNames.contains(s)) r.result.createObjectStore(s, { keyPath: 'id' }); };
        r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
        r.onblocked = () => toast('Cierra las demás ventanas de la app para terminar de actualizar. Tus notas no se han borrado.');
      }), sleep(4000).then(() => { throw new Error('timeout'); })]);
    } catch (e) {            // sin IndexedDB (p. ej. file://): se usa localStorage
      this.idb = null; try { this.mem = JSON.parse(pref('notas_fb') || 'null') || this.mem; } catch (x) {}
      S.limited = true;
      dialog('No se pudo abrir el almacenamiento', el('p', { textContent: 'Tus notas NO se han borrado: siguen guardadas en el navegador. Cierra todas las ventanas de la app (y pestañas del sitio), ábrela de nuevo y deberían aparecer. Mientras tanto no guardes nada nuevo.' }), [{ t: 'Entendido', v: 1 }]);
    }
  },
  tx(store, mode, fn) {
    return new Promise((res, rej) => {
      const t = this.idb.transaction(store, mode), out = fn(t.objectStore(store));
      t.oncomplete = () => res(out && out.result); t.onerror = () => rej(t.error);
    });
  },
  flush() { pref('notas_fb', JSON.stringify(this.mem)); },
  async all(s) { return this.idb ? this.tx(s, 'readonly', o => o.getAll()) : Object.values(this.mem[s] || {}); },
  async put(s, v) { if (this.idb) return this.tx(s, 'readwrite', o => o.put(v)); (this.mem[s] = this.mem[s] || {})[v.id] = v; this.flush(); },
  async del(s, id) { if (this.idb) return this.tx(s, 'readwrite', o => o.delete(id)); delete this.mem[s][id]; this.flush(); },
};

/* ============ Cifrado (AES-GCM + PBKDF2) ============ */
const b64 = u => { let s = ''; new Uint8Array(u).forEach(b => s += String.fromCharCode(b)); return btoa(s); };
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function deriveKey(pw, salt) {
  const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' }, km, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
}
async function encPayload(n) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, n._key, new TextEncoder().encode(JSON.stringify({ body: n.body, html: n.html, items: n.items })));
  const rk = await recoveryWrap(n);
  return Object.assign({ s: n.enc.s, iv: b64(iv), d: b64(ct) }, rk ? { rk } : {});
}
async function decryptWith(n, key) {
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(n.enc.iv) }, key, unb64(n.enc.d));
  const o = JSON.parse(new TextDecoder().decode(pt));
  n.body = o.body; n.html = o.html || ''; n.items = o.items; n._key = key;
}
let sessionPw = null;   // contraseña única de las notas: solo en memoria, se pide una vez por sesión
async function unlock(n) {
  if (!n.enc || n._key) return true;
  if (!crypto.subtle) { toast('El cifrado requiere HTTPS'); return false; }
  if (sessionPw) { try { await decryptWith(n, await deriveKey(sessionPw, unb64(n.enc.s))); return true; } catch (e) {} }
  if (await bioUnlock(n)) return true;                      // huella, si está activada para esta nota
  for (;;) {
    const inp = el('input', { type: 'password' });
    const btns = [{ t: 'Cancelar', v: null }]; if (recOn() && n.enc.rk) btns.push({ t: 'Olvidé la contraseña', v: 'forgot' }); btns.push({ t: 'Aceptar', v: true });
    const dp = dialog('Contraseña de la nota', inp, btns);
    setTimeout(() => inp.focus(), 50); inp.onkeydown = e => { if (e.key === 'Enter') $('overlay').querySelector('.btns button:last-child').click(); };
    const r = await dp; if (r === null) return false;
    if (r === 'forgot') { if (await recoverNote(n)) return true; continue; }
    try { await decryptWith(n, await deriveKey(inp.value, unb64(n.enc.s))); sessionPw = inp.value; setTimeout(() => offerBio(n), 500); return true; }
    catch (e) { toast('Contraseña incorrecta'); }
  }
}

// --- contraseña única de las notas (se configura en Ajustes) ---
const pwvGet = () => { try { return JSON.parse(pref('pwv') || 'null'); } catch (e) { return null; } };
async function pwvSet(pw) {
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await deriveKey(pw, salt), new TextEncoder().encode('notas-ok'));
  pref('pwv', JSON.stringify({ s: b64(salt), iv: b64(iv), d: b64(ct) }));
}
async function pwOk(pw) {   // ¿es la contraseña de las notas? (verificador local o, si falta, una nota cifrada)
  const v = pwvGet() || (S.notes.find(x => x.enc && x.enc.iv) || {}).enc;
  if (!v) return true;
  try { await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(v.iv) }, await deriveKey(pw, unb64(v.s)), unb64(v.d)); return true; } catch (e) { return false; }
}
async function masterPw() {   // contraseña lista para cifrar; si no está configurada, lleva a Ajustes
  if (!pwvGet()) { toast('Primero crea la contraseña de tus notas en Ajustes → Seguridad'); renderSettings(); openScreen('settings'); return null; }
  if (sessionPw) return sessionPw;
  const pw = await ask('Contraseña de tus notas', '', 'password'); if (!pw) return null;
  if (!(await pwOk(pw))) { toast('Contraseña incorrecta'); return null; }
  return (sessionPw = pw);
}
async function masterSetup() {
  if (!crypto.subtle) { toast('El cifrado requiere HTTPS (o localhost)'); return; }
  const have = !!pwvGet(), encNotes = S.notes.filter(x => x.enc);
  if (!have) {
    if (encNotes.length) {   // ya hay notas cifradas (otro dispositivo): se adopta su contraseña
      const pw = await ask('Escribe la contraseña que ya usas en tus notas cifradas', '', 'password'); if (!pw) return;
      if (!(await pwOk(pw))) { toast('No es la contraseña de tus notas cifradas'); return; }
      await pwvSet(pw); sessionPw = pw; toast('Contraseña configurada en este dispositivo'); renderSettings(); return;
    }
    const p1 = await ask('Elige la contraseña de tus notas (la misma para todas)', '', 'password'); if (!p1) return;
    const p2 = await ask('Repite la contraseña', '', 'password'); if (p1 !== p2) { toast('Las contraseñas no coinciden'); return; }
    await pwvSet(p1); sessionPw = p1; toast('Listo. No hay forma de recuperarla si la olvidas (salvo la recuperación configurada)'); renderSettings(); return;
  }
  const old = await ask('Contraseña actual', '', 'password'); if (!old) return;
  if (!(await pwOk(old))) { toast('Contraseña incorrecta'); return; }
  const p1 = await ask('Contraseña nueva', '', 'password'); if (!p1) return;
  const p2 = await ask('Repite la contraseña nueva', '', 'password'); if (p1 !== p2) { toast('Las contraseñas no coinciden'); return; }
  let done = 0, skipped = 0;
  for (const n of encNotes) {
    try {
      if (!n._key && n.enc.iv) await decryptWith(n, await deriveKey(old, unb64(n.enc.s)));
      const salt = crypto.getRandomValues(new Uint8Array(16));
      await bioForget(n.id); n.enc = { s: b64(salt), iv: '', d: '' }; n._key = await deriveKey(p1, salt); n.updated = Date.now(); await persist(n);
      if (n !== S.cur) { n.body = ''; n.html = ''; n.items = []; delete n._key; }
      done++;
    } catch (e) { skipped++; }
  }
  await pwvSet(p1); sessionPw = p1; renderSettings();
  toast(`Contraseña cambiada en ${done} nota(s)` + (skipped ? `; ${skipped} tenían otra contraseña y no se tocaron` : ''));
}

/* ============ Estado ============ */
const S = {
  notes: [], folders: [], view: { kind: 'all', id: null }, q: '', sel: new Set(), selMode: false,
  cur: null, stack: ['main'], tab: 'all', find: null,
};
const settings = {
  get theme() { return pref('theme') || 'dark'; }, set theme(v) { pref('theme', v); },
  get sort() { return pref('sort') || 'updated'; }, set sort(v) { pref('sort', v); },
  get desc() { return pref('desc') !== '0'; }, set desc(v) { pref('desc', v ? '1' : '0'); },
  get wiki() { return pref('wiki') !== '0'; }, set wiki(v) { pref('wiki', v ? '1' : '0'); },
};
const TRASH_DAYS = 30;
const folderById = id => S.folders.find(f => f.id === id);
const folderName = id => (folderById(id) || { name: 'Carpeta principal' }).name;
const childFolders = p => S.folders.filter(f => (f.parent || null) === p).sort((a, b) => a.name.localeCompare(b.name));
function noteTitle(n) {
  if (n.type === 'text') { const l = (n.enc && !n._key ? n.title : n.body).split('\n').find(s => s.trim()); return (l || n.title || 'Nota vacía').trim().slice(0, 80); }
  return n.title || TYPE_NAME[n.type];
}
const isEmpty = n => ({ text: !n.body.trim(), check: !n.items.some(i => i.t.trim()), voice: !n.media && !n.body.trim(), draw: !(n.strokes && n.strokes.length) && !n.bg, photo: !n.media && !n.body.trim() }[n.type]);
function newNote(type, folder) {
  const n = { id: uid(), type, title: '', body: '', items: [], folder: folder || 'main', color: '', readonly: false, enc: null, reminder: null, fired: false,
    media: null, strokes: [], html: '', labels: [], deleted: null, created: Date.now(), updated: Date.now() };
  if (type !== 'text') n.title = TYPE_NAME[type] + ' ' + (S.notes.filter(x => x.type === type).length + 1);
  if (type === 'check') n.items = [];
  return n;
}
async function persist(n) {
  if (n._new && !isEmpty(n)) delete n._new;
  const rec = {}; for (const k in n) if (k[0] !== '_') rec[k] = n[k];
  if (n.enc) {
    if (n._key) { rec.enc = await encPayload(n); n.enc = rec.enc; }   // la copia en memoria también debe tener el último texto cifrado
    rec.title = n._key ? noteTitle(n) : n.title; rec.body = ''; rec.html = ''; rec.items = [];   // el nombre de la nota se conserva visible
  }
  if (!S.notes.includes(n)) S.notes.push(n);
  await DB.put('notes', rec);
  scheduleSync();
}

/* ============ Navegación ============ */
function showTop() {
  const top = S.stack[S.stack.length - 1];
  for (const id of ['main', 'editor', 'folders', 'settings']) $(id).hidden = id !== top;
  if (top === 'main') renderMain();
}
function openScreen(name) { S.stack.push(name); history.pushState({ s: name }, ''); showTop(); }
const closeScreen = () => history.back();
let folderPicker = null;
async function onPop() {
  if (S.stack.length < 2) { history.pushState({}, ''); return; }
  if (!$('overlay').hidden) { $('overlay').hidden = true; history.pushState({ s: S.stack[S.stack.length - 1] }, ''); return; }
  const closed = S.stack.pop();
  if (closed === 'editor') await leaveEditor();
  if (closed === 'folders' && folderPicker) { folderPicker(null); folderPicker = null; }
  showTop();
}

/* ============ Pantalla principal ============ */
function viewName() {
  const v = S.view;
  return v.kind === 'all' ? 'Todas las notas' : v.kind === 'trash' ? 'Papelera' : folderName(v.id);
}
function visibleNotes() {
  const v = S.view, f = S.filter, toks = S.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const tagQ = toks.filter(t => t[0] === '#' && t.length > 1).map(t => t.slice(1)), q = toks.filter(t => t[0] !== '#').join(' ');
  const searching = !!(q || tagQ.length), scopeAll = v.kind === 'all' || (f.allFolders && v.kind === 'folder');
  let ns = S.notes.filter(n => {
    if (v.kind === 'trash') return !!n.deleted;
    if (n.deleted) return false;
    if (searching) return true;
    return scopeAll || n.folder === v.id;
  });
  if (searching) ns = ns.filter(n => {
    const ls = noteLabels(n).map(labelKey);
    if (tagQ.length && !tagQ.every(t => ls.some(l => l.includes(t)))) return false;
    return !q || [noteTitle(n), n.body, n.title, ...n.items.map(i => i.t), ...ls].join('\n').toLowerCase().includes(q);
  });
  if (filterActive(f)) ns = ns.filter(n => matchesFilter(n));
  const dir = settings.desc ? -1 : 1, so = settings.sort;
  return ns.sort((a, b) => {
    const c = so === 'title' ? noteTitle(a).localeCompare(noteTitle(b)) : so === 'type' ? a.type.localeCompare(b.type) : (a[so === 'created' ? 'created' : 'updated'] - b[so === 'created' ? 'created' : 'updated']);
    return c * dir;
  });
}
function renderMain() {
  document.documentElement.dataset.theme = settings.theme;
  const sel = S.selMode;
  $('mainBar').hidden = sel; $('selBar').hidden = !sel;
  $('selCount').textContent = S.sel.size + ' seleccionadas';
  $('mainTitle').textContent = 'Audio Manager';
  $('folderBar').innerHTML = ic(S.view.kind === 'trash' ? 'trash' : 'folder');
  $('folderBar').append(' ' + viewName());
  $('folderBar').onclick = () => pickFolder();
  updateSyncStat();
  const list = $('list'); list.replaceChildren();
  const rows = [];
  if (S.view.kind === 'folder' && !S.q) for (const f of childFolders(S.view.id)) {
    rows.push(el('div', { className: 'row', onclick: () => { S.view = { kind: 'folder', id: f.id }; renderMain(); } },
      el('span', { innerHTML: TYPE_ICON.folder }), el('div', { className: 'mid' }, el('div', { className: 't', textContent: f.name }))));
  }
  const ns = visibleNotes();
  for (const n of ns) {
    const row = el('div', { className: 'row' + (S.sel.has(n.id) ? ' sel' : '') },
      n.color ? Object.assign(el('span', { className: 'stripe' }), { style: `background:${n.color}` }) : null,
      el('span', { innerHTML: TYPE_ICON[n.type] }),
      el('div', { className: 'mid' }, el('div', { className: 't', textContent: noteTitle(n) }),
        (n.reminder || n.readonly) ? el('div', { className: 's', innerHTML: (n.reminder ? ic('bell') : '') + (n.readonly ? '<span>solo lectura</span>' : '') }) : null,
        noteLabels(n).length ? el('div', { className: 'chips' }, noteLabels(n).slice(0, 4).map(l => labelChip(l, { onclick: e => { e.stopPropagation(); applyLabelFilter(l); } })), noteLabels(n).length > 4 ? el('span', { className: 'fnote', textContent: '+' + (noteLabels(n).length - 4) }) : null) : null));
    const guarded = n.enc && !S.selMode && longOpen();   // cifradas: solo se abren manteniendo pulsado 3 s
    pressable(row, guarded ? () => {} : () => noteTap(n), guarded ? () => { navigator.vibrate && navigator.vibrate(15); openNote(n); } : () => noteHold(n), guarded ? 3000 : 500);
    rows.push(row);
  }
  list.append(...rows);
  $('empty').hidden = rows.length > 0;
  renderFilterBar();
  $('empty').textContent = S.q || filterActive() ? 'Sin resultados' : S.view.kind === 'trash' ? 'La papelera está vacía' : 'Aún no hay notas.\nToca + para crear una.';
  $('empty').style.whiteSpace = 'pre-line';
  $('addBtn').hidden = S.view.kind === 'trash';
}
const longOpen = () => pref('longopen') !== '0';
function pressable(node, tap, hold, ms = 500) {
  let t, held = false, moved = false, sx = 0, sy = 0;
  node.addEventListener('pointerdown', e => { held = moved = false; sx = e.clientX; sy = e.clientY; t = setTimeout(() => { held = true; hold(); }, ms); });
  node.addEventListener('pointermove', e => { if (Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) > 10) { moved = true; clearTimeout(t); } });
  for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) node.addEventListener(ev, () => clearTimeout(t));
  node.addEventListener('click', e => { if (!held && !moved) tap(e); });
  node.addEventListener('contextmenu', e => e.preventDefault());
}
function noteTap(n) { if (S.selMode) toggleSel(n); else openNote(n); }
function noteHold(n) { if (!S.selMode) { S.selMode = true; S.sel = new Set(); } toggleSel(n); navigator.vibrate && navigator.vibrate(15); }
function toggleSel(n) { S.sel.has(n.id) ? S.sel.delete(n.id) : S.sel.add(n.id); if (!S.sel.size) S.selMode = false; renderMain(); }
function endSel() { S.selMode = false; S.sel = new Set(); renderMain(); }

async function createNote(type, extra) {
  const f = S.view.kind === 'folder' ? S.view.id : 'main';
  const n = Object.assign(newNote(type, f), extra || {});
  if (type === 'check') n.items = [];
  n._new = true; S.fresh = n;
  await openNote(n, true);
}
function newMenu() {
  menu([
    { t: 'Nota de texto', fn: () => createNote('text') }, { t: 'Lista de tareas', fn: () => createNote('check') },
    { t: 'Nota de voz', fn: () => createNote('voice') }, { t: 'Dibujo', fn: () => createNote('draw') },
    { t: 'Foto (cámara)', fn: () => createNote('photo').then(() => choosePhoto(true)) },
    { t: 'Foto (galería)', fn: () => createNote('photo').then(() => choosePhoto(false)) },
  ]);
}
function mainMenu() {
  menu([
    { t: 'Seleccionar notas', fn: () => { S.selMode = true; S.sel = new Set(); renderMain(); toast('Mantén pulsada una nota para seleccionarla'); } },
    { t: 'Ordenar…', fn: sortMenu },
    { t: filterActive() ? 'Filtros… (hay filtros activos)' : 'Filtros…', fn: filterDialog },
    views().length ? { t: 'Vistas guardadas', fn: viewsMenu } : null,
    { t: 'Etiquetas…', fn: () => manageLabels(false) },
    S.view.kind === 'folder' ? { t: 'Nueva subcarpeta', fn: () => newFolder(S.view.id) } : null,
    S.view.kind === 'trash' ? { t: 'Vaciar papelera', fn: emptyTrash } : null,
    '-', { t: 'Ajustes', fn: () => { renderSettings(); openScreen('settings'); } },
  ]);
}
function sortMenu() {
  const mark = (f, l) => ({ t: (settings.sort === f ? '● ' : '○ ') + l, fn: () => { settings.sort = f; renderMain(); } });
  menu([mark('updated', 'Fecha de modificación'), mark('created', 'Fecha de creación'), mark('title', 'Título'), mark('type', 'Tipo'), '-',
    { t: settings.desc ? 'Orden: descendente (cambiar)' : 'Orden: ascendente (cambiar)', fn: () => { settings.desc = !settings.desc; renderMain(); } }]);
}
async function emptyTrash() {
  const ts = S.notes.filter(n => n.deleted);
  if (!ts.length || !(await confirmD(`¿Eliminar definitivamente ${ts.length} notas?`))) return;
  for (const n of ts) await forgetNote(n.id);
  S.notes = S.notes.filter(n => !n.deleted); renderMain();
}
async function trashNotes(ns) {
  if (S.view.kind === 'trash') {
    if (!(await confirmD(`¿Eliminar definitivamente ${ns.length} nota(s)?`))) return;
    for (const n of ns) await forgetNote(n.id);
    S.notes = S.notes.filter(n => !ns.includes(n));
  } else {
    for (const n of ns) { n.deleted = Date.now(); await persist(n); }
    toast(`${ns.length} nota(s) a la papelera`, 'Deshacer', async () => { for (const n of ns) { n.deleted = null; await persist(n); } renderMain(); });
  }
}

/* ============ Carpetas ============ */
function pickFolder(move) {
  return new Promise(res => {
    folderPicker = res; S.pickMove = !!move;
    $('fdTitle').textContent = move ? 'Mover a…' : 'Seleccionar carpeta';
    renderFolders(v => { folderPicker = null; res(v); closeScreen(); });
    openScreen('folders');
  });
}
function renderFolders(choose) {
  const list = $('fdList'); list.replaceChildren();
  const row = (iconHtml, name, count, tap, hold) => {
    const r = el('div', { className: 'fd' }, el('span', { innerHTML: iconHtml }), el('span', { textContent: name }), count != null ? el('span', { className: 'n', textContent: count }) : null);
    pressable(r, tap, hold || (() => {})); list.append(r);
  };
  if (!S.pickMove) {
    row(ic('folder'), 'Todas las notas', S.notes.filter(n => !n.deleted).length, () => { S.view = { kind: 'all', id: null }; choose(null); });
    row(ic('trash'), 'Papelera', S.notes.filter(n => n.deleted).length, () => { S.view = { kind: 'trash', id: null }; choose(null); });
  }
  const walk = (parent, depth) => {
    const kids = parent === null ? [{ id: 'main', name: 'Carpeta principal' }, ...childFolders(null).filter(f => f.id !== 'main')] : childFolders(parent);
    for (const f of kids) {
      const r = el('div', { className: 'fd', style: `padding-left:${14 + depth * 22}px` }, el('span', { innerHTML: ic('folder') }), el('span', { textContent: f.name }),
        el('span', { className: 'n', textContent: S.notes.filter(n => !n.deleted && n.folder === f.id).length }));
      pressable(r, () => { if (S.pickMove) choose(f.id); else { S.view = { kind: 'folder', id: f.id }; choose(null); } }, () => folderMenu(f, choose));
      list.append(r); walk(f.id, depth + 1);
    }
  };
  walk(null, 0);
  $('fdMore').onclick = () => menu([{ t: 'Nueva carpeta', fn: () => newFolder(null, choose) }]);
}
async function newFolder(parent, choose) {
  const name = await ask('Nombre de la carpeta');
  if (!name || !name.trim()) return;
  const f = { id: uid(), name: name.trim(), parent: parent || null };
  S.folders.push(f); await DB.put('folders', f);
  if (!$('folders').hidden) renderFolders(choose || (() => closeScreen())); else renderMain();
}
function folderMenu(f, choose) {
  const redo = () => renderFolders(choose);
  menu([
    { t: 'Nueva subcarpeta', fn: () => newFolder(f.id, choose) },
    f.id === 'main' ? null : { t: 'Renombrar', fn: async () => { const v = await ask('Nuevo nombre', f.name); if (v && v.trim()) { f.name = v.trim(); await DB.put('folders', f); redo(); } } },
    f.id === 'main' ? null : { t: 'Eliminar', fn: async () => {
      if (!(await confirmD(`¿Eliminar la carpeta "${f.name}"? Sus notas y subcarpetas pasan a la carpeta padre.`))) return;
      const par = f.parent || 'main';
      for (const c of S.folders.filter(x => x.parent === f.id)) { c.parent = f.parent; await DB.put('folders', c); }
      for (const n of S.notes.filter(n => n.folder === f.id)) { n.folder = par; await persist(n); }
      S.folders = S.folders.filter(x => x !== f); await forgetFolder(f.id);
      if (S.view.id === f.id) S.view = { kind: 'all', id: null };
      redo();
    } },
  ]);
}

/* ============ Editor ============ */
const LINK_RE = [
  { k: 'url', re: /\b(?:https?:\/\/|www\.)[^\s<>"']+[^\s<>"'.,;:!?)]/gi },
  { k: 'mail', re: /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g },
  { k: 'tel', re: /(?<![\w])\+?\d[\d ().-]{5,}\d(?![\w])/g },
  { k: 'wiki', re: /\[\[([^\]\n]+)\]\]|\b[A-Z][a-z0-9]+(?:[A-Z][a-z0-9]+)+\b/g },
];
function findLinks(text) {
  const out = [];
  for (const { k, re } of LINK_RE) {
    if (k === 'wiki' && !settings.wiki) continue;
    re.lastIndex = 0; let m;
    while ((m = re.exec(text))) {
      const s = m.index, e = s + m[0].length;
      if (!out.some(o => s < o.e && e > o.s)) out.push({ k, s, e, v: m[1] || m[0] });
    }
  }
  return out.sort((a, b) => a.s - b.s);
}
function openLink(l) {
  if (l.k === 'url') window.open(/^www/i.test(l.v) ? 'https://' + l.v : l.v, '_blank', 'noopener');
  else if (l.k === 'mail') location.href = 'mailto:' + l.v;
  else if (l.k === 'tel') location.href = 'tel:' + l.v.replace(/[^\d+]/g, '');
  else openWiki(l.v);
}
async function openWiki(name) {
  await flush();
  const low = name.trim().toLowerCase();
  let t = S.notes.find(n => !n.deleted && !n.enc && n.type !== 'check' && noteTitle(n).toLowerCase() === low);
  if (!t) { t = newNote('text', S.cur ? S.cur.folder : 'main'); t.body = name + '\n'; await persist(t); }
  openNote(t, false, true);
}

async function openNote(n, isNew, replace) {
  if (!(await unlock(n))) return;
  if (replace && S.stack[S.stack.length - 1] === 'editor') { await leaveEditor(true); }
  S.cur = n; S.find = null; S.tab = 'all';
  if (!replace || S.stack[S.stack.length - 1] !== 'editor') openScreen('editor');
  drawEditor(); histReset();
  if (n.deleted) toast('Esta nota está en la papelera', 'Restaurar', async () => { n.deleted = null; await persist(n); drawEditor(); });
  if (isNew && !n.readonly) setTimeout(() => { if (n.type === 'text') $('edText').focus(); else if (n.type === 'check') $('addInput').focus(); }, 80);
}
async function flush() { clearTimeout(S.timer); if (S.cur && !S.cur.deleted && (!isEmpty(S.cur) || S.notes.includes(S.cur))) { await persist(S.cur); } }
let tm;
function touch() {
  const n = S.cur; if (!n || n.deleted) return;
  n.updated = Date.now(); clearTimeout(S.timer);
  S.timer = setTimeout(() => flush().catch(() => {}), 400);
  histNote();
}
async function leaveEditor(keepStack) {
  const n = S.cur; if (!n) return;
  stopRec(true); stopAudio(); clearTimeout(S.timer);
  if (!n.deleted && isEmpty(n) && !(n.enc) && n._new) {
    if (S.notes.includes(n)) { S.notes = S.notes.filter(x => x !== n); await forgetNote(n.id); }
  } else if (!n.deleted || S.notes.includes(n)) {
    if (S.notes.includes(n) || !isEmpty(n)) await persist(n);
  }
  if (n.enc) { if (n.type === 'text') n.title = noteTitle(n); n.body = ''; n.html = ''; n.items = []; delete n._key; }
  S.cur = null; S.find = null; $('linkBtn').hidden = true;
}

function drawEditor() {
  const n = S.cur, t = n.type, ro = n.readonly || !!n.deleted;
  $('edTitle').textContent = noteTitle(n); drawEdLabels();
  $('edBody').style.display = '';
  const isText = t === 'text' || t === 'voice' || t === 'photo';
  $('edText').hidden = !isText || ro || !!S.find; setRich(n); $('edText').contentEditable = ro ? 'false' : 'true';
  $('edText').dataset.ph = t === 'text' ? '' : 'Añade texto a tu nota…';
  $('fmtBar').hidden = !isText || ro || !!S.find;
  $('edView').hidden = !isText || !(ro || S.find);
  if (!$('edView').hidden) renderView();
  $('checkWrap').hidden = t !== 'check'; $('addBar').hidden = t !== 'check' || ro;
  $('drawWrap').hidden = t !== 'draw'; $('drawStatus').hidden = t !== 'draw';
  $('findBar').hidden = !S.find;
  $('edShare').hidden = false;
  $('edDel').innerHTML = ic('trash');
  const x = $('edToolsExtra'); x.replaceChildren();
  $('edMedia').replaceChildren();
  $('edInfo').innerHTML = ic(t === 'draw' ? 'palette' : 'info'); $('edInfo').onclick = t === 'draw' ? penDialog : noteInfo;
  if (t === 'voice') drawVoice(); if (t === 'photo') drawPhoto();
  if (t === 'check') drawChecks();
  if (t === 'draw') setupCanvas();
  if (t === 'check') { $('addSort').onclick = checkSortMenu; }
  $('linkBtn').hidden = true;
}
function renderView() {
  const n = S.cur, v = $('edView'), q = S.find && S.find.q;
  v.innerHTML = sanitize(n.html || textToHtml(n.body));
  const marks = decorate(v, q);
  v.querySelectorAll('a[href]').forEach(a => a.onclick = e => { e.preventDefault(); openHref(a.getAttribute('href')); });
  if (S.find) { S.find.marks = marks; S.find.i = Math.min(S.find.i || 0, Math.max(0, marks.length - 1)); focusMark(); }
}
// Convierte enlaces en <a> y resalta la búsqueda dentro de un árbol HTML (conserva el formato).
function decorate(root, q) {
  const marks = [], nodes = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) nodes.push(w.currentNode);
  const ql = q ? q.toLowerCase() : '';
  for (const tn of nodes) {
    const text = tn.data, links = tn.parentElement.closest('a') ? [] : findLinks(text), frag = document.createDocumentFragment();
    const plain = (s, e) => {
      const seg = text.slice(s, e);
      if (!ql) { frag.append(seg); return; }
      const low = seg.toLowerCase(); let i = 0, j;
      while ((j = low.indexOf(ql, i)) >= 0) { frag.append(seg.slice(i, j)); const m = el('mark', { textContent: seg.slice(j, j + ql.length) }); marks.push(m); frag.append(m); i = j + ql.length; }
      frag.append(seg.slice(i));
    };
    if (!links.length && !ql) continue;
    let pos = 0;
    for (const l of links) { plain(pos, l.s); frag.append(el('a', { textContent: text.slice(l.s, l.e), onclick: () => openLink(l) })); pos = l.e; }
    plain(pos, text.length); tn.replaceWith(frag);
  }
  return marks;
}
function focusMark() {
  const f = S.find; if (!f || !f.marks) return;
  f.marks.forEach((m, i) => m.classList.toggle('cur', i === f.i));
  f.marks[f.i] && f.marks[f.i].scrollIntoView({ block: 'center' });
}

/* --- checklist --- */
function drawChecks() {
  const n = S.cur, ro = n.readonly || !!n.deleted;
  document.querySelectorAll('.tabs button[data-t]').forEach(b => b.classList.toggle('on', b.dataset.t === S.tab));
  const box = $('checkList'); box.replaceChildren();
  n.items.forEach((it, i) => {
    if ((S.tab === 'need' && it.done) || (S.tab === 'done' && !it.done)) return;
    if (S.find && S.find.q && !it.t.toLowerCase().includes(S.find.q.toLowerCase())) return;
    box.append(el('div', { className: 'ci' + (it.done ? ' done' : '') },
      el('span', { className: 'cb', innerHTML: it.done ? ic('check') : '', onclick: () => { if (ro) return; it.done = !it.done; touch(); drawChecks(); } }),
      el('input', { value: it.t, readOnly: ro, oninput: e => { it.t = e.target.value; touch(); } }),
      ro ? null : el('span', { className: 'x', innerHTML: ic('close'), onclick: () => { n.items.splice(i, 1); touch(); drawChecks(); } })));
  });
}
function addCheckItem(text) {
  const t = (text !== undefined ? text : $('addInput').value).trim(); if (!t) return;
  S.cur.items.push({ t, done: false }); $('addInput').value = ''; touch(); drawChecks();
  $('checkList').lastElementChild && $('checkList').lastElementChild.scrollIntoView();
}
function checkSortMenu() {
  const n = S.cur;
  menu([{ t: 'Pendientes primero', fn: () => { n.items.sort((a, b) => a.done - b.done); touch(); drawChecks(); } },
    { t: 'Ordenar A-Z', fn: () => { n.items.sort((a, b) => a.t.localeCompare(b.t)); touch(); drawChecks(); } },
    { t: 'Marcar todo', fn: () => { n.items.forEach(i => i.done = true); touch(); drawChecks(); } },
    { t: 'Desmarcar todo', fn: () => { n.items.forEach(i => i.done = false); touch(); drawChecks(); } },
    { t: 'Quitar los hechos', fn: () => { n.items = n.items.filter(i => !i.done); touch(); drawChecks(); } }]);
}
function dictate() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { toast('Dictado no disponible en este navegador'); return; }
  const r = new SR(); r.lang = navigator.language || 'es-ES';
  r.onresult = e => { $('addInput').value = e.results[0][0].transcript; addCheckItem(); };
  r.onerror = () => toast('No se pudo dictar'); r.start();
}

/* --- voz --- */
let rec = null, recTimer = null, aud = null;
const mmss = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
function drawVoice() {
  const n = S.cur, ro = n.readonly || !!n.deleted;
  const slider = el('input', { type: 'range', min: 0, max: 1000, value: 0, disabled: !n.media });
  const time = el('div', { textContent: '00:00' });
  const bRec = el('button', { className: 'rec', innerHTML: ic('rec'), disabled: ro, onclick: toggleRec });
  const bPlay = el('button', { innerHTML: ic('play'), disabled: !n.media, onclick: () => playAudio() });
  const bStop = el('button', { innerHTML: ic('stop'), onclick: () => { stopRec(); stopAudio(); } });
  $('edMedia').replaceChildren(el('div', { className: 'voice' }, slider, time, el('div', { className: 'ctl' }, bRec, bPlay, bStop)));
  S.v = { slider, time, bRec, bPlay };
  slider.oninput = () => { if (aud && aud.duration) aud.currentTime = aud.duration * slider.value / 1000; };
}
function playAudio() {
  const n = S.cur; if (!n.media) return;
  if (aud && !aud.ended && aud.src) { aud.paused ? aud.play() : aud.pause(); return; }
  aud = new Audio(n.media);
  aud.ontimeupdate = () => { if (S.v) { S.v.time.textContent = mmss(aud.currentTime); if (aud.duration) S.v.slider.value = aud.currentTime / aud.duration * 1000; } };
  aud.onended = () => { if (S.v) S.v.slider.value = 0; aud = null; };
  aud.play();
}
function stopAudio() { if (aud) { aud.pause(); aud = null; } if (S.v) { S.v.slider.value = 0; S.v.time.textContent = '00:00'; } }
async function toggleRec() {
  if (rec && rec.state === 'recording') { stopRec(); return; }
  if (!navigator.mediaDevices || !window.MediaRecorder) { toast('Grabar audio requiere HTTPS y un navegador compatible'); return; }
  if (S.cur.media && !(await confirmD('¿Reemplazar la grabación actual?'))) return;
  let stream; try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { toast('Sin permiso para el micrófono'); return; }
  const chunks = []; rec = new MediaRecorder(stream); const note = S.cur;
  rec.ondataavailable = e => chunks.push(e.data);
  rec.onstop = async () => {
    stream.getTracks().forEach(t => t.stop()); clearInterval(recTimer);
    note.media = await blobToDataURL(new Blob(chunks, { type: rec.mimeType || 'audio/webm' })); note.updated = Date.now(); rec = null;
    await persist(note); if (S.cur === note) drawVoice();
  };
  rec.start(); const t0 = Date.now(); S.v.bRec.classList.add('on');
  recTimer = setInterval(() => S.v && (S.v.time.textContent = mmss((Date.now() - t0) / 1000)), 250);
}
function stopRec(silent) { if (rec && rec.state === 'recording') rec.stop(); }
const blobToDataURL = b => new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(b); });

/* --- foto --- */
function drawPhoto() {
  const n = S.cur;
  $('edMedia').replaceChildren(n.media ? el('img', { className: 'photo', src: n.media, onclick: () => !n.readonly && choosePhoto(false) }) :
    el('div', { className: 'photoEmpty', textContent: 'Toca para añadir una foto', onclick: () => choosePhoto(false) }));
}
function choosePhoto(camera) {
  const f = $('fileIn'); f.accept = 'image/*'; f.multiple = false;
  if (camera) f.setAttribute('capture', 'environment'); else f.removeAttribute('capture');
  f.onchange = async () => {
    const file = f.files[0]; f.value = ''; if (!file || !S.cur) return;
    S.cur.media = await shrinkImage(file); touch(); drawPhoto();
  };
  f.click();
}
function shrinkImage(file, max = 1600) {
  return new Promise((res, rej) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height)), c = el('canvas', { width: Math.round(img.width * k), height: Math.round(img.height * k) });
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = rej; img.src = url;
  });
}

/* --- dibujo --- */
const PEN_COLORS = ['#000000', '#e53935', '#43a047', '#1e88e5', '#fdd835', '#fb8c00', '#8e24aa', '#8d6e63'];
const pen = { color: '#000000', size: 4, eraser: false };
// Dibuja un dibujo (imagen de fondo opcional + trazos). 'unit' = píxeles que mide el ancho del dibujo (los trazos se guardan relativos a él).
function paintDrawing(g, n, bg, W, H, unit) {
  g.fillStyle = '#fff'; g.fillRect(0, 0, W, H);
  if (bg && bg.naturalWidth) { const k = unit / bg.naturalWidth; g.drawImage(bg, 0, 0, bg.naturalWidth * k, bg.naturalHeight * k); }
  for (const s of n.strokes || []) {
    g.lineCap = g.lineJoin = 'round'; g.strokeStyle = s.c; g.lineWidth = s.w * unit / 400; g.beginPath();
    s.p.forEach(([x, y], i) => { const px = x * unit, py = y * unit; i ? g.lineTo(px, py) : g.moveTo(px, py); });
    if (s.p.length === 1) g.lineTo(s.p[0][0] * unit + .1, s.p[0][1] * unit);
    g.stroke();
  }
}
function setupCanvas() {
  const c = $('canvas'), wrap = $('drawWrap'), n = S.cur, ro = n.readonly || !!n.deleted;
  const bg = n.bg ? new Image() : null;                    // dibujo importado (p. ej. de Note Everything): imagen de fondo
  const unit = () => (bg && bg.naturalWidth) ? bg.naturalWidth * Math.min(c.width / bg.naturalWidth, c.height / bg.naturalHeight) : c.width;
  const redraw = () => paintDrawing(c.getContext('2d'), n, bg, c.width, c.height, unit());
  const resize = () => { c.width = wrap.clientWidth; c.height = wrap.clientHeight; redraw(); };
  if (bg) { bg.onload = redraw; bg.src = n.bg; }
  S.redraw = redraw; requestAnimationFrame(resize); S.resize = resize;
  let cur = null;
  const pt = e => { const r = c.getBoundingClientRect(), u = unit(); return [(e.clientX - r.left) / u, (e.clientY - r.top) / u]; };
  c.onpointerdown = e => { if (ro) return; c.setPointerCapture(e.pointerId); cur = { c: pen.eraser ? '#ffffff' : pen.color, w: pen.size, p: [pt(e)] }; n.strokes.push(cur); redraw(); };
  c.onpointermove = e => { if (!cur) return; cur.p.push(pt(e)); redraw(); };
  c.onpointerup = c.onpointercancel = () => { if (cur) { cur = null; H.u.push({ t: 'add' }); H.r = []; touch(); } };
  updateDrawStatus();
}
function updateDrawStatus() {
  $('drawStatus').innerHTML = '';
  const ub = (n, f) => el('button', { className: 'ib sm', innerHTML: ic(n), onclick: f });
  $('drawStatus').append(el('span', {}, ub('undo', () => undo()), ub('redo', () => redo()), ' ', S.cur ? S.cur.title : ''), el('span', {}, pen.eraser ? 'Borrador' : 'Lápiz', el('span', { className: 'dot', style: `background:${pen.eraser ? '#fff' : pen.color}` })));
}
async function penDialog() {
  const cw = el('div', { className: 'colors' }, PEN_COLORS.map(c => { const b = el('button', { className: !pen.eraser && pen.color === c ? 'on' : '', onclick: () => { pen.color = c; pen.eraser = false; done(); } }); b.style.background = c; return b; }));
  const sizes = el('div', { className: 'colors' }, [2, 4, 8, 14, 22].map(s => el('button', { className: pen.size === s ? 'on' : '', style: 'display:grid;place-items:center', onclick: () => { pen.size = s; done(); } }, el('span', { style: `width:${Math.max(3, s)}px;height:${Math.max(3, s)}px;border-radius:50%;background:currentColor` }))));
  const er = el('button', { textContent: pen.eraser ? '✔ Borrador' : 'Borrador', onclick: () => { pen.eraser = !pen.eraser; done(); } });
  let done; const p = dialog('Lápiz', el('div', {}, cw, sizes, er), [{ t: 'Cerrar', v: 1 }]);
  done = () => $('overlay').querySelector('.btns button').click(); await p; updateDrawStatus();
}
function drawTools() {
  const x = $('edToolsExtra'); x.replaceChildren();
}

/* ============ Texto con formato ============ */
const OK_TAGS = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'S', 'STRIKE', 'DEL', 'SPAN', 'FONT', 'DIV', 'P', 'BR', 'UL', 'OL', 'LI', 'H1', 'H2', 'H3', 'SUB', 'SUP', 'A']);
const OK_CSS = ['color', 'background-color', 'font-family', 'font-size', 'font-weight', 'font-style', 'text-decoration', 'text-decoration-line', 'text-align'];
const escHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = s => escHtml(s).replace(/"/g, '&quot;');
const textToHtml = t => escHtml(t || '').replace(/\n/g, '<br>');
const SAFE_HREF = /^(https?:|mailto:|tel:)/i;
function sanitize(html) {
  const t = document.createElement('template'); t.innerHTML = html || ''; clean(t.content); return t.innerHTML;
}
function clean(node) {
  for (const c of [...node.childNodes]) {
    if (c.nodeType === 3) continue;
    if (c.nodeType !== 1 || /^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED|TEMPLATE|LINK|META)$/.test(c.tagName)) { c.remove(); continue; }
    clean(c);
    if (!OK_TAGS.has(c.tagName)) { c.replaceWith(...c.childNodes); continue; }
    for (const a of [...c.attributes]) {
      if (a.name === 'style') {
        const keep = [];
        for (const p of OK_CSS) { const v = c.style.getPropertyValue(p); if (v && !/url\(|expression|javascript|@import/i.test(v)) keep.push(p + ':' + v); }
        keep.length ? c.setAttribute('style', keep.join(';')) : c.removeAttribute('style');
      } else if (c.tagName === 'A' && a.name === 'href') { if (!SAFE_HREF.test(a.value.trim())) c.removeAttribute('href'); }
      else if (!(c.tagName === 'FONT' && ['size', 'color', 'face'].includes(a.name))) c.removeAttribute(a.name);
    }
  }
}
function setRich(n) { $('edText').innerHTML = sanitize(n.html || textToHtml(n.body)); }
function openHref(h) { if (/^(mailto|tel):/i.test(h)) location.href = h; else window.open(h, '_blank', 'noopener'); }

let pendingSize = 0;
function onRichInput() {
  const r = $('edText'), n = S.cur; if (!n) return;
  fixSizeTags(r); autolink(r); syncFromEditor();
  touch();
}
function syncFromEditor() {
  const r = $('edText'), n = S.cur; if (!n) return;
  n.body = r.innerText.replace(/ /g, ' ');
  n.html = n.body.trim() ? r.innerHTML : '';
  $('edTitle').textContent = noteTitle(n);
}
// execCommand('fontSize') crea <font size=7>; lo convertimos en un <span> con el tamaño exacto en px.
function fixSizeTags(root) {
  const fs = root.querySelectorAll('font[size="7"]'); if (!fs.length) return;
  const sel = getSelection(); let last = null;
  fs.forEach(f => {
    const sp = document.createElement('span'); sp.style.fontSize = (pendingSize || 16) + 'px';
    while (f.firstChild) sp.append(f.firstChild);
    f.replaceWith(sp); last = sp;
  });
  if (last && sel.isCollapsed !== false) { const r = document.createRange(); r.selectNodeContents(last); r.collapse(false); sel.removeAllRanges(); sel.addRange(r); }
}

// --- detección automática de enlaces mientras se escribe (URLs y correos) ---
const AUTO_RE = [/\b(?:https?:\/\/|www\.)[^\s<>"']+[^\s<>"'.,;:!?)]/gi, /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g];
const hrefFor = s => /^https?:\/\//i.test(s) ? s : /^www\./i.test(s) ? 'https://' + s : 'mailto:' + s;
function autolink(root) {
  if (!/:\/\/|www\.|@/.test(root.textContent)) return;
  const sel = getSelection(), cNode = sel.rangeCount ? sel.anchorNode : null, cOff = sel.rangeCount ? sel.anchorOffset : 0;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), nodes = [];
  while (w.nextNode()) if (!w.currentNode.parentElement.closest('a')) nodes.push(w.currentNode);
  for (const tn of nodes) {
    const text = tn.data, ms = [];
    for (const re of AUTO_RE) {
      re.lastIndex = 0; let m;
      while ((m = re.exec(text))) {
        const s = m.index, e = s + m[0].length;
        if (tn === cNode && cOff >= s && cOff <= e) continue;   // aún se está escribiendo
        const after = /^[.,;:!?)]*(\s|$)/.exec(text.slice(e));  // solo se enlaza al terminar la palabra
        if (!after || (!after[1] && tn === cNode)) continue;
        ms.push({ s, e, v: m[0] });
      }
    }
    if (!ms.length) continue;
    ms.sort((a, b) => a.s - b.s);
    const frag = document.createDocumentFragment(); let pos = 0, target = null;
    const addText = (s, e) => {
      if (e <= s) return; const node = document.createTextNode(text.slice(s, e)); frag.append(node);
      if (tn === cNode && !target && cOff >= s && cOff <= e) target = [node, cOff - s];
    };
    for (const m of ms) { if (m.s < pos) continue; addText(pos, m.s); frag.append(el('a', { href: hrefFor(m.v), textContent: m.v })); pos = m.e; }
    addText(pos, text.length); tn.replaceWith(frag);
    if (target) { const r = document.createRange(); r.setStart(target[0], target[1]); r.collapse(true); sel.removeAllRanges(); sel.addRange(r); }
  }
}
function onRichPaste(e) {
  e.preventDefault();
  const html = e.clipboardData.getData('text/html'), text = e.clipboardData.getData('text/plain');
  document.execCommand('insertHTML', false, html ? sanitize(html) : textToHtml(text));
  setTimeout(onRichInput, 0);
}

// --- vínculos al estilo Gmail ---
function normHref(v) {
  v = v.trim(); if (!v) return '';
  if (/^[\w.+-]+@[\w-]+(\.[\w-]+)+$/.test(v)) return 'mailto:' + v;
  if (/^\+?[\d ()-]{6,}$/.test(v)) return 'tel:' + v.replace(/[^\d+]/g, '');
  return SAFE_HREF.test(v) ? v : 'https://' + v;
}
async function linkDialog(existing) {
  const sel0 = savedRange ? savedRange.toString() : '';
  const t = el('input', { value: existing ? existing.textContent : sel0, placeholder: 'Texto a mostrar' });
  const u = el('input', { type: 'text', value: existing ? existing.getAttribute('href') || '' : '', placeholder: 'https://…, correo o teléfono' });
  const body = el('div', {}, el('p', { textContent: 'Texto a mostrar' }), t, el('p', { textContent: 'Dirección del vínculo' }), u);
  const btns = [{ t: 'Cancelar', v: null }]; if (existing) btns.push({ t: 'Quitar vínculo', v: 'rm' }); btns.push({ t: 'Aceptar', v: 'ok' });
  const p = dialog(existing ? 'Editar vínculo' : 'Insertar vínculo', body, btns);
  setTimeout(() => (existing || sel0 ? u : t).focus(), 60);
  const r = await p; if (!r) return;
  if (r === 'rm') { existing.replaceWith(...existing.childNodes); onRichInput(); return; }
  const href = normHref(u.value); if (!href) { toast('Falta la dirección del vínculo'); return; }
  const text = t.value.trim() || u.value.trim();
  if (existing) { existing.setAttribute('href', href); existing.textContent = text; onRichInput(); return; }
  restoreSel(); document.execCommand('insertHTML', false, `<a href="${escAttr(href)}">${escHtml(text)}</a>&nbsp;`); onRichInput();
}
function linkMenu(a) {
  const href = a.getAttribute('href') || '';
  menu([{ t: 'Abrir: ' + (href.length > 34 ? href.slice(0, 34) + '…' : href), fn: () => href && openHref(href) },
    { t: 'Editar vínculo', fn: () => linkDialog(a) },
    { t: 'Quitar vínculo', fn: () => { a.replaceWith(...a.childNodes); onRichInput(); } }]);
}

// --- selección, formato y estado ---
let savedRange = null, miniRaf = 0, painter = null;
function onSelChange() {
  const r = $('edText'), sel = getSelection();
  if (sel.rangeCount && r.contains(sel.anchorNode)) {
    savedRange = sel.getRangeAt(0).cloneRange(); updateFmtState();
  }
  cancelAnimationFrame(miniRaf); miniRaf = requestAnimationFrame(updateMini);
}
function restoreSel() {
  const r = $('edText'); r.focus();
  if (savedRange) { const sel = getSelection(); sel.removeAllRanges(); sel.addRange(savedRange); }
}
function fmt(cmd, val, css = true) {
  histCommit(); restoreSel(); document.execCommand('styleWithCSS', false, css); document.execCommand(cmd, false, val || null);
  onRichInput(); histCommit(); updateFmtState();
}
function selStyle() {
  let n = savedRange ? savedRange.startContainer : null; if (!n) return null;
  if (n.nodeType === 3) n = n.parentElement; return n && $('edText').contains(n) ? getComputedStyle(n) : null;
}
const curSize = () => { const cs = selStyle(); return cs ? Math.round(parseFloat(cs.fontSize)) : 17; };
function updateFmtState() {
  document.querySelectorAll('[data-cmd]').forEach(b => { let on = false; try { on = document.queryCommandState(b.dataset.cmd); } catch (e) {} b.classList.toggle('on', on); });
  const cs = selStyle(); if (!cs) return;
  const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
  const famLabel = /^(system-ui|sans-serif)$/i.test(fam) ? 'Predet.' : fam;
  document.querySelectorAll('[data-role=font]').forEach(b => b.textContent = famLabel.length > 10 ? famLabel.slice(0, 9) + '…' : famLabel);
  document.querySelectorAll('[data-role=size]').forEach(b => b.textContent = Math.round(parseFloat(cs.fontSize)));
}
const FONTS = [['Predeterminada', 'sans-serif'], ['Serif', 'Georgia, serif'], ['Monoespaciada', '"Courier New", monospace'], ['Manuscrita', '"Comic Sans MS", cursive'], ['Arial', 'Arial, sans-serif'], ['Verdana', 'Verdana, sans-serif'], ['Times New Roman', '"Times New Roman", serif']];
const SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64];
const TEXT_COLORS = ['#000000', '#444444', '#888888', '#ffffff', '#e53935', '#fb8c00', '#fdd835', '#43a047', '#00acc1', '#1e88e5', '#5e35b1', '#d81b60'];
function colorPick(title, cmd, withNone) {
  const close = v => { $('overlay').hidden = true; $('overlay').replaceChildren(); if (v) fmt(cmd, v); };
  const rowEl = el('div', { className: 'colors' }, TEXT_COLORS.map(c => { const b = el('button', { onclick: () => close(c) }); b.style.background = c; return b; }));
  if (withNone) rowEl.append(el('button', { textContent: '∅', onclick: () => close('transparent') }));
  overlay(el('div', { className: 'dlg' }, el('h3', { textContent: title }), rowEl));
  $('overlay').onclick = e => { if (e.target.id === 'overlay') close(null); };
}
function setSize(px) {
  pendingSize = px; restoreSel();
  histCommit(); document.execCommand('styleWithCSS', false, false); document.execCommand('fontSize', false, '7'); onRichInput(); histCommit(); updateFmtState();
}
function stepSize(d) {
  const cur = curSize(); let i = SIZES.findIndex(s => s >= cur); if (i < 0) i = SIZES.length - 1;
  if (d > 0 && SIZES[i] <= cur) i++; else if (d < 0) i--;
  setSize(SIZES[Math.max(0, Math.min(SIZES.length - 1, i))]);
}

// --- copiar formato (como en Word) ---
function togglePainter() {
  if (painter) {
    if (savedRange && !savedRange.collapsed) { applyPainter(); return; }   // con texto seleccionado: aplicar
    painter = null; paintBtns(); toast('Copiar formato cancelado'); return;
  }
  const cs = selStyle(); if (!cs) { toast('Coloca el cursor en el texto cuyo formato quieres copiar'); return; }
  let bg = 'transparent', n = savedRange.startContainer; if (n.nodeType === 3) n = n.parentElement;
  for (; n && n !== $('edText'); n = n.parentElement) { const b = getComputedStyle(n).backgroundColor; if (b && b !== 'rgba(0, 0, 0, 0)' && b !== 'transparent') { bg = b; break; } }
  const deco = cs.textDecorationLine || '';
  painter = { t: 0, f: { bold: parseInt(cs.fontWeight) >= 600, italic: cs.fontStyle === 'italic', underline: deco.includes('underline'), strike: deco.includes('line-through'), color: cs.color, bg, family: cs.fontFamily, size: Math.round(parseFloat(cs.fontSize)) } };
  paintBtns(); toast('Formato copiado. Selecciona el texto y toca de nuevo el lápiz para aplicarlo');
}
function paintBtns() { document.querySelectorAll('[data-role=painter]').forEach(b => b.classList.toggle('on', !!painter)); }
function applyPainter() {
  if (!painter) return; const f = painter.f; painter = null; paintBtns();
  restoreSel(); document.execCommand('removeFormat'); document.execCommand('styleWithCSS', false, true);
  if (f.bold) document.execCommand('bold'); if (f.italic) document.execCommand('italic');
  if (f.underline) document.execCommand('underline'); if (f.strike) document.execCommand('strikeThrough');
  document.execCommand('foreColor', false, f.color);
  if (f.bg !== 'transparent') document.execCommand('hiliteColor', false, f.bg);
  document.execCommand('fontName', false, f.family);
  setSize(f.size); toast('Formato aplicado');
}

// --- barras de formato: fija (abajo) y flotante al seleccionar ---
const fontMenu = () => menu(FONTS.map(([l, f]) => ({ t: l, fn: () => fmt('fontName', f) })));
const sizeMenu = () => menu(SIZES.map(s => ({ t: s + ' px', fn: () => setSize(s) })));
const BTN = {
  undo: { l: ic('undo'), fn: () => undo() }, redo: { l: ic('redo'), fn: () => redo() },
  bold: { l: 'N', fn: () => fmt('bold'), cmd: 'bold', st: 'font-weight:800' },
  italic: { l: 'K', fn: () => fmt('italic'), cmd: 'italic', st: 'font-style:italic' },
  underline: { l: 'S', fn: () => fmt('underline'), cmd: 'underline', st: 'text-decoration:underline' },
  strike: { l: 'T', fn: () => fmt('strikeThrough'), cmd: 'strikeThrough', st: 'text-decoration:line-through' },
  font: { l: 'Fuente', role: 'font', fn: fontMenu }, size: { l: '16', role: 'size', fn: sizeMenu },
  grow: { l: 'A<small>▲</small>', fn: () => stepSize(1) }, shrink: { l: 'A<small>▼</small>', fn: () => stepSize(-1) },
  color: { l: 'A<span class="sw" style="background:#e53935"></span>', fn: () => colorPick('Color del texto', 'foreColor') },
  hilite: { l: '▮<span class="sw" style="background:#fdd835"></span>', fn: () => colorPick('Resaltado', 'hiliteColor', true) },
  ul: { l: '• Lista', fn: () => fmt('insertUnorderedList'), cmd: 'insertUnorderedList' },
  ol: { l: '1. Lista', fn: () => fmt('insertOrderedList'), cmd: 'insertOrderedList' },
  align: { l: 'Alinear', fn: () => menu([{ t: 'Izquierda', fn: () => fmt('justifyLeft') }, { t: 'Centro', fn: () => fmt('justifyCenter') }, { t: 'Derecha', fn: () => fmt('justifyRight') }, { t: 'Justificado', fn: () => fmt('justifyFull') }]) },
  head: { l: 'Título', fn: () => menu([{ t: 'Texto normal', fn: () => fmt('formatBlock', 'div') }, { t: 'Título grande', fn: () => fmt('formatBlock', 'h1', false) }, { t: 'Título mediano', fn: () => fmt('formatBlock', 'h2', false) }]) },
  link: { l: ic('link'), fn: () => { const a = savedRange && (savedRange.startContainer.nodeType === 3 ? savedRange.startContainer.parentElement : savedRange.startContainer).closest('a'); linkDialog(a && $('edText').contains(a) ? a : null); } },
  painter: { l: ic('brush'), role: 'painter', fn: togglePainter },
  sup: { l: 'x²', fn: () => fmt('superscript'), cmd: 'superscript' }, sub: { l: 'x₂', fn: () => fmt('subscript'), cmd: 'subscript' },
  clear: { l: '✕ Formato', fn: () => fmt('removeFormat') },
};
function fillBar(box, keys) {
  for (const k of keys) {
    const d = BTN[k], b = el('button', { innerHTML: d.l, onclick: d.fn, title: k });
    if (d.cmd) b.dataset.cmd = d.cmd; if (d.role) b.dataset.role = d.role; if (d.st) b.style.cssText = d.st;
    b.addEventListener('pointerdown', e => e.preventDefault());   // no quitar el foco ni la selección al editor
    box.append(b);
  }
}
function buildFmtBar() {
  const bar = $('fmtBar'); bar.replaceChildren();
  fillBar(bar, ['undo', 'redo', 'bold', 'italic', 'underline', 'strike', 'font', 'size', 'grow', 'shrink', 'color', 'hilite', 'ul', 'ol', 'align', 'head', 'link', 'painter', 'sup', 'sub', 'clear']);
  const mini = $('miniBar'); mini.replaceChildren();
  const r1 = el('div', { className: 'r' }), r2 = el('div', { className: 'r' });
  fillBar(r1, ['font', 'size', 'grow', 'shrink', 'clear', 'painter']); fillBar(r2, ['bold', 'italic', 'underline', 'hilite', 'color', 'ul', 'ol', 'link']);
  mini.append(r1, r2);
}
function updateMini() {
  const m = $('miniBar'), ed = $('edText'), sel = getSelection();
  if (!sel.rangeCount || sel.isCollapsed || ed.hidden || !ed.contains(sel.anchorNode) || !ed.isContentEditable || !$('overlay').hidden) { m.hidden = true; return; }
  const rc = sel.getRangeAt(0).getBoundingClientRect(); if (!rc.width && !rc.height) { m.hidden = true; return; }
  m.hidden = false;
  const w = m.offsetWidth, h = m.offsetHeight;
  // El menú nativo de Android (Cortar/Copiar/Pegar) va encima de la selección si hay sitio y, si no, debajo.
  // Colocamos esta barra en el lado contrario para que no se superpongan.
  const nativeBelow = rc.top < 150;
  let top = nativeBelow ? rc.bottom + 130 : rc.bottom + 48;
  if (top + h > innerHeight - 60) top = nativeBelow ? Math.max(60, innerHeight - h - 70) : Math.max(60, rc.top - h - 90);
  m.style.left = Math.max(4, Math.min(innerWidth - w - 4, rc.left + rc.width / 2 - w / 2)) + 'px'; m.style.top = top + 'px';
}

/* ============ Menú y acciones del editor ============ */
function editorMenu() {
  const n = S.cur, t = n.type;
  menu([
    { t: 'Deshacer  (Ctrl+Z)', fn: undo }, { t: 'Rehacer  (Ctrl+Y)', fn: redo }, '-',
    { t: 'Etiquetas…', fn: async () => { if (n.deleted) return; if (await labelsDialog([n])) drawEdLabels(); } },
    t !== 'text' ? { t: 'Renombrar', fn: async () => { const v = await ask('Título', n.title); if (v !== null) { n.title = v; touch(); drawEditor(); } } } : null,
    t === 'draw' ? { t: 'Lápiz y colores…', fn: penDialog } : null,
    t === 'draw' ? { t: 'Borrar dibujo', fn: async () => { if (await confirmD('¿Borrar todo el dibujo?')) { H.u.push({ t: 'clear', s: n.strokes }); H.r = []; n.strokes = []; S.redraw(); touch(); } } } : null,
    t === 'check' || t === 'text' ? { t: t === 'text' ? 'Convertir en lista de tareas' : 'Convertir en nota de texto', fn: convertNote } : null,
    t !== 'draw' && t !== 'voice' ? { t: 'Buscar en la nota', fn: openFind } : null,
    { t: 'Información', fn: noteInfo },
    { t: 'Color de la nota…', fn: colorDialog },
    { t: n.readonly ? 'Desactivar solo lectura' : 'Solo lectura', fn: () => { n.readonly = !n.readonly; touch(); drawEditor(); } },
    { t: n.reminder ? 'Recordatorio: ' + fmtDate(n.reminder) + ' (cambiar)' : 'Añadir recordatorio', fn: reminderDialog },
    { t: n.enc ? 'Quitar cifrado' : 'Cifrar con contraseña', fn: toggleEncrypt },
    n.enc ? { t: S.bioNotes.has(n.id) ? 'Quitar la huella de esta nota' : 'Abrir esta nota con huella', fn: () => toggleNoteBio(n) } : null,
    '-', { t: 'Mover a carpeta…', fn: async () => { const f = await pickFolder(true); if (f) { n.folder = f; touch(); toast('Movida a ' + folderName(f)); } } },
    { t: 'Duplicar', fn: async () => { const c = JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(n).filter(([k]) => k[0] !== '_')))); c.id = uid(); c.created = c.updated = Date.now(); c.enc = n.enc ? null : null; await persist(c); toast('Nota duplicada'); } },
    t !== 'draw' ? { t: 'Exportar como .txt', fn: () => exportTxt(n) } : { t: 'Exportar como imagen', fn: exportDraw },
    { t: 'Imprimir / guardar PDF', fn: printNote },
  ]);
}
function convertNote() {
  const n = S.cur; if (n.readonly) return;
  if (n.type === 'text') {
    const lines = n.body.split('\n').filter(s => s.trim());
    n.items = lines.map(s => ({ t: s.replace(/^\s*\[(x| )\]\s*/i, ''), done: /^\s*\[x\]/i.test(s) }));
    n.title = n.title || noteTitle(n); n.body = ''; n.html = ''; n.type = 'check';
  } else {
    n.body = n.items.map(i => (i.done ? '[x] ' : '') + i.t).join('\n'); n.html = ''; n.items = []; n.type = 'text'; n.title = '';
  }
  drawEditor(); histReset(); touch();
}
function openFind() {
  S.find = { q: '', i: 0, marks: [] }; drawEditor(); $('findInput').value = ''; $('findInput').focus();
}
function closeFind() { S.find = null; drawEditor(); }
async function colorDialog() {
  const n = S.cur;
  const row = el('div', { className: 'colors' }, NOTE_COLORS.map(c => {
    const b = el('button', { className: n.color === c ? 'on' : '', onclick: () => { n.color = c; touch(); $('overlay').querySelector('.btns button').click(); } });
    b.style.background = c || 'transparent'; if (!c) b.textContent = '∅'; return b;
  }));
  await dialog('Color de la nota', row, [{ t: 'Cerrar', v: 1 }]);
}
async function reminderDialog() {
  const n = S.cur;
  const local = ts => { const d = new Date(ts - new Date().getTimezoneOffset() * 6e4); return d.toISOString().slice(0, 16); };
  const inp = el('input', { type: 'datetime-local', value: local(n.reminder || Date.now() + 36e5) });
  const r = await dialog('Recordatorio', inp, [{ t: 'Cancelar', v: null }, { t: 'Quitar', v: 'x' }, { t: 'Guardar', v: 'ok' }]);
  if (r === 'x') { n.reminder = null; touch(); }
  else if (r === 'ok' && inp.value) {
    n.reminder = new Date(inp.value).getTime(); n.fired = false; touch();
    if (window.Notification && Notification.permission === 'default') Notification.requestPermission();
  }
  drawEditor();
}
async function toggleEncrypt() {
  const n = S.cur;
  if (!crypto.subtle) { toast('El cifrado requiere HTTPS (o localhost)'); return; }
  if (n.enc) { if (!(await confirmD('¿Quitar el cifrado de esta nota?'))) return; n.enc = null; delete n._key; bioForget(n.id); touch(); toast('Cifrado quitado'); drawEditor(); return; }
  const p1 = await masterPw(); if (!p1) return;
  const salt = crypto.getRandomValues(new Uint8Array(16));
  bioForget(n.id); n.enc = { s: b64(salt), iv: '', d: '' }; n._key = await deriveKey(p1, salt);
  touch(); toast('Nota cifrada con la contraseña de tus notas'); drawEditor();
}
function noteText(n) {
  return (n.type === 'check' ? n.title + '\n' + n.items.map(i => (i.done ? '[x] ' : '[ ] ') + i.t).join('\n') : (n.type === 'text' ? n.body : (n.title + '\n' + n.body)));
}
function download(name, blob) { const a = el('a', { href: URL.createObjectURL(blob), download: name }); document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }
const safeName = s => s.replace(/[\\/:*?"<>|]+/g, '_').slice(0, 60) || 'nota';
function exportTxt(n) { download(safeName(noteTitle(n)) + '.txt', new Blob([noteText(n)], { type: 'text/plain' })); }
function exportDraw() { $('canvas').toBlob(b => download(safeName(S.cur.title) + '.png', b)); }
async function shareNote() {
  const n = S.cur;
  try {
    if (n.type === 'draw') { const b = await new Promise(r => $('canvas').toBlob(r)); const f = new File([b], safeName(n.title) + '.png', { type: 'image/png' }); if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f] }); return; } exportDraw(); return; }
    if (navigator.share) await navigator.share({ title: noteTitle(n), text: noteText(n) });
    else { await navigator.clipboard.writeText(noteText(n)); toast('Copiado al portapapeles'); }
  } catch (e) { if (e.name !== 'AbortError') toast('No se pudo compartir'); }
}
function printNote() {
  const n = S.cur, p = $('printArea'); p.replaceChildren(el('h2', { textContent: noteTitle(n) }));
  if (n.type === 'draw') p.append(el('img', { src: $('canvas').toDataURL() }));
  else { if (n.media && n.type === 'photo') p.append(el('img', { src: n.media })); p.append(n.type === 'check' ? el('div', { textContent: n.items.map(i => (i.done ? '☑ ' : '☐ ') + i.t).join('\n') }) : el('div', { innerHTML: sanitize(n.html || textToHtml(n.body)) })); }
  setTimeout(() => print(), 100);
}
async function noteInfo() {
  const n = S.cur;
  const len = n.type === 'check' ? n.items.length + ' elementos' : n.body.length + ' caracteres';
  await info('Información', `Título: ${noteTitle(n)}\nTipo: ${TYPE_NAME[n.type]}\nCarpeta: ${folderName(n.folder)}\nCreada: ${fmtDate(n.created)}\nModificada: ${fmtDate(n.updated)}\nTamaño: ${len}${n.enc ? '\nCifrada: sí' : ''}${n.reminder ? '\nRecordatorio: ' + fmtDate(n.reminder) : ''}`);
}

/* ============ Ajustes, copias e importación ============ */
function renderSettings() {
  const L = $('stList'); L.replaceChildren();
  const sec = t => L.append(el('div', { className: 'sec', textContent: t }));
  const item = (t, sub, fn) => L.append(el('div', { className: 'set', onclick: fn }, el('span', { textContent: t }), sub ? el('small', { textContent: sub }) : null));
  sec('Apariencia');
  item('Tema', settings.theme === 'dark' ? 'Oscuro' : 'Claro', () => { settings.theme = settings.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = settings.theme; renderSettings(); });
  item('Enlaces wiki (PalabrasWiki y [[Nota]])', settings.wiki ? 'Activados' : 'Desactivados', () => { settings.wiki = !settings.wiki; renderSettings(); });
  item('Etiquetas', allLabels().length ? allLabels().length + ' etiqueta(s): renombrar, eliminar o ver sus notas' : 'Aún no hay etiquetas (se crean desde una nota)', () => manageLabels(true));
  sec('Seguridad');
  item('Bloqueo de la app', lock.on ? (lock.bio ? 'PIN y huella' : 'PIN') : 'Desactivado', lockMenu);
  item('Contraseña de las notas', pwvGet() ? 'Configurada · toca para cambiarla' : 'No configurada · toca para crearla (una sola para todas las notas cifradas)', masterSetup);
  item('Huella de este dispositivo', bio.cred ? `Registrada · ${S.bioNotes.size} nota(s) cifrada(s) con huella` : 'No registrada (se registra al activarla en una nota o en el bloqueo)', bio.cred ? removeBio : () => toast('Se registra al activar la huella'));
  item('Recuperación de contraseñas', recOn() ? (S.recovery.mode === 'drive' ? 'Configurada · con tu cuenta de Google' : 'Configurada · clave partida (método antiguo)') : 'No configurada', recoveryMenu);
  sec('Protección de los datos');
  item('Carpeta espejo (recomendado)', dirSupported() ? (mir.dir ? 'Activa: ' + mir.dir.name + ' — copia viva fuera del navegador' : 'No configurada: guarda cada nota como archivo en una carpeta de tu dispositivo') : 'Este navegador no permite elegir carpetas', mirrorMenu);
  const freq = (key, cur) => () => menu([1, 2, 3, 7].map(d => ({ t: d === 1 ? 'Cada día' : `Cada ${d} días`, fn: () => { pref(key, String(d)); renderSettings(); } })));
  const keepMenu = key => () => menu([3, 7, 14, 30].map(k => ({ t: k + ' copias', fn: () => { pref(key, String(k)); renderSettings(); } })));
  const label = d => d === 1 ? 'Cada día' : `Cada ${d} días`;
  sec('Copia interna (en este dispositivo)');
  item('Activada', bk.on ? 'Sí' : 'No', () => { pref('bk_on', bk.on ? '0' : '1'); renderSettings(); });
  item('Frecuencia', label(bk.days), freq('bk_days'));
  item('Hora', bk.time + ' · si la app estaba cerrada, se hace al abrirla', async () => { const v = await askTime('Hora de la copia interna', bk.time); if (v) { pref('bk_time', v); renderSettings(); } });
  item('Copias que se conservan', String(bk.keep), keepMenu('bk_keep'));
  item('Hacer una copia ahora', pref('bk_last') ? 'Última: ' + fmtDate(+pref('bk_last')) : 'Aún no hay copias', async () => { await runBackup(true); renderSettings(); });
  item('Ver y restaurar copias', 'Se guardan dentro de la app, en este dispositivo', backupsMenu);
  sec('Copia JSON diaria (archivo)');
  item('Activada', bj.on ? 'Sí' : 'No', () => { pref('bj_on', bj.on ? '0' : '1'); renderSettings(); });
  item('Frecuencia', label(bj.days), freq('bj_days'));
  item('Hora', bj.time + ' · si no hay internet o la app está cerrada, se hace en cuanto se pueda', async () => { const v = await askTime('Hora de la copia JSON', bj.time); if (v) { pref('bj_time', v); renderSettings(); } });
  item('Copias que se conservan', bj.keep ? String(bj.keep) : 'Todas: no se borra ninguna automáticamente', () => menu([...[3, 7, 14, 30].map(k => ({ t: k + ' copias', fn: () => { pref('bj_keep', String(k)); renderSettings(); } })), { t: 'Todas (no borrar nunca)', fn: () => { pref('bj_keep', '0'); renderSettings(); } }]));
  item('Guardar en Google Drive', bj.drive ? 'Sí (carpeta privada de la app en tu Drive)' : 'No', () => { pref('bj_drive', bj.drive ? '0' : '1'); renderSettings(); });
  item('Guardar en el teléfono (carpeta Descargas)', bj.phone ? 'Sí · un archivo .json que la app nunca borra; solo tú, a mano' : 'No', () => { pref('bj_phone', bj.phone ? '0' : '1'); renderSettings(); if (bj.phone) toast('Si Chrome pregunta, permite las descargas de este sitio'); });
  if (dirSupported()) item('Guardar en una carpeta del dispositivo', bj.pc ? 'Sí · toca para elegir o cambiar la carpeta' : 'No · toca para elegir la carpeta', () => menu([
    { t: 'Elegir o cambiar la carpeta', fn: async () => { await chooseBackupFolder(); renderSettings(); } },
    { t: bj.pc ? 'No guardar en la carpeta' : 'Guardar también en la carpeta', fn: () => { pref('bj_pc', bj.pc ? '0' : '1'); renderSettings(); } },
  ]));
  item('Hacer una copia JSON ahora', pref('bj_last') ? 'Última: ' + fmtDate(+pref('bj_last')) : 'Aún no hay copias JSON', async () => { await runJsonBackup(true, false); renderSettings(); });
  item('Ver y restaurar copias de Drive', 'Copias JSON guardadas en tu Google Drive', driveBackupsMenu);
  sec('Datos');
  item('Exportar copia de seguridad', 'Archivo JSON con todas las notas, fotos, audios y carpetas', exportBackup);
  item('Importar copia de seguridad', 'Fusiona; si hay conflicto gana la nota más reciente', () => pickFile('application/json', false, importBackup));
  item('Importar desde Note Everything (ZIP)', 'Copia manual de la app oficial (manualbackup_….zip)', () => pickFile('.zip,application/zip', false, async f => { try { await loadScript('ne.js'); neImport(f); } catch (e) { toast(e.message); } }));
  item('Exportar para Note Everything (ZIP)', 'Crea un backup que la app oficial puede restaurar', async () => { try { await loadScript('ne.js'); neExport(); } catch (e) { toast(e.message); } });
  item('Importar archivos de texto (.txt)', 'Uno o varios; cada archivo crea una nota', () => pickFile('.txt,text/plain', true, importTxt));
  item('Vaciar papelera', '', emptyTrash);
  sec('Sincronización');
  item('Sincronización automática', pref('autosync') !== '0' ? 'Activada: al abrir la app y al volver a ella' : 'Desactivada: solo con el botón', () => { pref('autosync', pref('autosync') !== '0' ? '0' : '1'); renderSettings(); });
  item('Sincronizar ahora con Google Drive', pref('lastSync') ? 'Última vez: ' + fmtDate(+pref('lastSync')) : 'Aún no sincronizado', () => { history.back(); setTimeout(syncDrive, 300); });
  item('ID de cliente de Google', pref('gclient') ? 'Configurado' : 'Sin configurar (necesario para sincronizar)', async () => { await setClientId(false); renderSettings(); });
  item('Correo de Google para sincronizar', pref('gemail') || 'Sin indicar (se te preguntará la cuenta)', async () => { const v = await ask('Correo de la cuenta de Google', pref('gemail') || '', 'email'); if (v !== null) { pref('gemail', v.trim()); pref('gconsent', ''); gToken = null; renderSettings(); } });
  item('Registro de sincronización', 'Últimas operaciones (para diagnosticar problemas)', () => { let l = []; try { l = JSON.parse(pref('synclog') || '[]'); } catch (e) {} info('Registro de sincronización', l.length ? l.slice().reverse().map(e => fmtDate(e.t) + ' — ' + (e.blocked ? 'DETENIDO: pedía borrar ' + e.blocked : e.drop ? `FALTABAN ${e.drop} notas al abrir (${e.prev} → ${e.now})` : `↓${e.down} ↑${e.up} borradas:${e.del} total:${e.total}`)).join('\n') : 'Sin registros todavía'); });
  item('Cerrar sesión de Google', '', googleSignOut);
  sec('Ajustes avanzados');
  item('Apertura de elementos', 'Toca para ver los detalles', async () => {
    const r = await dialog('Apertura de elementos', el('p', { style: 'white-space:pre-line', textContent: 'Las notas cifradas no se abren con un toque: hay que mantener pulsado sobre ellas 3 segundos, sin mover el dedo (el teléfono vibra al abrirse). Un toque normal no hace nada.\n\nTampoco muestran candado, para que no se note que están cifradas. Al abrirlas se pide la contraseña como siempre.\n\nMientras seleccionas varias notas funcionan como las demás.\n\nEstado actual: ' + (longOpen() ? 'activado.' : 'desactivado (se abren con un toque).') }), [{ t: 'Cerrar', v: null }, { t: longOpen() ? 'Desactivar' : 'Activar', v: true }]);
    if (r) { pref('longopen', longOpen() ? '0' : '1'); renderMain(); toast(longOpen() ? 'Activado' : 'Desactivado'); }
  });
  sec('Acerca de');
  item('Audio Manager', 'Funciona sin conexión. Los datos se guardan solo en este dispositivo.', () => {});
}
function pickFile(accept, multiple, fn) {
  const f = $('fileIn'); f.accept = accept; f.multiple = multiple; f.removeAttribute('capture');
  f.onchange = () => { const files = [...f.files]; f.value = ''; if (files.length) fn(files); }; f.click();
}
function exportBackup() {
  const data = { app: 'notas', version: 2, exported: Date.now(), folders: S.folders, notes: S.notes, recovery: S.recovery || undefined };
  download(`notas-copia-${new Date().toISOString().slice(0, 10)}.json`, new Blob([JSON.stringify(data, (k, v) => (k[0] === '_' ? undefined : v))], { type: 'application/json' }));
}
// overwrite=true: restaurar (la copia manda); false: fusionar (gana la más reciente)
async function applyBackupData(d, overwrite) {
  if (!d || !Array.isArray(d.notes)) throw new Error('copia no válida');
  let add = 0, upd = 0; const t = tombs();
  if (d.recovery) { const pk = pickRecovery(S.recovery, d.recovery); if (pk !== S.recovery) await setRecovery(pk); }
  for (const f of d.folders || []) if (f.id && !folderById(f.id)) { S.folders.push(f); await DB.put('folders', f); }
  for (const raw of d.notes) {
    if (!raw || !raw.id) continue;
    const n = Object.assign(newNote(raw.type || 'text'), raw), old = S.notes.find(x => x.id === n.id);
    if (!overwrite && old && old.updated >= n.updated) continue;
    if (overwrite) { n.updated = Date.now(); delete t['n:' + n.id]; }   // para que la sincronización propague la restauración
    if (old) { S.notes[S.notes.indexOf(old)] = n; upd++; } else { S.notes.push(n); add++; }
    await DB.put('notes', n);
  }
  saveTombs(t);
  return { add, upd };
}
async function importBackup([file]) {
  try {
    const r = await applyBackupData(JSON.parse(await file.text()), false);
    toast(`Importadas: ${r.add} nuevas, ${r.upd} actualizadas`);
  } catch (e) { toast('Archivo de copia no válido'); }
}
async function importTxt(files) {
  for (const f of files) { const n = newNote('text', S.view.kind === 'folder' ? S.view.id : 'main'); n.body = await f.text(); await persist(n); }
  toast(`${files.length} nota(s) importadas`);
}

/* ============ Recordatorios ============ */
async function checkReminders() {
  const now = Date.now();
  for (const n of S.notes.filter(n => n.reminder && !n.fired && !n.deleted && n.reminder <= now)) {
    n.fired = true; await persist(n);
    const title = noteTitle(n);
    try {
      if (window.Notification && Notification.permission === 'granted') {
        const reg = await navigator.serviceWorker.getRegistration();
        reg ? reg.showNotification('Recordatorio', { body: title, tag: n.id }) : new Notification('Recordatorio', { body: title });
      }
    } catch (e) {}
    const r = await dialog('Recordatorio', el('p', { textContent: title }), [{ t: 'Descartar', v: 0 }, { t: 'Posponer 10 min', v: 1 }, { t: 'Abrir', v: 2 }]);
    if (r === 1) { n.reminder = Date.now() + 6e5; n.fired = false; await persist(n); } else if (r === 2) { openNote(n); }
    renderMain();
  }
}

/* ============ Sincronización con Google Drive ============ */
// Guarda un único archivo JSON en la carpeta privada de la app (appDataFolder) de tu Drive.
// Alcance mínimo: drive.appdata (la app no ve ningún otro archivo de tu Drive).
const DRIVE_FILE = 'notas-sync.json';
const tombs = () => { try { return JSON.parse(pref('tomb') || '{}'); } catch (e) { return {}; } };
const saveTombs = t => pref('tomb', JSON.stringify(t));
async function forgetNote(id) { const t = tombs(); t['n:' + id] = Date.now(); saveTombs(t); await DB.del('notes', id); }
async function forgetFolder(id) { const t = tombs(); t['f:' + id] = Date.now(); saveTombs(t); await DB.del('folders', id); }

// Fusión pura (sin red): gana la versión más reciente de cada nota; los borrados se propagan con "lápidas".
function mergeData(L, R) {
  const tomb = Object.assign({}, R.tomb);
  for (const k in L.tomb) tomb[k] = Math.max(tomb[k] || 0, L.tomb[k]);
  const lim = Date.now() - 90 * 864e5; for (const k in tomb) if (tomb[k] < lim) delete tomb[k];
  const map = new Map();
  for (const n of R.notes) map.set(n.id, { r: n });
  for (const n of L.notes) map.set(n.id, Object.assign(map.get(n.id) || {}, { l: n }));
  const notes = [], applyLocal = [], delLocal = []; let upload = false;
  for (const [id, { l, r }] of map) {
    const best = !r ? l : !l ? r : (r.updated > l.updated ? r : l);
    const t = tomb['n:' + id];
    if (t && t >= best.updated) { if (l) delLocal.push(id); if (r) upload = true; continue; }
    notes.push(best); if (best !== l) applyLocal.push(best); if (best !== r) upload = true;
  }
  const fmap = new Map();
  for (const f of R.folders) fmap.set(f.id, { r: f });
  for (const f of L.folders) fmap.set(f.id, Object.assign(fmap.get(f.id) || {}, { l: f }));
  const folders = [], applyFolders = [], delFolders = [];
  for (const [id, { l, r }] of fmap) {
    if (tomb['f:' + id] && id !== 'main') { if (l) delFolders.push(id); if (r) upload = true; continue; }
    const best = l || r; folders.push(best); if (!l) applyFolders.push(best); if (!r) upload = true;
  }
  for (const k in tomb) if (tomb[k] !== (R.tomb || {})[k]) upload = true;
  return { notes, folders, tomb, applyLocal, delLocal, applyFolders, delFolders, upload };
}

let gToken = null, gExp = 0;
const loadGIS = () => (window.google && google.accounts) ? Promise.resolve() : new Promise((res, rej) => {
  const s = el('script', { src: 'https://accounts.google.com/gsi/client', onload: res, onerror: () => rej(new Error('Sin conexión a internet')) }); document.head.append(s);
});
async function getToken(auto, force) {
  if (!force && gToken && Date.now() < gExp - 60000) return gToken;
  const cid = pref('gclient'); if (!cid) throw new Error('noclient');
  await loadGIS();
  return new Promise((res, rej) => {
    const tc = google.accounts.oauth2.initTokenClient({
      client_id: cid, scope: 'https://www.googleapis.com/auth/drive.appdata', hint: pref('gemail') || undefined,
      callback: r => { if (r.error) rej(new Error(r.error_description || r.error)); else { gToken = r.access_token; gExp = Date.now() + r.expires_in * 1000; res(gToken); } },
      error_callback: e => rej(new Error(e.type === 'popup_failed_to_open' ? 'popup' : e.type === 'popup_closed' ? 'Cancelaste el inicio de sesión' : (e.message || e.type))),
    });
    tc.requestAccessToken({ prompt: auto ? 'none' : force ? 'select_account' : pref('gconsent') ? '' : 'select_account' });
  });
}
async function gfetch(url, opts = {}) {
  const r = await fetch(url, Object.assign({}, opts, { headers: Object.assign({ Authorization: 'Bearer ' + gToken }, opts.headers || {}) }));
  if (r.status === 401) { gToken = null; throw new Error('Sesión de Google caducada, vuelve a sincronizar'); }
  if (!r.ok) throw new Error('Drive respondió ' + r.status);
  return r;
}
const strip = n => { const o = {}; for (const k in n) if (k[0] !== '_') o[k] = n[k]; return o; };

let syncing = false;
function markCount() { pref('boot_count', String(S.notes.length)); }
function syncLog(e) { try { const l = JSON.parse(pref('synclog') || '[]'); l.push(Object.assign({ t: Date.now() }, e)); pref('synclog', JSON.stringify(l.slice(-25))); } catch (x) {} }
async function syncDrive(opts) {
  const auto = !!(opts && opts.auto);                 // arranque automático: sin avisos molestos
  if (syncing) return;
  if (!pref('gclient')) { if (auto) return; await setClientId(true); if (!pref('gclient')) return; }
  if (!navigator.onLine) { if (!auto) toast('Sin conexión a internet'); return; }
  syncing = true; S.dirty = false; $('syncBtn').classList.add('spin'); updateSyncStat(); if (!auto) toast('Sincronizando…');
  try {
    await getToken(auto); pref('gconsent', '1');
    const q = encodeURIComponent(`name='${DRIVE_FILE}'`);
    const list = await (await gfetch(`https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${q}&fields=files(id)`)).json();
    const fid = list.files && list.files[0] && list.files[0].id;
    let R = { notes: [], folders: [], tomb: {} };
    if (fid) { const d = await (await gfetch(`https://www.googleapis.com/drive/v3/files/${fid}?alt=media`)).json(); R = { notes: d.notes || [], folders: d.folders || [], tomb: d.tomb || {}, recovery: d.recovery || null }; }
    const L = { notes: S.notes.map(strip), folders: S.folders, tomb: tombs() };
    const m = mergeData(L, R);
    const pickRec = pickRecovery(S.recovery, R.recovery);          // la configuración de recuperación viaja con las notas
    if (pickRec !== S.recovery) await setRecovery(pickRec);
    if (pickRec && pickRec !== R.recovery) m.upload = true;
    const mass = m.delLocal.length >= 10 && m.delLocal.length > S.notes.length * 0.1;
    if (mass) {
      syncLog({ blocked: m.delLocal.length });
      if (auto) { toast(`La sincronización pedía borrar ${m.delLocal.length} notas y se detuvo. Toca ⟳ para revisarlo.`); return; }
      await runBackup(true, true);
      if (!(await confirmD(`Otro dispositivo pide borrar ${m.delLocal.length} notas de este. Se acaba de guardar una copia de seguridad. ¿Aplicar los borrados?`))) { toast('No se aplicaron los borrados'); return; }
    } else if (m.delLocal.length + m.applyLocal.length >= 20) await runBackup(true, true);   // copia previa a cambios grandes
    const openId = S.cur && S.cur.id;                    // la nota abierta no se toca en esta ronda
    m.applyLocal = m.applyLocal.filter(n => n.id !== openId); m.delLocal = m.delLocal.filter(id => id !== openId);
    for (const n of m.applyLocal) { const i = S.notes.findIndex(x => x.id === n.id); const full = Object.assign(newNote(n.type || 'text'), n); i >= 0 ? S.notes[i] = full : S.notes.push(full); await DB.put('notes', full); }
    for (const id of m.delLocal) { S.notes = S.notes.filter(x => x.id !== id); await DB.del('notes', id); }
    for (const f of m.applyFolders) { S.folders.push(f); await DB.put('folders', f); }
    for (const id of m.delFolders) { S.folders = S.folders.filter(x => x.id !== id); await DB.del('folders', id); }
    saveTombs(m.tomb);
    if (m.upload || !fid) {
      const body = JSON.stringify({ app: 'notas', version: 2, saved: Date.now(), notes: m.notes.map(strip), folders: m.folders, tomb: m.tomb, recovery: pickRec || undefined });
      if (fid) await gfetch(`https://www.googleapis.com/upload/drive/v3/files/${fid}?uploadType=media`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body });
      else {
        const bd = 'nb' + Date.now();
        const mp = `--${bd}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify({ name: DRIVE_FILE, parents: ['appDataFolder'] })}\r\n--${bd}\r\nContent-Type: application/json\r\n\r\n${body}\r\n--${bd}--`;
        await gfetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', { method: 'POST', headers: { 'Content-Type': 'multipart/related; boundary=' + bd }, body: mp });
      }
    }
    pref('lastSync', String(Date.now())); pref('lastSyncErr', '');
    syncLog({ down: m.applyLocal.length, del: m.delLocal.length, up: m.upload ? m.notes.length : 0, total: S.notes.length });
    if (!auto || m.applyLocal.length || m.delLocal.length) toast(`Sincronizado ✓  (↓${m.applyLocal.length} ↑${m.upload ? m.notes.length : 0})`);
    renderMain();
    if (!auto && !pref('gemail') && !pref('gemail_asked')) {   // sin correo la sincronización automática no puede entrar sola
      pref('gemail_asked', '1');
      const v = await ask('Para que la sincronización automática funcione al abrir la app, escribe el correo de tu cuenta de Google (puedes cambiarlo en Ajustes)', '', 'email');
      if (v && v.trim()) { pref('gemail', v.trim()); gToken = null; toast('Correo guardado'); }
    }
  } catch (e) {
    if (!/popup|interaction|login_required|consent|internet|network|fetch/i.test(e.message)) pref('lastSyncErr', e.message);
    if (auto) {
      // Google exige un gesto del usuario para abrir su ventana: se reintenta con el primer toque.
      if (/popup|interaction|login_required|consent/i.test(e.message)) { armFirstTap(); if (!pref('gemail')) toast('Falta tu correo de Google en Ajustes para sincronizar sola al abrir'); } else if (!/internet|network|fetch/i.test(e.message)) toast('Toca ⟳ para volver a conectar con Google');
    } else toast(e.message === 'noclient' ? 'Falta el ID de cliente de Google' : 'No se pudo sincronizar: ' + e.message);
  } finally { syncing = false; $('syncBtn').classList.remove('spin'); updateSyncStat(); }
}
let tapArmed = false;
function armFirstTap() {
  if (tapArmed) return; tapArmed = true;
  document.addEventListener('pointerup', () => { tapArmed = false; syncDrive({ auto: true }); }, { once: true });
}
const autoSyncDue = () => pref('autosync') !== '0' && pref('gclient') && pref('gconsent') && Date.now() - (+pref('lastSync') || 0) > 3 * 60000;
async function setClientId(first) {
  const v = await ask(first ? 'Para sincronizar pega tu ID de cliente de Google (termina en .apps.googleusercontent.com)' : 'ID de cliente de Google', pref('gclient') || '');
  if (v === null) return;
  const id = v.trim().replace(/\s+/g, '');
  if (id && !/^\d+-[a-z0-9]+\.apps\.googleusercontent\.com$/i.test(id)) {
    await info('ID no válido', 'Un ID de cliente tiene este aspecto:\n123456789012-abcdefg1234567.apps.googleusercontent.com\n\nCópialo completo desde Google Cloud: Google Auth Platform → Clientes → tu cliente de tipo "Aplicación web". No sirve el ID del proyecto ni el secreto del cliente.');
    return;
  }
  pref('gclient', id); gToken = null; pref('gconsent', '');
  if (first && id) syncDrive();
}
function googleSignOut() {
  if (gToken && window.google && google.accounts) google.accounts.oauth2.revoke(gToken, () => {});
  gToken = null; pref('gconsent', ''); toast('Sesión de Google cerrada');
}

/* ============ Deshacer / Rehacer (varios pasos) ============ */
// Texto y listas: instantáneas del contenido (hasta 200 pasos). Dibujo: acciones (trazo / borrado).
const H = { u: [], r: [], base: null, timer: 0 };
function caretOffset() {
  const r = $('edText'), sel = getSelection();
  if (!sel.rangeCount || !r.contains(sel.anchorNode)) return null;
  const pre = document.createRange(); pre.selectNodeContents(r); pre.setEnd(sel.anchorNode, sel.anchorOffset); return pre.toString().length;
}
function setCaretOffset(r, off) {
  if (off == null) return;
  const w = document.createTreeWalker(r, NodeFilter.SHOW_TEXT); let n, acc = 0;
  while ((n = w.nextNode())) {
    if (acc + n.data.length >= off) { const g = document.createRange(); g.setStart(n, off - acc); g.collapse(true); const s = getSelection(); s.removeAllRanges(); s.addRange(g); return; }
    acc += n.data.length;
  }
}
function snapNow() {
  const n = S.cur; if (!n || n.type === 'draw') return null;
  if (n.type === 'check') return { k: JSON.stringify(n.items) };
  return { k: $('edText').innerHTML, c: caretOffset() };
}
function histReset() { clearTimeout(H.timer); H.u = []; H.r = []; H.base = snapNow(); }
function histNote() { if (!S.cur || S.cur.type === 'draw') return; clearTimeout(H.timer); H.timer = setTimeout(histCommit, 450); }
function histCommit() {
  clearTimeout(H.timer); const s = snapNow();
  if (!s || !H.base || s.k === H.base.k) return;
  H.u.push(H.base); if (H.u.length > 200) H.u.shift();
  H.base = s; H.r = [];
}
function applySnap(s) {
  const n = S.cur;
  if (n.type === 'check') { n.items = JSON.parse(s.k); drawChecks(); }
  else { const r = $('edText'); r.innerHTML = s.k; r.focus(); setCaretOffset(r, s.c); syncFromEditor(); }
  touch();
}
function undo() {
  const n = S.cur; if (!n || n.readonly || n.deleted) return;
  if (n.type === 'draw') {
    const a = H.u.pop(); if (!a) { toast('Nada que deshacer'); return; }
    if (a.t === 'add') H.r.push({ t: 'add', s: n.strokes.pop() }); else { H.r.push({ t: 'clear' }); n.strokes = a.s; }
    S.redraw(); touch(); return;
  }
  histCommit(); const prev = H.u.pop(); if (!prev) { toast('Nada que deshacer'); return; }
  H.r.push(H.base); H.base = prev; applySnap(prev);
}
function redo() {
  const n = S.cur; if (!n || n.readonly || n.deleted) return;
  if (n.type === 'draw') {
    const a = H.r.pop(); if (!a) { toast('Nada que rehacer'); return; }
    if (a.t === 'add') { n.strokes.push(a.s); H.u.push({ t: 'add' }); } else { H.u.push({ t: 'clear', s: n.strokes }); n.strokes = []; }
    S.redraw(); touch(); return;
  }
  histCommit(); const nx = H.r.pop(); if (!nx) { toast('Nada que rehacer'); return; }
  H.u.push(H.base); H.base = nx; applySnap(nx);
}
function histKeys(e) {
  if (S.stack[S.stack.length - 1] !== 'editor' || !$('overlay').hidden || !(e.ctrlKey || e.metaKey)) return;
  const k = e.key.toLowerCase(); if (k !== 'z' && k !== 'y') return;
  e.preventDefault(); (k === 'y' || e.shiftKey) ? redo() : undo();
}

/* ============ Copias de seguridad automáticas ============ */
const bk = {
  get on() { return pref('bk_on') !== '0' }, get days() { return +pref('bk_days') || 1 }, get keep() { return +pref('bk_keep') || 7 }, get time() { return pref('bk_time') || '02:00'; },
};
const dirSupported = () => 'showDirectoryPicker' in window;
const pad2 = n => String(n).padStart(2, '0');
const stamp = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}_${pad2(d.getHours())}-${pad2(d.getMinutes())}`;
const backupJSON = () => JSON.stringify({ app: 'notas', version: 2, exported: Date.now(), folders: S.folders, notes: S.notes.map(strip), tomb: tombs(), recovery: S.recovery || undefined }, (k, v) => (k[0] === '_' ? undefined : v));
async function gzip(text) { const st = new Blob([text]).stream().pipeThrough(new CompressionStream('gzip')); return new Response(st).blob(); }
async function gunzipText(blob) { const st = blob.stream().pipeThrough(new DecompressionStream('gzip')); return new Response(st).text(); }

async function runBackup(force, silent) {
  if (!DB.idb) { if (force && !silent) toast('Este navegador no permite guardar copias internas'); return; }
  const due = bk.on && Date.now() >= nextDue(+pref('bk_last') || 0, bk.days, bk.time);
  if (!force && (!due || !S.notes.length)) return;
  const json = backupJSON(), ts = Date.now(), name = `notas-copia-${stamp(new Date(ts))}.json`;
  let blob = new Blob([json], { type: 'application/json' }), gz = false;
  if (window.CompressionStream) { try { blob = await gzip(json); gz = true; } catch (e) {} }
  await DB.put('backups', { id: String(ts), ts, name, size: blob.size, count: S.notes.length, gz, blob });
  pref('bk_last', String(ts));
  const all = (await DB.all('backups')).sort((a, b) => b.ts - a.ts);
  for (const old of all.slice(bk.keep)) await DB.del('backups', old.id);
  if (force && !silent) toast('Copia de seguridad creada');
}
// Carpeta del PC (Chrome/Edge de escritorio): requiere permiso del usuario, que se renueva con un toque.
let folderPending = null;
async function folderHandle() { try { const r = (await DB.all('meta')).find(x => x.id === 'bkdir'); return r && r.handle; } catch (e) { return null; } }
async function folderWrite(name, json, interactive) {
  const dir = await folderHandle(); if (!dir) return false;
  try {
    let perm = await dir.queryPermission({ mode: 'readwrite' });
    if (perm !== 'granted' && interactive) perm = await dir.requestPermission({ mode: 'readwrite' });
    if (perm !== 'granted') { folderPending = { name, json }; updateSyncStat(); return false; }   // se pide con el aviso de la pantalla principal
    const fh = await dir.getFileHandle(name, { create: true }), w = await fh.createWritable(); await w.write(json); await w.close();
    const names = []; for await (const [n, h] of dir.entries()) if (h.kind === 'file' && /^notas-copia-.*\.json$/.test(n)) names.push(n);
    names.sort().reverse(); if (bj.keep) for (const n of names.slice(bj.keep)) await dir.removeEntry(n);
    folderPending = null; updateSyncStat(); return true;
  } catch (e) { toast('No se pudo escribir en la carpeta de copias'); return false; }
}
async function chooseBackupFolder() {
  try {
    const handle = await showDirectoryPicker({ mode: 'readwrite', id: 'notas-backups' });
    await DB.put('meta', { id: 'bkdir', handle }); pref('bj_pc', '1'); toast('Carpeta elegida: ' + handle.name); await runJsonBackup(true);
  } catch (e) { if (e.name !== 'AbortError') toast('No se pudo elegir la carpeta'); }
}
async function backupText(b) { return b.gz ? gunzipText(b.blob) : b.blob.text(); }
async function backupsMenu() {
  const all = (await DB.all('backups')).sort((a, b) => b.ts - a.ts);
  if (!all.length) { toast('Aún no hay copias guardadas'); return; }
  menu(all.map(b => ({ t: `${fmtDate(b.ts)} · ${b.count} notas · ${Math.max(1, Math.round(b.size / 1024))} KB`, fn: () => menu([
    { t: 'Restaurar esta copia', fn: async () => {
      if (!(await confirmD('Las notas de esta copia sustituirán a las actuales que tengan el mismo identificador. Las notas nuevas que no estén en la copia se conservan. ¿Continuar?'))) return;
      await applyBackupData(JSON.parse(await backupText(b)), true); renderMain(); toast('Copia restaurada');
    } },
    { t: 'Descargar archivo', fn: async () => download(b.name, new Blob([await backupText(b)], { type: 'application/json' })) },
    { t: 'Eliminar esta copia', fn: async () => { await DB.del('backups', b.id); toast('Copia eliminada'); } },
  ]) })));
}

/* ============ Huella (WebAuthn) y bloqueo de la app ============ */
// La huella la verifica el sistema (Android/Windows Hello); la app nunca ve datos biométricos.
// - PRF disponible: la clave de cada nota se guarda envuelta con un secreto que solo libera la huella (seguro).
// - Sin PRF: la huella solo "abre la puerta" (cómodo, pero menos seguro); se avisa y hay que aceptarlo.
const PRF_SALT = new TextEncoder().encode('notas-enplus-prf-v1');
const metaAll = () => DB.all('meta').catch(() => []);
const bio = {
  get cred() { return pref('bio_cred'); },
  async available() { try { return !!(window.PublicKeyCredential && navigator.credentials && await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()); } catch (e) { return false; } },
  async register() {
    const c = await navigator.credentials.create({ publicKey: {
      rp: { name: 'Audio Manager' }, user: { id: crypto.getRandomValues(new Uint8Array(16)), name: 'notas', displayName: 'Audio Manager' },
      challenge: crypto.getRandomValues(new Uint8Array(32)), pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
      authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'discouraged' }, timeout: 60000, extensions: { prf: {} },
    } });
    pref('bio_cred', b64(c.rawId));
  },
  async assert(prf, cred) {
    const publicKey = { challenge: crypto.getRandomValues(new Uint8Array(32)), allowCredentials: [{ type: 'public-key', id: unb64(cred || this.cred) }], userVerification: 'required', timeout: 60000 };
    if (prf) publicKey.extensions = { prf: { eval: { first: PRF_SALT } } };
    const a = await navigator.credentials.get({ publicKey });
    const r = a.getClientExtensionResults(), first = r.prf && r.prf.results && r.prf.results.first;
    return { prf: first ? new Uint8Array(first) : null };
  },
};
async function prfWrapKey(prfBytes) {
  const base = await crypto.subtle.importKey('raw', prfBytes, 'HKDF', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(32), info: new TextEncoder().encode('notas-bio-wrap') }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
async function bioForget(noteId) { S.bioNotes.delete(noteId); try { await DB.del('meta', 'bio:' + noteId); } catch (e) {} }
async function bioActivate(n) {
  if (!n._key) return false;
  if (!(await bio.available())) { toast('Este dispositivo o navegador no ofrece huella al abrir páginas web'); return false; }
  try {
    if (!bio.cred) await bio.register();
    const a = await bio.assert(true);
    const raw = await crypto.subtle.exportKey('raw', n._key), rec = { id: 'bio:' + n.id, salt: n.enc.s };
    if (a.prf) {
      const iv = crypto.getRandomValues(new Uint8Array(12));
      rec.mode = 'prf'; rec.iv = b64(iv); rec.d = b64(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await prfWrapKey(a.prf), raw));
    } else {
      const ok = await dialog('Huella sin cifrado reforzado', el('p', { textContent: 'Tu dispositivo permite usar la huella, pero no ofrece la función para proteger la clave con ella. Puedo guardar la clave de esta nota en el dispositivo y liberarla solo cuando la huella coincida. Es cómodo, pero menos seguro que la contraseña: alguien con acceso a los datos del navegador podría saltarse la huella.\n\n¿Activarlo de todos modos?' }), [{ t: 'No', v: false }, { t: 'Activar', v: true }]);
      if (!ok) return false;
      rec.mode = 'gate'; rec.raw = b64(raw);
    }
    await DB.put('meta', rec); S.bioNotes.add(n.id); return true;
  } catch (e) { if (e.name !== 'NotAllowedError') toast('No se pudo activar la huella: ' + (e.message || e.name)); return false; }
}
async function bioUnlock(n) {
  if (!bio.cred || !S.bioNotes.has(n.id)) return false;
  const meta = (await metaAll()).find(m => m.id === 'bio:' + n.id); if (!meta) return false;
  try {
    const a = await bio.assert(meta.mode === 'prf'); let raw;
    if (meta.mode === 'prf') { if (!a.prf) throw new Error('prf'); raw = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(meta.iv) }, await prfWrapKey(a.prf), unb64(meta.d)); }
    else raw = unb64(meta.raw);
    await decryptWith(n, await crypto.subtle.importKey('raw', raw, 'AES-GCM', true, ['encrypt', 'decrypt']));
    return true;
  } catch (e) {
    if (e.name === 'NotAllowedError') return false;               // cancelada: se pide la contraseña
    await bioForget(n.id); toast('La huella ya no sirve para esta nota; usa la contraseña'); return false;
  }
}
async function toggleNoteBio(n) {
  if (S.bioNotes.has(n.id)) { await bioForget(n.id); toast('Huella quitada de esta nota'); return; }
  if (await bioActivate(n)) toast('Esta nota se abrirá con huella');
}
async function offerBio(n) {
  if (pref('bio_offer') === '0' || S.bioNotes.has(n.id) || !n._key || !(await bio.available())) return;
  const r = await dialog('¿Abrir con huella?', el('p', { textContent: 'La próxima vez puedes abrir esta nota con tu huella en lugar de la contraseña.' }), [{ t: 'No preguntar más', v: 'never' }, { t: 'Ahora no', v: null }, { t: 'Activar', v: 'ok' }]);
  if (r === 'never') pref('bio_offer', '0'); else if (r === 'ok' && await bioActivate(n)) toast('Esta nota se abrirá con huella');
}

/* --- bloqueo de toda la app (PIN y/o huella) --- */
const lock = {
  get on() { return !!pref('lock_pin'); }, get bio() { return pref('lock_bio') === '1' && !!bio.cred; },
  get delay() { const v = pref('lock_delay'); return v === null ? 1 : +v; }, shown: false, hiddenAt: 0,
};
async function hashPin(pin, salt) {
  const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']);
  return b64(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' }, km, 256));
}
async function checkPin(pin) { const o = JSON.parse(pref('lock_pin')); return (await hashPin(pin, unb64(o.s))) === o.h; }
async function setPin() {
  if (!crypto.subtle) { toast('El bloqueo requiere HTTPS'); return false; }
  if (!lock.on) await info('Antes de empezar', 'Si olvidas el PIN, la única salida es borrar los datos del sitio, y eso borra las notas guardadas en este dispositivo. Mantén activadas la sincronización con Drive o las copias de seguridad.');
  const p1 = await ask('Nuevo PIN (de 4 a 8 dígitos)', '', 'password'); if (p1 === null) return false;
  if (!/^\d{4,8}$/.test(p1)) { toast('El PIN debe tener de 4 a 8 dígitos'); return false; }
  const p2 = await ask('Repite el PIN', '', 'password'); if (p1 !== p2) { toast('Los PIN no coinciden'); return false; }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  pref('lock_pin', JSON.stringify({ s: b64(salt), h: await hashPin(p1, salt) })); toast('PIN guardado'); return true;
}
async function verifyCurrentPin() {
  const p = await ask('PIN actual', '', 'password'); if (p === null) return false;
  if (await checkPin(p)) return true; toast('PIN incorrecto'); return false;
}
function showLock() {
  sessionPw = null;
  if (!lock.on || lock.shown) return; lock.shown = true;
  $('lockScreen').hidden = false; $('lockPin').value = ''; $('lockMsg').textContent = ''; $('lockBio').hidden = !lock.bio;
  setTimeout(() => { $('lockPin').focus(); if (lock.bio) lockWithBio(true); }, 150);
}
function unlockApp() { lock.shown = false; $('lockScreen').hidden = true; pref('lock_fails', '0'); pref('lock_until', '0'); }
async function lockWithBio(auto) {
  try { await bio.assert(false); unlockApp(); } catch (e) { if (!auto) $('lockMsg').textContent = 'No se pudo verificar la huella'; }
}
async function lockSubmit() {
  const wait = (+pref('lock_until') || 0) - Date.now();
  if (wait > 0) { $('lockMsg').textContent = `Demasiados intentos. Espera ${Math.ceil(wait / 1000)} s`; return; }
  if (await checkPin($('lockPin').value)) { unlockApp(); return; }
  const fails = (+pref('lock_fails') || 0) + 1; pref('lock_fails', String(fails)); $('lockPin').value = '';
  if (fails >= 5) { pref('lock_until', String(Date.now() + 30000 * Math.pow(2, Math.min(6, fails - 5)))); $('lockMsg').textContent = 'Demasiados intentos. Espera un momento.'; }
  else $('lockMsg').textContent = `PIN incorrecto (${fails}/5)`;
}
async function toggleLockBio() {
  if (lock.bio) { pref('lock_bio', '0'); return; }
  if (!(await bio.available())) { toast('Este dispositivo o navegador no ofrece huella al abrir páginas web'); return; }
  try { if (!bio.cred) await bio.register(); await bio.assert(false); pref('lock_bio', '1'); toast('Huella activada para desbloquear la app'); }
  catch (e) { if (e.name !== 'NotAllowedError') toast('No se pudo activar la huella'); }
}
const DELAYS = [[0, 'Inmediatamente'], [1, 'Tras 1 minuto'], [5, 'Tras 5 minutos'], [15, 'Tras 15 minutos']];
function lockMenu() {
  menu([
    { t: lock.on ? 'Cambiar PIN' : 'Activar con un PIN', fn: async () => { if (lock.on && !(await verifyCurrentPin())) return; if (await setPin()) renderSettings(); } },
    lock.on ? { t: lock.bio ? 'Dejar de usar la huella' : 'Usar también la huella', fn: async () => { await toggleLockBio(); renderSettings(); } } : null,
    lock.on ? { t: 'Bloquear: ' + (DELAYS.find(d => d[0] === lock.delay) || DELAYS[1])[1], fn: () => menu(DELAYS.map(([m, l]) => ({ t: l, fn: () => { pref('lock_delay', String(m)); renderSettings(); } }))) } : null,
    lock.on ? { t: 'Desactivar el bloqueo', fn: async () => { if (!(await verifyCurrentPin())) return; for (const k of ['lock_pin', 'lock_bio', 'lock_fails', 'lock_until']) pref(k, ''); renderSettings(); toast('Bloqueo desactivado'); } } : null,
  ]);
}
async function removeBio() {
  if (!(await confirmD('¿Quitar la huella registrada en este dispositivo? Las notas cifradas volverán a pedir la contraseña.'))) return;
  for (const id of [...S.bioNotes]) await bioForget(id);
  for (const k of ['bio_cred', 'bio_prf', 'lock_bio']) pref(k, ''); renderSettings(); toast('Huella quitada');
}

/* ============ Recuperación de contraseñas (con la cuenta de Google; o clave partida, método antiguo) ============ */
// Se genera un par de claves RSA. La clave pública queda en la app y envuelve la clave de cada nota cifrada.
// La clave privada se guarda cifrada con un secreto R que NO se guarda en ningún sitio: se parte en dos
// mitades (A y B, con R = A xor B). Una mitad va al correo del usuario y la otra a su WhatsApp/SMS.
// Con las dos mitades se reconstruye R, se abre la clave privada y se recupera cualquier nota.
// Método actual (rec.mode === 'drive'): R no se parte; vive en un archivo aparte de la carpeta privada de Drive
// (nunca en las copias ni en la carpeta espejo) y solo se lee tras volver a elegir la cuenta de Google.
const recOn = () => !!(S.recovery && !S.recovery.removed);
const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
function b32enc(u8) { let bits = 0, val = 0, out = ''; for (const b of u8) { val = (val << 8) | b; bits += 8; while (bits >= 5) { out += B32[(val >>> (bits - 5)) & 31]; bits -= 5; } val &= (1 << bits) - 1; } if (bits > 0) out += B32[(val << (5 - bits)) & 31]; return out; }
function b32dec(str) { let bits = 0, val = 0; const out = []; for (const ch of str) { const i = B32.indexOf(ch); if (i < 0) throw new Error('carácter inválido'); val = (val << 5) | i; bits += 5; if (bits >= 8) { out.push((val >>> (bits - 8)) & 255); bits -= 8; } val &= (1 << bits) - 1; } return new Uint8Array(out); }
const sha256 = async u8 => new Uint8Array(await crypto.subtle.digest('SHA-256', u8));
const xorBytes = (a, b) => Uint8Array.from(a, (v, i) => v ^ b[i]);
const openUrl = u => { const a = el('a', { href: u, target: '_blank', rel: 'noopener' }); document.body.append(a); a.click(); a.remove(); };
const pickRecovery = (a, b) => !a ? (b || null) : !b ? a : (b.created > a.created ? b : a);
async function setRecovery(r) { S.recovery = r; if (r) await DB.put('meta', Object.assign({}, r, { id: 'recovery' })); }

async function shareCode(rid, bytes) {
  const chk = (await sha256(bytes)).slice(0, 2), all = new Uint8Array(34); all.set(bytes); all.set(chk, 32);
  return rid + '-' + b32enc(all).match(/.{1,5}/g).join('-');
}
async function parseShare(text) {
  const s = String(text || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); if (s.length < 20) throw new Error('código incompleto');
  const rid = s.slice(0, 8), data = b32dec(s.slice(8)); if (data.length < 34) throw new Error('código incompleto');
  const share = data.slice(0, 32), chk = (await sha256(share)).slice(0, 2);
  if (chk[0] !== data[32] || chk[1] !== data[33]) throw new Error('código con errores (revisa que esté completo)');
  return { rid, share };
}
async function openPrivateKey(rec, t1, t2) {
  const a = await parseShare(t1), b = await parseShare(t2);
  if (a.rid !== rec.rid || b.rid !== rec.rid) throw new Error('las partes no corresponden a esta recuperación');
  return openPrivateKeyR(rec, xorBytes(a.share, b.share));
}
async function openPrivateKeyR(rec, R) {
  const pkcs8 = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(rec.priv.iv) }, await crypto.subtle.importKey('raw', R, 'AES-GCM', false, ['decrypt']), unb64(rec.priv.d));
  return crypto.subtle.importKey('pkcs8', pkcs8, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['decrypt']);
}
async function genRecovery() {
  const kp = await crypto.subtle.generateKey({ name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['encrypt', 'decrypt']);
  const pub = await crypto.subtle.exportKey('jwk', kp.publicKey), pkcs8 = await crypto.subtle.exportKey('pkcs8', kp.privateKey);
  const R = crypto.getRandomValues(new Uint8Array(32)), iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await crypto.subtle.importKey('raw', R, 'AES-GCM', false, ['encrypt']), pkcs8);
  const A = crypto.getRandomValues(new Uint8Array(32)), B = xorBytes(R, A);
  const rid = Array.from(crypto.getRandomValues(new Uint8Array(4)), x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
  return { rec: { rid, created: Date.now(), pub, priv: { iv: b64(iv), d: b64(ct) } }, A, B, R };
}
// Clave de la nota envuelta con la clave pública de recuperación (se guarda dentro de n.enc.rk)
async function recoveryWrap(n) {
  const r = S.recovery, cur = n.enc && n.enc.rk;
  if (!recOn()) return undefined;
  if (cur && cur.rid === r.rid) return cur;
  const pub = await crypto.subtle.importKey('jwk', r.pub, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']);
  return { rid: r.rid, d: b64(await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, pub, await crypto.subtle.exportKey('raw', n._key))) };
}

// --- clave de recuperación guardada en Drive (archivo aparte del de las notas) ---
const REC_FILE = 'notas-recovery-key.json';
async function recDriveFind() {
  const l = await (await gfetch(`https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${encodeURIComponent(`name='${REC_FILE}'`)}&fields=files(id)`)).json();
  return l.files && l.files[0] && l.files[0].id;
}
async function recDriveSave(rid, R) {
  const body = JSON.stringify({ rid, k: b64(R) }), fid = await recDriveFind();
  if (fid) { await gfetch(`https://www.googleapis.com/upload/drive/v3/files/${fid}?uploadType=media`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body }); return; }
  const bd = 'nr' + Date.now();
  const mp = `--${bd}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify({ name: REC_FILE, parents: ['appDataFolder'] })}\r\n--${bd}\r\nContent-Type: application/json\r\n\r\n${body}\r\n--${bd}--`;
  await gfetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', { method: 'POST', headers: { 'Content-Type': 'multipart/related; boundary=' + bd }, body: mp });
}
async function recDriveLoad(rid) {
  const fid = await recDriveFind(); if (!fid) throw new Error('esta cuenta de Google no tiene la clave de recuperación');
  const d = await (await gfetch(`https://www.googleapis.com/drive/v3/files/${fid}?alt=media`)).json();
  if (d.rid !== rid) throw new Error('la clave guardada en Drive es de otra configuración de recuperación');
  return unb64(d.k);
}
// Segundo factor local: huella / PIN / patrón del dispositivo (WebAuthn con verificación de usuario obligatoria).
// Usa una credencial propia de la recuperación ('rec_cred'); si no existe se crea (el propio alta pide la verificación).
async function recVerify() {
  if (!(await bio.available())) return await confirmD('Este dispositivo no tiene huella, PIN ni patrón de bloqueo, así que no puedo pedirlo. Sin eso, la recuperación solo queda protegida por tu cuenta de Google abierta en este navegador. ¿Continuar igualmente?');
  try {
    const cred = pref('rec_cred');
    if (cred) { try { await bio.assert(false, cred); return true; } catch (e) { if (e && e.name === 'NotAllowedError' && !/not.*found|no.*credential/i.test(e.message || '')) throw e; } }
    const c = await navigator.credentials.create({ publicKey: {
      rp: { name: 'Audio Manager' }, user: { id: crypto.getRandomValues(new Uint8Array(16)), name: 'recuperacion', displayName: 'Audio Manager' },
      challenge: crypto.getRandomValues(new Uint8Array(32)), pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
      authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'discouraged' }, timeout: 60000,
    } });
    pref('rec_cred', b64(c.rawId)); return true;
  } catch (e) { toast('No se verificó tu huella o PIN: ' + (e.name === 'NotAllowedError' ? 'cancelado' : e.message)); return false; }
}
// Devuelve la clave privada de recuperación (null si cancelas). Con Drive pide elegir de nuevo la cuenta de Google.
async function recoveryKey(rec) {
  if (rec.mode === 'drive') {
    if (!(await confirmD('Para recuperar la contraseña tienes que volver a iniciar sesión en tu cuenta de Google. Antes se te pedirá tu huella o el PIN del dispositivo. Elige la misma cuenta con la que activaste la recuperación. ¿Continuar?'))) return null;
    if (!(await recVerify())) return null;
    await getToken(false, true);
    return openPrivateKeyR(rec, await recDriveLoad(rec.rid));
  }
  const got = await pasteBoth('Recuperar con las dos partes', 'Método antiguo: pega la parte 1 (de tu correo) y la parte 2 (de WhatsApp o SMS). Da igual el orden.');
  return got ? openPrivateKey(rec, got[0], got[1]) : null;
}

// --- recuperar una nota y fijar una contraseña nueva ---
async function recoverNote(n) {
  if (!recOn() || !n.enc.rk || n.enc.rk.rid !== S.recovery.rid) {
    await info('Sin recuperación para esta nota', 'Esta nota se cifró antes de configurar la recuperación (o con otra configuración). Solo puede abrirse con su contraseña.'); return false;
  }
  try {
    const priv = await recoveryKey(S.recovery); if (!priv) return false;
    const raw = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, priv, unb64(n.enc.rk.d));
    await decryptWith(n, await crypto.subtle.importKey('raw', raw, 'AES-GCM', true, ['encrypt', 'decrypt']));
  } catch (e) { toast('No se pudo: ' + (e.message && !/operation/i.test(e.message) ? e.message : 'la clave de recuperación no es correcta')); return false; }
  const p1 = await ask('Recuperada. Elige una contraseña nueva para esta nota', '', 'password');
  if (p1) {
    const p2 = await ask('Repite la contraseña nueva', '', 'password');
    if (p1 === p2) {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      await bioForget(n.id); n.enc = { s: b64(salt), iv: '', d: '' }; n._key = await deriveKey(p1, salt); n.updated = Date.now(); await persist(n);
      toast('Contraseña restablecida');
    } else toast('No coinciden: la contraseña anterior sigue vigente');
  }
  return true;
}

// --- configuración ---
async function pasteBoth(title, intro) {
  const i1 = el('input', { placeholder: 'Parte 1 (correo)' }), i2 = el('input', { placeholder: 'Parte 2 (WhatsApp o SMS)' });
  const r = await dialog(title, el('div', {}, el('p', { textContent: intro }), i1, i2), [{ t: 'Cancelar', v: null }, { t: 'Comprobar', v: true }]);
  return r ? [i1.value, i2.value] : null;
}
async function setupRecovery() {
  if (!crypto.subtle) { toast('La recuperación requiere HTTPS'); return; }
  if (!pref('gclient')) { toast('Primero conecta Google Drive con el botón de sincronizar'); return; }
  if (recOn() && !(await confirmD('Ya hay una recuperación configurada. Si creas otra, las notas cifradas se protegerán con la nueva cuando las abras, y la anterior dejará de servir. ¿Continuar?'))) return;
  if (!(await confirmD('La clave de recuperación se guardará en la carpeta privada de tu Google Drive. Quien entre en tu cuenta de Google podrá recuperar y abrir tus notas cifradas, así que protege esa cuenta con verificación en dos pasos. Si algún día olvidas la contraseña, deberás confirmar con tu huella o el PIN del dispositivo y elegir tu cuenta de Google. ¿Activar?'))) return;
  try {
    if (!(await recVerify())) return;
    await getToken(false, true);
    toast('Generando claves…'); await sleep(50);
    const { rec, R } = await genRecovery(); rec.mode = 'drive';
    await recDriveSave(rec.rid, R);
    await openPrivateKeyR(rec, await recDriveLoad(rec.rid));   // comprobación: lo guardado en Drive abre la clave
    await setRecovery(rec); toast('Recuperación activada. Las notas cifradas se protegen al abrirlas');
  } catch (e) { toast('No se activó la recuperación: ' + e.message); }
}
async function testRecovery() {
  if (!recOn()) { toast('La recuperación no está configurada'); return; }
  try { const k = await recoveryKey(S.recovery); if (k) await info('Todo bien', 'La clave de recuperación es correcta.'); }
  catch (e) { toast('No sirve: ' + (e.message && !/operation/i.test(e.message) ? e.message : 'la clave no es correcta')); }
}
function recoveryMenu() {
  menu([
    { t: recOn() ? 'Volver a configurar' : 'Configurar la recuperación', fn: async () => { await setupRecovery(); renderSettings(); } },
    recOn() ? { t: 'Probar la recuperación', fn: testRecovery } : null,
    recOn() ? { t: 'Eliminar la recuperación', fn: async () => { if (await confirmD('Las notas cifradas ya no podrán recuperarse si olvidas su contraseña. ¿Eliminar?')) { if (S.recovery.mode === 'drive') { try { await getToken(false); const f = await recDriveFind(); if (f) await gfetch('https://www.googleapis.com/drive/v3/files/' + f, { method: 'DELETE' }); } catch (e) {} } await setRecovery({ rid: S.recovery.rid, created: Date.now(), removed: true }); renderSettings(); toast('Recuperación eliminada'); } } } : null,
  ]);
}

/* ============ Carpeta espejo en el PC (a prueba de "borrar datos del sitio") ============ */
// Cada nota se guarda además como un archivo .json en una carpeta real del disco (Chrome/Edge de escritorio).
// Si el navegador borra sus datos, las notas siguen en esa carpeta y se restauran al elegirla de nuevo.
// Los archivos guardan exactamente lo mismo que la base interna: las notas cifradas siguen cifradas.
const mir = { dir: null, q: new Map(), timer: 0, needPerm: false };
const mirName = id => 'n_' + String(id).replace(/[^\w.-]+/g, '_') + '.json';
async function mirInit() {
  if (!dirSupported()) return;
  const r = (await metaAll()).find(m => m.id === 'mirdir'); mir.dir = (r && r.handle) || null;
}
async function mirPerm(interactive) {
  if (!mir.dir) return false;
  try {
    let p = await mir.dir.queryPermission({ mode: 'readwrite' });
    if (p !== 'granted' && interactive) p = await mir.dir.requestPermission({ mode: 'readwrite' });
    return p === 'granted';
  } catch (e) { return false; }
}
const mirSub = () => mir.dir.getDirectoryHandle('notas', { create: true });
function mirQueue(op) { if (!mir.dir) return; mir.q.set(op.name, op); clearTimeout(mir.timer); mir.timer = setTimeout(() => mirFlush(false), 800); }
function mirHook(op, store, v) {
  if (!mir.dir) return;
  if (store === 'notes') mirQueue(op === 'put' ? { k: 'put', name: mirName(v.id), data: JSON.stringify(v) } : { k: 'del', name: mirName(v) });
  else if (store === 'folders') mirQueue({ k: 'put', name: '_folders.json', data: JSON.stringify(S.folders) });
  else if (store === 'meta' && op === 'put' && v.id === 'recovery') mirQueue({ k: 'put', name: '_recovery.json', data: JSON.stringify(v) });
}
for (const m of ['put', 'del']) { const orig = DB[m].bind(DB); DB[m] = async (...a) => { const r = await orig(...a); try { mirHook(m, ...a); } catch (e) {} return r; }; }
async function mirFlush(interactive) {
  if (!mir.dir || !mir.q.size) return;
  if (!(await mirPerm(interactive))) { mir.needPerm = true; updateSyncStat(); return; }
  mir.needPerm = false;
  const sub = await mirSub(), ops = [...mir.q.values()]; mir.q.clear();
  for (const op of ops) {
    try {
      if (op.k === 'put') { const fh = await sub.getFileHandle(op.name, { create: true }), w = await fh.createWritable(); await w.write(op.data); await w.close(); }
      else await sub.removeEntry(op.name).catch(() => {});
    } catch (e) { mir.q.set(op.name, op); }
  }
  if (mir.q.size) { mir.needPerm = true; updateSyncStat(); }
}
async function mirRead() {
  const sub = await mirSub(), notes = [], out = { notes, folders: [], recovery: null };
  for await (const [name, h] of sub.entries()) {
    if (h.kind !== 'file' || !name.endsWith('.json')) continue;
    try {
      const o = JSON.parse(await (await h.getFile()).text());
      if (name.startsWith('n_')) { if (o && o.id) notes.push(o); } else if (name === '_folders.json') out.folders = o; else if (name === '_recovery.json') out.recovery = o;
    } catch (e) {}
  }
  return out;
}
async function mirDumpAll() {
  for (const n of await DB.all('notes')) mirQueue({ k: 'put', name: mirName(n.id), data: JSON.stringify(n) });
  mirQueue({ k: 'put', name: '_folders.json', data: JSON.stringify(S.folders) });
  if (S.recovery) mirQueue({ k: 'put', name: '_recovery.json', data: JSON.stringify(Object.assign({}, S.recovery, { id: 'recovery' })) });
  await mirFlush(true);
}
async function mirRestore(ask) {
  if (!(await mirPerm(true))) { toast('Sin permiso para leer la carpeta'); return; }
  const d = await mirRead();
  if (!d.notes.length) { if (ask) toast('La carpeta no contiene notas todavía'); return; }
  if (ask && !(await confirmD(`La carpeta tiene ${d.notes.length} notas. ¿Restaurarlas aquí? (Se fusionan: gana la versión más reciente de cada nota.)`))) return;
  const r = await applyBackupData(d, false); renderMain(); markCount();
  toast(`Restauradas: ${r.add} nuevas, ${r.upd} actualizadas`);
}
// Al abrir: si la carpeta tiene bastantes más notas que la base interna, ofrece restaurar.
async function mirCheck() {
  if (!mir.dir || !(await mirPerm(false))) return;
  try {
    const sub = await mirSub(); let files = 0; for await (const [n, h] of sub.entries()) if (h.kind === 'file' && n.startsWith('n_')) files++;
    if (files - S.notes.length >= 10) {
      const r = await dialog('Hay notas en la carpeta del PC', el('p', { textContent: `La carpeta espejo tiene ${files} notas y esta app solo ${S.notes.length}. ¿Quieres restaurar las que faltan?` }), [{ t: 'Ahora no', v: 0 }, { t: 'Restaurar', v: 1 }]);
      if (r === 1) await mirRestore(false);
    }
  } catch (e) {}
}
async function chooseMirrorFolder() {
  try {
    const handle = await showDirectoryPicker({ mode: 'readwrite', id: 'notas-mirror' });
    mir.dir = handle; await DB.put('meta', { id: 'mirdir', handle });
    const existing = await mirRead();
    if (existing.notes.length && await confirmD(`Esta carpeta ya contiene ${existing.notes.length} notas. ¿Restaurarlas en la app antes de empezar a guardar aquí?`)) {
      const r = await applyBackupData(existing, false); renderMain(); toast(`Restauradas: ${r.add} nuevas, ${r.upd} actualizadas`);
    }
    await mirDumpAll(); toast('Carpeta espejo activa: ' + handle.name);
  } catch (e) { if (e.name !== 'AbortError') toast('No se pudo elegir la carpeta'); }
}
function mirrorMenu() {
  if (!dirSupported()) { info('Carpeta espejo', 'Este navegador no permite elegir carpetas. Usa una versión reciente de Chrome o Edge. Mientras tanto, tus notas se protegen con la sincronización con Google Drive y las copias exportadas.'); return; }
  menu([
    { t: mir.dir ? 'Cambiar de carpeta' : 'Elegir la carpeta', fn: async () => { await chooseMirrorFolder(); renderSettings(); } },
    mir.dir ? { t: 'Restaurar desde la carpeta', fn: () => mirRestore(true) } : null,
    mir.dir ? { t: 'Volver a escribir todas las notas ahora', fn: async () => { await mirDumpAll(); toast('Carpeta actualizada'); } } : null,
    mir.dir ? { t: 'Dejar de usar la carpeta', fn: async () => { mir.dir = null; mir.q.clear(); await DB.del('meta', 'mirdir'); renderSettings(); toast('Carpeta espejo desactivada (los archivos se conservan)'); } } : null,
  ]);
}

/* --- sincronización con Drive tras cada cambio (con retardo) --- */
function scheduleSync() {
  S.dirty = true;
  if (pref('autosync') === '0' || !pref('gclient') || !pref('gconsent')) return;
  clearTimeout(S.syncT);
  S.syncT = setTimeout(() => { if (typeof gToken !== 'undefined' && gToken && Date.now() < gExp - 60000) syncDrive({ auto: true }); }, 45000);
}

/* ============ Horarios de copias, copia JSON diaria y estado de la sincronización ============ */
// Una web no puede ejecutarse con la app cerrada: la hora elegida es "a partir de cuándo toca". Si la app estaba cerrada
// o no había internet a esa hora, la copia se hace en cuanto se abre la app o vuelve la conexión.
const bj = {
  get on() { return pref('bj_on') !== '0'; }, get days() { return +pref('bj_days') || 1; },
  get keep() { const v = pref('bj_keep'); return v === null || v === '' ? 7 : +v; },          // 0 = conservar todas, nunca borrar
  get phone() { const v = pref('bj_phone'); return v === null || v === '' ? !dirSupported() : v === '1'; },   // descarga a la carpeta Descargas
  get time() { return pref('bj_time') || '03:00'; }, get drive() { return pref('bj_drive') !== '0'; }, get pc() { return pref('bj_pc') !== '0'; },
};
// Próximo momento en que toca una copia: la primera vez que sea HH:MM después de la última, más (días-1) días.
function nextDue(last, days, time) {
  if (!last) return 0;
  const [h, m] = (/^\d{1,2}:\d{2}$/.test(time || '') ? time : '02:00').split(':').map(Number);
  const d = new Date(last); d.setHours(h, m, 0, 0);
  if (d.getTime() <= last) d.setDate(d.getDate() + 1);
  d.setDate(d.getDate() + Math.max(0, days - 1)); return d.getTime();
}
const askTime = async (title, cur) => { const v = await ask(title, cur, 'time'); return v && /^\d{1,2}:\d{2}$/.test(v) ? v : null; };

async function driveUploadJson(name, json) {
  const bd = 'nb' + Date.now();
  const mp = `--${bd}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify({ name, parents: ['appDataFolder'], mimeType: 'application/json' })}\r\n--${bd}\r\nContent-Type: application/json\r\n\r\n${json}\r\n--${bd}--`;
  await gfetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', { method: 'POST', headers: { 'Content-Type': 'multipart/related; boundary=' + bd }, body: mp });
}
async function driveListJson() {
  const q = encodeURIComponent("name contains 'notas-copia-'");
  const r = await (await gfetch(`https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${q}&fields=files(id,name,createdTime,size)&orderBy=createdTime%20desc&pageSize=100`)).json();
  return r.files || [];
}
async function drivePruneJson(keep) { if (!keep) return; for (const f of (await driveListJson()).slice(keep)) await gfetch(`https://www.googleapis.com/drive/v3/files/${f.id}`, { method: 'DELETE' }); }

let bjRunning = false, bjTapArmed = false;
function armBjTap() {
  if (bjTapArmed) return; bjTapArmed = true;
  document.addEventListener('pointerup', () => { bjTapArmed = false; runJsonBackup(false, true); }, { once: true });
}
async function runJsonBackup(force, auto) {
  if (bjRunning) return;
  if (!force && (!bj.on || !S.notes.length || Date.now() < nextDue(+pref('bj_last') || 0, bj.days, bj.time))) return;
  const dest = { drive: bj.drive && !!pref('gclient') && !!pref('gconsent'), pc: bj.pc && !!(await folderHandle()), phone: bj.phone };
  if (!dest.drive && !dest.pc && !dest.phone) { if (force) toast('Elige dónde guardar la copia: Google Drive, el teléfono (Descargas) o una carpeta del PC'); return; }
  bjRunning = true;
  try {
    const json = backupJSON(), ts = +pref('bj_try') || Date.now(); pref('bj_try', String(ts));   // mismo nombre en los reintentos
    const name = `notas-copia-${stamp(new Date(ts))}.json`;
    let done = {}; try { done = JSON.parse(pref('bj_done') || '{}'); } catch (e) {}
    const save = () => pref('bj_done', JSON.stringify(done));
    let err = null;
    if (dest.pc && !done.pc) { if (await folderWrite(name, json, false)) { done.pc = true; save(); } }
    if (dest.phone && !done.phone) {
      // Chrome solo permite descargar archivos tras un toque del usuario: si no lo hay, se hace con el próximo toque
      if (force || (navigator.userActivation && navigator.userActivation.isActive)) { download(name, new Blob([json], { type: 'application/json' })); done.phone = true; save(); }
      else armBjTap();
    }
    if (dest.drive && !done.drive) {
      try {
        if (!navigator.onLine) throw new Error('offline');
        await getToken(auto); await driveUploadJson(name, json); done.drive = true; save();
        try { await drivePruneJson(bj.keep); } catch (e) {}
      } catch (e) { err = e; }
    }
    if ((!dest.pc || done.pc) && (!dest.phone || done.phone) && (!dest.drive || done.drive)) {
      pref('bj_last', String(Date.now())); pref('bj_try', ''); pref('bj_done', ''); pref('bj_pending', '0'); if (force) toast('Copia JSON guardada');
    } else {
      pref('bj_pending', '1');
      if (err) {
        if (/popup|interaction|login_required|consent/i.test(err.message)) armBjTap();
        else if (force) toast(err.message === 'offline' ? 'Sin internet: la copia en Drive se hará en cuanto vuelva la conexión' : 'Copia JSON: ' + err.message);
      }
    }
  } catch (e) { pref('bj_pending', '1'); if (force) toast('Copia JSON: ' + e.message); }
  finally { bjRunning = false; updateSyncStat(); }
}
function markBjDone(k) { try { const d = JSON.parse(pref('bj_done') || '{}'); d[k] = true; pref('bj_done', JSON.stringify(d)); } catch (e) {} }
// Pide el permiso de las carpetas SOLO cuando el usuario toca el aviso (una vez por copia pendiente).
async function grantFolders() {
  if (folderPending) { const p = folderPending; if (await folderWrite(p.name, p.json, true)) markBjDone('pc'); }
  if (mir.dir && (mir.needPerm || mir.q.size)) { await mirFlush(true); mirCheck(); }
  updateSyncStat(); runJsonBackup(false, true);
}
function checkSchedules() { runBackup(false).catch(() => {}); runJsonBackup(false, true).catch(() => {}); }

async function driveBackupsMenu() {
  try {
    await getToken(false); const l = await driveListJson();
    if (!l.length) { toast('Aún no hay copias JSON en Google Drive'); return; }
    menu(l.map(f => ({ t: `${fmtDate(Date.parse(f.createdTime))} · ${Math.max(1, Math.round((+f.size || 0) / 1024))} KB`, fn: () => menu([
      { t: 'Restaurar esta copia', fn: async () => {
        if (!(await confirmD('Las notas de esta copia sustituirán a las actuales con el mismo identificador. Las notas nuevas que no estén en la copia se conservan. ¿Continuar?'))) return;
        try { const d = await (await gfetch(`https://www.googleapis.com/drive/v3/files/${f.id}?alt=media`)).json(); await applyBackupData(d, true); renderMain(); toast('Copia restaurada'); } catch (e) { toast('No se pudo restaurar: ' + e.message); }
      } },
      { t: 'Descargar archivo', fn: async () => { try { download(f.name, await (await gfetch(`https://www.googleapis.com/drive/v3/files/${f.id}?alt=media`)).blob()); } catch (e) { toast(e.message); } } },
      { t: 'Eliminar esta copia', fn: async () => { try { await gfetch(`https://www.googleapis.com/drive/v3/files/${f.id}`, { method: 'DELETE' }); toast('Copia eliminada'); } catch (e) { toast(e.message); } } },
    ]) })));
  } catch (e) { toast(e.message === 'popup' ? 'Toca de nuevo para iniciar sesión con Google' : 'No se pudo leer Drive: ' + e.message); }
}

// --- barra de estado de la sincronización (pantalla principal) ---
function updateSyncStat() {
  const e = $('syncBar'); if (!e) return;
  const last = +pref('lastSync') || 0, err = pref('lastSyncErr');
  let t, cls = '';
  if (folderPending || (mir.dir && mir.needPerm)) { t = '🔒 Toca aquí para permitir que la app guarde en tu carpeta (Chrome lo pide en cada sesión)'; cls = 'warn'; }
  else if (!pref('gclient')) t = '☁ Sincronización no configurada (toca para configurarla)';
  else if (syncing) t = '☁ Sincronizando…';
  else if (err) { t = '⚠ La última sincronización falló' + (last ? ' · última correcta: ' + fmtDate(last) : ''); cls = 'warn'; }
  else if (!navigator.onLine && S.dirty) { t = '⏳ Sin conexión: se sincronizará al volver' + (last ? ' · última: ' + fmtDate(last) : ''); cls = 'warn'; }
  else t = last ? '☁ Última sincronización: ' + fmtDate(last) : '☁ Sin sincronizar todavía';
  if (pref('bj_pending') === '1' && bj.on) t += ' · copia JSON pendiente';
  e.textContent = t; e.className = cls;
}

/* ============ Etiquetas y filtros ============ */
// Las etiquetas son textos guardados en cada nota (n.labels). No hay registro aparte: la lista sale de las notas,
// así viajan solas con la sincronización, las copias y la carpeta espejo. El color de cada etiqueta se calcula del nombre.
const noteLabels = n => n.labels || [];
const labelKey = s => String(s).trim().toLowerCase();
function labelColor(name) { let h = 0; for (const c of labelKey(name)) h = (h * 31 + c.charCodeAt(0)) % 360; return `hsl(${h} 55% 42%)`; }
function allLabels() {
  const m = new Map();
  for (const n of S.notes) { if (n.deleted) continue; for (const l of noteLabels(n)) { const k = labelKey(l); if (!m.has(k)) m.set(k, { name: l, count: 0 }); m.get(k).count++; } }
  return [...m.values()].sort((a, b) => a.name.localeCompare(b.name));
}
const canonLabel = name => { const k = labelKey(name), f = allLabels().find(l => labelKey(l.name) === k); return f ? f.name : String(name).trim().slice(0, 30); };
function setLabel(n, name, on) {
  const k = labelKey(name), rest = noteLabels(n).filter(l => labelKey(l) !== k);
  if (on) rest.push(canonLabel(name)); n.labels = rest;
}
const labelChip = (name, extra) => Object.assign(el('span', { className: 'lchip', textContent: name }), { style: `background:${labelColor(name)}` }, extra || {});

// --- asignar etiquetas a una o varias notas ---
async function labelsDialog(notes) {
  const rows = new Map(), box = el('div', { className: 'lbl-list' });
  const addRow = (name, state, touched) => {
    const k = labelKey(name); if (rows.has(k)) { rows.get(k).cb.checked = true; rows.get(k).touched = true; return; }
    const cb = el('input', { type: 'checkbox', checked: state === 'all' || touched, style: 'width:auto;margin:0 8px 0 0' }); cb.indeterminate = state === 'some';
    const r = { name, cb, touched: !!touched }; cb.onchange = () => { r.touched = true; };
    rows.set(k, r); box.append(el('label', { className: 'lbl-row' }, cb, labelChip(name)));
  };
  for (const l of allLabels()) {
    const k = labelKey(l.name), c = notes.filter(n => noteLabels(n).some(x => labelKey(x) === k)).length;
    addRow(l.name, c === 0 ? 'none' : c === notes.length ? 'all' : 'some');
  }
  const inp = el('input', { placeholder: 'Nueva etiqueta…', maxLength: 30 });
  const add = () => { const v = inp.value.trim(); if (v) { addRow(canonLabel(v), 'all', true); inp.value = ''; } };
  inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); add(); } };
  const head = el('div', { className: 'muted', textContent: notes.length > 1 ? `Se aplican a ${notes.length} notas` : 'Marca las etiquetas de esta nota' });
  const r = await dialog('Etiquetas', el('div', {}, head, inp, el('button', { className: 'fchip', textContent: '＋ Añadir', onclick: add }), box), [{ t: 'Cancelar', v: null }, { t: 'Aceptar', v: true }]);
  if (!r) return false;
  add();                                   // por si escribió una etiqueta y pulsó Aceptar sin añadirla
  for (const n of notes) {
    let changed = false;
    for (const row of rows.values()) if (row.touched) { const had = noteLabels(n).some(l => labelKey(l) === labelKey(row.name)); if (had !== row.cb.checked) { setLabel(n, row.name, row.cb.checked); changed = true; } }
    if (!changed) continue;
    if (n === S.cur) touch(); else { n.updated = Date.now(); await persist(n); }
  }
  return true;
}
function drawEdLabels() {
  const n = S.cur, e = $('edLabels'); if (!n || !e) return;
  const ls = noteLabels(n); e.hidden = !ls.length;
  e.replaceChildren(...ls.map(l => labelChip(l)), el('span', { className: 'lchip add', textContent: '＋ etiqueta' }));
  e.onclick = async () => { if (n.readonly || n.deleted) return; if (await labelsDialog([n])) drawEdLabels(); };
}

// --- administrar etiquetas (renombrar, eliminar, ver notas) ---
function applyLabelFilter(name) { S.filter = Object.assign(emptyFilter(), { labels: [labelKey(name)] }); renderMain(); }
function manageLabels(fromSettings) {
  const ls = allLabels();
  if (!ls.length) { toast('Aún no hay etiquetas. Créalas desde una nota: ⋮ → Etiquetas'); return; }
  menu(ls.map(l => ({ t: `${l.name}  (${l.count})`, fn: () => menu([
    { t: 'Ver las notas con esta etiqueta', fn: () => { S.filter = Object.assign(emptyFilter(), { labels: [labelKey(l.name)] }); if (fromSettings) closeScreen(); else renderMain(); } },
    { t: 'Renombrar', fn: async () => {
      const v = await ask('Nuevo nombre de la etiqueta', l.name); if (!v || !v.trim() || v.trim() === l.name) return;
      const to = canonLabel(v), k = labelKey(l.name);
      for (const n of S.notes.filter(n => noteLabels(n).some(x => labelKey(x) === k))) { setLabel(n, l.name, false); setLabel(n, to, true); n.updated = Date.now(); await persist(n); }
      S.filter = emptyFilter(); toast(`Etiqueta renombrada a "${to}"`); renderMain();
    } },
    { t: 'Eliminar de todas las notas', fn: async () => {
      if (!(await confirmD(`¿Quitar la etiqueta "${l.name}" de ${l.count} nota(s)? Las notas no se borran.`))) return;
      const k = labelKey(l.name);
      for (const n of S.notes.filter(n => noteLabels(n).some(x => labelKey(x) === k))) { setLabel(n, l.name, false); n.updated = Date.now(); await persist(n); }
      S.filter = emptyFilter(); toast('Etiqueta eliminada'); renderMain();
    } },
  ]) })));
}

// --- filtros combinados ---
function emptyFilter() { return { labels: [], mode: 'all', noLabel: false, types: [], colors: [], reminder: false, enc: false, readonly: false, range: '', from: null, to: null, allFolders: false }; }
S.filter = emptyFilter();
const filterActive = (f = S.filter) => !!(f.labels.length || f.noLabel || f.types.length || f.colors.length || f.reminder || f.enc || f.readonly || f.range);
const RANGES = [['', 'Cualquier fecha'], ['today', 'Hoy'], ['7d', 'Últimos 7 días'], ['30d', 'Últimos 30 días'], ['year', 'Este año'], ['custom', 'Entre dos fechas…']];
function rangeBounds(f) {
  const now = Date.now(), d0 = new Date(); d0.setHours(0, 0, 0, 0);
  switch (f.range) {
    case 'today': return [d0.getTime(), Infinity];
    case '7d': return [now - 7 * 864e5, Infinity];
    case '30d': return [now - 30 * 864e5, Infinity];
    case 'year': return [new Date(d0.getFullYear(), 0, 1).getTime(), Infinity];
    case 'custom': return [f.from || 0, f.to || Infinity];
    default: return [0, Infinity];
  }
}
function matchesFilter(n) {
  const f = S.filter, ls = noteLabels(n).map(labelKey);
  if (f.labels.length || f.noLabel) {
    const okL = f.labels.length && (f.mode === 'any' ? f.labels.some(k => ls.includes(k)) : f.labels.every(k => ls.includes(k)));
    const okN = f.noLabel && !ls.length;
    if (!okL && !okN) return false;
  }
  if (f.types.length && !f.types.includes(n.type)) return false;
  if (f.colors.length && !f.colors.includes(n.color || '')) return false;
  if (f.reminder && !n.reminder) return false;
  if (f.enc && !n.enc) return false;
  if (f.readonly && !n.readonly) return false;
  if (f.range) { const [a, b] = rangeBounds(f); if (n.updated < a || n.updated > b) return false; }
  return true;
}
const toggleIn = (arr, v) => { const i = arr.indexOf(v); i >= 0 ? arr.splice(i, 1) : arr.push(v); };
async function filterDialog() {
  const d = JSON.parse(JSON.stringify(S.filter)), wrap = el('div', {});
  const sec = t => wrap.append(el('div', { className: 'fsec', textContent: t }));
  const chip = (par, text, isOn, toggle, css) => { const b = el('button', { className: 'fchip' + (isOn() ? ' on' : ''), textContent: text, onclick: () => { toggle(); b.classList.toggle('on', isOn()); } }); if (css) b.style.cssText = css; par.append(b); return b; };
  const ls = allLabels();
  sec('Etiquetas'); const rl = el('div');
  if (!ls.length) rl.append(el('span', { className: 'muted', textContent: 'Aún no hay etiquetas' }));
  for (const l of ls) chip(rl, `${l.name} (${l.count})`, () => d.labels.includes(labelKey(l.name)), () => toggleIn(d.labels, labelKey(l.name)), `border-color:${labelColor(l.name)}`);
  chip(rl, 'Sin etiqueta', () => d.noLabel, () => { d.noLabel = !d.noLabel; });
  chip(rl, 'Basta con una de las elegidas', () => d.mode === 'any', () => { d.mode = d.mode === 'any' ? 'all' : 'any'; }, 'border-style:dashed');
  wrap.append(rl);
  sec('Tipo de nota'); const rt = el('div'); for (const t of ['text', 'check', 'voice', 'draw', 'photo']) chip(rt, TYPE_NAME[t], () => d.types.includes(t), () => toggleIn(d.types, t)); wrap.append(rt);
  sec('Color de la nota'); const rc = el('div');
  NOTE_COLORS.forEach(c => { const b = chip(rc, c ? '' : 'Sin color', () => d.colors.includes(c), () => toggleIn(d.colors, c)); if (c) b.style.cssText = `background:${c};min-width:34px;height:30px;padding:0`; }); wrap.append(rc);
  sec('Estado'); const rs = el('div');
  chip(rs, 'Con recordatorio', () => d.reminder, () => { d.reminder = !d.reminder; }); chip(rs, 'Cifradas', () => d.enc, () => { d.enc = !d.enc; }); chip(rs, 'Solo lectura', () => d.readonly, () => { d.readonly = !d.readonly; });
  if (S.view.kind === 'folder') chip(rs, 'Incluir todas las carpetas', () => d.allFolders, () => { d.allFolders = !d.allFolders; });
  wrap.append(rs);
  sec('Modificadas'); const sel = el('select', {}, RANGES.map(([v, t]) => el('option', { value: v, textContent: t, selected: d.range === v })));
  const iso = t => t ? new Date(t - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10) : '';
  const from = el('input', { type: 'date', value: iso(d.from) }), to = el('input', { type: 'date', value: iso(d.to) }), custom = el('div', {}, el('div', { className: 'muted', textContent: 'Desde' }), from, el('div', { className: 'muted', textContent: 'Hasta' }), to);
  custom.hidden = d.range !== 'custom'; sel.onchange = () => { d.range = sel.value; custom.hidden = d.range !== 'custom'; };
  wrap.append(sel, custom);
  const r = await dialog('Filtrar notas', wrap, [{ t: 'Cancelar', v: null }, { t: 'Limpiar', v: 'clear' }, { t: 'Guardar vista', v: 'save' }, { t: 'Aplicar', v: true }]);
  if (r === null) return;
  if (r === 'clear') S.filter = emptyFilter();
  else {
    d.from = from.value ? new Date(from.value + 'T00:00:00').getTime() : null; d.to = to.value ? new Date(to.value + 'T23:59:59.999').getTime() : null;
    S.filter = d;
    if (r === 'save') { const nm = await ask('Nombre de la vista', ''); if (nm && nm.trim()) saveView(nm.trim(), d); }
  }
  renderMain();
}
const views = () => { try { return JSON.parse(pref('views') || '[]'); } catch (e) { return []; } };
function saveView(name, f) { const l = views().filter(v => v.name !== name); l.push({ name, filter: f }); pref('views', JSON.stringify(l)); toast(`Vista "${name}" guardada`); }
function viewsMenu() {
  menu(views().map(v => ({ t: v.name, fn: () => menu([
    { t: 'Aplicar esta vista', fn: () => { S.filter = Object.assign(emptyFilter(), v.filter); renderMain(); } },
    { t: 'Eliminar la vista', fn: () => { pref('views', JSON.stringify(views().filter(x => x.name !== v.name))); toast('Vista eliminada'); } },
  ]) })));
}
// --- barra de filtros activos (con ✕ para quitar cada uno) ---
function renderFilterBar() {
  const bar = $('filterBar'); if (!bar) return; bar.replaceChildren();
  const f = S.filter, parts = [];
  const add = (node, remove) => { node.onclick = () => { remove(); renderMain(); }; node.classList.add('rm'); parts.push(node); };
  for (const k of f.labels) { const nm = (allLabels().find(l => labelKey(l.name) === k) || { name: k }).name; add(labelChip('#' + nm), () => toggleIn(f.labels, k)); }
  if (f.labels.length > 1) parts.push(el('span', { className: 'fnote', textContent: f.mode === 'any' ? 'cualquiera' : 'todas' }));
  if (f.noLabel) add(el('span', { className: 'fchip on', textContent: 'Sin etiqueta ✕' }), () => { f.noLabel = false; });
  for (const t of f.types) add(el('span', { className: 'fchip on', textContent: TYPE_NAME[t] + ' ✕' }), () => toggleIn(f.types, t));
  for (const c of f.colors) { const s = el('span', { className: 'fchip on', textContent: c ? '● ✕' : 'Sin color ✕' }); if (c) s.style.color = c; add(s, () => toggleIn(f.colors, c)); }
  if (f.reminder) add(el('span', { className: 'fchip on', textContent: 'Recordatorio ✕' }), () => { f.reminder = false; });
  if (f.enc) add(el('span', { className: 'fchip on', textContent: 'Cifradas ✕' }), () => { f.enc = false; });
  if (f.readonly) add(el('span', { className: 'fchip on', textContent: 'Solo lectura ✕' }), () => { f.readonly = false; });
  if (f.range) add(el('span', { className: 'fchip on', textContent: (RANGES.find(r => r[0] === f.range) || ['', ''])[1] + ' ✕' }), () => { f.range = ''; });
  if (f.allFolders) parts.push(el('span', { className: 'fnote', textContent: 'todas las carpetas' }));
  if (parts.length && filterActive(f)) { const clr = el('button', { className: 'fchip', textContent: 'Limpiar filtros', onclick: () => { S.filter = emptyFilter(); renderMain(); } }); parts.push(clr); }
  bar.hidden = !(filterActive(f)); if (filterActive(f)) bar.append(...parts);
}

/* ============ Arranque ============ */
function wire() {
  setIcons();
  $('addBtn').onclick = newMenu; $('moreBtn').onclick = mainMenu; $('syncBtn').onclick = syncDrive; $('syncBar').onclick = () => ((folderPending || (mir.dir && mir.needPerm)) ? grantFolders() : syncDrive());
  $('folderBtn').onclick = () => pickFolder();
  $('searchBtn').onclick = () => { const b = $('searchBar'); b.hidden = !b.hidden; if (b.hidden) { S.q = ''; $('searchInput').value = ''; renderMain(); } else $('searchInput').focus(); };
  $('searchInput').oninput = e => { S.q = e.target.value; renderMain(); };
  $('selClose').onclick = endSel;
  $('searchFilter').onclick = filterDialog;
  $('selTag').onclick = async () => { const ns = S.notes.filter(n => S.sel.has(n.id)); if (await labelsDialog(ns)) endSel(); };
  $('selAll').onclick = () => { visibleNotes().forEach(n => S.sel.add(n.id)); renderMain(); };
  $('selDel').onclick = async () => { const ns = S.notes.filter(n => S.sel.has(n.id)); endSel(); await trashNotes(ns); renderMain(); };
  $('selMove').onclick = async () => { const f = await pickFolder(true); if (!f) return; for (const n of S.notes.filter(n => S.sel.has(n.id))) { n.folder = f; await persist(n); } endSel(); toast('Notas movidas a ' + folderName(f)); };

  $('lockGo').onclick = lockSubmit; $('lockBio').onclick = () => lockWithBio(false);
  $('lockPin').onkeydown = e => { if (e.key === 'Enter') lockSubmit(); };
  $('edBack').onclick = closeScreen; $('fdBack').onclick = closeScreen; $('stBack').onclick = closeScreen;
  $('edMore').onclick = editorMenu; $('edShare').onclick = shareNote;
  $('edDel').onclick = async () => {
    const n = S.cur;
    if (n.deleted) { if (!(await confirmD('¿Eliminar definitivamente esta nota?'))) return; S.notes = S.notes.filter(x => x !== n); await forgetNote(n.id); closeScreen(); return; }
    if (isEmpty(n)) { closeScreen(); return; }
    n.deleted = Date.now(); await persist(n); closeScreen();
    toast('Nota movida a la papelera', 'Deshacer', async () => { n.deleted = null; await persist(n); renderMain(); });
  };
  $('edText').oninput = onRichInput;
  $('edText').addEventListener('paste', onRichPaste);
  $('edText').addEventListener('beforeinput', e => { if (e.inputType === 'historyUndo') { e.preventDefault(); undo(); } else if (e.inputType === 'historyRedo') { e.preventDefault(); redo(); } });
  document.addEventListener('keydown', histKeys);
  $('ckUndo').onclick = () => undo(); $('ckRedo').onclick = () => redo();
  $('edText').addEventListener('click', e => { const a = e.target.closest && e.target.closest('a'); if (a && $('edText').contains(a)) { e.preventDefault(); linkMenu(a); } });
  $('edBody').addEventListener('scroll', () => requestAnimationFrame(updateMini));
  document.addEventListener('selectionchange', onSelChange);
  buildFmtBar();
  const caretLink = () => {
    const t = $('edText'), b = $('linkBtn'), sel = getSelection();
    if (t.hidden || !sel.rangeCount || sel.anchorNode.nodeType !== 3 || !t.contains(sel.anchorNode)) { b.hidden = true; return; }
    if (sel.anchorNode.parentElement.closest('a')) { b.hidden = true; return; }
    const p = sel.anchorOffset, l = findLinks(sel.anchorNode.data).find(l => l.k === 'wiki' && p >= l.s && p <= l.e);
    if (l) { b.textContent = 'Abrir enlace: ' + l.v; b.onclick = () => openLink(l); b.hidden = false; } else b.hidden = true;
  };
  for (const ev of ['click', 'keyup']) $('edText').addEventListener(ev, caretLink);
  $('edText').addEventListener('blur', () => setTimeout(() => $('linkBtn').hidden = true, 250));
  document.querySelectorAll('.tabs button[data-t]').forEach(b => b.onclick = () => { S.tab = b.dataset.t; drawChecks(); });
  $('addInput').onkeydown = e => { if (e.key === 'Enter') addCheckItem(); };
  $('addItem').onclick = () => addCheckItem(); $('addMic').onclick = dictate;
  $('findInput').oninput = e => {
    S.find.q = e.target.value; S.find.i = 0;
    const n = S.cur;
    if (n.type === 'check') drawChecks(); else { $('edText').hidden = true; $('edView').hidden = false; renderView(); }
  };
  const step = d => { const f = S.find; if (f && f.marks && f.marks.length) { f.i = (f.i + d + f.marks.length) % f.marks.length; focusMark(); } };
  $('findNext').onclick = () => step(1); $('findPrev').onclick = () => step(-1);
  $('findInput').onkeydown = e => { if (e.key === 'Enter') step(1); if (e.key === 'Escape') closeFind(); };
  $('edTitle').onclick = () => { if (S.find) closeFind(); };
  addEventListener('resize', () => S.resize && !$('drawWrap').hidden && S.resize());
  addEventListener('popstate', onPop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { lock.hiddenAt = Date.now(); if (!window.__dropPending) markCount(); if (S.dirty && typeof gToken !== 'undefined' && gToken && Date.now() < gExp - 60000) syncDrive({ auto: true }); flush().catch(() => {}); } else { if (lock.on && !lock.shown && Date.now() - lock.hiddenAt >= lock.delay * 60000) showLock(); checkReminders(); if (autoSyncDue() && gToken) syncDrive({ auto: true }); checkSchedules(); } });
  addEventListener('pagehide', () => { flush().catch(() => {}); if (!window.__dropPending) markCount(); });
}

async function init() {
  S.bioNotes = new Set();
  wire();
  if (lock.on) showLock();                       // pantalla de bloqueo antes de cargar nada
  document.documentElement.dataset.theme = settings.theme;
  history.replaceState({ s: 'main' }, ''); history.pushState({ s: 'main' }, '');   // evita salir de la app con el primer "atrás"
  try {
    await DB.open();
    S.notes = await DB.all('notes'); S.folders = await DB.all('folders');
    const metas = await metaAll();
    S.bioNotes = new Set(metas.filter(m => m.id.startsWith('bio:')).map(m => m.id.slice(4)));
    S.recovery = metas.find(m => m.id === 'recovery') || null;
    await mirInit();
    if (!S.folders.some(f => f.id === 'main')) { const m = { id: 'main', name: 'Carpeta principal', parent: null }; S.folders.push(m); await DB.put('folders', m); }
    const lim = Date.now() - TRASH_DAYS * 864e5;
    for (const n of S.notes.filter(n => n.deleted && n.deleted < lim)) await forgetNote(n.id);
    S.notes = S.notes.filter(n => !n.deleted || n.deleted >= lim);
    const prevCount = +pref('boot_count') || 0, nowCount = S.notes.length;
    if (prevCount - nowCount >= 10) {
      syncLog({ drop: prevCount - nowCount, prev: prevCount, now: nowCount }); window.__dropPending = true;
      setTimeout(async () => {
        const r = await dialog('Faltan notas', el('p', { textContent: `Hay ${prevCount - nowCount} notas menos que la última vez que cerraste la app (antes ${prevCount}, ahora ${nowCount}).\n\nPuede que el navegador haya borrado datos o que alguna operación las haya quitado. Tus notas pueden estar en una copia de seguridad, en Google Drive o en el ZIP original.\n\nPulsa "Ver copias" para restaurar una copia interna.` }), [{ t: 'Cerrar', v: 0 }, { t: 'Ver copias', v: 1 }]);
        window.__dropPending = false; markCount(); if (r === 1) backupsMenu();
      }, 800);
    } else markCount();
  } catch (e) { toast('Error al abrir el almacenamiento: ' + e.message); }
  renderMain();
  mirCheck();
  // texto recibido desde otras apps (share target)
  const p = new URLSearchParams(location.search);
  if (p.has('text') || p.has('title') || p.has('url')) {
    const n = newNote('text'); n.body = [p.get('title'), p.get('text'), p.get('url')].filter(Boolean).join('\n'); await persist(n);
    history.replaceState({ s: 'main' }, '', location.pathname); renderMain(); toast('Nota creada desde otra app');
  }
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist();
  checkReminders(); setInterval(checkReminders, 30000);
  if (pref('autosync') !== '0' && pref('gclient') && pref('gconsent')) syncDrive({ auto: true });
    checkSchedules(); setInterval(checkSchedules, 60000);
  addEventListener('online', () => { checkSchedules(); if (pref('autosync') !== '0' && pref('gclient') && pref('gconsent')) syncDrive({ auto: true }); updateSyncStat(); });
  addEventListener('offline', updateSyncStat);
}
init();
