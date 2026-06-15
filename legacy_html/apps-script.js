/**
 * JCOM ZONE 18 - Google Apps Script Backend API
 * 
 * INSTRUCTIONS TO CONNECT:
 * 1. Open your Google Sheet (with tabs: TeamMembers, contact, membership, Events).
 * 2. In Row 1 of each tab, ensure you have the exact column headers:
 *    - "TeamMembers": ID, Name, Role, ImageUrl, Bio, Phone, Whatsapp
 *    - "Events": ID, Title, Category, Date, Time, Location, ImageUrl, ActionUrl, Description
 *    - "membership": ID, Name, Email, Phone, Company, Industry, Whatsapp, Message, Timestamp
 *    - "contact": ID, Name, Email, Message, Timestamp
 * 3. Go to Extensions > Apps Script.
 * 4. Paste this code.
 * 5. IF THIS IS A STANDALONE SCRIPT (not created directly inside the Google Sheet):
 *    Paste your Google Sheet's ID (found in the Sheet's URL) in the SPREADSHEET_ID variable below.
 * 6. Click Deploy > New deployment.
 * 7. Select type "Web app".
 * 8. Execute as "Me", Who has access: "Anyone".
 * 9. Click Deploy. Review Permissions and authorize the script.
 * 10. Copy the deployed Web App URL (ends in /exec).
 */

// If you created this script as a standalone script (directly from script.google.com),
// paste your Google Sheet ID here. If container-bound (via Extensions > Apps Script), leave it empty.
var SPREADSHEET_ID = "";

function getSpreadsheet() {
  var id = SPREADSHEET_ID ? SPREADSHEET_ID.trim() : "";
  if (id !== "") {
    // Check if they mistakenly pasted the Apps Script project URL
    if (id.includes("script.google.com") || id.includes("/projects/")) {
      throw new Error("Invalid SPREADSHEET_ID. You have pasted the Google Apps Script project URL instead of the Google Sheet ID/URL. Please open your Google Sheet, copy its URL, and paste it here.");
    }
    
    // Auto-extract Spreadsheet ID if they pasted the entire Google Sheet URL
    if (id.includes("docs.google.com/spreadsheets")) {
      var match = id.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match) {
        id = match[1];
      } else {
        throw new Error("Unable to extract Spreadsheet ID from the pasted Google Sheet URL. Please check the URL and try again.");
      }
    }
    
    return SpreadsheetApp.openById(id);
  }
  
  try {
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (err) {
    throw new Error("Unable to identify active Spreadsheet. If this is a standalone Apps Script project, please paste your Google Spreadsheet ID into the SPREADSHEET_ID variable at the top of the script.");
  }
}

function doGet(e) {
  var action = e.parameter.action;
  var callback = e.parameter.callback;
  var responseData;
  
  try {
    var ss = getSpreadsheet();
    if (!ss) {
      throw new Error("Spreadsheet connection failed. Please ensure SPREADSHEET_ID is correct.");
    }
    
    if (action === 'getTeams') {
      responseData = getSheetData(ss, "TeamMembers");
    } else if (action === 'getEvents') {
      responseData = getSheetData(ss, "Events");
    } else if (action === 'getMembership') {
      responseData = getSheetData(ss, "membership");
    } else if (action === 'getContacts') {
      responseData = getSheetData(ss, "contact");
    } else {
      responseData = { "status": "error", "message": "Invalid action parameter" };
    }
  } catch (err) {
    responseData = { "status": "error", "message": err.toString() };
  }
  
  // Return JSONP if callback is specified (highly useful to bypass CORS/Tracking Prevention on local hosts)
  if (callback) {
    var callbackResponse = callback + "(" + JSON.stringify(responseData) + ")";
    return ContentService.createTextOutput(callbackResponse).setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    return ContentService.createTextOutput(JSON.stringify(responseData)).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var sheetName = data.sheet; // "TeamMembers", "Events", "membership", "contact"
    var ss = getSpreadsheet();
    
    if (!ss) {
      return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": "Spreadsheet not found" })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'add') {
      return addRow(ss, sheetName, data.row);
    } else if (action === 'delete') {
      return deleteRow(ss, sheetName, data.id);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": "Invalid POST action" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheetData(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return []; // Only headers or empty
  
  // Trim the headers
  var headers = data[0].map(function(h) { return String(h).trim(); });
  var rows = [];
  
  // Define standard expected keys for each sheet to match page requirements
  var expectedKeys = [];
  if (sheetName === "TeamMembers") {
    expectedKeys = ["ID", "Name", "Role", "ImageUrl", "Bio", "Phone", "Whatsapp"];
  } else if (sheetName === "Events") {
    expectedKeys = ["ID", "Title", "Category", "Date", "Time", "Location", "ImageUrl", "ActionUrl", "Description"];
  } else if (sheetName === "membership") {
    expectedKeys = ["ID", "Name", "Email", "Phone", "Company", "Industry", "Whatsapp", "Message", "Timestamp"];
  } else if (sheetName === "contact") {
    expectedKeys = ["ID", "Name", "Email", "Message", "Timestamp"];
  }
  
  // Create a map from normalized sheet headers to their column index
  var headerIndexMap = {};
  for (var j = 0; j < headers.length; j++) {
    var normHeader = String(headers[j]).toLowerCase().replace(/[^a-z0-9]/g, "");
    headerIndexMap[normHeader] = j;
  }
  
  for (var i = 1; i < data.length; i++) {
    var rowObj = {};
    
    // First, populate expectedKeys using normalization matching
    expectedKeys.forEach(function(key) {
      var normKey = String(key).toLowerCase().replace(/[^a-z0-9]/g, "");
      var colIdx = headerIndexMap[normKey];
      if (colIdx !== undefined) {
        rowObj[key] = data[i][colIdx];
      } else {
        rowObj[key] = ""; // Fallback if column is missing
      }
    });
    
    // Also copy all original headers to rowObj just in case they added custom columns
    for (var j = 0; j < headers.length; j++) {
      var originalHeader = headers[j];
      if (rowObj[originalHeader] === undefined) {
        rowObj[originalHeader] = data[i][j];
      }
    }
    
    rows.push(rowObj);
  }
  
  return rows;
}

function addRow(ss, sheetName, rowData) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": "Sheet tab not found: " + sheetName })).setMimeType(ContentService.MimeType.JSON);
  }
  
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(function(h) { return String(h).trim(); });
  
  // Normalize rowData keys (lowercase and remove symbols/spaces) for lookup
  var normalizedRow = {};
  for (var key in rowData) {
    var normKey = String(key).toLowerCase().replace(/[^a-z0-9]/g, "");
    normalizedRow[normKey] = rowData[key];
  }
  
  var newRow = [];
  for (var i = 0; i < headers.length; i++) {
    var normHeader = String(headers[i]).toLowerCase().replace(/[^a-z0-9]/g, "");
    newRow.push(normalizedRow[normHeader] !== undefined ? normalizedRow[normHeader] : "");
  }
  
  sheet.appendRow(newRow);
  return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Row added to " + sheetName })).setMimeType(ContentService.MimeType.JSON);
}

function deleteRow(ss, sheetName, idToDelete) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": "Sheet tab not found" })).setMimeType(ContentService.MimeType.JSON);
  }
  
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == idToDelete) { // ID is in column 1
      sheet.deleteRow(i + 1);
      return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Row deleted" })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": "ID not found" })).setMimeType(ContentService.MimeType.JSON);
}
