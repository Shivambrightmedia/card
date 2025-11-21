const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const FILE_PATH = path.join(__dirname, '../../visiting_cards.xlsx');

/**
 * Appends card data to the Excel file.
 * @param {Object} data 
 * @returns {string} Path to the saved file
 */
function appendToExcel(data) {
    let workbook;
    let worksheet;

    // Check if file exists
    if (fs.existsSync(FILE_PATH)) {
        workbook = xlsx.readFile(FILE_PATH);
        const sheetName = workbook.SheetNames[0];
        worksheet = workbook.Sheets[sheetName];
    } else {
        workbook = xlsx.utils.book_new();
        worksheet = xlsx.utils.json_to_sheet([]);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Cards');
    }

    // Convert sheet to JSON to append easily
    const existingData = xlsx.utils.sheet_to_json(worksheet);

    // Add new row with all fields
    existingData.push({
        Name: data.name,
        Company: data.company,
        Position: data.position,
        Email: data.email,
        Phone: data.phone,
        Website: data.website,
        Address: data.address,
        'Additional Info': data.additionalInfo,
        'Scanned At': data.scannedAt
    });

    // Convert back to sheet
    const newWorksheet = xlsx.utils.json_to_sheet(existingData);
    workbook.Sheets[workbook.SheetNames[0]] = newWorksheet;

    // Write file
    xlsx.writeFile(workbook, FILE_PATH);

    return FILE_PATH;
}

module.exports = { appendToExcel };
