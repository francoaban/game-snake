# Registro de cambios

Todos los cambios relevantes de este proyecto se documentan aquí.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa [Versionado Semántico](https://semver.org/lang/es/).

## [Sin publicar]

### Agregado

- Núcleo del juego como funciones puras en `game/engine.js`, independiente del DOM.
- Recuperación de la partida en curso al reabrir el popup (`storage.session`), siempre en pausa.
- Cola de hasta 2 giros para no perder pulsaciones rápidas.
- Las flechas inician la partida; Espacio pausa, reanuda o inicia.
- Íconos provisionales (`icons/`).
- Pruebas unitarias con `node --test` (movimiento, comida, colisiones, cola de giros, récord y sesión).
- Herramientas de desarrollo: ESLint, Prettier, EditorConfig y web-ext.
- Integración continua con GitHub Actions y plantillas de issues y pull requests.
- Documentación en `docs/`: privacidad, plan de pruebas y notas de publicación.

### Cambiado

- El código pasó de scripts globales (`window.SnakeGame`) a módulos ES.
- `popup.js` solo gestiona eventos, temporizador y renderizado.
- Los textos y el estado de los botones se derivan de la fase del juego.
- El récord cargado al abrir nunca pisa un valor mayor ya obtenido.
- `manifest.json`: se agregan `browser_specific_settings.gecko` (id, versión mínima y `data_collection_permissions`) y los íconos.
- El README refleja el estado real del proyecto.

### Corregido

- El botón de pausa quedaba como "Continuar" después de reanudar.
- Textos contradictorios entre el estado, "Iniciar" y "Jugar otra vez".
- Ctrl/Cmd/Alt + P o R disparaban la pausa o el reinicio.
- Espacio o Enter reactivaban el último botón pulsado.
- `roundRect` ya no exige Firefox 112: hay alternativa con `rect`.
