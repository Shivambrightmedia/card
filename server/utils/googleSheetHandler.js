const { google } = require('googleapis');

/**
 * Appends card data to Google Sheets
 * @param {Object} data 
 * @returns {string} Success message
 */
async function appendToGoogleSheet(data) {
    try {
        // Get credentials from environment variables
        const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
        const GOOGLE_CREDENTIALS = process.env.GOOGLE_CREDENTIALS;

        if (!SPREADSHEET_ID || !GOOGLE_CREDENTIALS) {
            throw new Error('Missing Google Sheets configuration. Please set GOOGLE_SHEET_ID and GOOGLE_CREDENTIALS environment variables.');
        }

        // Parse credentials
        const credentials = JSON.parse(GOOGLE_CREDENTIALS);

        // Create auth client
        const auth = new google.auth.GoogleAuth({
            credentials: credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Prepare row data
        const values = [[
            data.name,
            data.company,
            data.position,
            data.email,
            data.phone,
            data.website,
            data.address,
            data.additionalInfo,
            data.scannedAt
        ]];

        // Append to sheet
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A:I', // Adjust sheet name if needed
            valueInputOption: 'USER_ENTERED',
            resource: { values },
        });

        console.log(`${response.data.updates.updatedRows} row(s) added to Google Sheets`);
        return `Data saved to Google Sheets (${response.data.updates.updatedRows} row added)`;
    } catch (error) {
        console.error('Error writing to Google Sheets:', error.message);
        throw error;
    }
}

/**
 * Initialize the Google Sheet with headers if it's empty
 */
async function initializeSheet() {
    try {
        const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
        const GOOGLE_CREDENTIALS = process.env.GOOGLE_CREDENTIALS;

        if (!SPREADSHEET_ID || !GOOGLE_CREDENTIALS) {
            console.log('Google Sheets not configured. Skipping initialization.');
            return;
        }

        const credentials = JSON.parse(GOOGLE_CREDENTIALS);
        const auth = new google.auth.GoogleAuth({
            credentials: credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Check if sheet has headers
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A1:I1',
        });

        // If no data, add headers
        if (!response.data.values || response.data.values.length === 0) {
            const headers = [[
                'Name',
                'Company',
                'Position',
                'Email',
                'Phone',
                'Website',
                'Address',
                'Additional Info',
                'Scanned At'
            ]];

            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: 'Sheet1!A1:I1',
                valueInputOption: 'USER_ENTERED',
                resource: { values: headers },
            });

            console.log('Google Sheet initialized with headers');
        } else {
            console.log('Google Sheet already has headers');
        }
    } catch (error) {
        console.error('Error initializing Google Sheet:', error.message);
    }
}

module.exports = { appendToGoogleSheet, initializeSheet };
