# AudioRecorder Component

A reusable React component for recording and playing audio with a beautiful, responsive UI.

## Features

- 🎤 **Audio Recording** - Record audio using the browser's MediaRecorder API
- ▶️ **Audio Playback** - Built-in audio player with play/pause controls
- 🔊 **Volume Control** - Adjustable volume slider with mute functionality
- 📱 **Responsive Design** - Mobile-friendly 2-row layout, desktop single-row layout
- ⏱️ **Duration Tracking** - Real-time duration display and progress tracking
- 🎨 **Customizable** - Configurable props for different use cases
- 🔧 **Cross-browser Support** - Works on modern browsers including iOS Safari

## Installation

The component is already in your project at `resources/js/Components/Audio/AudioRecorder.jsx`

## Basic Usage

```jsx
import AudioRecorder from '@/Components/Audio/AudioRecorder';
// Or
import { AudioRecorder } from '@/Components/Audio';

function MyComponent() {
    const handleRecordingComplete = (audioFile, audioBlob, duration) => {
        console.log('Recording completed!', audioFile, duration);
        // Handle the recorded audio
    };

    return (
        <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
        />
    );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onRecordingComplete` | `Function` | `undefined` | Callback when recording is complete. Receives `(audioFile, audioBlob, duration)` |
| `onDelete` | `Function` | `undefined` | Callback when recording is deleted |
| `onError` | `Function` | `undefined` | Callback for errors. Receives `(errorMessage)` |
| `showControls` | `boolean` | `true` | Show playback controls after recording |
| `autoPlay` | `boolean` | `false` | Auto-play audio after recording completes |
| `className` | `string` | `""` | Additional CSS classes for the wrapper |
| `style` | `Object` | `{}` | Inline styles for the wrapper |
| `showMicButton` | `boolean` | `true` | Show microphone button when no recording exists |
| `maxDuration` | `number` | `0` | Maximum recording duration in seconds (0 = unlimited) |

## Examples

### Basic Recording

```jsx
<AudioRecorder
    onRecordingComplete={(file, blob, duration) => {
        console.log('File:', file);
        console.log('Duration:', duration);
    }}
/>
```

### With Upload

```jsx
const handleRecordingComplete = async (audioFile, audioBlob, duration) => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    
    await fetch('/api/upload', {
        method: 'POST',
        body: formData,
    });
};

<AudioRecorder
    onRecordingComplete={handleRecordingComplete}
    onError={(error) => alert(error)}
/>
```

### Limited Duration Recording

```jsx
<AudioRecorder
    maxDuration={60} // 60 seconds max
    onRecordingComplete={(file, blob, duration) => {
        console.log('Recording stopped at:', duration);
    }}
/>
```

### Recording Only (No Playback)

```jsx
<AudioRecorder
    showControls={false}
    onRecordingComplete={(file, blob, duration) => {
        // Handle file directly without showing player
        uploadFile(file);
    }}
/>
```

### Auto-play After Recording

```jsx
<AudioRecorder
    autoPlay={true}
    onRecordingComplete={(file, blob, duration) => {
        console.log('Audio will auto-play');
    }}
/>
```

### Custom Styling

```jsx
<AudioRecorder
    className="my-custom-class"
    style={{ maxWidth: '800px', margin: '0 auto' }}
    onRecordingComplete={handleRecordingComplete}
/>
```

## Callback Parameters

### onRecordingComplete

Called when recording stops successfully.

**Parameters:**
- `audioFile` (File) - The recorded audio as a File object
- `audioBlob` (Blob) - The recorded audio as a Blob object
- `duration` (number) - Recording duration in seconds

**Example:**
```jsx
onRecordingComplete={(file, blob, duration) => {
    console.log('File name:', file.name);
    console.log('File size:', file.size);
    console.log('File type:', file.type);
    console.log('Duration:', duration, 'seconds');
}}
```

### onDelete

Called when the user deletes the recording.

**Example:**
```jsx
onDelete={() => {
    console.log('Recording deleted');
    // Cleanup or update UI
}}
```

### onError

Called when an error occurs during recording or playback.

**Parameters:**
- `errorMessage` (string) - Human-readable error message

**Example:**
```jsx
onError={(errorMessage) => {
    console.error('Error:', errorMessage);
    alert(errorMessage);
}}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest, including iOS)
- Opera (latest)

**Note:** Requires microphone permissions and MediaRecorder API support.

## Styling

The component includes built-in styles but can be customized using:
- `className` prop for additional CSS classes
- `style` prop for inline styles
- CSS overrides using `.custom-audio-player` class

## Mobile Layout

On mobile devices (≤640px), the player displays in a 2-row layout:
- **Row 1:** Play/Pause button + Duration + Progress bar
- **Row 2:** Speaker icon + Volume slider

On desktop, all controls are in a single horizontal row.

## File Formats

The component automatically detects and uses the best supported audio format:
- WebM (Opus)
- MP4/M4A
- OGG (Opus)
- WAV
- AAC

## Notes

- The component handles iOS-specific audio playback requirements
- Recording automatically stops if `maxDuration` is reached
- Audio URLs are automatically cleaned up when component unmounts
- The component is fully self-contained with no external dependencies (except React and Lucide icons)

## License

Part of your project codebase.
