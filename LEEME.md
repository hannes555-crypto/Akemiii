# Para Akemi · Una luz en la oscuridad

## Abrir
Descomprime el ZIP. Abre index.html y toca la llama: irá a birthday.html.
Mantén los cinco archivos del sitio en la misma carpeta.

## Archivos
- index.html: pantalla negra, frase y llama interactiva.
- birthday.html: pastel, celebración y sobre con carta.
- styles.css: estilos separados, transición de luz y animación del sobre.
- app.js: dibujo en Canvas, fuego, partículas, navegación, carta y música opcional.
- celebration.js: confeti lateral, elección de la carta, fuego fluido, ojos y rotura de pantalla.

## Actualizar GitHub
Reemplaza los archivos anteriores por index.html, birthday.html, styles.css, app.js y celebration.js en la carpeta publicada del repositorio. Sube los archivos descomprimidos. Conserva los cinco archivos juntos. La fuente ya está incluida dentro de styles.css. En esta versión debes subir también celebration.js.

## Carta
La carta ya contiene tu mensaje para Akemi, con ortografía y puntuación corregidas. Usa una sola fuente caligráfica cursiva, incrustada directamente en styles.css, para el título, los párrafos, el encabezado y el sobre. La copia y licencia de la fuente se conservan en fonts. Su contenido está en HTML y se restaura desde los párrafos al abrirla, también después de las dos quemas. El corazón al final es ahora una ilustración en rosa con una animación suave. Puedes editar los párrafos en LETTER_PARAGRAPHS, al principio de app.js.

## Si no aparecen la celebración o los botones
Reemplaza TODOS los archivos del sitio, especialmente birthday.html: subir celebration.js solo no hace que un HTML antiguo lo utilice. Los cinco archivos deben estar juntos en la carpeta publicada.
Esta versión añade un identificador a las referencias CSS/JS para renovar la caché. Una vez publicados los cambios, recarga con Ctrl+F5. Si sigue igual, revisa que GitHub haya terminado de publicar el último cambio.

## Animación
La llama ya está encendida sobre un cielo oscuro. Al tocarla se expande la luz y se abre la segunda página. El pastel aparece con rayos, cuatro ráfagas de confeti y velitas animadas. A continuación aparece un sobre flotante y las opciones «Quemarla» y «Abrirla». Al quemarla, cae al fuego, se consume por píxeles y aparecen ojos y distorsiones, con grietas que nacen en cuatro puntos distintos, uno después del otro. Hay seis ojos en toda la secuencia, con aparición y desvanecimiento escalonados; como máximo coinciden tres. Tras la primera quema vuelven ambas opciones. Tras la segunda solo queda un botón grande para abrirla. El número de intentos se reinicia al recargar la página. La animación se puede saltar o cerrar con Escape, y cuenta como intento. Al abrir la carta se levanta la solapa y se muestra la hoja; se cierra con la cruz o Escape.

La música se activa voluntariamente en la segunda página. Se respeta la preferencia del dispositivo de reducir el movimiento.

## Verificación
Sintaxis de JavaScript, dibujo de Canvas, dos ciclos completos de quema, bloqueo del tercer intento y apertura/cierre final y conservación de los cuatro párrafos comprobados. Se comparó también la imagen de ambas quemas al mismo tiempo de animación y se comprobó que un cierre tardío de la primera no interrumpe la segunda, también con movimiento reducido. El diseño completo todavía no se ha verificado en un navegador real.
