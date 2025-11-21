require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { processCard } = require('./utils/ocrProcessor');
const { appendToGoogleSheet, initializeSheet } = require('./utils/googleSheetHandler');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure Multer for memory storage (we process buffers directly)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
app.post('/api/scan', upload.fields([{ name: 'front' }, { name: 'back' }]), async (req, res) => {
    try {
        const files = req.files;
        if (!files.front || !files.back) {
            return res.status(400).json({ error: 'Both front and back images are required.' });
        }

        const frontBuffer = files.front[0].buffer;
        const backBuffer = files.back[0].buffer;

        // Process images with OCR
        console.log('Processing images...');
        const data = await processCard(frontBuffer, backBuffer);

        // Save to Google Sheets
        console.log('Saving to Google Sheets...');
        const savedMessage = await appendToGoogleSheet(data);

        res.json({ success: true, data, message: savedMessage });
    } catch (error) {
        console.error('Error processing card:', error);
        res.status(500).json({ error: 'Failed to process card.', details: error.message });
    }
});

app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // Initialize Google Sheet with headers if needed
    await initializeSheet();
});
