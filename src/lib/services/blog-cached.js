'use server';

import { unstable_cache } from 'next/cache';
import {
    collection,
    doc,
    getDocs,
    getDoc,
    query,
    orderBy,
    where,
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'blog_posts';
const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7; // 604800 seconds

// Helper to convert Firestore data
function formatPostData(docSnapshot) {
    const data = docSnapshot.data();
    return {
        id: docSnapshot.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    };
}

// Internal fetch function (not cached)
async function fetchAllPosts() {
    try {
        const postsRef = collection(db, COLLECTION_NAME);

        let snapshot;
        try {
            const q = query(postsRef, orderBy('createdAt', 'desc'));
            snapshot = await getDocs(q);
        } catch (orderError) {
            console.warn('Order index not available, fetching without order:', orderError.message);
            snapshot = await getDocs(postsRef);
        }

        const posts = snapshot.docs.map(formatPostData);
        return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

// Internal fetch function (not cached)
async function fetchPostBySlug(slug) {
    try {
        const postsRef = collection(db, COLLECTION_NAME);
        const q = query(postsRef, where('slug', '==', slug));
        const snapshot = await getDocs(q);

        if (snapshot.empty) return null;

        return formatPostData(snapshot.docs[0]);
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

// Cached version of getAllPosts - revalidates every week
export const getAllPostsCached = unstable_cache(
    async () => {
        console.log('[Cache] Fetching all blog posts from Firebase');
        return fetchAllPosts();
    },
    ['all-blog-posts'],
    {
        revalidate: ONE_WEEK_IN_SECONDS,
        tags: ['blog-posts'],
    }
);

// Cached version of getPostBySlug - revalidates every week
export const getPostBySlugCached = unstable_cache(
    async (slug) => {
        console.log(`[Cache] Fetching blog post by slug: ${slug}`);
        return fetchPostBySlug(slug);
    },
    ['blog-post-by-slug'],
    {
        revalidate: ONE_WEEK_IN_SECONDS,
        tags: ['blog-posts'],
    }
);

// Export aliases for backwards compatibility
export { getAllPostsCached as getAllPosts };
export { getPostBySlugCached as getPostBySlug };

// Re-export mutation functions from original service (these can't be cached)
import { createPost as createPostOriginal, updatePost as updatePostOriginal, deletePost as deletePostOriginal } from './blog';

export async function createPost(data) {
    return createPostOriginal(data);
}

export async function updatePost(id, data) {
    return updatePostOriginal(id, data);
}

export async function deletePost(id) {
    return deletePostOriginal(id);
}
