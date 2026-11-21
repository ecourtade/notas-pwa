// Copia los archivos de la PWA (carpeta superior) a www/ para empaquetarlos en el APK.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), out = path.join(__dirname, 'www');
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
const files = ['index.html', 'style.css', 'app.js', 'ne.js', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];
for (const f of files) fs.copyFileSync(path.join(root, f), path.join(out, f));
fs.cpSync(path.join(root, 'lib'), path.join(out, 'lib'), { recursive: true });
fs.copyFileSync(path.join(__dirname, 'native-bridge.js'), path.join(out, 'native-bridge.js'));
const ix = path.join(out, 'index.html'); let h = fs.readFileSync(ix, 'utf8');
if (!/src="app\.js[^"]*"><\/script>/.test(h)) throw new Error('No encuentro <script src="app.js"> en index.html');
h = h.replace(/(<script[^>]*src="app\.js[^"]*"[^>]*><\/script>)/, '$1<script src="native-bridge.js"></script>');
fs.writeFileSync(ix, h);
console.log('www listo:', fs.readdirSync(out).join(', '));
