import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    where,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'blog_posts';

// Get all blog posts
export async function getAllPosts() {
    try {
        const postsRef = collection(db, COLLECTION_NAME);

        // Try to get with ordering first
        let snapshot;
        try {
            const q = query(postsRef, orderBy('createdAt', 'desc'));
            snapshot = await getDocs(q);
        } catch (orderError) {
            // Fallback to unordered if index doesn't exist
            console.warn('Order index not available, fetching without order:', orderError.message);
            snapshot = await getDocs(postsRef);
        }

        const posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        }));

        // Sort client-side by date (newest first)
        return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

// Get a single post by slug
export async function getPostBySlug(slug) {
    try {
        const postsRef = collection(db, COLLECTION_NAME);
        const q = query(postsRef, where('slug', '==', slug));
        const snapshot = await getDocs(q);

        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        };
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
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
