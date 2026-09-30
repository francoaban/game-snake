# Publicación y mantenimiento

## Antes de enviar a AMO

1. Completar el [plan de pruebas](plan-de-pruebas.md) y marcar el QA manual.
2. Reemplazar los íconos provisionales (`icons/`) por los definitivos si corresponde.
3. Preparar capturas de pantalla y la descripción del listado.
4. Verificar que [la política de privacidad](privacidad.md) coincide con el comportamiento real.
5. Confirmar el `id` en `browser_specific_settings.gecko`: no se puede cambiar después de publicar.
6. Subir la versión en `manifest.json` y `package.json` y actualizar `CHANGELOG.md`.
7. Ejecutar `npm run check` y `npm run build`.

## Paquete

```bash
npm run build   # genera web-ext-artifacts/snake-<versión>.zip
```

El paquete contiene solo lo necesario en tiempo de ejecución (ver `web-ext-config.mjs`).

## Advertencias esperadas en `web-ext lint`

Con `strict_min_version` en 115, `web-ext lint` muestra dos avisos porque `data_collection_permissions` se introdujo en Firefox 140 (escritorio) y 142 (Android). Las versiones anteriores ignoran la clave. Si prefieres eliminarlos, sube `strict_min_version` a `140.0` a costa de excluir a los usuarios de versiones anteriores.

## Notas para revisores

- La extensión no tiene paso de compilación, minificación ni dependencias en tiempo de ejecución: el código del paquete es exactamente el del repositorio.
- No realiza solicitudes de red ni ejecuta código remoto.
- Permiso `storage`: guarda el mejor puntaje (`storage.local`) y la partida en curso (`storage.session`).
- No inyecta scripts en páginas ni accede a pestañas, historial o contenido web.
- Para probarla: abrir el popup, pulsar una flecha y jugar. Las teclas P/Espacio pausan y R reinicia.
- Código fuente: <https://github.com/francoaban/game-snake>.

## Proceso de actualización

1. Crear una rama y realizar los cambios con sus pruebas.
2. Abrir un Pull Request y esperar a que pase la integración continua.
3. Al fusionar, actualizar la versión según SemVer y mover las entradas de `CHANGELOG.md` de "Sin publicar" a la nueva versión.
4. Crear la etiqueta `vX.Y.Z`, ejecutar `npm run build` y subir el `.zip` a AMO.
5. Revisar los comentarios de revisión y responder a los revisores si los hay.
