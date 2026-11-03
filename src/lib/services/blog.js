import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Write path for blog posts, used by the admin panel through the Firebase
 * client SDK so Firestore rules can authenticate the signed-in user.
 *
 * Reads live in ../services/firestore-rest.js: they run on the server over the
 * REST API so pages can be rendered and cached instead of shipping an empty
 * shell that fetches on the client.
 */

const COLLECTION_NAME = 'blog_posts';

/**
 * Live, uncached read for the admin dashboard only. Public pages must use
 * ./firestore-rest.js instead, which runs on the server.
 */
export async function getAllPosts() {
    try {
        const postsRef = collection(db, COLLECTION_NAME);

        let snapshot;
        try {
            snapshot = await getDocs(query(postsRef, orderBy('createdAt', 'desc')));
        } catch (orderError) {
            // The composite index may not exist yet; sorting client-side is fine
            // for the handful of posts the dashboard shows.
            console.warn('Order index not available:', orderError.message);
            snapshot = await getDocs(postsRef);
        }

        return snapshot.docs
            .map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
                createdAt: docSnap.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                updatedAt: docSnap.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

// Create a new post
export async function createPost(postData) {
    try {
        const postsRef = collection(db, COLLECTION_NAME);
        const docRef = await addDoc(postsRef, {
            ...postData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return { id: docRef.id, ...postData };
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
}

// Update a post
export async function updatePost(id, postData) {
    try {
        const postRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(postRef, {
            ...postData,
            updatedAt: serverTimestamp(),
        });

        return { id, ...postData };
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }
}

// Delete a post
export async function deletePost(id) {
    try {
        const postRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(postRef);
        return true;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
}
