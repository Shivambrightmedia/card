# Google Sheets Integration Setup Guide

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Visiting Cards" (or any name you prefer)
4. Copy the **Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
   ```

## Step 2: Create a Google Cloud Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

4. Create a Service Account:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the details and click "Create"
   - Skip the optional steps and click "Done"

5. Create a Key:
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" > "Create New Key"
   - Choose "JSON" format
   - Download the JSON file

## Step 3: Share Your Google Sheet

1. Open your Google Sheet
2. Click the "Share" button
3. Add the **service account email** (found in the JSON file as `client_email`)
4. Give it "Editor" permissions
5. Click "Send"

## Step 4: Configure Environment Variables

1. Create a `.env` file in the `server` folder
2. Add the following:

```env
GOOGLE_SHEET_ID=your_spreadsheet_id_here
GOOGLE_CREDENTIALS={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

**Important**: 
- Replace `your_spreadsheet_id_here` with your actual Spreadsheet ID
- Replace the `GOOGLE_CREDENTIALS` value with the **entire contents** of your downloaded JSON file (as a single line)

## Step 5: Install Dependencies

```bash
cd server
npm install dotenv googleapis
```

## Step 6: Update server/index.js

Add this at the very top of `server/index.js`:

```javascript
require('dotenv').config();
```

## Step 7: Restart the Server

```bash
node index.js
```

The server will automatically create headers in your Google Sheet on first run!

## Troubleshooting

- **"Missing Google Sheets configuration"**: Make sure `.env` file exists and has the correct variables
- **"Permission denied"**: Make sure you shared the sheet with the service account email
- **"Invalid credentials"**: Check that the JSON in GOOGLE_CREDENTIALS is valid (no extra quotes or formatting)

## Security Note

⚠️ **Never commit your `.env` file or service account JSON to Git!**

Add this to your `.gitignore`:
```
.env
*.json
```
