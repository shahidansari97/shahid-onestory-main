import React, { useState, useEffect, useRef } from 'react';
import HlsPlayer from './HlsPlayer';
import useHlsCache from '@/Hooks/useHlsCache';

const HlsPerformanceTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(0);
  const testVideos = [
    {
      name: 'Test Video 1',
      url: 'https://dms5pg8p1t5xt.cloudfront.net/renders/newodellia567890/hls/master.m3u8',
      poster: 'https://dms5pg8p1t5xt.cloudfront.net/renders/newodellia567890/hls/poster.jpg'
    },
    {
      name: 'Test Video 2', 
      url: 'https://dms5pg8p1t5xt.cloudfront.net/renders/newayalet567890/hls/master.m3u8',
      poster: 'https://dms5pg8p1t5xt.cloudfront.net/renders/newayalet567890/hls/poster.jpg'
    },
    {
      name: 'Test Video 3',
      url: 'https://dms5pg8p1t5xt.cloudfront.net/renders/newalica567890/hls/master.m3u8', 
      poster: 'https://dms5pg8p1t5xt.cloudfront.net/renders/newalica567890/hls/poster.jpg'
    }
  ];

  const { cacheStats, clearCache, getCacheStats, formatCacheSize } = useHlsCache();
  const videoRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    getCacheStats();
  }, [getCacheStats]);

  const runPerformanceTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    for (let i = 0; i < testVideos.length; i++) {
      setCurrentTest(i);
      const video = testVideos[i];
      
      // Clear cache before each test
      await clearCache();
      
      // Measure load time
      const startTime = performance.now();
      startTimeRef.current = startTime;
      
      // Simulate video loading
      const videoElement = document.createElement('video');
      videoElement.src = video.url;
      videoElement.preload = 'metadata';
      
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout'));
        }, 30000); // 30 second timeout
        
        videoElement.addEventListener('loadedmetadata', () => {
          clearTimeout(timeout);
          const loadTime = performance.now() - startTime;
          
          setTestResults(prev => [...prev, {
            video: video.name,
            loadTime: Math.round(loadTime),
            timestamp: new Date().toLocaleTimeString(),
            success: true
          }]);
          resolve();
        });
        
        videoElement.addEventListener('error', () => {
          clearTimeout(timeout);
          setTestResults(prev => [...prev, {
            video: video.name,
            loadTime: null,
            timestamp: new Date().toLocaleTimeString(),
            success: false,
            error: 'Failed to load'
          }]);
          resolve();
        });
      });
      
      // Wait between tests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    setIsRunning(false);
    setCurrentTest(0);
  };

  const getAverageLoadTime = () => {
    const successfulTests = testResults.filter(r => r.success && r.loadTime);
    if (successfulTests.length === 0) return 0;
    return Math.round(
      successfulTests.reduce((sum, r) => sum + r.loadTime, 0) / successfulTests.length
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">HLS Performance Test</h1>
      
      {/* Cache Statistics */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Cache Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium">Cache Size:</span> {formatCacheSize(cacheStats.size)}
          </div>
          <div>
            <span className="font-medium">Cached Entries:</span> {cacheStats.entries}
          </div>
        </div>
        <button 
          onClick={clearCache}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear Cache
        </button>
      </div>

      {/* Test Controls */}
      <div className="mb-6">
        <button
          onClick={runPerformanceTest}
          disabled={isRunning}
          className={`px-6 py-3 rounded-lg font-medium ${
            isRunning 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isRunning ? `Running Test ${currentTest + 1}/${testVideos.length}...` : 'Run Performance Test'}
        </button>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="bg-white border rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Video</th>
                  <th className="text-left py-2">Load Time</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {testResults.map((result, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{result.video}</td>
                    <td className="py-2">
                      {result.loadTime ? `${result.loadTime}ms` : 'N/A'}
                    </td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {result.success ? 'Success' : 'Failed'}
                      </span>
                    </td>
                    <td className="py-2">{result.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {testResults.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <strong>Average Load Time:</strong> {getAverageLoadTime()}ms
            </div>
          )}
        </div>
      )}

      {/* Live Video Test */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Live Video Test</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testVideos.map((video, index) => (
            <div key={index} className="border rounded p-4">
              <h3 className="font-medium mb-2">{video.name}</h3>
              <HlsPlayer
                ref={videoRef}
                src={video.url}
                poster={video.poster}
                classes="w-full h-48 object-cover rounded"
                controls={true}
                muted={true}
                autoPlay={false}
                priority={index === 0} // First video is priority
              />
            </div>
          ))}
        </div>
      </div>

      {/* Performance Tips */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">Performance Tips</h3>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• Test on actual iPhone device for accurate results</li>
          <li>• Clear cache between tests for consistent measurements</li>
          <li>• Test on different network conditions (WiFi, 4G, 5G)</li>
          <li>• Monitor browser developer tools for network requests</li>
          <li>• Check service worker registration in Application tab</li>
        </ul>
      </div>
    </div>
  );
};

export default HlsPerformanceTest;
