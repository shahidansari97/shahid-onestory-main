import Dexie from "dexie";

// Must match your DB_NAME and DB_VERSION from Next.js project
const DB_NAME = "VideoEditorDB";       // <-- replace with actual
const DB_VERSION = 0.5;               // <-- replace with actual
const MEDIA_STORE = "userMedia";        // <-- replace with actual store name

// Init Dexie instance
const db = new Dexie(DB_NAME);

// Define stores & indexes (must match your Next.js setup)
db.version(DB_VERSION).stores({
  [MEDIA_STORE]: "id,userId, type, createdAt"
  // id = primary key, other fields are indexed
});
async function checkDbConnection() {
  try {
    // Force IndexedDB open
    await db.open();

    console.log(`✅ Connected to IndexedDB: ${db.name}`);
    console.log(`📦 Available tables:`, db.tables.map(t => t.name));

    return true;
  } catch (error) {
    console.error("❌ Failed to connect to IndexedDB:", error);
    return false;
  }
}
checkDbConnection();
export { db, MEDIA_STORE,checkDbConnection };
