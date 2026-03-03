// Cloudflare R2 Storage Service — uses S3-compatible API via CDN
// R2 is S3-compatible, so we use the AWS S3 presigned URL approach

const R2_CONFIG = {
    accountId: import.meta.env.VITE_R2_ACCOUNT_ID,
    accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY,
    bucketName: import.meta.env.VITE_R2_BUCKET_NAME || 'bharatapp-media',
    publicUrl: import.meta.env.VITE_R2_PUBLIC_URL,
};

const isDemoMode = () => !R2_CONFIG.accessKeyId || R2_CONFIG.accessKeyId === 'your_r2_access_key';

/**
 * Generate a unique filename for uploads
 */
function generateFileName(file, folder = 'uploads') {
    const ext = file.name.split('.').pop();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${folder}/${timestamp}-${random}.${ext}`;
}

/**
 * Upload a file to Cloudflare R2
 * In production: uses direct R2 API or a backend presigned URL endpoint
 * In demo: returns a placeholder URL
 */
export async function uploadFile(file, folder = 'uploads') {
    if (isDemoMode()) {
        console.log(`📁 [Demo] Would upload: ${file.name} (${(file.size / 1024).toFixed(1)}KB) to ${folder}/`);
        // Return a demo URL
        return {
            url: `https://placehold.co/400x400/FF9933/white?text=${encodeURIComponent(file.name)}`,
            key: generateFileName(file, folder),
            success: true,
            demo: true,
        };
    }

    const key = generateFileName(file, folder);
    const endpoint = `https://${R2_CONFIG.accountId}.r2.cloudflarestorage.com/${R2_CONFIG.bucketName}/${key}`;

    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type,
                'X-Amz-Content-Sha256': 'UNSIGNED-PAYLOAD',
            },
            body: file,
        });

        if (!response.ok) throw new Error(`Upload failed: ${response.status}`);

        const publicUrl = R2_CONFIG.publicUrl
            ? `${R2_CONFIG.publicUrl}/${key}`
            : endpoint;

        return { url: publicUrl, key, success: true, demo: false };
    } catch (error) {
        console.error('R2 upload error:', error);
        throw error;
    }
}

/**
 * Upload profile image
 */
export async function uploadProfileImage(file, userId) {
    return uploadFile(file, `profiles/${userId}`);
}

/**
 * Upload post image
 */
export async function uploadPostImage(file, userId) {
    return uploadFile(file, `posts/${userId}`);
}

/**
 * Upload story image/video
 */
export async function uploadStoryMedia(file, userId) {
    return uploadFile(file, `stories/${userId}`);
}

/**
 * Upload group cover image
 */
export async function uploadGroupCover(file, groupId) {
    return uploadFile(file, `groups/${groupId}`);
}

/**
 * Delete a file from R2
 */
export async function deleteFile(key) {
    if (isDemoMode()) {
        console.log(`🗑️ [Demo] Would delete: ${key}`);
        return { success: true, demo: true };
    }

    const endpoint = `https://${R2_CONFIG.accountId}.r2.cloudflarestorage.com/${R2_CONFIG.bucketName}/${key}`;

    try {
        const response = await fetch(endpoint, { method: 'DELETE' });
        return { success: response.ok, demo: false };
    } catch (error) {
        console.error('R2 delete error:', error);
        throw error;
    }
}

/**
 * Get public URL for a stored file
 */
export function getPublicUrl(key) {
    if (isDemoMode() || !R2_CONFIG.publicUrl) {
        return `https://placehold.co/400x400/FF9933/white?text=Media`;
    }
    return `${R2_CONFIG.publicUrl}/${key}`;
}
