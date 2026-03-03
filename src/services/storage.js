/**
 * Storage Service — uses Supabase Storage (S3-compatible, 1GB free)
 *
 * Buckets:
 *   - profiles  → profile images
 *   - posts     → post images/videos
 *   - stories   → story media
 *   - groups    → group cover images
 */

import { supabase } from '../lib/supabase';

const isDemoMode = () => !supabase;

function generateFileName(file, folder = 'uploads') {
    const ext = file.name.split('.').pop();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${folder}/${timestamp}-${random}.${ext}`;
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(file, folder = 'uploads', bucket = 'media') {
    if (isDemoMode()) {
        console.log(`📁 [Demo] Would upload: ${file.name} (${(file.size / 1024).toFixed(1)}KB) to ${folder}/`);
        return {
            url: `https://placehold.co/400x400/FF9933/white?text=${encodeURIComponent(file.name)}`,
            key: generateFileName(file, folder),
            success: true,
            demo: true,
        };
    }

    const key = generateFileName(file, folder);

    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(key, file, {
                contentType: file.type,
                upsert: true,
            });

        if (error) throw error;

        // Get public URL
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(key);

        return {
            url: urlData.publicUrl,
            key,
            success: true,
            demo: false,
        };
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
}

export async function uploadProfileImage(file, userId) {
    return uploadFile(file, `profiles/${userId}`, 'media');
}

export async function uploadPostImage(file, userId) {
    return uploadFile(file, `posts/${userId}`, 'media');
}

export async function uploadStoryMedia(file, userId) {
    return uploadFile(file, `stories/${userId}`, 'media');
}

export async function uploadGroupCover(file, groupId) {
    return uploadFile(file, `groups/${groupId}`, 'media');
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(key, bucket = 'media') {
    if (isDemoMode()) {
        console.log(`🗑️ [Demo] Would delete: ${key}`);
        return { success: true, demo: true };
    }

    try {
        const { error } = await supabase.storage.from(bucket).remove([key]);
        if (error) throw error;
        return { success: true, demo: false };
    } catch (error) {
        console.error('Delete error:', error);
        throw error;
    }
}

/**
 * Get public URL for a stored file
 */
export function getPublicUrl(key, bucket = 'media') {
    if (isDemoMode()) {
        return `https://placehold.co/400x400/FF9933/white?text=Media`;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(key);
    return data.publicUrl;
}
