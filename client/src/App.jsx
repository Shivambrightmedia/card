import React, { useState } from 'react';
import axios from 'axios';
import ImageUploader from './components/ImageUploader';

function App() {
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleScan = async () => {
        if (!frontImage || !backImage) {
            setError('Please upload both front and back images.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        const formData = new FormData();
        formData.append('front', frontImage);
        formData.append('back', backImage);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.post(`${apiUrl}/api/scan`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setResult(response.data.data);
            } else {
                setError('Failed to process card.');
            }
        } catch (err) {
            console.error(err);
            setError('Error connecting to server. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel">
            <h1>Card Scanner</h1>

            <div className="upload-container">
                <ImageUploader
                    label="Front Side"
                    image={frontImage}
                    onImageSelect={setFrontImage}
                />
                <ImageUploader
                    label="Back Side"
                    image={backImage}
                    onImageSelect={setBackImage}
                />
            </div>

            {error && <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

            <button className="btn-primary" onClick={handleScan} disabled={loading}>
                {loading ? <><span className="loading-spinner"></span>Scanning & Saving...</> : 'ADD CARD'}
            </button>

            {result && (
                <div className="result-card glass-panel" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <h2 style={{ marginTop: 0, color: '#818cf8' }}>Card Details Saved!</h2>
                    <div className="result-grid">
                        <span className="label">Name:</span>
                        <span className="value">{result.name}</span>

                        <span className="label">Company:</span>
                        <span className="value">{result.company}</span>

                        {result.position && (
                            <>
                                <span className="label">Position:</span>
                                <span className="value">{result.position}</span>
                            </>
                        )}

                        <span className="label">Email:</span>
                        <span className="value">{result.email}</span>

                        <span className="label">Phone:</span>
                        <span className="value">{result.phone}</span>

                        <span className="label">Website:</span>
                        <span className="value">{result.website}</span>

                        {result.address && (
                            <>
                                <span className="label">Address:</span>
                                <span className="value">{result.address}</span>
                            </>
                        )}

                        {result.additionalInfo && (
                            <>
                                <span className="label">Additional Info:</span>
                                <span className="value">{result.additionalInfo}</span>
                            </>
                        )}
                    </div>
                    <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                        Data has been saved to your Google Sheet
                    </p>
                </div>
            )}
        </div>
    );
}

export default App;
