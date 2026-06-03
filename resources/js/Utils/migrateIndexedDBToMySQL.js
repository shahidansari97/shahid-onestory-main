import { db, MEDIA_STORE } from '@/db';
import axios from 'axios';

/**
 * Utility to migrate IndexedDB data to MySQL
 */
export const migrateIndexedDBToMySQL = async (userId) => {
  try {
    console.log('Starting migration from IndexedDB to MySQL...');

    // 1. Export all media from IndexedDB
    const mediaData = await db[MEDIA_STORE]
      .where('userId')
      .equals(userId.toString())
      .toArray();

    console.log(`Found ${mediaData.length} media items in IndexedDB`);

    // 2. Migrate media data to MySQL
    for (const media of mediaData) {
      try {
        const response = await axios.post(route('media.save'), {
          type: media.type,
          name: media.name || 'Migrated Media',
          url: media.url,
          extension: media.extension || 'unknown',
          videoId: media.videoId,
          thumbnails: media.thumbnails,
          reference: media.reference,
          captions: media.captions,
          has_audio: media.has_audio || false,
          duration: media.duration || 0
        });

        if (response.data.success) {
          console.log(`Migrated media: ${media.name || 'Unknown'}`);
        } else {
          console.error(`Failed to migrate media: ${response.data.message}`);
        }
      } catch (error) {
        console.error(`Error migrating media item:`, error);
      }
    }

    // 3. Clear IndexedDB data after successful migration
    await db[MEDIA_STORE]
      .where('userId')
      .equals(userId.toString())
      .delete();

    console.log('Migration completed successfully!');
    return {
      success: true,
      message: `Successfully migrated ${mediaData.length} media items`,
      migratedCount: mediaData.length
    };

  } catch (error) {
    console.error('Migration failed:', error);
    return {
      success: false,
      message: 'Migration failed: ' + error.message,
      migratedCount: 0
    };
  }
};

/**
 * Check if user has data in IndexedDB that needs migration
 */
export const hasIndexedDBData = async (userId) => {
  try {
    const count = await db[MEDIA_STORE]
      .where('userId')
      .equals(userId.toString())
      .count();

    return count > 0;
  } catch (error) {
    console.error('Error checking IndexedDB data:', error);
    return false;
  }
};

/**
 * Get IndexedDB data count for a user
 */
export const getIndexedDBDataCount = async (userId) => {
  try {
    const count = await db[MEDIA_STORE]
      .where('userId')
      .equals(userId.toString())
      .count();

    return count;
  } catch (error) {
    console.error('Error getting IndexedDB data count:', error);
    return 0;
  }
};
