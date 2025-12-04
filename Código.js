/**
 * Servir la página HTML
 */
function doGet() {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('Sistema de Asignación de Salones')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Obtener las opciones para los Selects (Salones y Horarios) desde la hoja 'Config'
 */
function getOptions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Config');
  
  // Asumimos que Salones están en Columna A y Horarios en Columna B
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return { salones: [], horarios: [] };
  
  const data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  
  // Filtramos vacíos
  const salones = data.map(row => row[0]).filter(String);
  const horarios = data.map(row => row[1]).filter(String);
  
  return { salones, horarios };
}

/**
 * Guardar una nueva asignación en la hoja 'Registro'
 */
function saveAssignment(formObject) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Registro');
  
  // Validación simple: Verificar si ya existe asignación (Opcional, se puede expandir)
  // Aquí simplemente guardamos los datos
  sheet.appendRow([
    new Date(), // Fecha de registro (Timestamp)
    formObject.horaInicio,
    formObject.horaFin,
    formObject.salon,
    formObject.docente,
    formObject.materia
  ]);
  
  return getAssignments(); // Devolvemos la lista actualizada
}

/**
 * Obtener las asignaciones actuales para mostrar en la tabla
 */
function getAssignments() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Registro');
  const lastRow = sheet.getLastRow();
  
  if (lastRow < 2) return [];
  
  // Obtenemos datos desde la fila 2 hasta la última
  const data = sheet.getRange(2, 1, lastRow - 1, 6).getDisplayValues();
  // Invertimos para ver los más recientes primero
  return data.reverse(); 
}