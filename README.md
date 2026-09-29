# 🐍 Snake — Firefox Extension

Extensión para **Mozilla Firefox** que permite jugar al clásico juego **Snake** directamente desde el navegador, sin necesidad de abrir una página web externa.

El proyecto está desarrollado utilizando el estándar **WebExtensions** y una arquitectura sencilla basada en **HTML, CSS y JavaScript**, con el objetivo de ser fácil de entender, modificar y utilizar como proyecto educativo.

## Estado actual

El proyecto se encuentra en una etapa inicial (`0.1.0`). El popup y las mecánicas principales del juego ya están implementados. Todavía están pendientes la verificación manual en Firefox, una suite de pruebas automatizadas y la preparación para publicación. Los hitos distinguen el trabajo implementado de las pruebas aún no realizadas.

---

## 📋 Descripción

**Snake Extension** agrega un pequeño juego de Snake al navegador Firefox.

El usuario puede abrir la extensión desde la barra de herramientas e iniciar una partida desde el popup.

El objetivo del juego es controlar una serpiente, recoger la comida y obtener la mayor cantidad de puntos posible sin chocar contra las paredes o contra el propio cuerpo de la serpiente.

### Características principales

* 🐍 Juego Snake ejecutado dentro de Firefox.
* 🎮 Controles mediante teclado.
* 🍎 Generación de comida.
* 📊 Sistema de puntuación.
* 🏆 Registro del mejor puntaje.
* 🔄 Reinicio de partida.
* ⏸️ Pausa del juego.
* 💾 Persistencia del mejor puntaje mediante almacenamiento local.
* 🎨 Interfaz compacta para el popup de Firefox.
* 🔒 No requiere servidor.
* 🔒 No requiere cuenta de usuario.
* 🔒 No recopila información personal.
* 🌐 No necesita conexión a Internet para jugar.

---

# 🎯 Objetivo del proyecto

El objetivo principal es desarrollar una extensión sencilla para Firefox utilizando tecnologías web estándar.

El proyecto también sirve como ejemplo para aprender:

* HTML.
* CSS.
* JavaScript.
* WebExtensions.
* `manifest.json`.
* Eventos del navegador.
* Manipulación del DOM.
* Canvas.
* `localStorage` / almacenamiento de extensión.
* Pruebas unitarias.
* Control de versiones con Git.
* Publicación de extensiones.

La estructura sigue las recomendaciones generales para proyectos de extensiones: definir alcance, requisitos, diseño, código, pruebas, documentación y publicación.

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

Para mantener el proyecto sencillo, la primera versión no contempla:

* Usuarios.
* Registro e inicio de sesión.
* Servidor backend.
* Base de datos.
* Juego multijugador.
* Sincronización entre dispositivos.
* Publicidad.
* Analítica de usuarios.
* Compra de funcionalidades.
* Comunicación con servicios externos.

Esto permite mantener una extensión pequeña, con pocos permisos y fácil de probar.

---

# 🛠️ Tecnologías

| Tecnología    | Uso                           |
| ------------- | ----------------------------- |
| HTML5         | Estructura de la interfaz     |
| CSS3          | Diseño visual                 |
| JavaScript    | Lógica del juego              |
| Canvas API    | Renderizado del tablero       |
| WebExtensions | Integración con Firefox       |
| Manifest V3   | Configuración de la extensión |
| Git           | Control de versiones          |
| GitHub        | Repositorio y colaboración    |
| Pruebas       | Suite automatizada pendiente  |

---

# 📁 Estructura del proyecto

```text
game-snake/
│
├── manifest.json
├── README.md
├── LICENSE
├── .gitignore
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── game/
│   ├── board.js
│   ├── snake.js
│   ├── food.js
│   ├── collision.js
│   └── score.js
```

Actualmente no hay directorios `icons/`, `tests/` o `docs/`; se podrán incorporar en etapas posteriores.

---

# 🧱 Arquitectura

La extensión utiliza una arquitectura sencilla:

```text
┌───────────────────────────────┐
│          Firefox              │
│                               │
│  ┌─────────────────────────┐  │
│  │       Extension         │  │
│  │                         │  │
│  │  ┌───────────────────┐  │  │
│  │  │     Popup         │  │  │
│  │  │                   │  │  │
│  │  │  HTML             │  │  │
│  │  │  CSS              │  │  │
│  │  │  JavaScript       │  │  │
│  │  └─────────┬─────────┘  │  │
│  │            │            │  │
│  │            ▼            │  │
│  │  ┌───────────────────┐  │  │
│  │  │   Game Engine     │  │  │
│  │  │                   │  │  │
│  │  │ Snake             │  │  │
│  │  │ Food              │  │  │
│  │  │ Collision         │  │  │
│  │  │ Score             │  │  │
│  │  └─────────┬─────────┘  │  │
│  │            │            │  │
│  │            ▼            │  │
│  │  ┌───────────────────┐  │  │
│  │  │ Firefox Storage   │  │  │
│  │  │                   │  │  │
│  │  │ Best Score        │  │  │
│  │  └───────────────────┘  │  │
│  └─────────────────────────┘  │
└───────────────────────────────┘
```

---

# 📜 Manifest

El archivo `manifest.json` es el archivo principal de configuración de la extensión.

Configuración actual:

```json
{
  "manifest_version": 3,
  "name": "Snake",
  "version": "0.1.0",
  "description": "Juega Snake directamente desde Firefox.",
  "action": {
    "default_popup": "popup/popup.html",
    "default_title": "Jugar Snake"
  },
  "permissions": [
    "storage"
  ]
}
```

El manifiesto debe solicitar solamente los permisos necesarios. La guía del proyecto establece como criterio utilizar los permisos mínimos imprescindibles.

---

# 🎮 Cómo jugar

Una vez instalada la extensión:

1. Abrir Firefox.
2. Hacer clic sobre el ícono de **Snake**.
3. Presionar **Iniciar**.
4. Utilizar las teclas:

```text
        ↑
        │
    ←───┼───→
        │
        ↓
```

### Controles

| Tecla | Acción                   |
| ----- | ------------------------ |
| ↑     | Mover hacia arriba       |
| ↓     | Mover hacia abajo        |
| ←     | Mover hacia la izquierda |
| →     | Mover hacia la derecha   |
| P     | Pausar                   |
| R     | Reiniciar                |

---

# 🏆 Sistema de puntuación

Cada alimento recogido aumenta la puntuación.

Ejemplo:

```text
Comida recogida → +10 puntos
```

La interfaz mostrará:

```text
┌──────────────────────────┐
│       🐍 SNAKE           │
│                          │
│   Puntos: 120            │
│   Récord: 250            │
│                          │
│   ┌──────────────────┐   │
│   │                  │   │
│   │      🐍 🍎       │   │
│   │                  │   │
│   │                  │   │
│   └──────────────────┘   │
│                          │
│       [ PAUSAR ]         │
│       [ REINICIAR ]      │
└──────────────────────────┘
```

---

# 💾 Persistencia

El mejor puntaje se almacenará utilizando el sistema de almacenamiento proporcionado por Firefox.

Conceptualmente:

```javascript
await browser.storage.local.set({
  bestScore: 250
});
```

Para recuperar el récord:

```javascript
const result = await browser.storage.local.get("bestScore");

console.log(result.bestScore);
```

No se utilizará un servidor externo.

---

# 🧪 Estado de las pruebas

Todavía no hay una suite automatizada ni un framework de pruebas configurado. Las reglas principales están separadas en módulos dentro de `game/`, lo que permitirá probarlas unitariamente en una etapa posterior.

Los tests futuros deberían cubrir, como mínimo, estos casos:

### Movimiento

```text
Dado:
La serpiente está en X=5, Y=5.

Cuando:
Se mueve hacia la derecha.

Entonces:
La nueva posición debe ser X=6, Y=5.
```

### Comida

```text
Dado:
Existe una comida en el tablero.

Cuando:
La serpiente alcanza la comida.

Entonces:
La puntuación aumenta.
```

### Colisión

```text
Dado:
La serpiente está próxima a una pared.

Cuando:
Se mueve hacia la pared.

Entonces:
La partida termina.
```

### Récord

```text
Dado:
El récord actual es 100.

Cuando:
El jugador obtiene 150 puntos.

Entonces:
El nuevo récord debe ser 150.
```

### Reinicio

```text
Dado:
La partida terminó.

Cuando:
El jugador presiona "Reiniciar".

Entonces:
La serpiente vuelve a su posición inicial.
La puntuación vuelve a 0.
La partida comienza nuevamente.
```

---

# 🔎 QA manual pendiente

La lista siguiente todavía debe verificarse cargando la extensión en Firefox. Marcar una función como implementada en los hitos no significa que ya haya pasado estas pruebas manuales.

### Checklist

* [x] La extensión se instala correctamente.
* [x] El popup se abre.
* [x] El juego comienza.
* [x] La serpiente se mueve.
* [x] Las teclas funcionan.
* [x] La comida aparece correctamente.
* [x] La puntuación aumenta.
* [x] La colisión funciona.
* [x] La pausa funciona.
* [x] Reiniciar funciona.
* [x] El récord se guarda.
* [ ] El récord permanece después de cerrar Firefox.
* [ ] No aparecen errores en la consola.
* [ ] No se solicitan permisos innecesarios.

---

# 🦊 Prueba local en Firefox

Antes de publicar la extensión, se debe probar localmente.

Firefox permite cargar extensiones temporalmente desde:

```text
about:debugging
```

Luego:

```text
about:debugging
       ↓
Este Firefox
       ↓
Cargar complemento temporal
       ↓
manifest.json
```

La extensión puede probarse de esta manera antes de enviarla a la tienda.

---

# 📦 Instalación para desarrollo

Clonar el repositorio:

```bash
git clone https://github.com/francoaban/game-snake.git
```

Ingresar al proyecto:

```bash
cd game-snake
```

No es necesario un servidor backend para la versión inicial.

La extensión puede cargarse directamente desde Firefox utilizando `manifest.json`.

---

# 🚀 Etapas del proyecto

| Etapa | Estado actual |
| --- | --- |
| Preparación y estructura | Implementada: manifiesto, popup, módulos del juego y licencia. |
| Base técnica y mecánicas | Implementadas en el código; falta confirmar la carga y el funcionamiento en Firefox. |
| Pruebas automatizadas | Pendientes; no hay framework ni archivos de pruebas configurados. |
| QA manual | Pendiente; usar la lista de verificación anterior. |
| Publicación | Pendiente; faltan QA, recursos gráficos y preparación del paquete. |

---

# 🏁 Hitos

## H1 — Proyecto iniciado

* [x] Repositorio Git inicializado.
* [x] Cuenta Mozilla creada.
* [x] Publicación del repositorio GitHub confirmada.

## H2 — Alcance aprobado

* [ ] Objetivo definido.
* [ ] Funciones definidas.
* [ ] Funciones fuera del alcance identificadas.
* [ ] Criterios de aceptación definidos.

## H3 — Diseño aprobado

* [ ] Diseño del popup.
* [ ] Diseño del tablero.
* [ ] Diseño de botones.
* [ ] Diseño del ícono.
* [ ] Flujo del juego definido.

## H4 — Extensión mínima

* [x] `manifest.json`.
* [x] Popup.
* [ ] Firefox puede cargar la extensión.

## H5 — Juego funcional

* [x] Movimiento.
* [x] Comida.
* [x] Puntuación.
* [x] Colisiones y fin de partida.
* [x] Pausa y reinicio.
* [x] Guardado del récord.

Las marcas de H4 y H5 reflejan implementación en el código; la verificación en Firefox sigue pendiente en H7.

## H6 — Tests

* [ ] Tests unitarios.
* [ ] Tests de colisiones.
* [ ] Tests de puntuación.
* [ ] Tests de movimiento.
* [ ] Tests de reinicio.

## H7 — QA

* [ ] Pruebas manuales.
* [ ] Pruebas de interfaz.
* [ ] Pruebas de almacenamiento.
* [ ] Pruebas de errores.

## H8 — Publicación

* [ ] Íconos definitivos.
* [ ] Capturas.
* [ ] Descripción.
* [ ] Política de privacidad.
* [ ] Paquete `.zip`.
* [ ] Notas para revisores.

## H9 — Publicación en Firefox

* [ ] Paquete enviado.
* [ ] Información completada.
* [ ] Revisión superada.

## H10 — Mantenimiento

* [ ] Issues configurados.
* [ ] Registro de cambios.
* [ ] Versionado.
* [ ] Proceso de actualización.

---

## Licencia

Este proyecto se distribuye bajo una licencia basada en MIT.

El código puede utilizarse, copiarse, modificarse y redistribuirse,
incluyendo para proyectos comerciales.

Las redistribuciones deben conservar la atribución al proyecto original.
Las versiones modificadas deben indicar claramente que han sido
modificadas respecto del proyecto original.

Ver el archivo [LICENSE](LICENSE) para consultar los términos completos.

# 🔐 Privacidad

Snake no necesita recopilar información personal.

La extensión:

* No requiere registro.
* No solicita nombre.
* No solicita correo electrónico.
* No recopila historial de navegación.
* No transmite datos a servidores externos.
* No utiliza publicidad.
* No utiliza analítica externa.

El único dato persistente previsto para la primera versión es el **mejor puntaje**, almacenado localmente.

La política de privacidad definitiva debe reflejar exactamente el comportamiento real de la versión publicada. La guía también establece que la política debe coincidir con los datos que realmente utiliza o transmite la extensión.

---

# 🔒 Seguridad

No almacenar nunca dentro del repositorio:

```text
passwords
API keys
tokens
secret keys
credentials
private certificates
```

Antes de cada publicación:

* Revisar permisos.
* Revisar dependencias.
* Revisar código fuente.
* Revisar información sensible.
* Revisar versión del `manifest.json`.

---

# 📚 Documentación adicional

El proyecto debería mantener los siguientes documentos:

```text
docs/
│
├── alcance.md
├── requisitos.md
├── diseño.md
├── arquitectura.md
├── plan-de-pruebas.md
├── privacidad.md
├── guia-de-usuario.md
└── roadmap.md
```

Estos documentos permiten que una persona con conocimientos técnicos básicos pueda comprender progresivamente el proyecto.

---

# 📌 Versionado

Se utilizará **Semantic Versioning**:

```text
MAJOR.MINOR.PATCH
```

Ejemplo:

```text
1.0.0
```

### MAJOR

Cambios incompatibles.

```text
1.0.0 → 2.0.0
```

### MINOR

Nueva funcionalidad compatible.

```text
1.0.0 → 1.1.0
```

### PATCH

Corrección de errores.

```text
1.0.0 → 1.0.1
```

---

# 📝 Changelog

## [1.0.0] — Primera versión

### Agregado

* Juego Snake.
* Movimiento mediante teclado.
* Comida.
* Puntuación.
* Récord.
* Pausa.
* Reinicio.
* Almacenamiento local.

---

# 🗺️ Roadmap

## Versión 1.0

* [x] Juego básico.
* [ ] Tests unitarios.
* [ ] Pruebas manuales.
* [ ] Publicación Firefox.

## Versión 1.1

Posibles mejoras:

* [ ] Diferentes velocidades.
* [ ] Niveles.
* [ ] Nuevos diseños.
* [ ] Sonidos.
* [ ] Animaciones.

## Versión 2.0

Posibles funcionalidades:

* [ ] Diferentes modos de juego.
* [ ] Obstáculos.
* [ ] Rankings locales.
* [ ] Personalización visual.

Las funcionalidades futuras deberán evaluarse antes de incorporarlas para evitar aumentar innecesariamente los permisos, complejidad y requisitos de publicación.

---

# 🤝 Contribución

Las contribuciones son bienvenidas.

Proceso recomendado:

```text
Fork
  ↓
Crear branch
  ↓
Realizar cambios
  ↓
Ejecutar tests
  ↓
Crear Pull Request
  ↓
Code Review
  ↓
Merge
```

Ejemplo:

```bash
git checkout -b feature/nuevo-modo-juego
```

Después de realizar los cambios:

```bash
git add .
git commit -m "feat: agregar nuevo modo de juego"
git push origin feature/nuevo-modo-juego
```

---

# 📄 Licencia

Este proyecto utiliza la licencia:

```text
MIT License
```

Consultar el archivo:

```text
LICENSE
```

para conocer las condiciones completas de uso.

---

# 👨‍💻 Proyecto educativo

Este proyecto está diseñado para demostrar cómo crear una extensión de navegador utilizando tecnologías web estándar.

Puede utilizarse como práctica para aprender:

```text
HTML
 ↓
CSS
 ↓
JavaScript
 ↓
WebExtensions
 ↓
Manifest
 ↓
Testing
 ↓
Git/GitHub
 ↓
Publicación
```

---

# 🐍 ¡A jugar!

```text
███████╗███╗   ██╗ █████╗ ██╗  ██╗███████╗
██╔════╝████╗  ██║██╔══██╗██║ ██╔╝██╔════╝
███████╗██╔██╗ ██║███████║█████╔╝ █████╗
╚════██║██║╚██╗██║██╔══██║██╔═██╗ ██╔══╝
███████║██║ ╚████║██║  ██║██║  ██╗███████╗
╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
```

**Diviértete desarrollando y jugando Snake directamente desde Firefox.**
