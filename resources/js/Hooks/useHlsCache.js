import { useEffect, useState } from 'react';

const useHlsCache = () => {
  const [isServiceWorkerSupported, setIsServiceWorkerSupported] = useState(false);
  const [isServiceWorkerRegistered, setIsServiceWorkerRegistered] = useState(false);
  const [cacheStats, setCacheStats] = useState({ size: 0, entries: 0 });

  useEffect(() => {
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
      setIsServiceWorkerSupported(true);
      
      // Register the service worker
      navigator.serviceWorker.register('/sw-hls-cache.js')
        .then((registration) => {
          console.log('HLS Cache Service Worker registered:', registration);
          setIsServiceWorkerRegistered(true);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  // Clear cache
  const clearCache = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('HLS cache cleared');
        setCacheStats({ size: 0, entries: 0 });
      } catch (error) {
        console.error('Error clearing cache:', error);
      }
    }
  };

  // Get cache statistics
  const getCacheStats = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        let totalSize = 0;
        let totalEntries = 0;

        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          totalEntries += keys.length;
          
          // Estimate size (this is approximate)
          for (const request of keys) {
            const response = await cache.match(request);
            if (response) {
              const blob = await response.blob();
              totalSize += blob.size;
            }
          }
        }

        setCacheStats({ 
          size: totalSize, 
          entries: totalEntries 
        });
      } catch (error) {
        console.error('Error getting cache stats:', error);
      }
    }
  };

  // Preload HLS manifest and first few segments
  const preloadHlsVideo = async (manifestUrl) => {
    if (!isServiceWorkerRegistered) return;

    try {
      // Fetch and cache the manifest
      const manifestResponse = await fetch(manifestUrl);
      if (manifestResponse.ok) {
        const manifestText = await manifestResponse.text();
        
        // Parse manifest to find segment URLs
        const segmentUrls = [];
        const lines = manifestText.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line && !line.startsWith('#') && line.includes('.ts')) {
            // Construct full URL for segment
            const baseUrl = manifestUrl.substring(0, manifestUrl.lastIndexOf('/') + 1);
            const segmentUrl = line.startsWith('http') ? line : baseUrl + line;
            segmentUrls.push(segmentUrl);
          }
        }

        // Preload first 3 segments
        const segmentsToPreload = segmentUrls.slice(0, 3);
        await Promise.all(
          segmentsToPreload.map(url => 
            fetch(url).catch(err => console.warn('Failed to preload segment:', url, err))
          )
        );

        console.log(`Preloaded ${segmentsToPreload.length} segments for ${manifestUrl}`);
      }
    } catch (error) {
      console.error('Error preloading HLS video:', error);
    }
  };

  // Format cache size for display
  const formatCacheSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return {
    isServiceWorkerSupported,
    isServiceWorkerRegistered,
    cacheStats,
    clearCache,
    getCacheStats,
    preloadHlsVideo,
    formatCacheSize
  };
};

export default useHlsCache;
