# VIDEOIA local

Base de producción sin suscripciones ni llamadas a APIs de pago. Usa recursos del PC y descargas gratuitas. No hay cuentas vinculadas ni publicaciones automáticas configuradas.

## Estado

Primer video sobre web y seguridad de la información: HTTPS no garantiza que una web sea confiable. Texto animado HTML vertical, voz española local Microsoft Sabina y subtítulos por escena. Los diez roles están definidos en `agents/ROLES.md`; no son diez procesos autónomos ejecutándose.

## Uso

Voz actual: **Alex Neural, masculina, español de Perú**, usando `edge-tts`. Es gratuita sin clave de API y necesita internet. `./scripts/voice.ps1` ahora usa esta voz; `./scripts/voice.ps1 -Offline` conserva la alternativa antigua de SAPI. La voz seleccionada y el proveedor se registran en `voice-provider.json`. Instalar dependencia con `python -m pip install edge-tts`.

FFmpeg y FFprobe también están instalados en `%LOCALAPPDATA%/Programs/VideoIA/bin`, añadido al PATH del usuario. El lanzador añade esa carpeta a cada proceso; se reinició la vista previa para heredar la corrección.

Tercera versión: `node scripts/build-realistic.mjs` construye `projects/realista` con las capturas reales y originales de la mascota ya copiados en sus assets. Exportar con `npm run hf -- render projects/realista --output output/odiseacloud-realista.mp4 --quality draft --workers 2`. Procedencia en `projects/realista/ASSETS.json`.

Versión animada: `scripts/visuals.mjs` genera los recursos SVG/CSS y las animaciones del navegador, candado, cursor y conexión. `output/interactivo.html` acompaña a `seguridad-web-animado.mp4` con controles y un quiz; abrir ambos desde la misma carpeta. La plantilla editable está en `templates/interactivo.html`. El MP4 incluye interacciones simuladas; los clics reales funcionan en la página HTML.

Desde esta carpeta, `./scripts/create-video.ps1` genera voz, proyecto, revisión y MP4. Para revisar antes de exportar: `./scripts/create-video.ps1 -PreviewOnly`.

1. Editar `ideas/demo.json`.
2. Ejecutar `./scripts/voice.ps1` para generar voz sin conexión con SAPI de Windows.
3. Ejecutar `npm run demo` para crear HTML y SRT; calcula las duraciones a partir de los WAV.
4. Ejecutar `npm run hf -- check projects/demo --json`.
5. Ejecutar `npm run hf -- preview projects/demo --background` para editar en el navegador.
6. Ejecutar `npm run hf -- render projects/demo --output output/seguridad-web.mp4 --quality draft --workers 2`.

El lanzador usa Node 22 incluido en Playwright de Python, o `VIDEOIA_NODE` si se define. FFmpeg procede de `imageio-ffmpeg` (`python -m pip install imageio-ffmpeg`); ffprobe está en `tools/ffprobe.exe`, descargado del release b6.0 de https://github.com/eugeneware/ffmpeg-static (build Gyan GPLv3). No usa las funciones cloud de HyperFrames. Las voces SAPI son menos naturales que Kokoro, pero funcionan con lo ya instalado y sin descargar un modelo. Los subtítulos SRT se temporizan por escena; aún no hay alineación palabra por palabra.

## Herramientas candidatas

| Proyecto | Uso | Condiciones |
|---|---|---|
| https://github.com/heygen-com/hyperframes | HTML/CSS a MP4 local | Apache-2.0; evitar funciones Pro y generación de pago |
| https://github.com/remotion-dev/remotion | Alternativa React a video | Revisar licencia comercial según equipo y uso |
| https://github.com/thewh1teagle/kokoro-onnx | Voz local, incluido español | Código MIT; modelo Kokoro Apache-2.0; requiere descargar pesos |
| https://github.com/hexgrad/kokoro | Modelo de voz | Apache-2.0 |
| https://github.com/SYSTRAN/faster-whisper | Subtítulos locales | MIT; descargar modelo; comprobar compatibilidad Python |
| https://github.com/ggml-org/whisper.cpp | Alternativa de transcripción | MIT; binario y modelo local |
| https://github.com/OHF-Voice/piper1-gpl | Alternativa voz | GPL-3.0; revisar licencia de cada voz |
| https://github.com/googleapis/google-api-python-client | Publicación oficial YouTube | OAuth, cuotas y configuración de proyecto |

## Flujo previsto

Idea propia → guion → revisión → escenas → voz → montaje HTML → subtítulos → MP4 → revisión visual → publicación → métricas.

No se necesita un proveedor de generación de imágenes para videos tipográficos, explicaciones, datos o material propio. Voz, transcripción y publicación se integrarán después del render básico.

## Publicación sin suscripciones

Exportar el MP4 y subirlo con las herramientas nativas es la primera vía. Automatizar requiere OAuth y permisos oficiales. No guardar contraseñas en el repositorio. YouTube usa cuotas; TikTok limita las apps sin auditoría a contenido privado y restringe utilitarios para cuentas propias. Instagram requiere cuentas y permisos compatibles. No se promete publicación pública automática hasta verificar cada cuenta.

Fuentes: https://developers.tiktok.com/doc/content-sharing-guidelines/ y https://developers.google.com/youtube/v3/docs/videos/insert
