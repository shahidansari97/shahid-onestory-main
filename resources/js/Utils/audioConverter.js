/**
 * Audio Converter Utility
 * Converts audio blobs (WebM, etc.) to WAV format using Web Audio API
 */

/**
 * Convert audio blob to WAV format
 * @param {Blob} audioBlob - The audio blob to convert
 * @param {string} mimeType - Original MIME type (e.g., 'audio/webm')
 * @returns {Promise<Blob>} - WAV formatted blob
 */
export const convertToWav = async (audioBlob, mimeType = 'audio/webm') => {
    let audioContext = null;
    
    try {
        // Check if Web Audio API is supported
        if (!isWebAudioSupported()) {
            throw new Error('Web Audio API is not supported in this browser');
        }
        
        // Create audio context (iOS Safari uses webkitAudioContext)
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContextClass();
        
        // iOS Safari may need the context to be resumed if suspended
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }
        
        // Convert blob to array buffer
        const arrayBuffer = await audioBlob.arrayBuffer();
        
        // Decode audio data with error handling
        let audioBuffer;
        try {
            audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        } catch (decodeError) {
            // iOS Safari might have issues with certain formats
            console.warn('Audio decode error, trying with copy:', decodeError);
            // Try with a copy of the array buffer
            const arrayBufferCopy = arrayBuffer.slice(0);
            audioBuffer = await audioContext.decodeAudioData(arrayBufferCopy);
        }
        
        // Validate audio buffer
        if (!audioBuffer || audioBuffer.length === 0) {
            throw new Error('Decoded audio buffer is empty');
        }
        
        // Convert to WAV
        const wavBlob = audioBufferToWav(audioBuffer);
        
        // Validate WAV blob
        if (!wavBlob || wavBlob.size === 0) {
            throw new Error('WAV conversion produced empty blob');
        }
        
        return wavBlob;
    } catch (error) {
        console.error('Error converting audio to WAV:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            mimeType: mimeType,
            blobSize: audioBlob.size,
            blobType: audioBlob.type
        });
        throw new Error(`Failed to convert audio to WAV: ${error.message}`);
    } finally {
        // Cleanup audio context
        if (audioContext && audioContext.state !== 'closed') {
            try {
                await audioContext.close();
            } catch (closeError) {
                console.warn('Error closing audio context:', closeError);
            }
        }
    }
};

/**
 * Convert AudioBuffer to WAV blob
 * @param {AudioBuffer} audioBuffer - The audio buffer to convert
 * @param {number} sampleRate - Sample rate (default: 44100)
 * @returns {Blob} - WAV formatted blob
 */
const audioBufferToWav = (audioBuffer, sampleRate = 44100) => {
    const numChannels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length;
    const sampleRateActual = audioBuffer.sampleRate;
    
    // Use actual sample rate from buffer
    const rate = sampleRateActual || sampleRate;
    
    const buffer = new ArrayBuffer(44 + length * numChannels * 2);
    const view = new DataView(buffer);
    const channels = [];
    let offset = 0;
    let pos = 0;
    
    // Write WAV header
    const writeString = (str) => {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(pos + i, str.charCodeAt(i));
        }
        pos += str.length;
    };
    
    // RIFF header
    writeString('RIFF');
    view.setUint32(pos, 36 + length * numChannels * 2, true);
    pos += 4;
    writeString('WAVE');
    
    // fmt chunk
    writeString('fmt ');
    view.setUint32(pos, 16, true);
    pos += 4; // Subchunk1Size
    view.setUint16(pos, 1, true);
    pos += 2; // AudioFormat (1 = PCM)
    view.setUint16(pos, numChannels, true);
    pos += 2; // NumChannels
    view.setUint32(pos, rate, true);
    pos += 4; // SampleRate
    view.setUint32(pos, rate * numChannels * 2, true);
    pos += 4; // ByteRate
    view.setUint16(pos, numChannels * 2, true);
    pos += 2; // BlockAlign
    view.setUint16(pos, 16, true);
    pos += 2; // BitsPerSample
    
    // data chunk
    writeString('data');
    view.setUint32(pos, length * numChannels * 2, true);
    pos += 4;
    
    // Write audio data
    for (let i = 0; i < numChannels; i++) {
        channels.push(audioBuffer.getChannelData(i));
    }
    
    while (pos < buffer.byteLength) {
        for (let i = 0; i < numChannels; i++) {
            let sample = Math.max(-1, Math.min(1, channels[i][offset]));
            sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
            view.setInt16(pos, sample, true);
            pos += 2;
        }
        offset++;
    }
    
    return new Blob([buffer], { type: 'audio/wav' });
};

/**
 * Get audio duration from blob
 * @param {Blob} audioBlob - The audio blob
 * @param {string} mimeType - MIME type of the blob
 * @returns {Promise<number>} - Duration in seconds
 */
export const getAudioDuration = async (audioBlob, mimeType = 'audio/webm') => {
    let audioContext = null;
    
    try {
        if (!isWebAudioSupported()) {
            console.warn('Web Audio API not supported, cannot get duration');
            return 0;
        }
        
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContextClass();
        
        // iOS Safari may need the context to be resumed
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }
        
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const duration = audioBuffer.duration;
        
        // Validate duration
        if (isNaN(duration) || !isFinite(duration) || duration <= 0) {
            console.warn('Invalid duration detected:', duration);
            return 0;
        }
        
        return duration;
    } catch (error) {
        console.error('Error getting audio duration:', error);
        // Return 0 if we can't determine duration
        return 0;
    } finally {
        if (audioContext && audioContext.state !== 'closed') {
            try {
                await audioContext.close();
            } catch (closeError) {
                console.warn('Error closing audio context:', closeError);
            }
        }
    }
};

/**
 * Check if Web Audio API is supported
 * @returns {boolean}
 */
export const isWebAudioSupported = () => {
    return !!(window.AudioContext || window.webkitAudioContext);
};

/**
 * Check if conversion is needed
 * @param {string} mimeType - Original MIME type
 * @returns {boolean}
 */
export const needsConversion = (mimeType) => {
    // Convert everything except WAV to WAV for consistency
    return mimeType !== 'audio/wav' && mimeType !== 'audio/wave';
};
