// LANDING 0€ — recibe las solicitudes de /landing0 y las guarda en esta hoja de Google.
// Instalación: ver GOOGLE-SHEETS.md

const SHEET_NAME = "Solicitudes";
const COLUMNS = [
  "enviado", "negocio", "instagram", "sector", "web_actual", "objetivo",
  "encaje_precio", "nombre", "contacto", "puntuacion_auto", "estado",
];

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.web_url) return ContentService.createTextOutput("ok"); // bot: campo trampa relleno
  const sheet = getSheet_();
  sheet.appendRow(COLUMNS.map((col) => (col === "estado" ? "Nuevo" : data[col] ?? "")));
  notify_(data);
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
  }
  return sheet;
}

// Aviso por email a la cuenta dueña de la hoja en cada solicitud nueva.
function notify_(data) {
  const to = Session.getEffectiveUser().getEmail();
  if (!to) return;
  MailApp.sendEmail({
    to,
    subject: `LANDING 0€ · nueva solicitud: ${data.negocio} (${data.puntuacion_auto}/6)`,
    body:
      `Negocio: ${data.negocio}\nInstagram: https://instagram.com/${data.instagram}\n` +
      `Sector: ${data.sector}\nWeb actual: ${data.web_actual}\nObjetivo: ${data.objetivo}\n` +
      `¿Le encaja 19,90 €/mes?: ${data.encaje_precio}\nNombre: ${data.nombre}\nContacto: ${data.contacto}`,
  });
}
