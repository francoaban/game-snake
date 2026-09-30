# Plan de pruebas

## Pruebas automatizadas

```bash
npm run check   # formato, lint, tests y validación del manifiesto
npm test        # solo los tests unitarios
```

| Archivo                  | Cubre                                                                    |
| ------------------------ | ------------------------------------------------------------------------ |
| `test/snake.test.js`     | Creación, movimiento, crecimiento, inmutabilidad, direcciones inválidas. |
| `test/food.test.js`      | Comida en celda libre, determinismo y tablero lleno.                     |
| `test/collision.test.js` | Paredes, cuerpo y regla de la cola.                                      |
| `test/engine.test.js`    | Puntos, colisión, victoria, cola de giros, pausa, reinicio.              |
| `test/score.test.js`     | Récord (guardar, cargar, sanear) y fallos de almacenamiento.             |
| `test/session.test.js`   | Validación y recuperación de la partida en curso.                        |

## Criterios de aceptación

1. Al pulsar una flecha o **Iniciar**, la serpiente empieza a moverse hacia la derecha.
2. Cada comida suma 10 puntos y la serpiente crece una celda.
3. Chocar con una pared o con el cuerpo termina la partida.
4. **Pausar** detiene el juego y **Continuar** lo reanuda sin cambiar el estado.
5. **R** o el botón de reinicio empiezan una partida nueva con 0 puntos.
6. Un puntaje mayor al récord lo reemplaza y se conserva al reabrir la extensión.
7. Si el popup se cierra durante una partida, al reabrirlo aparece en pausa con el mismo estado.
8. La extensión no solicita más permisos que `storage` y no muestra errores en la consola.

## QA manual en Firefox

Marca cada punto solo cuando lo hayas comprobado en Firefox. Fecha y versión de Firefox usadas: ____________.

### Instalación

- [ ] `npm start` (o `about:debugging` → Cargar complemento temporal) carga la extensión sin errores.
- [ ] El ícono aparece en la barra de herramientas.
- [ ] Al instalar no se solicita ningún permiso adicional.

### Juego

- [ ] El popup se abre con el tablero y los botones visibles.
- [ ] Iniciar con el botón y con una flecha funciona.
- [ ] Las cuatro flechas mueven la serpiente y no permiten el giro de 180°.
- [ ] Dos giros rápidos seguidos se aplican ambos.
- [ ] Comer suma puntos y genera nueva comida fuera de la serpiente.
- [ ] Colisión con pared y con el cuerpo terminan la partida.
- [ ] Pausa y continuar con botón, **P** y **Espacio**.
- [ ] Reinicio con botón y con **R**.
- [ ] Ctrl+R y Ctrl+P no pausan ni reinician el juego.

### Persistencia

- [ ] El récord se conserva al cerrar y reabrir el popup.
- [ ] El récord se conserva después de cerrar y reabrir Firefox.
- [ ] Cerrar el popup con la partida en curso y reabrirlo la recupera en pausa.
- [ ] Tras terminar la partida, reabrir el popup muestra el tablero inicial.

### Interfaz y accesibilidad

- [ ] Se puede jugar y operar todos los botones solo con el teclado.
- [ ] El estado de la partida se anuncia con un lector de pantalla.
- [ ] El popup se ve completo sin barras de desplazamiento.

### Errores

- [ ] La consola del popup (`about:debugging` → Inspeccionar) no muestra errores.
- [ ] `npm run lint:ext` no informa errores.
