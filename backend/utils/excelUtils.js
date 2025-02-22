const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const saveScoreToExcel = (userId, name, email, score) => {
  try {
    const dataDir = path.join(__dirname, "../data");

    // Create directory if not exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, `${userId}.xlsx`);

    let workbook;
    if (fs.existsSync(filePath)) {
      workbook = XLSX.readFile(filePath);
    } else {
      workbook = XLSX.utils.book_new();
    }

    const sheetName = "Scores";
    let worksheet = workbook.Sheets[sheetName];

    // Get existing data or initialize empty array
    let data = worksheet ? XLSX.utils.sheet_to_json(worksheet) : [];

    // Append new record
    data.push({ Name: name, Email: email, Score: score });

    // Convert JSON to worksheet
    const newWorksheet = XLSX.utils.json_to_sheet(data);

    // Remove old sheet and add updated one
    if (workbook.SheetNames.includes(sheetName)) {
      delete workbook.Sheets[sheetName];
    }

    workbook.Sheets[sheetName] = newWorksheet;
    workbook.SheetNames = [sheetName];

    // Save workbook
    XLSX.writeFile(workbook, filePath);

    // Read and return all values
    const updatedWorkbook = XLSX.readFile(filePath);
    const updatedWorksheet = updatedWorkbook.Sheets[sheetName];
    const allData = XLSX.utils.sheet_to_json(updatedWorksheet);

    return allData;
  } catch (error) {
    console.error("Error saving score to Excel:", error);
    throw error;
  }
};

module.exports = { saveScoreToExcel };
