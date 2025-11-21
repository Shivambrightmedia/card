# 📇 Visiting Card Scanner

A modern web application that scans visiting cards using OCR and automatically saves the extracted data to Google Sheets.

## ✨ Features

- 📸 **Dual-Side Scanning**: Upload front and back of visiting cards
- 🤖 **Smart OCR**: Powered by Tesseract.js for text extraction
- 🧠 **Intelligent Parsing**: Automatically detects names, companies, positions, emails, phones, websites, and addresses
- ☁️ **Cloud Storage**: Saves data directly to Google Sheets
- 🎨 **Premium UI**: Beautiful dark-mode interface with glassmorphism effects
- 📱 **Responsive Design**: Works on desktop and mobile devices

## 🚀 Tech Stack

### Frontend
- **React** + **Vite**
- **Axios** for API calls
- **Vanilla CSS** with modern design

### Backend
- **Node.js** + **Express**
- **Tesseract.js** for OCR
- **Google Sheets API** for data storage
- **Multer** for file uploads

## 📋 Prerequisites

- Node.js (v14 or higher)
- A Google Cloud account (for Google Sheets API)
- A Google Sheet to store the data

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Card
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure Google Sheets

Follow the detailed instructions in [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md) to:
1. Create a Google Sheet
2. Set up a Google Cloud Service Account
3. Get your credentials

### 4. Set Up Environment Variables

Create a `.env` file in the `server` folder:

```env
GOOGLE_SHEET_ID=your_spreadsheet_id_here
GOOGLE_CREDENTIALS={"type":"service_account",...}
PORT=5000
```

See `.env.example` for the template.

### 5. Run the Application

```bash
# Start the backend (in server folder)
cd server
node index.js

# Start the frontend (in client folder, new terminal)
cd client
npm run dev
```

The app will be available at `http://localhost:5173`

## 📖 How to Use

1. Open the web app in your browser
2. Click on "Front Side" to upload/capture the front of the visiting card
3. Click on "Back Side" to upload/capture the back of the visiting card
4. Click "ADD CARD" button
5. Wait for processing (OCR takes a few seconds)
6. View the extracted data on screen
7. Check your Google Sheet - the data is automatically saved!

## 🎯 Features in Detail

### Smart Text Extraction
- **Name Detection**: Handles ALL CAPS and Title Case names
- **Company Detection**: Recognizes company names with numbers (e.g., "360 BRIGHT MEDIA")
- **Position Detection**: Identifies job titles like CEO, Manager, Director, etc.
- **Email Fallback**: If name isn't detected from image, extracts it from email address
- **Location Filtering**: Prevents cities (Mumbai, Delhi, etc.) from being mistaken as names
- **OCR Artifact Cleaning**: Removes common OCR errors and noise

### Data Captured
- Name
- Company
- Position/Title
- Email
- Phone
- Website
- Address
- Additional Information
- Timestamp

## 🌐 Deployment

### Deploy to Production

#### Backend (Render.com)
1. Push your code to GitHub
2. Create a new Web Service on Render.com
3. Connect your GitHub repository
4. Add environment variables (GOOGLE_SHEET_ID, GOOGLE_CREDENTIALS)
5. Deploy!

#### Frontend (Netlify)
1. Build the frontend: `npm run build` (in client folder)
2. Deploy the `dist` folder to Netlify
3. Update the API URL in `App.jsx` to your Render backend URL

## 🔒 Security Notes

⚠️ **Never commit these files:**
- `.env`
- Service account JSON files
- Any files containing credentials

These are already included in `.gitignore`.

## 🐛 Troubleshooting

### "Missing Google Sheets configuration"
- Make sure `.env` file exists in the `server` folder
- Check that `GOOGLE_SHEET_ID` and `GOOGLE_CREDENTIALS` are set

### "Permission denied" when writing to Google Sheets
- Ensure you shared the Google Sheet with the service account email
- Give it "Editor" permissions

### OCR not detecting text correctly
- Ensure good lighting when capturing images
- Use high-resolution images
- Colored text (especially on light backgrounds) may not be detected well

### Name shows as "Mumbai - Delhi" or other location
- This has been fixed in the latest version
- The system now filters out common location names

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ using React, Node.js, and Google Sheets API
