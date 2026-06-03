/**
 * Analytics utility functions
 * Handles dataLayer pushes with UTM parameters and user ID
 */

/**
 * Get UTM parameters from sessionStorage
 * @returns {Object} Object containing UTM parameters
 */
export function getUTMParams() {
    const utmParams = {};
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_ad'];
    
    utmKeys.forEach(key => {
        const value = sessionStorage.getItem(key);
        if (value) {
            utmParams[key] = value;
        }
    });
    
    return utmParams;
}

/**
 * Capture UTM parameters from URL and store in sessionStorage
 * Should be called on page load
 */
export function captureUTMParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_ad'];
    
    let hasUTM = false;
    
    utmKeys.forEach(key => {
        const value = urlParams.get(key);
        if (value) {
            sessionStorage.setItem(key, value);
            hasUTM = true;
        }
    });
    
    // Only store UTM params if at least one exists in URL
    // This prevents overwriting existing stored values with empty values
    return hasUTM;
}

/**
 * Push event to dataLayer with user ID and UTM parameters
 * @param {string} eventName - Name of the event
 * @param {number|string|null} userId - User ID (optional)
 * @param {Object} additionalData - Any additional data to include
 */
export function pushToDataLayer(eventName, userId = null, additionalData = {}) {
    if (typeof window === 'undefined' || !window.dataLayer) {
        console.warn('dataLayer not available');
        return;
    }
    
    const utmParams = getUTMParams();
    
    const eventData = {
        event: eventName,
        ...additionalData
    };
    
    // Add user ID if provided
    if (userId) {
        eventData.user_id = userId;
    }
    
    // Add UTM parameters if they exist
    Object.keys(utmParams).forEach(key => {
        eventData[key] = utmParams[key];
    });
    
    window.dataLayer.push(eventData);
    
    // Optional: Log for debugging (remove in production if needed)
    if (process.env.NODE_ENV === 'development') {
        console.log('Analytics Event:', eventData);
    }
}

/**
 * Track signup event
 * @param {number|string} userId - User ID
 */
export function trackSignup(userId) {
    pushToDataLayer('signup', userId);
}

/**
 * Track "Create A Story" button click
 * @param {number|string|null} userId - User ID (optional, null if not logged in)
 */
export function trackCreateStoryClick(userId = null) {
    pushToDataLayer('create_story_click', userId);
}

/**
 * Track video upload event
 * @param {number|string} userId - User ID
 */
export function trackVideoUpload(userId) {
    pushToDataLayer('video_upload', userId);
}

