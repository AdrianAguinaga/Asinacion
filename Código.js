/**
 * 1. Servir la página HTML
 */
function doGet() {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('Asignación de Salones')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * 2. Obtener opciones (Salones y Horarios) desde la hoja 'Config'
 */
function getOptions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Config');
  
  if (!sheet) return { salones: [], horarios: [] }; // Previene error si no existe la hoja

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return { salones: [], horarios: [] };
  
  // Obtenemos columnas A y B (Salones y Horarios)
  const data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  
  // Filtramos celdas vacías
  const salones = data.map(row => row[0]).filter(String);
  const horarios = data.map(row => row[1]).filter(String);
  
  return { salones, horarios };
}

/**
 * 3. Guardar la asignación en la hoja 'Registro'
 */
function saveAssignment(formObject) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Registro');
  
  // Si no existe la hoja Registro, la crea
  if (!sheet) {
    sheet = ss.insertSheet('Registro');
    sheet.appendRow(['Fecha Registro', 'Hora Inicio', 'Hora Fin', 'Salón', 'Docente', 'Materia']);
  }
  
  // Guardar datos
  sheet.appendRow([
    new Date(),          // Fecha actual (Timestamp)
    formObject.horaInicio,
    formObject.horaFin,
    formObject.salon,
    formObject.docente,
    formObject.materia
  ]);
  
  return getAssignments(); // Retorna la lista actualizada
}

/**
 * 4. Leer asignaciones para la tabla
 */
function getAssignments() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Registro');
  
  if (!sheet || sheet.getLastRow() < 2) return [];
  
  const lastRow = sheet.getLastRow();
  // Leemos columnas A a F (6 columnas)
  const data = sheet.getRange(2, 1, lastRow - 1, 6).getDisplayValues();
  
  // Invertimos el array para mostrar los últimos registros arriba
  return data.reverse(); 
}