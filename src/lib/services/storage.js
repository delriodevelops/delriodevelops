import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
    listAll
} from 'firebase/storage';
import { storage } from '../firebase';

/**
 * Upload an image to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} folder - The folder to upload to (e.g., 'blog', 'projects')
 * @returns {Promise<string>} - The download URL
 */
export async function uploadImage(file, folder = 'images') {
    try {
        // Create a unique filename
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${timestamp}_${safeName}`;
        const filePath = `${folder}/${fileName}`;

        // Create a reference
        const storageRef = ref(storage, filePath);

        // Upload the file
        const snapshot = await uploadBytes(storageRef, file, {
            contentType: file.type,
        });

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

/**
 * Delete an image from Firebase Storage
 * @param {string} url - The full URL of the image to delete
 */
export async function deleteImage(url) {
    try {
        // Extract the path from the URL
        const baseUrl = 'https://firebasestorage.googleapis.com';
        if (!url.startsWith(baseUrl)) {
            console.log('Not a Firebase Storage URL, skipping delete');
            return;
        }

        // Create a reference from the URL
        const imageRef = ref(storage, url);
        await deleteObject(imageRef);
    } catch (error) {
        console.error('Error deleting image:', error);
        // Don't throw - image might not exist
    }
}

/**
 * List all images in a folder
 * @param {string} folder - The folder to list
 * @returns {Promise<Array<{name: string, url: string}>>}
 */
export async function listImages(folder = 'images') {
    try {
        const folderRef = ref(storage, folder);
        const result = await listAll(folderRef);

        const images = await Promise.all(
            result.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                return {
                    name: itemRef.name,
                    url,
                };
            })
        );

        return images;
    } catch (error) {
        console.error('Error listing images:', error);
        return [];
    }
}
