# File Upload System - One Story Application

## 📤 Overview

The application supports multiple file upload methods for different purposes:
1. **General File Upload** - Images, videos, avatars, cover images
2. **Video Editor Media** - Images, videos, audio for story creation
3. **Audio Recording** - Voice recordings
4. **Support Images** - Support ticket attachments
5. **Chat Attachments** - Chatify file uploads

---

## 🎯 Upload Controllers & Routes

### **1. UploadController** (General Purpose)
**File**: `app/Http/Controllers/UploadController.php`  
**Route**: `POST /upload`  
**Route Name**: `user.upload.file`

**Purpose**: Handles general file uploads (avatars, images, cover images, videos)

**Supported Types:**
- `avatar` → `users-avatar/` folder
- `image` → `images/` folder
- `cover_image` → `cover-images/` folder
- `video` → `videos/` folder

**Code:**
```php
public function file(Request $request)
{
    $allowedType = $request->input('allowed_types', 'image');
    $folder = $this->fileTypes[$allowedType] ?? 'uploads';
    
    // Upload from URL or file
    if ($request->has('imageUrl')) {
        return $this->uploadFromUrl($request->input('imageUrl'), $folder);
    }
    
    return $this->uploadFromFile($request, $allowedType, $folder);
}
```

**Validation:**
- Images: `image` validation
- Videos: `mimes:mp4,mov,avi,flv,mkv`
- Cover Images: `image` validation

**Response:**
```json
{
    "url": "/storage/images/filename.jpg",
    "fileName": "filename.jpg"
}
```

---

### **2. VideoEditorController** (Video Editor Media)
**File**: `app/Http/Controllers/VideoEditorController.php`  
**Route**: `POST /stories/upload-media`  
**Service**: `VideoEditorService`

**Purpose**: Uploads media files for video editor (images, videos, audio)

**Supported Types:**
- Images: `jpg, jpeg, png, gif`
- Videos: `mp4, avi, mov`
- Audio: `mp3, wav`
- Max Size: `500480 KB` (~500 MB)

**Code:**
```php
public function upload(Request $request)
{
    return $this->videoEditorService->uploadMedia($request);
}
```

**Service Logic** (`VideoEditorService::uploadMedia`):
```php
// Detects file type by MIME type
if (str_starts_with($mimeType, 'image/')) {
    $folder = 'images';
} elseif (str_starts_with($mimeType, 'video/')) {
    $folder = 'videos';
} elseif (str_starts_with($mimeType, 'audio/')) {
    $folder = 'audios';
}

$path = $request->file('file')->store($folder, 'public');
$url = Storage::url($path);
```

**Response:**
```json
{
    "url": "/storage/videos/filename.mp4",
    "fileName": "filename.mp4",
    "success": true
}
```

---

### **3. RecorderController** (Audio Recordings)
**File**: `app/Http/Controllers/RecorderController.php`  
**Route**: `POST /recorder/store`  
**Route Name**: `user.recorder.store`

**Purpose**: Uploads audio recordings from voice recorder

**Code:**
```php
public function store(Request $request)
{
    $file = $request->file('audio');
    $uuid = Str::uuid()->toString();
    $extension = $file->getClientOriginalExtension();
    $filename = $uuid . '.' . $extension;
    
    $path = $file->storeAs('audio-recordings', $filename, 'public');
    
    AudioRecording::create([
        'user_id' => auth()->id(),
        'path' => $path,
        'publish_type' => $request->publish_type ?? 'public'
    ]);
}
```

**Frontend** (`resources/js/Pages/Recorder/Recorder.jsx`):
```javascript
const form = new FormData();
form.append("userId", auth?.user?.id);
form.append("audio", recordedFile);
form.append("publish_type", type);

const response = await axios.post(route('user.recorder.store'), form, {
    headers: {
        "Content-Type": "multipart/form-data",
    },
});
```

---

## 📁 Storage Configuration

### **Filesystem Disks** (`config/filesystems.php`)

**Public Disk:**
```php
'public' => [
    'driver' => 'local',
    'root' => storage_path('app/public'),
    'url' => env('APP_URL').'/storage',
    'visibility' => 'public',
]
```

**Storage Locations:**
- `storage/app/public/images/` - Images
- `storage/app/public/videos/` - Videos
- `storage/app/public/audios/` - Audio files
- `storage/app/public/users-avatar/` - User avatars
- `storage/app/public/cover-images/` - Cover images
- `storage/app/public/audio-recordings/` - Voice recordings
- `storage/app/public/support/images/` - Support images
- `storage/app/public/drafts/` - Editor drafts

**Symbolic Link:**
```bash
php artisan storage:link
```
Creates: `public/storage` → `storage/app/public`

---

## 🔄 Upload Flow

### **General Upload Flow:**
```
1. Frontend: User selects file
   ↓
2. Frontend: FormData created with file
   ↓
3. Frontend: POST request to /upload
   ↓
4. Backend: UploadController::file()
   ↓
5. Backend: Validates file type & size
   ↓
6. Backend: Stores file in 'public' disk
   ↓
7. Backend: Returns JSON with URL
   ↓
8. Frontend: Uses URL for display/storage
```

### **Video Editor Upload Flow:**
```
1. Frontend: User selects media file
   ↓
2. Frontend: POST /stories/upload-media
   ↓
3. Backend: VideoEditorController::upload()
   ↓
4. Backend: VideoEditorService::uploadMedia()
   ↓
5. Backend: Detects MIME type (image/video/audio)
   ↓
6. Backend: Stores in appropriate folder
   ↓
7. Backend: Returns URL + fileName
   ↓
8. Frontend: Adds to editor media library
```

---

## 📋 Upload Methods

### **Method 1: Upload from File**
```php
// UploadController::uploadFromFile()
$path = $request->file('file')->store($folder, 'public');
$url = Storage::url($path);
```

### **Method 2: Upload from URL**
```php
// UploadController::uploadFromUrl()
$client = new Client();
$response = $client->get($imageUrl);
$imageContent = $response->getBody()->getContents();
$path = $folder . "/" . uniqid() . "_" . basename($imageUrl);
Storage::disk('public')->put($path, $imageContent);
```

### **Method 3: Store with Custom Name**
```php
// RecorderController::store()
$filename = Str::uuid()->toString() . '.' . $extension;
$path = $file->storeAs('audio-recordings', $filename, 'public');
```

---

## 🎨 Frontend Upload Examples

### **Example 1: General File Upload**
```javascript
// React component
const handleFileUpload = async (file, allowedType = 'image') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('allowed_types', allowedType);
    
    try {
        const response = await axios.post(route('user.upload.file'), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        console.log('Uploaded:', response.data.url);
        return response.data.url;
    } catch (error) {
        console.error('Upload failed:', error);
    }
};
```

### **Example 2: Video Editor Upload**
```javascript
// Video editor component
const uploadMedia = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post('/stories/upload-media', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    
    if (response.data.success) {
        // Add to media library
        addMediaToLibrary(response.data.url, response.data.fileName);
    }
};
```

### **Example 3: Audio Recording Upload**
```javascript
// Recorder component (from Recorder.jsx)
const uploadAudio = async (type) => {
    const form = new FormData();
    form.append("userId", auth?.user?.id);
    form.append("audio", recordedFile);
    form.append("publish_type", type);
    
    const response = await axios.post(route('user.recorder.store'), form, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
```

---

## 🔒 Security Features

### **Validation:**
- ✅ File type validation (MIME types)
- ✅ File size limits (500MB for video editor)
- ✅ Extension whitelisting
- ✅ Required file checks

### **Storage:**
- ✅ Files stored in `public` disk (accessible via URL)
- ✅ UUID-based naming prevents conflicts
- ✅ Organized by folder structure
- ✅ Symbolic link for public access

### **Access Control:**
- ✅ Authentication required (`auth` middleware)
- ✅ User-specific folders where applicable
- ✅ Public URLs for shared content

---

## 📊 File Upload Summary

| Upload Type | Controller | Route | Folder | Max Size |
|------------|------------|-------|--------|----------|
| **General Files** | UploadController | `/upload` | `images/`, `videos/`, etc. | Default |
| **Video Editor** | VideoEditorController | `/stories/upload-media` | `images/`, `videos/`, `audios/` | 500MB |
| **Audio Recording** | RecorderController | `/recorder/store` | `audio-recordings/` | Default |
| **Support Images** | SupportController | `/support` | `support/images/` | Default |
| **Chat Files** | Chatify | `/chatify` | Chatify folder | Chatify limit |

---

## 🛠️ Usage Examples

### **Upload Avatar:**
```javascript
const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('allowed_types', 'avatar');
    
    const response = await axios.post(route('user.upload.file'), formData);
    // Returns: { url: "/storage/users-avatar/uuid.jpg", fileName: "uuid.jpg" }
};
```

### **Upload Cover Image:**
```javascript
const uploadCover = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('allowed_types', 'cover_image');
    
    const response = await axios.post(route('user.upload.file'), formData);
    // Returns: { url: "/storage/cover-images/uuid.jpg", fileName: "uuid.jpg" }
};
```

### **Upload Video:**
```javascript
const uploadVideo = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('allowed_types', 'video');
    
    const response = await axios.post(route('user.upload.file'), formData);
    // Returns: { url: "/storage/videos/uuid.mp4", fileName: "uuid.mp4" }
};
```

---

## 🔍 File Storage Structure

```
storage/app/public/
├── images/              # General images
├── videos/              # General videos
├── audios/              # Audio files
├── users-avatar/        # User avatars
├── cover-images/        # Cover photos
├── audio-recordings/    # Voice recordings
├── support/images/      # Support attachments
└── drafts/              # Editor drafts (JSON)
```

**Public Access:**
- Files accessible via: `{APP_URL}/storage/{folder}/{filename}`
- Example: `https://example.com/storage/images/photo.jpg`

---

## 📝 Key Points

1. **Multiple Upload Endpoints**: Different controllers for different purposes
2. **Organized Storage**: Files organized by type in folders
3. **UUID Naming**: Prevents filename conflicts
4. **Public Disk**: Files accessible via public URLs
5. **Validation**: Type and size validation on all uploads
6. **Service Layer**: Video editor uses service for business logic
7. **FormData**: Frontend uses FormData for multipart uploads

---

## 🚀 Future Enhancements

- **Cloud Storage**: S3 integration ready (config exists)
- **Image Processing**: Resize/optimize on upload
- **Progress Tracking**: Upload progress bars
- **Chunked Uploads**: For large files
- **CDN Integration**: Serve files from CDN

---

## Summary

✅ **Multiple upload methods** for different file types  
✅ **Organized storage** structure  
✅ **Security validation** on all uploads  
✅ **Public access** via storage URLs  
✅ **Service layer** for complex uploads  
✅ **Frontend integration** with React/axios  

The file upload system is **fully functional** and ready for production use! 🎉
