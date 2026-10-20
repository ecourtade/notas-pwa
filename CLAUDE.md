# Notas_EnPlus

> Desde el 2026-10-20 la app se muestra al usuario como **«Audio Manager»** (camuflaje: nombre, icono de ecualizador, notas cifradas sin candado y en una lista oculta: mantener pulsado 3 s el título «Audio Manager»). Internamente y en los repos sigue llamándose Notas_EnPlus. No revelar en la interfaz que son notas.

PWA de notas tipo Note Everything (HTML/CSS/JS sin compilación). App publicada en GitHub Pages desde este repo.

**Para retomar rápido lee solo `docs/CONTINUAR.md`** (estado, pendientes, comandos y trampas; es corto). Abre `docs/MEMORIA.md` solo si necesitas el detalle de una zona, y no leas `app.js` entero (usa `grep`).

**Antes de trabajar a fondo lee `docs/MEMORIA.md`** (repo privado `notas-enplus-docs`, clonado en `docs/`; si falta: `git clone https://github.com/ecourtade/notas-enplus-docs.git docs`).
Al terminar un cambio, actualiza `docs/CHANGELOG.md` y la sección afectada de `docs/MEMORIA.md`, y haz commit y push en ambos repos.

## Reglas del proyecto
- Responder y escribir la interfaz en **español**.
- Hacer `git add` solo de archivos concretos, nunca `git add .`. No subir nunca: `*.zip`, `*.db`, `*.apk`, `Credenciales*` ni datos personales (correos, teléfonos, claves).
- Si cambia la lista de archivos de la app, subir `CACHE` en `sw.js`.
- Servidor local solo en `127.0.0.1` (puerto 8080); para WebAuthn usar `localhost`.
- Probar con Chrome headless + `playwright-core` (ver `docs/MEMORIA.md` §4) antes de publicar.
- Acciones externas o difíciles de revertir (cambiar visibilidad de repos, publicar, borrar datos): confirmar con el usuario.
- No usar el código del APK de Note Everything: solo se estudió su formato de datos.

## Guía rápida para el usuario: instalar la app y activar la carpeta espejo en un PC (por ejemplo el personal)

Hazlo en Chrome o Edge con **tu perfil personal** (no en un PC compartido o del trabajo).

1. **Instalar la app:** abre `https://ecourtade.github.io/notas-pwa/` y pulsa el icono de instalar de la barra de direcciones (o menú ⋮ → *Transmitir, guardar y compartir* → *Instalar página como aplicación*). Se abre en su propia ventana.
2. **Conectar con Google Drive:** en la app, botón de sincronizar (flechas circulares) → pega tu **ID de cliente de Google** (consola de Google Cloud, proyecto *Notas_EnPlus* → Google Auth Platform → Clientes). Elige tu cuenta y acepta. En *Ajustes* puedes escribir tu correo en "Correo de Google para sincronizar". Tus notas se descargan solas desde Drive.
3. **Crear la carpeta:** en el Explorador de Windows crea una carpeta normal, por ejemplo `Documentos\Notas_EnPlus` (nunca dentro del perfil de Chrome).
4. **Activar la carpeta espejo:** en la app → *Ajustes* → sección **Protección de los datos** → **Carpeta espejo en el PC (recomendado)** → **Elegir la carpeta** → selecciona la carpeta del paso 3 → acepta el permiso de Chrome para editar archivos.
5. **Comprobar:** tras unos segundos aparece dentro la subcarpeta `notas` con un archivo `.json` por nota (las cifradas van cifradas). Desde entonces se actualiza sola con cada cambio.
6. **Opcional, copia diaria:** *Ajustes* → **Copia JSON diaria** → *Guardar en una carpeta del PC* → elige la **misma** carpeta (los archivos no se pisan). Ahí también se eligen la hora, la frecuencia y cuántas copias conservar (7 = se borra la más antigua; *Todas* = nunca borrar).

Detalles: Chrome puede volver a pedir el permiso cada vez que abres la app (se concede con el primer toque). Si el navegador pierde sus datos, vuelve a elegir esa misma carpeta y la app ofrece restaurar las notas (o *Ajustes → Carpeta espejo → Restaurar desde la carpeta*). Esta carpeta no sustituye a Drive: son capas distintas. En Android (Chrome reciente) también se puede elegir una carpeta (por ejemplo una subcarpeta de Documentos): el aviso de permiso aparece solo al tocar el aviso 🔒 de la pantalla principal, una vez por copia. Si el navegador no permite carpetas, protegen Drive y la copia JSON en *Descargas*.

### Dejar un PC sin tus notas (PC del trabajo o compartido)
1. En la app: *Ajustes* → **Cerrar sesión de Google**.
2. Desinstalar la app (Chrome: ⋮ de la ventana de la app → *Desinstalar…*) **marcando "Quitar datos de esta aplicación de Chrome"**.
3. Comprobar en `chrome://settings/content/all` que ya no aparece `ecourtade.github.io`; si aparece, eliminar sus datos.
4. Si se había elegido una carpeta espejo o de copias en ese PC, borrarla.
5. Antes de borrar nada, comprobar que las notas están en Drive y en el otro dispositivo (botón de sincronizar).
Archivos que pueden contener notas y **no deben quedarse** en un PC ajeno: backups ZIP de Note Everything (`manualbackup_*.zip`), exportaciones `.json` de copia, carpeta espejo.
