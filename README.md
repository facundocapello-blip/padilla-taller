# Padilla · Taller y Presupuestos

App web instalable para herrería y trabajos del hogar, con presupuestos Clickie/directos, catálogo de materiales y Taller con plan de cortes.

**Web:** https://facundocapello-blip.github.io/padilla-taller/

HTML único con JavaScript vanilla y fuente Archivo local; no requiere compilación ni backend. GitHub Pages sirve la raíz de `main`. Mantener `index.html`, `archivo.woff2`, `manifest.webmanifest`, `sw.js` y los iconos juntos. `.nojekyll` permite servir estos archivos directamente.

Los datos se guardan en el navegador de cada persona; no se comparten ni sincronizan entre celulares. Usar **Ajustes → Descargar copia** antes de cambiar de navegador, dispositivo u origen.

Los precios de catálogo son orientativos hasta cargar precios propios. Los materiales nuevos sin cotización aparecen con precio 0 pendiente: no significa que sean gratis. Los estándares todavía no confirmados están señalados en la app y en [el informe de validación](docs/validacion-mejoras.md).

## Desarrollo

```sh
python3 -m http.server 3000 --bind 0.0.0.0
```

Para instalar como PWA y usar sin conexión se requiere HTTPS o localhost. La primera carga necesita conexión para preparar la caché.

## Verificación

En el entorno de desarrollo con Node, Playwright y Chromium disponibles:

```sh
node --test tests/*.test.cjs
node tests/mejoras.browser.cjs
```

Los tests de navegador cubren móvil y escritorio, uso sin conexión, recorrido de presupuesto, cortes y copias de seguridad. No son dependencias de la aplicación publicada.
