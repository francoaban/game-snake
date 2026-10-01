# 🐍 Snake — Firefox Extension

Extensión para **Mozilla Firefox** que permite jugar al clásico **Snake** directamente desde el popup del navegador, sin abrir una página externa.

Está desarrollada con el estándar **WebExtensions** (Manifest V3) usando **HTML, CSS y JavaScript** sin dependencias en tiempo de ejecución. El objetivo es que sea fácil de entender, modificar y usar como proyecto educativo.

## Estado actual

Versión `0.1.0`, en desarrollo. Las mecánicas del juego, la interfaz, las pruebas automatizadas, el tooling y la integración continua están implementados. **Todavía falta verificar la extensión manualmente en Firefox**, definir los recursos gráficos finales y publicarla. Los hitos distinguen lo implementado de lo verificado.

---

## 📋 Descripción

El usuario abre la extensión desde la barra de herramientas y juega desde el popup. Debe controlar una serpiente, recoger comida y sumar puntos sin chocar contra las paredes ni contra su propio cuerpo.

### Características principales

- 🐍 Juego Snake ejecutado dentro de Firefox.
- 🎮 Controles con teclado y botones.
- 🍎 Comida generada siempre en una celda libre.
- 📊 Puntuación y 🏆 récord persistente.
- ⏸️ Pausa y 🔄 reinicio.
- 💾 Si el popup se cierra durante la partida, se recupera en pausa al reabrirlo.
- ⌨️ Cola de giros: las pulsaciones rápidas no se pierden.
- 🔒 Sin servidor, sin cuenta, sin recopilar datos personales y sin conexión a Internet.

---

# 🎯 Objetivo del proyecto

Desarrollar una extensión sencilla para Firefox con tecnologías web estándar. También sirve para aprender:

- HTML, CSS y JavaScript (módulos ES).
- WebExtensions y `manifest.json`.
- Canvas y manipulación del DOM.
- `storage.local` y `storage.session`.
- Separar la lógica del juego de la interfaz para poder probarla.
- Pruebas unitarias, lint y formato.
- Git, GitHub e integración continua.
- Publicación de extensiones.

---

# 🧩 Alcance

## Incluido en la primera versión

La versión `1.0.0` contempla:

1. Inicio del juego.
2. Movimiento de la serpiente.
3. Generación aleatoria de comida.
4. Incremento de puntuación.
5. Detección de colisiones.
6. Finalización de la partida.
7. Reinicio.
8. Pausa.
9. Guardado del mejor puntaje.
10. Interfaz para utilizar desde el navegador.

## Fuera del alcance inicial

- Usuarios, registro e inicio de sesión.
- Servidor backend y base de datos.
- Juego multijugador.
- Sincronización entre dispositivos.
- Publicidad, analítica y compras.
- Comunicación con servicios externos.

Esto mantiene la extensión pequeña, con pocos permisos y fácil de probar.

---

# 🛠️ Tecnologías

| Tecnología              | Uso                            |
| ----------------------- | ------------------------------ |
| HTML5                   | Estructura de la interfaz      |
| CSS3                    | Diseño visual                  |
| JavaScript (módulos ES) | Lógica del juego               |
| Canvas API              | Renderizado del tablero        |
| WebExtensions           | Integración con Firefox        |
| Manifest V3             | Configuración de la extensión  |
| `node:test`             | Pruebas unitarias              |
| ESLint y Prettier       | Calidad y formato del código   |
| web-ext                 | Validar, ejecutar y empaquetar |
| GitHub Actions          | Integración continua           |

---

# 📁 Estructura del proyecto

```text
game-snake/
├── manifest.json
├── package.json
├── web-ext-config.mjs
├── eslint.config.js
├── .prettierrc.json
├── .editorconfig
├── README.md
├── CHANGELOG.md
├── LICENSE
├── icons/                  # Íconos provisionales
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js            # Eventos, temporizador y renderizado
├── game/
│   ├── engine.js           # Reglas del juego (funciones puras)
│   ├── snake.js
│   ├── food.js
│   ├── collision.js
│   ├── board.js            # Dibujo en el canvas
│   ├── score.js            # Récord (storage.local)
│   └── session.js          # Partida en curso (storage.session)
├── test/                   # Pruebas unitarias
├── docs/
│   ├── privacidad.md
│   ├── plan-de-pruebas.md
│   └── publicacion.md
└── .github/                # CI y plantillas de issues y PR
```

---

# 🧱 Arquitectura

La lógica del juego no conoce el navegador. `engine.js` recibe un estado y devuelve un estado nuevo, sin tocar el DOM, temporizadores ni almacenamiento. Por eso puede probarse con Node, sin Firefox.

```text
┌────────────────────────────────────────────┐
│ popup.js  (eventos, temporizador, render)  │
└───────┬──────────────┬─────────────┬───────┘
        │              │             │
        ▼              ▼             ▼
  ┌──────────┐   ┌──────────┐   ┌───────────────────┐
  │ engine.js│   │ board.js │   │ score.js          │
  │ (puro)   │   │ (canvas) │   │ session.js        │
  └────┬─────┘   └──────────┘   │ (storage)         │
       │                        └───────────────────┘
       ▼
  snake.js · food.js · collision.js
```

### Fases del juego

```text
ready ──iniciar──▶ running ◀──continuar── paused
                     │  ▲                    ▲
                     │  └────reiniciar       └── pausar
                     ├──colisión──▶ over
                     └──tablero lleno──▶ won
```

`over` y `won` vuelven a `running` con una partida nueva al iniciar de nuevo.

---

# 📜 Manifest

Configuración principal (resumen):

```json
{
  "manifest_version": 3,
  "name": "Snake",
  "version": "0.1.0",
  "action": { "default_popup": "popup/popup.html" },
  "permissions": ["storage"],
  "browser_specific_settings": {
    "gecko": {
      "id": "game-snake@francoaban.github.io",
      "strict_min_version": "115.0",
      "data_collection_permissions": { "required": ["none"] }
    }
  }
}
```

El único permiso solicitado es `storage`. Se aplica el criterio de permisos mínimos. Consulta [`docs/publicacion.md`](docs/publicacion.md) para las advertencias esperadas de `web-ext lint` sobre `strict_min_version`.

---

# 🎮 Cómo jugar

1. Abre Firefox y haz clic en el ícono de **Snake**.
2. Pulsa **Iniciar** o cualquier flecha.
3. Recoge la comida sin chocar.

### Controles

| Tecla   | Acción                                              |
| ------- | --------------------------------------------------- |
| ↑ ↓ ← → | Mover (la primera flecha también inicia la partida) |
| P       | Pausar o continuar                                  |
| Espacio | Pausar, continuar o iniciar                         |
| R       | Reiniciar                                           |

Los atajos se ignoran si están combinados con Ctrl, Cmd o Alt.

---

# 🏆 Sistema de puntuación

Cada alimento recogido suma **10 puntos**. El récord se actualiza en cuanto se supera y se conserva entre sesiones.

---

# 💾 Persistencia

| Dato             | Almacenamiento    | Duración             |
| ---------------- | ----------------- | -------------------- |
| Mejor puntaje    | `storage.local`   | Hasta desinstalar    |
| Partida en curso | `storage.session` | Hasta cerrar Firefox |

Ambos se validan al leerlos: los datos corruptos se ignoran. No hay servidor externo. Detalles en [`docs/privacidad.md`](docs/privacidad.md).

---

# 🧪 Pruebas automatizadas

```bash
npm test          # pruebas unitarias
npm run check     # formato + lint + tests + web-ext lint
```

Las pruebas cubren movimiento, comida, colisiones, victoria, cola de giros, pausa, reinicio, récord y recuperación de sesión. Ejemplo de lo que se verifica:

```text
Dado:     La serpiente está en X=5, Y=5.
Cuando:   Se mueve hacia la derecha.
Entonces: La nueva posición es X=6, Y=5.
```

Detalle completo en [`docs/plan-de-pruebas.md`](docs/plan-de-pruebas.md).

---

# 🔎 QA manual pendiente

Las pruebas automatizadas no reemplazan la verificación en Firefox. El checklist completo está en [`docs/plan-de-pruebas.md`](docs/plan-de-pruebas.md#qa-manual-en-firefox). Marca cada punto solo cuando lo hayas comprobado en el navegador.

### Resumen

- [ ] La extensión se carga sin errores.
- [ ] El juego completo funciona con teclado y botones.
- [ ] El récord permanece después de cerrar Firefox.
- [ ] La partida se recupera al reabrir el popup.
- [ ] No aparecen errores en la consola.
- [ ] No se solicitan permisos innecesarios.

---

# 🦊 Prueba local en Firefox

Con web-ext (recarga automática al editar):

```bash
npm install
npm start
```

O manualmente:

```text
about:debugging → Este Firefox → Cargar complemento temporal → manifest.json
```

---

# 📦 Instalación para desarrollo

```bash
git clone https://github.com/francoaban/game-snake.git
cd game-snake
npm install
```

Requiere Node.js 20 o superior solo para las herramientas de desarrollo. La extensión en sí no necesita compilación ni servidor.

### Scripts

| Comando                | Descripción                             |
| ---------------------- | --------------------------------------- |
| `npm start`            | Abre Firefox con la extensión cargada   |
| `npm test`             | Ejecuta las pruebas unitarias           |
| `npm run lint`         | ESLint                                  |
| `npm run format`       | Prettier (escribe cambios)              |
| `npm run format:check` | Prettier (solo verifica)                |
| `npm run lint:ext`     | Valida la extensión con web-ext         |
| `npm run build`        | Genera el `.zip` en `web-ext-artifacts` |
| `npm run check`        | Formato, lint, tests y web-ext lint     |

---

# 🚀 Etapas del proyecto

| Etapa                    | Estado actual                                                                     |
| ------------------------ | --------------------------------------------------------------------------------- |
| Preparación y estructura | Implementada: manifiesto, popup, módulos, licencia, tooling y CI.                 |
| Base técnica y mecánicas | Implementadas. Falta confirmar la carga y el funcionamiento en Firefox.           |
| Pruebas automatizadas    | Implementadas: `node:test` con pruebas del motor, el récord y la sesión.          |
| QA manual                | Pendiente; usar el checklist de `docs/plan-de-pruebas.md`.                        |
| Publicación              | Pendiente: faltan QA, íconos definitivos y capturas. Paquete y documentos listos. |

---

# 🏁 Hitos

## H1 — Proyecto iniciado

- [x] Repositorio Git inicializado.
- [x] Cuenta Mozilla creada.
- [x] Publicación del repositorio GitHub confirmada.

## H2 — Alcance aprobado

- [x] Objetivo definido.
- [x] Funciones definidas.
- [x] Funciones fuera del alcance identificadas.
- [x] Criterios de aceptación definidos (`docs/plan-de-pruebas.md`).

## H3 — Diseño aprobado

- [x] Diseño del popup.
- [x] Diseño del tablero.
- [x] Diseño de botones.
- [x] Diseño del ícono (provisional).
- [x] Flujo del juego definido (fases en la sección de arquitectura).

## H4 — Extensión mínima

- [x] `manifest.json`.
- [x] Popup.
- [ ] Firefox puede cargar la extensión.

## H5 — Juego funcional

- [x] Movimiento.
- [x] Comida.
- [x] Puntuación.
- [x] Colisiones y fin de partida.
- [x] Pausa y reinicio.
- [x] Guardado del récord.

Las marcas de H4 y H5 reflejan implementación en el código; la verificación en Firefox sigue pendiente en H7.

## H6 — Tests

- [x] Tests unitarios.
- [x] Tests de colisiones.
- [x] Tests de puntuación.
- [x] Tests de movimiento.
- [x] Tests de reinicio.

## H7 — QA

- [ ] Pruebas manuales.
- [ ] Pruebas de interfaz.
- [ ] Pruebas de almacenamiento.
- [ ] Pruebas de errores.

## H8 — Publicación

- [ ] Íconos definitivos (hay íconos provisionales).
- [ ] Capturas.
- [ ] Descripción del listado.
- [x] Política de privacidad (`docs/privacidad.md`).
- [x] Paquete `.zip` (`npm run build`).
- [x] Notas para revisores (`docs/publicacion.md`).

## H9 — Publicación en Firefox

- [ ] Paquete enviado.
- [ ] Información completada.
- [ ] Revisión superada.

## H10 — Mantenimiento

- [x] Issues configurados (plantillas en `.github/`).
- [x] Registro de cambios (`CHANGELOG.md`).
- [x] Versionado (SemVer).
- [x] Proceso de actualización (`docs/publicacion.md`).

---

# 🔐 Privacidad

Snake no necesita recopilar información personal. La extensión:

- No requiere registro, nombre ni correo electrónico.
- No recopila historial de navegación.
- No transmite datos a servidores externos ni realiza conexiones de red.
- No utiliza publicidad ni analítica.

Solo se guardan localmente el **mejor puntaje** y la **partida en curso**. La política completa está en [`docs/privacidad.md`](docs/privacidad.md) y debe reflejar siempre el comportamiento real de la versión publicada.

---

# 🔒 Seguridad

No almacenes nunca dentro del repositorio contraseñas, claves de API, tokens, claves secretas, credenciales ni certificados privados.

Antes de cada publicación: revisar permisos, dependencias, código fuente, información sensible y la versión del `manifest.json`.

---

# 📚 Documentación

| Documento                                            | Contenido                                                  |
| ---------------------------------------------------- | ---------------------------------------------------------- |
| [`CHANGELOG.md`](CHANGELOG.md)                       | Registro de cambios                                        |
| [`docs/privacidad.md`](docs/privacidad.md)           | Política de privacidad                                     |
| [`docs/plan-de-pruebas.md`](docs/plan-de-pruebas.md) | Pruebas automatizadas, criterios de aceptación y QA manual |
| [`docs/publicacion.md`](docs/publicacion.md)         | Publicación en AMO, notas para revisores y releases        |

---

# 📌 Versionado

Se utiliza **Semantic Versioning** (`MAJOR.MINOR.PATCH`):

- **MAJOR**: cambios incompatibles (`1.0.0 → 2.0.0`).
- **MINOR**: funcionalidad nueva compatible (`1.0.0 → 1.1.0`).
- **PATCH**: corrección de errores (`1.0.0 → 1.0.1`).

Los cambios se registran en [`CHANGELOG.md`](CHANGELOG.md).

---

# 🗺️ Roadmap

## Versión 1.0

- [x] Juego básico.
- [x] Tests unitarios.
- [ ] Pruebas manuales.
- [ ] Publicación Firefox.

## Versión 1.1

Posibles mejoras:

- [ ] Diferentes velocidades.
- [ ] Niveles.
- [ ] Panel lateral (`sidebar_action`) para jugar sin que el popup se cierre.
- [ ] Sonidos.
- [ ] Animaciones.

## Versión 2.0

- [ ] Diferentes modos de juego.
- [ ] Obstáculos.
- [ ] Rankings locales.
- [ ] Personalización visual.

Cada funcionalidad futura debe evaluarse para no aumentar innecesariamente los permisos, la complejidad ni los requisitos de publicación.

---

# 🤝 Contribución

Las contribuciones son bienvenidas.

```text
Fork → Crear rama → Cambios → npm run check → Pull Request → Revisión → Merge
```

```bash
git checkout -b feature/nuevo-modo-juego
npm run check
git add .
git commit -m "feat: agregar nuevo modo de juego"
git push origin feature/nuevo-modo-juego
```

Al abrir el Pull Request se ejecutará la integración continua (formato, lint, tests, validación y build).

---

# 📄 Licencia

Licencia basada en MIT, con condiciones adicionales de atribución y de indicación de modificaciones. Puedes usar, copiar, modificar y redistribuir el código, incluso con fines comerciales.

- Las redistribuciones deben conservar la atribución al proyecto original.
- Las versiones modificadas deben indicar claramente que fueron modificadas.
- No debe sugerirse el respaldo del autor original.

Consulta el archivo [`LICENSE`](LICENSE) para conocer los términos completos.

---

# 👨‍💻 Proyecto educativo

Este proyecto demuestra cómo crear una extensión de navegador con tecnologías web estándar: HTML → CSS → JavaScript → WebExtensions → Manifest → Testing → Git/GitHub → Publicación.

**¡Diviértete desarrollando y jugando Snake directamente desde Firefox!** 🐍
