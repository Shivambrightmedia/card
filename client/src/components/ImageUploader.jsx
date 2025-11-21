import React, { useRef } from 'react';

const ImageUploader = ({ label, image, onImageSelect }) => {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onImageSelect(file);
        }
    };

    return (
        <div className="upload-box" onClick={handleClick}>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
            />
            {image ? (
                <img src={URL.createObjectURL(image)} alt={label} />
            ) : (
                <>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📷</div>
                    <p>Scan {label}</p>
                </>
            )}
        </div>
    );
};

export default ImageUploader;
