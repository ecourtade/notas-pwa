'use strict';
/* Interoperabilidad con los backups ZIP de Note Everything (manualbackup_*.zip).
   Se carga solo cuando se usa. Requiere lib/fflate.js, lib/sql-wasm.js(+.wasm) y lib/ne_template.bin. */
const NE = {
  ROOT: '►', TRASH: '▼',
  PRIO_COLOR: { 1: '#4a8af0', 2: '#00e5ff', 4: '#ffee00', 5: '#ef5350' },
  libs: null,
  loadLibs() {
    if (!this.libs) this.libs = (async () => {
      await loadScript('lib/fflate.js'); await loadScript('lib/sql-wasm.js');
      this.SQL = await initSqlJs({ locateFile: f => 'lib/' + f });
    })().catch(e => { this.libs = null; throw e; });
    return this.libs;
  },
};
const q = (db, sql, params) => { const st = db.prepare(sql), rows = []; if (params) st.bind(params); while (st.step()) rows.push(st.getAsObject()); st.free(); return rows; };
const baseName = p => String(p || '').split('/').pop();
const MIME = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', '3gp': 'audio/3gpp', '3gpp': 'audio/3gpp', m4a: 'audio/mp4', mp4: 'audio/mp4', wav: 'audio/wav', amr: 'audio/amr' };
const bytesToDataURL = (bytes, type) => new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(new Blob([bytes], { type })); });
const dataURLToBytes = u => { const [h, b] = u.split(','); return { type: (/data:([^;]+)/.exec(h) || [])[1] || '', bytes: Uint8Array.from(atob(b), c => c.charCodeAt(0)) }; };
const looksBinary = b => typeof b === 'string' && (b.includes('\u0000') || b.startsWith('PK\u0003\u0004') || b.startsWith('SQLite format 3'));

/* ---------------- Importar ---------------- */
function neFolderId(path) {
  if (!path || path === NE.ROOT || path === NE.TRASH) return 'main';
  const id = 'ne:' + path;
  if (!folderById(id)) {
    const i = path.lastIndexOf(NE.ROOT), parent = i > 0 ? path.slice(0, i) : NE.ROOT;
    const f = { id, name: path.slice(i + 1) || 'Carpeta', parent: neFolderId(parent) === 'main' ? null : neFolderId(parent) };
    S.folders.push(f); NE._newFolders.push(f);
  }
  return id;
}

async function neImport([file]) {
  try {
    toast('Leyendo la copia…'); await NE.loadLibs();
    const raw = fflate.unzipSync(new Uint8Array(await file.arrayBuffer())), zip = {};
    for (const k in raw) zip[k.replace(/^\/+/, '')] = raw[k];      // los backups de Note Everything llevan una barra inicial (/paintings/…)
    if (!zip['notes.db']) throw new Error('el ZIP no contiene notes.db: ¿es una copia de Note Everything?');
    const db = new NE.SQL.Database(zip['notes.db']);
    const rows = q(db, 'select * from Notes where is_folder=0 order by _id');
    const folderRows = q(db, 'select folder from Notes where is_folder=1');
    const items = q(db, 'select note_id,item_text,checked from ChecklistItems order by note_id, sort_order, _id');
    const st = { total: rows.length, trash: rows.filter(r => r.folder === NE.TRASH).length, enc: rows.filter(r => r.encrypted).length, bin: rows.filter(r => looksBinary(r.body)).length };
    const chk = el('input', { type: 'checkbox', checked: st.trash > 0, style: 'width:auto' });
    const body = el('div', {}, el('p', { textContent: `Se encontraron ${st.total} notas.\n• ${st.trash} están en la papelera.\n• ${st.enc} cifradas (no se pueden importar).\n• ${st.bin} son archivos binarios guardados por error como nota (se omiten).` }),
      st.trash ? el('label', { style: 'display:flex;gap:8px;align-items:center;margin-top:8px' }, chk, `Incluir las ${st.trash} notas de la papelera`) : null);
    const ok = await dialog('Importar desde Note Everything', body, [{ t: 'Cancelar', v: null }, { t: 'Importar', v: true }]);
    if (!ok) { toast('Importación cancelada'); return; }
    const withTrash = chk.checked;
    NE._newFolders = [];
    for (const f of folderRows) neFolderId(f.folder);
    const byNote = new Map(); for (const it of items) { if (!byNote.has(it.note_id)) byNote.set(it.note_id, []); byNote.get(it.note_id).push(it); }

    const res = { add: 0, upd: 0, same: 0, enc: 0, bin: 0, trash: 0, unsup: 0, nomedia: 0 };
    let i = 0;
    for (const r of rows) {
      if (++i % 40 === 0) { toast(`Importando… ${i}/${rows.length}`); await sleep(0); }
      if (r.encrypted) { res.enc++; continue; }
      if (looksBinary(r.body)) { res.bin++; continue; }
      const trashed = r.folder === NE.TRASH;
      if (trashed && !withTrash) { res.trash++; continue; }
      const n = newNote('text', trashed ? 'main' : neFolderId(r.folder));
      n.id = `ne:${r._id}:${r.created_at}`; n.created = r.created_at || Date.now(); n.updated = r.modified_at || n.created;
      n.color = NE.PRIO_COLOR[r.priority] || ''; n.reminder = r.reminder > 0 ? r.reminder : null; n.fired = !!n.reminder && n.reminder < Date.now();
      if (trashed) n.deleted = Date.now();
      const title = (r.title || '').trim(), text = r.body || '';
      const media = r.data_uri ? zip[baseNameDir(r.data_uri)] : null;
      switch (r.type) {
        case 0: {
          n.body = !title || text.trimStart().startsWith(title) ? (text || title) : (text ? title + '\n' + text : title);
          n.neT = r.title || ''; n.neB = text; n.neSrc = n.body;      // original, para devolverlo idéntico al exportar si no se edita
          if (title && n.body !== text && text) n.html = `<div><b>${escHtml(title)}</b></div>` + text.split('\n').map(l => `<div>${l ? escHtml(l) : '<br>'}</div>`).join('');
          break;
        }
        case 4: case 5:
          n.type = 'check'; n.title = title || 'Lista de tareas'; n.items = (byNote.get(r._id) || []).map(it => ({ t: it.item_text || '', done: it.checked === 1 }));
          break;
        case 1:
          n.type = 'voice'; n.title = title || 'Nota de voz'; n.body = text;
          if (media) n.media = await bytesToDataURL(media, MIME[(baseName(r.data_uri).split('.').pop() || '').toLowerCase()] || 'audio/3gpp'); else res.nomedia++;
          break;
        case 2:
          n.type = 'draw'; n.title = title || 'Dibujo'; n.strokes = [];
          if (media) n.bg = await bytesToDataURL(media, 'image/png'); else res.nomedia++;
          break;
        case 3:
          n.type = 'photo'; n.title = title || 'Foto'; n.body = text;
          if (media) { try { n.media = await shrinkImage(new Blob([media], { type: 'image/jpeg' })); } catch (e) { n.media = await bytesToDataURL(media, 'image/jpeg'); } } else res.nomedia++;
          break;
        default:   // vídeo (8), galería (6) u otros: se conserva el texto y se avisa
          n.body = (title ? title + '\n' : '') + text + `\n[Nota de tipo "${r.type === 8 ? 'vídeo' : r.type === 6 ? 'galería' : r.type}" de Note Everything: el contenido multimedia no se importa]`;
          res.unsup++;
      }
      const old = S.notes.find(x => x.id === n.id);
      if (old && old.updated >= n.updated) { res.same++; continue; }
      if (old) { S.notes = S.notes.filter(x => x !== old); res.upd++; } else res.add++;
      await persist(n);
    }
    for (const f of NE._newFolders) await DB.put('folders', f);
    try { await runBackup(true, true); markCount(); } catch (e) {}    // red de seguridad: copia justo tras importar
    renderMain();
    await info('Importación terminada', `Nuevas: ${res.add}\nActualizadas: ${res.upd}\nYa estaban al día: ${res.same}\nCarpetas creadas: ${NE._newFolders.length}\n\nOmitidas: ${res.enc} cifradas, ${res.bin} binarias${withTrash ? '' : ', ' + res.trash + ' de la papelera'}.\nSin multimedia: ${res.nomedia}. Tipo no soportado (vídeo/galería): ${res.unsup}.`);
  } catch (e) { console.error(e); toast('No se pudo importar: ' + e.message); }
}
// las rutas del ZIP son "paintings/paintingNNN.png": se reconstruyen desde la ruta del content://
function baseNameDir(uri) { const p = String(uri).split('/'); return p.slice(-2).join('/'); }

/* ---------------- Exportar ---------------- */
async function renderDrawPNG(n) {
  const bg = n.bg ? await new Promise(r => { const im = new Image(); im.onload = () => r(im); im.onerror = () => r(null); im.src = n.bg; }) : null;
  const W = bg ? bg.naturalWidth : 1080;
  let maxY = 0; for (const s of n.strokes || []) for (const p of s.p) maxY = Math.max(maxY, p[1]);
  const H = bg ? bg.naturalHeight : Math.round(Math.max(W * 1.78, maxY * W + 40));
  const c = el('canvas', { width: W, height: H });
  paintDrawing(c.getContext('2d'), n, bg, W, H, W);
  return new Promise(r => c.toBlob(async b => r(new Uint8Array(await b.arrayBuffer())), 'image/png'));
}
async function neExport() {
  try {
    const go = await dialog('Exportar para Note Everything', el('p', { textContent: 'Se creará un archivo manualbackup_….zip con todas tus notas.\n\nIMPORTANTE: al restaurarlo en Note Everything se REEMPLAZAN todas las notas que tenga esa app. Para no perder nada, importa primero su copia actual aquí (Importar desde Note Everything) y exporta después.\n\nNo se exportan las notas cifradas. El formato de texto enriquecido se convierte en texto plano.' }), [{ t: 'Cancelar', v: null }, { t: 'Crear ZIP', v: true }]);
    if (!go) return;
    toast('Preparando la copia…'); await NE.loadLibs();
    const tpl = new Uint8Array(await (await fetch('lib/ne_template.bin')).arrayBuffer());
    const db = new NE.SQL.Database(tpl);
    const files = { 'version215.code': new Uint8Array([215]) };
    let id = 2;
    // carpetas
    const pathOf = f => { const names = []; for (let x = f; x; x = x.parent ? folderById(x.parent) : null) names.unshift(x.name); return NE.ROOT + names.join(NE.ROOT); };
    const folderPath = fid => (!fid || fid === 'main' || !folderById(fid)) ? NE.ROOT : pathOf(folderById(fid));
    const insF = db.prepare('INSERT INTO Notes (_id, folder, is_folder, cursor_pos, chklst_sort_order, priority) VALUES (?,?,1,-1,-1,0)');
    for (const f of S.folders) if (f.id !== 'main') insF.run([id++, pathOf(f)]);
    insF.free();
    const ins = db.prepare('INSERT INTO Notes (_id,title,type,data_uri,body,reminder,created_at,modified_at,folder,is_folder,cursor_pos,chklst_sort_order,priority) VALUES (?,?,?,?,?,?,?,?,?,0,-1,?,?)');
    const insC = db.prepare('INSERT INTO ChecklistItems (note_id,item_text,checked,created_at,modified_at,sort_order,priority) VALUES (?,?,?,?,?,?,0)');
    const AUTH = 'content://de.softxperience.android.noteeverything.files/';
    const prio = c => +Object.keys(NE.PRIO_COLOR).find(k => NE.PRIO_COLOR[k] === c) || 0;
    const sk = { enc: 0, nomedia: 0 }; let count = 0;
    for (const n of S.notes) {
      if (n.enc) { sk.enc++; continue; }
      const nid = id++, folder = n.deleted ? NE.TRASH : folderPath(n.folder), pr = prio(n.color);
      let type = 0, uri = null, title = noteTitle(n), body = n.body || '', cso = -1;
      if (n.type === 'check') {
        type = 5; body = ''; cso = 10; title = n.title || 'Lista de tareas';
        n.items.forEach((it, k) => insC.run([nid, it.t, it.done ? 1 : 0, n.created, n.updated, k + 1]));
      } else if (n.type === 'draw') {
        type = 2; title = n.title || 'Dibujo'; body = '';
        const fn = `painting${nid}.png`; files['/paintings/' + fn] = await renderDrawPNG(n); uri = AUTH + 'paintings/' + fn;
      } else if (n.type === 'photo' && n.media) {
        type = 3; title = n.title || 'Foto'; const fn = `photo${nid}.jpg`; files['/photos/' + fn] = dataURLToBytes(n.media).bytes; uri = AUTH + 'photos/' + fn;
      } else if (n.type === 'voice' && n.media) {
        type = 1; title = n.title || 'Nota de voz'; const fn = `voice${nid}.3gp`; files['/voices/' + fn] = dataURLToBytes(n.media).bytes; uri = AUTH + 'voices/' + fn;
      } else {
        if (n.type === 'photo' || n.type === 'voice') { sk.nomedia++; title = n.title || title; }
        else if (n.neT !== undefined && n.neSrc === n.body) { title = n.neT; body = n.neB; }
        else { const lines = body.split('\n'), first = lines.findIndex(l => l.trim()); if (first >= 0 && lines[first].trim().slice(0, 80) === title) body = lines.slice(first + 1).join('\n').replace(/^\n/, ''); }
      }
      ins.run([nid, title, type, uri, body, n.reminder || null, n.created, n.updated, folder, cso, pr]); count++;
    }
    ins.free(); insC.free();
    files['notes.db'] = db.export(); db.close();
    const zipped = fflate.zipSync(files, { level: 6 });
    const d = new Date(), p2 = v => String(v).padStart(2, '0');
    download(`manualbackup_${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}_${p2(d.getHours())}${p2(d.getMinutes())}${p2(d.getSeconds())}.zip`, new Blob([zipped], { type: 'application/zip' }));
    await info('Copia creada', `Notas exportadas: ${count}\nOmitidas (cifradas): ${sk.enc}\nSin archivo multimedia (pasadas a texto): ${sk.nomedia}\n\nCópiala a tu celular y restáurala desde Note Everything (menú de copias de seguridad). Las notas de voz se guardan con el formato de este navegador; si Note Everything no las reproduce, el texto y el título se conservan.`);
  } catch (e) { console.error(e); toast('No se pudo exportar: ' + e.message); }
}
