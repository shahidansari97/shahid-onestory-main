import React, { useState, useRef } from 'react';
import HlsPlayer from './HlsPlayer';

const HlsStallTest = () => {
  const [testVideo, setTestVideo] = useState({
    url: 'https://dms5pg8p1t5xt.cloudfront.net/renders/newodellia567890/hls/master.m3u8',
    poster: 'https://dms5pg8p1t5xt.cloudfront.net/renders/newodellia567890/hls/poster.jpg'
  });
  
  const [logs, setLogs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const testVideos = [
    {
      name: 'Odelia Story',
      url: 'https://dms5pg8p1t5xt.cloudfront.net/renders/newodellia567890/hls/master.m3u8',
      poster: 'https://dms5pg8p1t5xt.cloudfront.net/renders/newodellia567890/hls/poster.jpg'
    },
    {
      name: 'Ayelet Story', 
      url: 'https://dms5pg8p1t5xt.cloudfront.net/renders/newayalet567890/hls/master.m3u8',
      poster: 'https://dms5pg8p1t5xt.cloudfront.net/renders/newayalet567890/hls/poster.jpg'
    },
    {
      name: 'Alisa Story',
      url: 'https://dms5pg8p1t5xt.cloudfront.net/renders/newalica567890/hls/master.m3u8',
      poster: 'https://dms5pg8p1t5xt.cloudfront.net/renders/newalica567890/hls/poster.jpg'
    }
  ];

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-9), `${timestamp}: ${message}`]);
  };

  // Override console.log to capture HLS logs
  React.useEffect(() => {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => {
      originalLog(...args);
      if (args[0] && typeof args[0] === 'string') {
        if (args[0].includes('HLS') || args[0].includes('Buffer') || args[0].includes('stall')) {
          addLog(args.join(' '));
        }
      }
    };

    console.warn = (...args) => {
      originalWarn(...args);
      if (args[0] && typeof args[0] === 'string') {
        if (args[0].includes('HLS') || args[0].includes('Buffer') || args[0].includes('stall')) {
          addLog(`WARN: ${args.join(' ')}`);
        }
      }
    };

    console.error = (...args) => {
      originalError(...args);
      if (args[0] && typeof args[0] === 'string') {
        if (args[0].includes('HLS') || args[0].includes('Buffer') || args[0].includes('stall')) {
          addLog(`ERROR: ${args.join(' ')}`);
        }
      }
    };

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  const handleVideoChange = (video) => {
    setTestVideo(video);
    addLog(`Switched to ${video.name}`);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        addLog('Video paused');
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        addLog('Video playing');
      }
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">HLS Buffer Stall Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Player */}
        <div className="space-y-4">
          <div className="bg-black rounded-lg overflow-hidden">
            <HlsPlayer
              ref={videoRef}
              src={testVideo.url}
              poster={testVideo.poster}
              classes="w-full h-64"
              controls={true}
              muted={false}
              autoPlay={false}
              priority={true}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handlePlayPause}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = 0;
                  addLog('Seeked to start');
                }
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Restart
            </button>
          </div>
        </div>

        {/* Test Controls and Logs */}
        <div className="space-y-4">
          {/* Video Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Test Videos</h3>
            <div className="space-y-2">
              {testVideos.map((video, index) => (
                <button
                  key={index}
                  onClick={() => handleVideoChange(video)}
                  className={`w-full text-left p-2 rounded border ${
                    testVideo.url === video.url 
                      ? 'bg-blue-100 border-blue-500' 
                      : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  {video.name}
                </button>
              ))}
            </div>
          </div>

          {/* Logs */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Live Logs</h3>
              <button
                onClick={clearLogs}
                className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Clear
              </button>
            </div>
            <div className="bg-black text-green-400 p-4 rounded h-64 overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-gray-500">Waiting for HLS events...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">Test Instructions</h3>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• Click "Play" to start the video</li>
          <li>• Watch the logs for buffer stall errors</li>
          <li>• Try different videos to test various scenarios</li>
          <li>• Look for "Buffer health" messages every 500ms</li>
          <li>• Check if stalls are automatically recovered from</li>
          <li>• Monitor quality level changes</li>
        </ul>
      </div>

      {/* Expected Behavior */}
      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-2">Expected Behavior (Fixed)</h3>
        <ul className="text-green-700 text-sm space-y-1">
          <li>✅ Buffer health should show 5+ seconds ahead</li>
          <li>✅ No "bufferStalledError" messages</li>
          <li>✅ Automatic quality downgrade when buffer is low</li>
          <li>✅ Emergency recovery measures if buffer gets critical</li>
          <li>✅ Smooth playback without interruptions</li>
        </ul>
      </div>
    </div>
  );
};

export default HlsStallTest;
