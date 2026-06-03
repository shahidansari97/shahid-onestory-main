import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const useUserMedia = (userId) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching media from MySQL for userId:", userId);
        
        // Fetch media from MySQL database via API
        const response = await axios.get(route('media.get'));
        console.log("response.data",response.data);
        if (response.data.success) {
          setMedia(response.data.media);
          console.log(`✅ Loaded ${response.data.media.length} media items from MySQL`);
        } else {
          console.error("Failed to fetch media:", response.data.message);
          setError(response.data.message);
          setMedia([]);
        }
      } catch (err) {
        console.error("Error fetching media from MySQL:", err);
        setError(err.message);
        setMedia([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [userId]);

  // Function to clear media for given userId
  const clearUserMedia = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      
      // Clear media from MySQL database via API
      const response = await axios.delete(route('media.clear'));

      if (response.data.success) {
        // Reset state
        setMedia([]);
        console.log(`✅ Cleared all media for userId: ${userId}`);
      } else {
        console.error("Failed to clear media:", response.data.message);
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Error clearing media from MySQL:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { media, clearUserMedia, loading, error };
};

export default useUserMedia;
