# Notas_EnPlus

PWA de notas tipo Note Everything (HTML/CSS/JS sin compilación). App publicada en GitHub Pages desde este repo.

**Antes de trabajar lee `docs/MEMORIA.md`** (repo privado `notas-enplus-docs`, clonado en `docs/`; si falta: `git clone https://github.com/ecourtade/notas-enplus-docs.git docs`).
Al terminar un cambio, actualiza `docs/CHANGELOG.md` y la sección afectada de `docs/MEMORIA.md`, y haz commit y push en ambos repos.

## Reglas del proyecto
- Responder y escribir la interfaz en **español**.
- Hacer `git add` solo de archivos concretos, nunca `git add .`. No subir nunca: `*.zip`, `*.db`, `*.apk`, `Credenciales*` ni datos personales (correos, teléfonos, claves).
- Si cambia la lista de archivos de la app, subir `CACHE` en `sw.js`.
- Servidor local solo en `127.0.0.1` (puerto 8080); para WebAuthn usar `localhost`.
- Probar con Chrome headless + `playwright-core` (ver `docs/MEMORIA.md` §4) antes de publicar.
- Acciones externas o difíciles de revertir (cambiar visibilidad de repos, publicar, borrar datos): confirmar con el usuario.
- No usar el código del APK de Note Everything: solo se estudió su formato de datos.
