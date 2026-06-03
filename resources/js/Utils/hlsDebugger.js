// HLS Debugging Utilities
export const hlsDebugger = {
  // Log buffer information
  logBufferInfo: (video, hlsInstance) => {
    if (!video || !hlsInstance) return;
    
    const buffered = video.buffered;
    const currentTime = video.currentTime;
    const duration = video.duration;
    
    console.group('HLS Buffer Debug Info');
    console.log('Current Time:', currentTime.toFixed(2));
    console.log('Duration:', duration.toFixed(2));
    console.log('Buffered Ranges:', buffered.length);
    
    for (let i = 0; i < buffered.length; i++) {
      console.log(`Range ${i}: ${buffered.start(i).toFixed(2)} - ${buffered.end(i).toFixed(2)}`);
    }
    
    if (buffered.length > 0) {
      const currentBuffer = buffered.end(buffered.length - 1) - currentTime;
      console.log('Buffer Ahead:', currentBuffer.toFixed(2) + 's');
    }
    
    console.log('HLS Level:', hlsInstance.currentLevel);
    console.log('HLS Levels Available:', hlsInstance.levels?.length || 0);
    console.log('HLS Loading State:', hlsInstance.loading);
    console.groupEnd();
  },
  
  // Check if buffer is healthy
  isBufferHealthy: (video, minBuffer = 2) => {
    if (!video) return false;
    
    const buffered = video.buffered;
    const currentTime = video.currentTime;
    
    if (buffered.length === 0) return false;
    
    const currentBuffer = buffered.end(buffered.length - 1) - currentTime;
    return currentBuffer >= minBuffer;
  },
  
  // Get buffer gaps
  getBufferGaps: (video) => {
    if (!video) return [];
    
    const buffered = video.buffered;
    const gaps = [];
    
    for (let i = 0; i < buffered.length - 1; i++) {
      const gap = buffered.start(i + 1) - buffered.end(i);
      if (gap > 0.1) { // Only report gaps larger than 100ms
        gaps.push({
          start: buffered.end(i),
          end: buffered.start(i + 1),
          duration: gap
        });
      }
    }
    
    return gaps;
  },
  
  // Monitor buffer health over time
  startBufferMonitoring: (video, hlsInstance, interval = 2000) => {
    const monitor = setInterval(() => {
      hlsDebugger.logBufferInfo(video, hlsInstance);
      
      const gaps = hlsDebugger.getBufferGaps(video);
      if (gaps.length > 0) {
        console.warn('Buffer gaps detected:', gaps);
      }
      
      if (!hlsDebugger.isBufferHealthy(video)) {
        console.warn('Buffer is unhealthy - may cause stalls');
      }
    }, interval);
    
    return () => clearInterval(monitor);
  },
  
  // Analyze HLS manifest
  analyzeManifest: (manifestText) => {
    const lines = manifestText.split('\n');
    const analysis = {
      isLive: false,
      targetDuration: 0,
      segments: [],
      variants: []
    };
    
    let currentVariant = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('#EXT-X-VERSION:')) {
        analysis.version = parseInt(line.split(':')[1]);
      } else if (line.startsWith('#EXT-X-TARGETDURATION:')) {
        analysis.targetDuration = parseInt(line.split(':')[1]);
      } else if (line.startsWith('#EXT-X-ENDLIST')) {
        analysis.isLive = false;
      } else if (line.startsWith('#EXT-X-STREAM-INF:')) {
        // Parse variant info
        const variantInfo = {};
        const parts = line.split(',');
        parts.forEach(part => {
          const [key, value] = part.split('=');
          if (key && value) {
            variantInfo[key] = value;
          }
        });
        currentVariant = variantInfo;
      } else if (line.startsWith('#EXTINF:')) {
        const duration = parseFloat(line.split(':')[1]);
        analysis.segments.push({ duration });
      } else if (line && !line.startsWith('#') && currentVariant) {
        analysis.variants.push({
          ...currentVariant,
          url: line
        });
        currentVariant = null;
      }
    }
    
    console.log('HLS Manifest Analysis:', analysis);
    return analysis;
  }
};

export default hlsDebugger;
