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
  sort: '<path d="M4 6h16M4 12h11M4 18h6"/>', selall: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 12l4 4 6-8"/>',
  move: '<path d="M3 6h7l2 2h9v11H3z"/><path d="M9 14h7M13 11l3 3-3 3"/>',
};
const ic = n => `<svg class="ic" viewBox="0 0 24 24">${ICONS[n]}</svg>`;
const setIcons = () => {
  const map = { addBtn: 'plus', folderBtn: 'folder', searchBtn: 'search', moreBtn: 'more', selClose: 'close', selAll: 'selall', selMove: 'move', selDel: 'trash',
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
  idb: null, mem: { notes: {}, folders: {} },
  async open() {
    try {
      this.idb = await Promise.race([new Promise((res, rej) => {
        const r = indexedDB.open('notas', 2);
        r.onupgradeneeded = () => { for (const s of ['notes', 'folders']) if (!r.result.objectStoreNames.contains(s)) r.result.createObjectStore(s, { keyPath: 'id' }); };
        r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
      }), sleep(4000).then(() => { throw new Error('timeout'); })]);
    } catch (e) {            // sin IndexedDB (p. ej. file://): se usa localStorage
      this.idb = null; try { this.mem = JSON.parse(pref('notas_fb') || 'null') || this.mem; } catch (x) {}
      toast('Modo limitado: el navegador no permite guardar datos de forma completa');
    }
  },
  tx(store, mode, fn) {
    return new Promise((res, rej) => {
      const t = this.idb.transaction(store, mode), out = fn(t.objectStore(store));
      t.oncomplete = () => res(out && out.result); t.onerror = () => rej(t.error);
    });
  },
  flush() { pref('notas_fb', JSON.stringify(this.mem)); },
  async all(s) { return this.idb ? this.tx(s, 'readonly', o => o.getAll()) : Object.values(this.mem[s]); },
  async put(s, v) { if (this.idb) return this.tx(s, 'readwrite', o => o.put(v)); this.mem[s][v.id] = v; this.flush(); },
  async del(s, id) { if (this.idb) return this.tx(s, 'readwrite', o => o.delete(id)); delete this.mem[s][id]; this.flush(); },
};

/* ============ Cifrado (AES-GCM + PBKDF2) ============ */
const b64 = u => { let s = ''; new Uint8Array(u).forEach(b => s += String.fromCharCode(b)); return btoa(s); };
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function deriveKey(pw, salt) {
  const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' }, km, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
async function encPayload(n) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, n._key, new TextEncoder().encode(JSON.stringify({ body: n.body, html: n.html, items: n.items })));
  return { s: n.enc.s, iv: b64(iv), d: b64(ct) };
}
async function unlock(n) {
  if (!n.enc || n._key) return true;
  if (!crypto.subtle) { toast('El cifrado requiere HTTPS'); return false; }
  for (;;) {
    const pw = await ask('Contraseña de la nota', '', 'password');
    if (pw === null) return false;
    try {
      const key = await deriveKey(pw, unb64(n.enc.s));
      const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(n.enc.iv) }, key, unb64(n.enc.d));
      const o = JSON.parse(new TextDecoder().decode(pt));
      n.body = o.body; n.html = o.html || ''; n.items = o.items; n._key = key; return true;
    } catch (e) { toast('Contraseña incorrecta'); }
  }
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
const isEmpty = n => ({ text: !n.body.trim(), check: !n.items.some(i => i.t.trim()), voice: !n.media && !n.body.trim(), draw: !(n.strokes && n.strokes.length), photo: !n.media && !n.body.trim() }[n.type]);
function newNote(type, folder) {
  const n = { id: uid(), type, title: '', body: '', items: [], folder: folder || 'main', color: '', readonly: false, enc: null, reminder: null, fired: false,
    media: null, strokes: [], html: '', deleted: null, created: Date.now(), updated: Date.now() };
  if (type !== 'text') n.title = TYPE_NAME[type] + ' ' + (S.notes.filter(x => x.type === type).length + 1);
  if (type === 'check') n.items = [];
  return n;
}
async function persist(n) {
  const rec = {}; for (const k in n) if (k[0] !== '_') rec[k] = n[k];
  if (n.enc) {
    if (n._key) rec.enc = await encPayload(n);
    rec.title = n.type === 'text' ? 'Nota cifrada' : n.title; rec.body = ''; rec.html = ''; rec.items = [];
  }
  if (!S.notes.includes(n)) S.notes.push(n);
  await DB.put('notes', rec);
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
  const q = S.q.trim().toLowerCase(), v = S.view;
  let ns = S.notes.filter(n => {
    if (v.kind === 'trash') return !!n.deleted;
    if (n.deleted) return false;
    if (q) return true;
    return v.kind === 'all' || n.folder === v.id;
  });
  if (q) ns = ns.filter(n => [noteTitle(n), n.body, n.title, ...n.items.map(i => i.t)].join('\n').toLowerCase().includes(q));
  const dir = settings.desc ? -1 : 1, f = settings.sort;
  return ns.sort((a, b) => {
    const c = f === 'title' ? noteTitle(a).localeCompare(noteTitle(b)) : f === 'type' ? a.type.localeCompare(b.type) : (a[f === 'created' ? 'created' : 'updated'] - b[f === 'created' ? 'created' : 'updated']);
    return c * dir;
  });
}
function renderMain() {
  document.documentElement.dataset.theme = settings.theme;
  const sel = S.selMode;
  $('mainBar').hidden = sel; $('selBar').hidden = !sel;
  $('selCount').textContent = S.sel.size + ' seleccionadas';
  $('mainTitle').textContent = 'Note Everything';
  $('folderBar').innerHTML = ic(S.view.kind === 'trash' ? 'trash' : 'folder');
  $('folderBar').append(' ' + viewName());
  $('folderBar').onclick = () => pickFolder();
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
        (n.enc || n.reminder || n.readonly) ? el('div', { className: 's', innerHTML: (n.enc ? ic('lock') : '') + (n.reminder ? ic('bell') : '') + (n.readonly ? '<span>solo lectura</span>' : '') }) : null),
      el('div', { className: 'd', textContent: fmtDate(n.updated) }));
    pressable(row, () => noteTap(n), () => noteHold(n));
    rows.push(row);
  }
  list.append(...rows);
  $('empty').hidden = rows.length > 0;
  $('empty').textContent = S.q ? 'Sin resultados' : S.view.kind === 'trash' ? 'La papelera está vacía' : 'Aún no hay notas.\nToca + para crear una.';
  $('empty').style.whiteSpace = 'pre-line';
  $('addBtn').hidden = S.view.kind === 'trash';
}
function pressable(node, tap, hold) {
  let t, held = false, moved = false, sx = 0, sy = 0;
  node.addEventListener('pointerdown', e => { held = moved = false; sx = e.clientX; sy = e.clientY; t = setTimeout(() => { held = true; hold(); }, 500); });
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
  S.fresh = n;
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
  for (const n of ts) await DB.del('notes', n.id);
  S.notes = S.notes.filter(n => !n.deleted); renderMain();
}
async function trashNotes(ns) {
  if (S.view.kind === 'trash') {
    if (!(await confirmD(`¿Eliminar definitivamente ${ns.length} nota(s)?`))) return;
    for (const n of ns) await DB.del('notes', n.id);
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
      S.folders = S.folders.filter(x => x !== f); await DB.del('folders', f.id);
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
  drawEditor();
  if (n.deleted) toast('Esta nota está en la papelera', 'Restaurar', async () => { n.deleted = null; await persist(n); drawEditor(); });
  if (isNew && !n.readonly) setTimeout(() => { if (n.type === 'text') $('edText').focus(); else if (n.type === 'check') $('addInput').focus(); }, 80);
}
async function flush() { clearTimeout(S.timer); if (S.cur && !S.cur.deleted && (!isEmpty(S.cur) || S.notes.includes(S.cur))) { await persist(S.cur); } }
let tm;
function touch() {
  const n = S.cur; if (!n || n.deleted) return;
  n.updated = Date.now(); clearTimeout(S.timer);
  S.timer = setTimeout(() => flush().catch(() => {}), 400);
}
async function leaveEditor(keepStack) {
  const n = S.cur; if (!n) return;
  stopRec(true); stopAudio(); clearTimeout(S.timer);
  if (!n.deleted && isEmpty(n) && !(n.enc)) {
    if (S.notes.includes(n)) { S.notes = S.notes.filter(x => x !== n); await DB.del('notes', n.id); }
  } else if (!n.deleted || S.notes.includes(n)) {
    if (S.notes.includes(n) || !isEmpty(n)) await persist(n);
  }
  if (n.enc) { n.body = ''; n.html = ''; n.items = []; delete n._key; if (n.type === 'text') n.title = 'Nota cifrada'; }
  S.cur = null; S.find = null; $('linkBtn').hidden = true;
}

function drawEditor() {
  const n = S.cur, t = n.type, ro = n.readonly || !!n.deleted;
  $('edTitle').textContent = noteTitle(n);
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
  if (S.find) { S.find.marks = marks; S.find.i = Math.min(S.find.i || 0, Math.max(0, marks.length - 1)); focusMark(); }
}
// Convierte enlaces en <a> y resalta la búsqueda dentro de un árbol HTML (conserva el formato).
function decorate(root, q) {
  const marks = [], nodes = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) nodes.push(w.currentNode);
  const ql = q ? q.toLowerCase() : '';
  for (const tn of nodes) {
    const text = tn.data, links = findLinks(text), frag = document.createDocumentFragment();
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
  document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.t === S.tab));
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
function setupCanvas() {
  const c = $('canvas'), wrap = $('drawWrap'), n = S.cur, ro = n.readonly || !!n.deleted;
  const resize = () => { c.width = wrap.clientWidth; c.height = wrap.clientHeight; redraw(); };
  S.redraw = redraw; requestAnimationFrame(resize); S.resize = resize;
  function redraw() {
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
    for (const s of n.strokes) strokePath(g, s);
  }
  function strokePath(g, s) {
    g.lineCap = g.lineJoin = 'round'; g.strokeStyle = s.c; g.lineWidth = s.w * c.width / 400; g.beginPath();
    s.p.forEach(([x, y], i) => { const px = x * c.width, py = y * c.width; i ? g.lineTo(px, py) : g.moveTo(px, py); });
    if (s.p.length === 1) g.lineTo(s.p[0][0] * c.width + .1, s.p[0][1] * c.width);
    g.stroke();
  }
  let cur = null;
  const pt = e => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) / c.width, (e.clientY - r.top) / c.width]; };
  c.onpointerdown = e => { if (ro) return; c.setPointerCapture(e.pointerId); cur = { c: pen.eraser ? '#ffffff' : pen.color, w: pen.size, p: [pt(e)] }; n.strokes.push(cur); strokePath(c.getContext('2d'), cur); };
  c.onpointermove = e => { if (!cur) return; cur.p.push(pt(e)); redraw(); };
  c.onpointerup = c.onpointercancel = () => { if (cur) { cur = null; touch(); } };
  updateDrawStatus();
}
function updateDrawStatus() {
  $('drawStatus').innerHTML = '';
  $('drawStatus').append(el('span', { textContent: S.cur ? S.cur.title : '' }), el('span', {}, pen.eraser ? 'Borrador' : 'Lápiz', el('span', { className: 'dot', style: `background:${pen.eraser ? '#fff' : pen.color}` })));
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
const OK_TAGS = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'S', 'STRIKE', 'DEL', 'SPAN', 'FONT', 'DIV', 'P', 'BR', 'UL', 'OL', 'LI', 'H1', 'H2', 'H3', 'SUB', 'SUP']);
const OK_CSS = ['color', 'background-color', 'font-family', 'font-size', 'font-weight', 'font-style', 'text-decoration', 'text-decoration-line', 'text-align'];
const escHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const textToHtml = t => escHtml(t || '').replace(/\n/g, '<br>');
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
      } else if (!(c.tagName === 'FONT' && ['size', 'color', 'face'].includes(a.name))) c.removeAttribute(a.name);
    }
  }
}
function setRich(n) { $('edText').innerHTML = sanitize(n.html || textToHtml(n.body)); }
let pendingSize = 0;
function onRichInput() {
  const r = $('edText'), n = S.cur; if (!n) return;
  fixSizeTags(r);
  n.body = r.innerText.replace(/ /g, ' ');
  n.html = n.body.trim() ? r.innerHTML : '';
  touch(); $('edTitle').textContent = noteTitle(n);
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
function onRichPaste(e) {
  e.preventDefault();
  const html = e.clipboardData.getData('text/html'), text = e.clipboardData.getData('text/plain');
  document.execCommand('insertHTML', false, html ? sanitize(html) : textToHtml(text));
}
let savedRange = null;
function onSelChange() {
  const r = $('edText'), sel = getSelection();
  if (sel.rangeCount && r.contains(sel.anchorNode)) { savedRange = sel.getRangeAt(0).cloneRange(); updateFmtState(); }
}
function restoreSel() {
  const r = $('edText'); r.focus();
  if (savedRange) { const sel = getSelection(); sel.removeAllRanges(); sel.addRange(savedRange); }
}
function fmt(cmd, val, css = true) {
  restoreSel(); document.execCommand('styleWithCSS', false, css); document.execCommand(cmd, false, val || null);
  onRichInput(); updateFmtState();
}
function updateFmtState() {
  document.querySelectorAll('#fmtBar [data-cmd]').forEach(b => { let on = false; try { on = document.queryCommandState(b.dataset.cmd); } catch (e) {} b.classList.toggle('on', on); });
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
  document.execCommand('styleWithCSS', false, false); document.execCommand('fontSize', false, '7'); onRichInput();
}
function buildFmtBar() {
  const bar = $('fmtBar'); bar.replaceChildren();
  const btn = (label, fn, cmd, style) => {
    const b = el('button', { innerHTML: label, onclick: fn }); if (cmd) b.dataset.cmd = cmd; if (style) b.style.cssText = style;
    b.addEventListener('pointerdown', e => e.preventDefault()); bar.append(b);   // no quitar el foco al editor
  };
  btn('N', () => fmt('bold'), 'bold', 'font-weight:700'); btn('K', () => fmt('italic'), 'italic', 'font-style:italic');
  btn('S', () => fmt('underline'), 'underline', 'text-decoration:underline'); btn('T', () => fmt('strikeThrough'), 'strikeThrough', 'text-decoration:line-through');
  btn('Fuente', () => menu(FONTS.map(([l, f]) => ({ t: l, fn: () => fmt('fontName', f) }))));
  btn('Tamaño', () => menu(SIZES.map(s => ({ t: s + ' px', fn: () => setSize(s) }))));
  btn('A<span class="sw" style="background:#e53935"></span>', () => colorPick('Color del texto', 'foreColor'));
  btn('▮<span class="sw" style="background:#fdd835"></span>', () => colorPick('Resaltado', 'hiliteColor', true));
  btn('• Lista', () => fmt('insertUnorderedList'), 'insertUnorderedList'); btn('1. Lista', () => fmt('insertOrderedList'), 'insertOrderedList');
  btn('Alinear', () => menu([{ t: 'Izquierda', fn: () => fmt('justifyLeft') }, { t: 'Centro', fn: () => fmt('justifyCenter') }, { t: 'Derecha', fn: () => fmt('justifyRight') }, { t: 'Justificado', fn: () => fmt('justifyFull') }]));
  btn('Título', () => menu([{ t: 'Texto normal', fn: () => fmt('formatBlock', 'div') }, { t: 'Título grande', fn: () => fmt('formatBlock', 'h1', false) }, { t: 'Título mediano', fn: () => fmt('formatBlock', 'h2', false) }]));
  btn('Sup', () => fmt('superscript'), 'superscript'); btn('Sub', () => fmt('subscript'), 'subscript');
  btn('✕ Formato', () => fmt('removeFormat'));
}

/* ============ Menú y acciones del editor ============ */
function editorMenu() {
  const n = S.cur, t = n.type;
  menu([
    t !== 'text' ? { t: 'Renombrar', fn: async () => { const v = await ask('Título', n.title); if (v !== null) { n.title = v; touch(); drawEditor(); } } } : null,
    t === 'draw' ? { t: 'Lápiz y colores…', fn: penDialog } : null,
    t === 'draw' ? { t: 'Deshacer trazo', fn: () => { n.strokes.pop(); S.redraw(); touch(); } } : null,
    t === 'draw' ? { t: 'Borrar dibujo', fn: async () => { if (await confirmD('¿Borrar todo el dibujo?')) { n.strokes = []; S.redraw(); touch(); } } } : null,
    t === 'check' || t === 'text' ? { t: t === 'text' ? 'Convertir en lista de tareas' : 'Convertir en nota de texto', fn: convertNote } : null,
    t !== 'draw' && t !== 'voice' ? { t: 'Buscar en la nota', fn: openFind } : null,
    { t: 'Información', fn: noteInfo },
    { t: 'Color de la nota…', fn: colorDialog },
    { t: n.readonly ? 'Desactivar solo lectura' : 'Solo lectura', fn: () => { n.readonly = !n.readonly; touch(); drawEditor(); } },
    { t: n.reminder ? 'Recordatorio: ' + fmtDate(n.reminder) + ' (cambiar)' : 'Añadir recordatorio', fn: reminderDialog },
    { t: n.enc ? 'Quitar cifrado' : 'Cifrar con contraseña', fn: toggleEncrypt },
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
  touch(); drawEditor();
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
  if (n.enc) { if (!(await confirmD('¿Quitar el cifrado de esta nota?'))) return; n.enc = null; delete n._key; touch(); toast('Cifrado quitado'); drawEditor(); return; }
  const p1 = await ask('Nueva contraseña', '', 'password'); if (!p1) return;
  const p2 = await ask('Repite la contraseña', '', 'password'); if (p1 !== p2) { toast('Las contraseñas no coinciden'); return; }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  n.enc = { s: b64(salt), iv: '', d: '' }; n._key = await deriveKey(p1, salt);
  touch(); toast('Nota cifrada. No hay forma de recuperar la contraseña.'); drawEditor();
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
  sec('Datos');
  item('Exportar copia de seguridad', 'Archivo JSON con todas las notas, fotos, audios y carpetas', exportBackup);
  item('Importar copia de seguridad', 'Fusiona; si hay conflicto gana la nota más reciente', () => pickFile('application/json', false, importBackup));
  item('Importar archivos de texto (.txt)', 'Uno o varios; cada archivo crea una nota', () => pickFile('.txt,text/plain', true, importTxt));
  item('Vaciar papelera', '', emptyTrash);
  sec('Sincronización');
  item('Sincronizar entre dispositivos', 'Próximamente', () => info('Sincronización', 'Aún no está disponible. Mientras tanto usa exportar/importar copia de seguridad.'));
  sec('Acerca de');
  item('Notas', 'Funciona sin conexión. Los datos se guardan solo en este dispositivo.', () => {});
}
function pickFile(accept, multiple, fn) {
  const f = $('fileIn'); f.accept = accept; f.multiple = multiple; f.removeAttribute('capture');
  f.onchange = () => { const files = [...f.files]; f.value = ''; if (files.length) fn(files); }; f.click();
}
function exportBackup() {
  const data = { app: 'notas', version: 2, exported: Date.now(), folders: S.folders, notes: S.notes };
  download(`notas-copia-${new Date().toISOString().slice(0, 10)}.json`, new Blob([JSON.stringify(data, (k, v) => (k[0] === '_' ? undefined : v))], { type: 'application/json' }));
}
async function importBackup([file]) {
  try {
    const d = JSON.parse(await file.text()); if (!Array.isArray(d.notes)) throw 0;
    let add = 0, upd = 0;
    for (const f of d.folders || []) if (f.id && !folderById(f.id)) { S.folders.push(f); await DB.put('folders', f); }
    for (const raw of d.notes) {
      if (!raw || !raw.id) continue;
      const n = Object.assign(newNote(raw.type || 'text'), raw), old = S.notes.find(x => x.id === n.id);
      if (old && old.updated >= n.updated) continue;
      if (old) { S.notes[S.notes.indexOf(old)] = n; upd++; } else { S.notes.push(n); add++; }
      await DB.put('notes', n);
    }
    toast(`Importadas: ${add} nuevas, ${upd} actualizadas`);
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

/* ============ Arranque ============ */
function wire() {
  setIcons();
  $('addBtn').onclick = newMenu; $('moreBtn').onclick = mainMenu;
  $('folderBtn').onclick = () => pickFolder();
  $('searchBtn').onclick = () => { const b = $('searchBar'); b.hidden = !b.hidden; if (b.hidden) { S.q = ''; $('searchInput').value = ''; renderMain(); } else $('searchInput').focus(); };
  $('searchInput').oninput = e => { S.q = e.target.value; renderMain(); };
  $('selClose').onclick = endSel;
  $('selAll').onclick = () => { visibleNotes().forEach(n => S.sel.add(n.id)); renderMain(); };
  $('selDel').onclick = async () => { const ns = S.notes.filter(n => S.sel.has(n.id)); endSel(); await trashNotes(ns); renderMain(); };
  $('selMove').onclick = async () => { const f = await pickFolder(true); if (!f) return; for (const n of S.notes.filter(n => S.sel.has(n.id))) { n.folder = f; await persist(n); } endSel(); toast('Notas movidas a ' + folderName(f)); };

  $('edBack').onclick = closeScreen; $('fdBack').onclick = closeScreen; $('stBack').onclick = closeScreen;
  $('edMore').onclick = editorMenu; $('edShare').onclick = shareNote;
  $('edDel').onclick = async () => {
    const n = S.cur;
    if (n.deleted) { if (!(await confirmD('¿Eliminar definitivamente esta nota?'))) return; S.notes = S.notes.filter(x => x !== n); await DB.del('notes', n.id); closeScreen(); return; }
    if (isEmpty(n)) { closeScreen(); return; }
    n.deleted = Date.now(); await persist(n); closeScreen();
    toast('Nota movida a la papelera', 'Deshacer', async () => { n.deleted = null; await persist(n); renderMain(); });
  };
  $('edText').oninput = onRichInput;
  $('edText').addEventListener('paste', onRichPaste);
  document.addEventListener('selectionchange', onSelChange);
  buildFmtBar();
  const caretLink = () => {
    const t = $('edText'), b = $('linkBtn'), sel = getSelection();
    if (t.hidden || !sel.rangeCount || sel.anchorNode.nodeType !== 3 || !t.contains(sel.anchorNode)) { b.hidden = true; return; }
    const p = sel.anchorOffset, l = findLinks(sel.anchorNode.data).find(l => p >= l.s && p <= l.e);
    if (l) { b.textContent = 'Abrir enlace: ' + l.v; b.onclick = () => openLink(l); b.hidden = false; } else b.hidden = true;
  };
  for (const ev of ['click', 'keyup']) $('edText').addEventListener(ev, caretLink);
  $('edText').addEventListener('blur', () => setTimeout(() => $('linkBtn').hidden = true, 250));
  document.querySelectorAll('.tabs button').forEach(b => b.onclick = () => { S.tab = b.dataset.t; drawChecks(); });
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
  document.addEventListener('visibilitychange', () => { if (document.hidden) flush().catch(() => {}); else checkReminders(); });
  addEventListener('pagehide', () => flush().catch(() => {}));
}

async function init() {
  wire();
  document.documentElement.dataset.theme = settings.theme;
  history.replaceState({ s: 'main' }, ''); history.pushState({ s: 'main' }, '');   // evita salir de la app con el primer "atrás"
  try {
    await DB.open();
    S.notes = await DB.all('notes'); S.folders = await DB.all('folders');
    if (!S.folders.some(f => f.id === 'main')) { const m = { id: 'main', name: 'Carpeta principal', parent: null }; S.folders.push(m); await DB.put('folders', m); }
    const lim = Date.now() - TRASH_DAYS * 864e5;
    for (const n of S.notes.filter(n => n.deleted && n.deleted < lim)) await DB.del('notes', n.id);
    S.notes = S.notes.filter(n => !n.deleted || n.deleted >= lim);
  } catch (e) { toast('Error al abrir el almacenamiento: ' + e.message); }
  renderMain();
  // texto recibido desde otras apps (share target)
  const p = new URLSearchParams(location.search);
  if (p.has('text') || p.has('title') || p.has('url')) {
    const n = newNote('text'); n.body = [p.get('title'), p.get('text'), p.get('url')].filter(Boolean).join('\n'); await persist(n);
    history.replaceState({ s: 'main' }, '', location.pathname); renderMain(); toast('Nota creada desde otra app');
  }
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist();
  checkReminders(); setInterval(checkReminders, 30000);
}
init();
