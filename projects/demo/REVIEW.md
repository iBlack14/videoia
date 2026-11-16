# Revisión del primer borrador

- Tema: web y seguridad de la información, elegido por el usuario.
- Duración: 26 s; formato 1080 × 1920; 30 fps.
- Guion: HTTPS cifra la conexión; no demuestra honestidad del sitio.
- Voz: Microsoft Sabina, generada localmente mediante SAPI.
- Validación HyperFrames: resultado `ok: true`, sin hallazgos.
- Inspección visual: fotogramas a 1, 8, 15, 23 y 25.75 segundos; texto completo, contraste legible y sin recortes.
- Diseño tipográfico de prueba; no utiliza imágenes, avatares, stock ni música.
- SRT temporizado por escena, sin sincronización por palabra.
- No se ha publicado ni vinculado ninguna cuenta.

Primera versión: MP4 verificado de 26 segundos, H.264/AAC.

## Segunda versión: recursos animados e interactividad

- Navegador ficticio, candados SVG, cursor con clic, alerta, paquetes de datos, comparación de dominios y apertura de app oficial.
- Recursos originales de SVG/CSS; GSAP local; sin descargas de stock ni llamadas a servicios de pago.
- Validación HyperFrames: `ok: true`, sin hallazgos tras corregir márgenes y las partículas decorativas.
- Revisados fotogramas a 3, 10, 17, 23 y 25.75 segundos.
- Página HTML con quiz, feedback, reinicio, silencio y velocidad. Verificadas las respuestas correcta/incorrecta, el reinicio, el cambio de velocidad y el silencio en Chrome mediante Playwright.
- Las interacciones del MP4 son simuladas; la página HTML admite clics reales.
- MP4 animado exportado y verificado: 26.000 segundos, 1080 × 1920, H.264 + AAC, 2.415.129 bytes. El reproductor HTML cargó el archivo y mostró correctamente el fotograma a los 10 segundos.
