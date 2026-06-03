# Replace User Video - Quick Guide

## Overview
This guide helps you replace a user's video file with a new one using the Artisan command.

## Prerequisites
- User ID or email address
- New video file on your local system
- Access to the Laravel application

## Usage

### Basic Command (by User ID)
```bash
php artisan story:replace-video --user-id=123 --video-path="C:\path\to\new-video.mp4"
```

### By Email Address
```bash
php artisan story:replace-video --email="user@example.com" --video-path="C:\path\to\new-video.mp4"
```

### Delete Old Video File
Add `--delete-old` flag to automatically delete the old video file:
```bash
php artisan story:replace-video --user-id=123 --video-path="C:\path\to\new-video.mp4" --delete-old
```

## Example

**Scenario:** User with email `john@example.com` has uploaded a low-quality video. You have a high-quality version at `D:\videos\john-high-quality.mp4`

**Command:**
```bash
php artisan story:replace-video --email="john@example.com" --video-path="D:\videos\john-high-quality.mp4" --delete-old
```

**Output:**
```
Found user: John Doe (john@example.com) - ID: 123
Found story ID: 456
Current video: old-video-uuid.mp4
New filename will be: new-uuid.mp4
Uploading new video...
Using S3 storage (or Using local storage)
✓ Video uploaded successfully
✓ Story record updated
✓ Old video deleted
✓ Success! Video replaced successfully
New video URL: https://your-domain.com/storage/videos/new-uuid.mp4
```

## What the Command Does

1. ✅ Finds the user by ID or email
2. ✅ Locates their story (assumes only one story per user)
3. ✅ Uploads the new video file to storage (S3 or local)
4. ✅ Updates the story record with new video filename
5. ✅ Optionally deletes the old video file
6. ✅ Shows confirmation and new video URL

## Storage Location

- **Local Storage:** `storage/app/public/videos/`
- **S3 Storage:** Configured S3 bucket `videos/` folder

The command automatically detects which storage is configured based on your `.env` file.

## Notes

- The command generates a unique UUID filename for the new video
- Original file extension is preserved
- Old video is only deleted if `--delete-old` flag is used
- Works with both local storage and S3
- Safe operation - validates user and story exist before proceeding

## Troubleshooting

**Error: User not found**
- Double-check the user ID or email address
- Ensure user exists in the database

**Error: No story found**
- Verify the user has a story uploaded
- Check the `stories` table for records with this `user_id`

**Error: Video file not found**
- Verify the file path is correct
- Use absolute path (full path from root)
- On Windows, use double quotes around path: `"C:\path\to\file.mp4"`

**Error: Permission denied**
- Check file permissions on the video file
- Ensure Laravel has write access to storage directory
