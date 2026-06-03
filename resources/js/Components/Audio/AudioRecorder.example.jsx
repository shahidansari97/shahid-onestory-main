/**
 * AudioRecorder Component Usage Examples
 * 
 * This file demonstrates how to use the AudioRecorder component in different scenarios.
 */

import React, { useState } from 'react';
import AudioRecorder from './AudioRecorder';
// Or import from index: import { AudioRecorder } from '@/Components/Audio';

// Example 1: Basic Usage
export const BasicExample = () => {
    const handleRecordingComplete = (audioFile, audioBlob, duration) => {
        console.log('Recording completed!');
        console.log('File:', audioFile);
        console.log('Blob:', audioBlob);
        console.log('Duration:', duration, 'seconds');
    };

    return (
        <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
        />
    );
};

// Example 2: With Upload Functionality
export const UploadExample = () => {
    const [uploading, setUploading] = useState(false);

    const handleRecordingComplete = async (audioFile, audioBlob, duration) => {
        setUploading(true);
        
        try {
            const formData = new FormData();
            formData.append('audio', audioFile);
            formData.append('duration', duration);

            const response = await fetch('/api/upload-audio', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Upload successful:', data);
                alert('Audio uploaded successfully!');
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload audio');
        } finally {
            setUploading(false);
        }
    };

    const handleError = (errorMessage) => {
        console.error('Recording error:', errorMessage);
        alert(errorMessage);
    };

    return (
        <div>
            {uploading && <p>Uploading...</p>}
            <AudioRecorder
                onRecordingComplete={handleRecordingComplete}
                onError={handleError}
            />
        </div>
    );
};

// Example 3: With Maximum Duration
export const LimitedDurationExample = () => {
    return (
        <AudioRecorder
            maxDuration={60} // 60 seconds max
            onRecordingComplete={(file, blob, duration) => {
                console.log('Recording stopped at:', duration, 'seconds');
            }}
        />
    );
};

// Example 4: Auto-play After Recording
export const AutoPlayExample = () => {
    return (
        <AudioRecorder
            autoPlay={true}
            onRecordingComplete={(file, blob, duration) => {
                console.log('Recording will auto-play');
            }}
        />
    );
};

// Example 5: Without Playback Controls (Recording Only)
export const RecordingOnlyExample = () => {
    return (
        <AudioRecorder
            showControls={false}
            onRecordingComplete={(file, blob, duration) => {
                console.log('Recording saved:', file.name);
                // Handle the file directly without showing player
            }}
        />
    );
};

// Example 6: Custom Styling
export const CustomStyledExample = () => {
    return (
        <AudioRecorder
            className="my-custom-class"
            style={{ maxWidth: '800px', margin: '0 auto' }}
            onRecordingComplete={(file, blob, duration) => {
                console.log('Custom styled recorder');
            }}
        />
    );
};

// Example 7: With Delete Callback
export const WithDeleteExample = () => {
    const handleDelete = () => {
        console.log('Recording deleted');
        // Perform cleanup or update UI
    };

    return (
        <AudioRecorder
            onRecordingComplete={(file, blob, duration) => {
                console.log('Recording completed');
            }}
            onDelete={handleDelete}
        />
    );
};

// Example 8: Complete Integration with State Management
export const CompleteExample = () => {
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

    const handleRecordingComplete = (audioFile, audioBlob, duration) => {
        setRecordedAudio({
            file: audioFile,
            blob: audioBlob,
            duration: duration,
            url: URL.createObjectURL(audioBlob),
        });
        setIsRecording(false);
    };

    const handleDelete = () => {
        if (recordedAudio?.url) {
            URL.revokeObjectURL(recordedAudio.url);
        }
        setRecordedAudio(null);
    };

    return (
        <div>
            <h2>Audio Recorder</h2>
            <AudioRecorder
                onRecordingComplete={handleRecordingComplete}
                onDelete={handleDelete}
                onError={(error) => {
                    console.error('Error:', error);
                    setIsRecording(false);
                }}
            />
            
            {recordedAudio && (
                <div className="mt-4">
                    <p>Recording saved!</p>
                    <p>Duration: {recordedAudio.duration} seconds</p>
                    <p>File: {recordedAudio.file.name}</p>
                </div>
            )}
        </div>
    );
};
