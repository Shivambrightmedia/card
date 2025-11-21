const Tesseract = require('tesseract.js');

/**
 * Extracts text from an image buffer using Tesseract.js
 * @param {Buffer} buffer 
 * @returns {Promise<string>}
 */
async function extractText(buffer) {
    const { data: { text } } = await Tesseract.recognize(buffer, 'eng', {
        tessedit_pageseg_mode: Tesseract.PSM.AUTO,
    });
    return text;
}

/**
 * Extracts name from email address as fallback
 * @param {string} email 
 * @returns {string}
 */
function extractNameFromEmail(email) {
    if (!email) return '';
    const localPart = email.split('@')[0];
    // Convert ashutosh to Ashutosh, or ashutosh.pandey to Ashutosh Pandey
    const parts = localPart.split(/[._-]/);
    return parts.map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(' ');
}

/**
 * Parses raw text to find contact details with improved heuristics.
 * @param {string} text 
 * @returns {Object}
 */
function parseText(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // Enhanced regex patterns
    const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g;
    const phoneRegex = /(\+?\d{1,4}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{2,4}[-.\s]?\d{0,4}/g;
    const websiteRegex = /(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?(\/[^\s]*)?/g;
    // Added Indian address keywords: floor, nagar, sadan
    const addressRegex = /\b\d+[^\n]*(?:street|st|road|rd|avenue|ave|lane|ln|drive|dr|boulevard|blvd|way|court|ct|circle|plaza|square|floor|nagar|sadan)\b/gi;

    let emails = [];
    let phones = [];
    let websites = [];
    let addresses = [];
    let name = '';
    let company = '';
    let position = '';
    let additionalInfo = [];

    // Join all text to search for patterns
    const fullText = lines.join(' ');

    // Extract all emails
    const emailMatches = fullText.matchAll(emailRegex);
    for (const match of emailMatches) {
        if (!emails.includes(match[0])) emails.push(match[0]);
    }

    // Extract all phone numbers (improved validation - require at least 10 digits)
    const phoneMatches = fullText.matchAll(phoneRegex);
    for (const match of phoneMatches) {
        const cleaned = match[0].trim();
        // Count only digits to ensure it's a valid phone number
        const digitCount = (cleaned.match(/\d/g) || []).length;
        if (digitCount >= 10 && !phones.includes(cleaned)) {
            phones.push(cleaned);
        }
    }

    // Extract all websites (excluding emails)
    const websiteMatches = fullText.matchAll(websiteRegex);
    for (const match of websiteMatches) {
        if (!match[0].includes('@') && !websites.includes(match[0])) {
            websites.push(match[0]);
        }
    }

    // Extract addresses (and check for phone numbers within them)
    const addressMatches = fullText.matchAll(addressRegex);
    for (const match of addressMatches) {
        let addressText = match[0];

        // Check if this address contains a phone number
        const phoneInAddress = addressText.match(phoneRegex);
        if (phoneInAddress) {
            for (const phoneMatch of phoneInAddress) {
                const digitCount = (phoneMatch.match(/\d/g) || []).length;
                if (digitCount >= 10 && !phones.includes(phoneMatch.trim())) {
                    phones.push(phoneMatch.trim());
                }
                // Remove phone from address text
                addressText = addressText.replace(phoneMatch, '').trim();
            }
        }

        // Clean up address text
        addressText = addressText.replace(/\s+/g, ' ').trim();

        if (addressText.length > 5 && !addresses.includes(addressText)) {
            addresses.push(addressText);
        }
    }

    // Common job titles/positions
    const positionKeywords = ['ceo', 'cto', 'cfo', 'manager', 'director', 'president', 'vice president',
        'vp', 'founder', 'co-founder', 'engineer', 'developer', 'designer',
        'consultant', 'specialist', 'executive', 'officer', 'head', 'lead',
        'senior', 'junior', 'associate', 'assistant'];

    // Common locations to exclude from names
    const commonLocations = ['mumbai', 'delhi', 'bangalore', 'chennai', 'kolkata', 'hyderabad',
        'pune', 'ahmedabad', 'jaipur', 'india', 'usa', 'uk', 'london', 'new york'];

    // Clean up OCR artifacts from lines
    const cleanLine = (line) => {
        // Remove common OCR artifacts like ®, ©, special symbols, extra spaces
        let cleaned = line.replace(/[®©™]/g, '').replace(/\s+/g, ' ').trim();
        // Remove leading "Le " or "Ee " or other OCR garbage
        cleaned = cleaned.replace(/^(Le|Ee|Fes|da|ad)\s+/i, '');
        // Remove trailing "ie" or other OCR artifacts
        cleaned = cleaned.replace(/\s+(ie|oe|ae)$/i, '');
        return cleaned.trim();
    };

    // Improved detection: Check ALL lines
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const cleaned = cleanLine(line);
        const lowerLine = cleaned.toLowerCase();

        // Skip if it's contact info
        if (line.includes('@') || line.match(/^\+?\d/) || line.match(/www\./i)) continue;
        if (line.match(/contact:|email:|phone:|website:/i)) continue;

        // Skip very short lines or obvious OCR noise
        if (cleaned.length < 3) continue;
        if (cleaned.match(/^[^a-zA-Z0-9]+$/)) continue; // Only special chars

        // Skip if it's a location
        if (commonLocations.some(loc => lowerLine.includes(loc))) continue;

        // Check if it's a position/title (prioritize this)
        if (!position && positionKeywords.some(kw => lowerLine.includes(kw))) {
            position = cleaned;
            continue;
        }

        // Name detection: Can be ALL CAPS or Title Case
        // Names are typically 2-4 words, mostly alphabetic
        const wordCount = cleaned.split(/\s+/).length;
        if (!name && wordCount >= 2 && wordCount <= 4) {
            // Check if it's mostly alphabetic (allow some special chars)
            const alphaRatio = (cleaned.match(/[a-zA-Z]/g) || []).length / cleaned.length;
            if (alphaRatio > 0.7) {
                // Could be ALL CAPS or Title Case
                if (cleaned.match(/^[A-Z][A-Z\s.-]+$/) || cleaned.match(/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+$/)) {
                    name = cleaned;
                    continue;
                }
            }
        }

        // Company name detection
        if (!company && cleaned.length > 3) {
            // Check if ALL CAPS (very common for company names)
            if (cleaned === cleaned.toUpperCase() && cleaned.match(/^[A-Z0-9\s&.,'-]+$/)) {
                // Make sure it's not just a single short word
                if (cleaned.length > 5 || wordCount >= 2) {
                    company = cleaned;
                    continue;
                }
            }
            // Or if it contains numbers and letters (like "360 BRIGHT MEDIA")
            if (cleaned.match(/\d/) && cleaned.match(/[A-Z]/) && wordCount >= 2) {
                company = cleaned;
                continue;
            }
        }
    }

    // Fallback: Extract name from email if name wasn't found
    if (!name && emails.length > 0) {
        name = extractNameFromEmail(emails[0]);
    }

    // Collect all other non-empty lines as additional info
    for (const line of lines) {
        const cleaned = cleanLine(line);
        // Skip if already captured
        if (cleaned === name || cleaned === company || cleaned === position) continue;
        if (emails.some(e => line.includes(e))) continue;
        if (phones.some(p => line.includes(p))) continue;
        if (websites.some(w => line.includes(w))) continue;

        // Add to additional info if it has meaningful content
        if (cleaned.length > 2 && !additionalInfo.includes(cleaned)) {
            additionalInfo.push(cleaned);
        }
    }

    return {
        name,
        company,
        position,
        email: emails.join(', '),
        phone: phones.join(', '),
        website: websites.join(', '),
        address: addresses.join(', '),
        additionalInfo: additionalInfo.join(' | '),
        rawText: text
    };
}

/**
 * Processes front and back images to extract consolidated data.
 * @param {Buffer} frontBuffer 
 * @param {Buffer} backBuffer 
 * @returns {Promise<Object>}
 */
async function processCard(frontBuffer, backBuffer) {
    const frontText = await extractText(frontBuffer);
    const backText = await extractText(backBuffer);

    console.log('Front text extracted:', frontText);
    console.log('Back text extracted:', backText);

    const frontData = parseText(frontText);
    const backData = parseText(backText);

    console.log('Front data parsed:', frontData);
    console.log('Back data parsed:', backData);

    // Merge data (prefer front for name/company, but fill gaps from back)
    return {
        name: frontData.name || backData.name || 'Unknown',
        company: frontData.company || backData.company || '',
        position: frontData.position || backData.position || '',
        email: frontData.email || backData.email || '',
        phone: frontData.phone || backData.phone || '',
        website: frontData.website || backData.website || '',
        address: frontData.address || backData.address || '',
        additionalInfo: [frontData.additionalInfo, backData.additionalInfo].filter(x => x).join(' | '),
        scannedAt: new Date().toISOString()
    };
}

module.exports = { processCard };
