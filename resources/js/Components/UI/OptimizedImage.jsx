import React, { useState, useCallback, memo } from 'react';

/**
 * Optimized Image Component with WebP/AVIF Support
 * Automatically serves the best format based on browser support
 */

const OptimizedImage = memo(function OptimizedImage({
  src,
  webpSrc,
  avifSrc,
  alt,
  className,
  style,
  width,
  height,
  loading = 'lazy',
  onLoad,
  onError,
  fallbackSrc,
  ...props
}) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Check browser support for modern formats
  const supportsWebP = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }, []);

  const supportsAVIF = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  }, []);

  // Get the best image source based on browser support
  const getBestImageSrc = useCallback(() => {
    if (supportsAVIF() && avifSrc) {
      return avifSrc;
    } else if (supportsWebP() && webpSrc) {
      return webpSrc;
    } else {
      return src;
    }
  }, [src, webpSrc, avifSrc, supportsWebP, supportsAVIF]);

  // Handle image load
  const handleLoad = useCallback((e) => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.(e);
  }, [onLoad]);

  // Handle image error
  const handleError = useCallback((e) => {
    setHasError(true);
    
    // Try fallback sources in order
    if (currentSrc === avifSrc && webpSrc) {
      setCurrentSrc(webpSrc);
    } else if (currentSrc === webpSrc && src) {
      setCurrentSrc(src);
    } else if (fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      onError?.(e);
    }
  }, [currentSrc, avifSrc, webpSrc, src, fallbackSrc, onError]);

  // Set initial source
  React.useEffect(() => {
    setCurrentSrc(getBestImageSrc());
  }, [getBestImageSrc]);

  // Generate srcset for responsive images
  const generateSrcSet = useCallback((baseSrc) => {
    if (!baseSrc) return undefined;
    
    const baseUrl = baseSrc.split('.')[0];
    const extension = baseSrc.split('.').pop();
    
    return `${baseUrl}@1x.${extension} 1x, ${baseUrl}@2x.${extension} 2x, ${baseUrl}@3x.${extension} 3x`;
  }, []);

  // Generate sizes attribute for responsive images
  const generateSizes = useCallback(() => {
    if (width) {
      return `(max-width: 768px) 100vw, ${width}px`;
    }
    return '100vw';
  }, [width]);

  return (
    <picture className={className} style={style}>
      {/* AVIF source */}
      {avifSrc && (
        <source
          srcSet={generateSrcSet(avifSrc)}
          sizes={generateSizes()}
          type="image/avif"
        />
      )}
      
      {/* WebP source */}
      {webpSrc && (
        <source
          srcSet={generateSrcSet(webpSrc)}
          sizes={generateSizes()}
          type="image/webp"
        />
      )}
      
      {/* Fallback img element */}
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={`${className} ${isLoaded ? 'loaded' : 'loading'} ${hasError ? 'error' : ''}`}
        style={{
          ...style,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div
          className="image-placeholder"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...style
          }}
        >
          <div className="loading-spinner" style={{
            width: '20px',
            height: '20px',
            border: '2px solid #ccc',
            borderTop: '2px solid #333',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      )}
      
      {/* Error placeholder */}
      {hasError && (
        <div
          className="image-error"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f8f8f8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '12px',
            ...style
          }}
        >
          Image not available
        </div>
      )}
    </picture>
  );
});

export default OptimizedImage;
