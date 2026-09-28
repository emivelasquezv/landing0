# Conectar /landing0 con Google Sheets (unos 3 minutos)

1. Crea una hoja nueva en Google Sheets, por ejemplo «COLLINS · LANDING 0€».
2. En el menú: **Extensiones → Apps Script**.
3. Borra lo que aparece y pega todo el contenido de `google-sheets.gs`. Guarda (icono del disco).
4. Pulsa **Implementar → Nueva implementación**.
   - Tipo (rueda dentada): **Aplicación web**.
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquier usuario**.
5. Pulsa **Implementar**. Google te pedirá permisos: acepta con tu cuenta. Si aparece «Google no ha verificado esta aplicación», entra en *Configuración avanzada → Ir a (nombre del proyecto)*. Es tu propio script.
6. Copia la **URL de la aplicación web** (termina en `/exec`) y pásamela, o pégala en `FORM_ENDPOINT`.

Cada solicitud aparece como una fila en la pestaña «Solicitudes» (se crea sola con la primera) y te llega un email de aviso. La columna **estado** empieza en «Nuevo»; puedes cambiarla a DM / Llamada / Tarjeta / Publicado para seguir el funnel.
