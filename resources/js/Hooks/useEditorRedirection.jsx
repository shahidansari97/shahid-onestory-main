import { useState, useEffect, useCallback } from 'react';

const useEditorRedirection = ({ userId }) => {
    // Common encryption key (32 bytes for AES-256)
    const ENCRYPTION_KEY = new Uint8Array([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
        17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
    ]);
    const [cipherText, setCipherText] = useState(null);
    const [ivBase64, setIvBase64] = useState(null);
    const [url, setUrl] = useState(null);

    const encryptStringToURL = useCallback(async (plainText) => {
        const key = await window.crypto.subtle.importKey(
            'raw',
            ENCRYPTION_KEY,
            { name: 'AES-CBC', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );
        const encoder = new TextEncoder();
        const data = encoder.encode(String(plainText));
        const iv = window.crypto.getRandomValues(new Uint8Array(16));
        const algorithm = { name: "AES-CBC", iv: iv };

        const ciphertext = await window.crypto.subtle.encrypt(algorithm, key, data);

        // Convert ArrayBuffer to Base64 for URL transmission
        const ciphertextBase64 = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
        const ivBase64String = btoa(String.fromCharCode(...iv));
        setCipherText(ciphertextBase64);
        setIvBase64(ivBase64String);

        // Construct the editor step-1 URL. (Draft routing is handled elsewhere.)
        const base = import.meta.env.VITE_VIDEO_EDITOR_FRONTEND_BASE_URL;
        const generatedUrl = `${base}/record/step-1/?identification=${encodeURIComponent(ciphertextBase64)}&iv=${encodeURIComponent(ivBase64String)}`;
        setUrl(generatedUrl);
        return generatedUrl;
    }, []);

    useEffect(() => {
        if (userId) {
            encryptStringToURL(userId);
        } else {
            setCipherText(null);
            setIvBase64(null);
            setUrl(null);
        }
    }, [userId, encryptStringToURL]);

    // Return values so caller can use them
    return {
        cipherText,
        ivBase64,
        url,
        regenerate: () => (userId ? encryptStringToURL(userId) : null),
    };
};

export default useEditorRedirection; 