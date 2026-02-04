'use server';

import { unstable_cache } from 'next/cache';
import {
    collection,
    doc,
    getDocs,
    getDoc,
    query,
    orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'projects';
const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7; // 604800 seconds

// Helper to convert Firestore data
function formatProjectData(docSnapshot) {
    const data = docSnapshot.data();
    return {
        id: docSnapshot.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    };
}

// Internal fetch function (not cached)
async function fetchAllProjects() {
    try {
        const projectsRef = collection(db, COLLECTION_NAME);

        let snapshot;
        try {
            const q = query(projectsRef, orderBy('order', 'asc'));
            snapshot = await getDocs(q);
        } catch (orderError) {
            console.warn('Order index not available, fetching without order:', orderError.message);
            snapshot = await getDocs(projectsRef);
        }

        const projects = snapshot.docs.map(formatProjectData);
        return projects.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

// Internal fetch function (not cached)
async function fetchProjectById(id) {
    try {
        const projectRef = doc(db, COLLECTION_NAME, id);
        const snapshot = await getDoc(projectRef);

        if (!snapshot.exists()) return null;

        return formatProjectData(snapshot);
    } catch (error) {
        console.error('Error fetching project:', error);
        return null;
    }
}

// Cached version of getAllProjects - revalidates every week
export const getAllProjectsCached = unstable_cache(
    async () => {
        console.log('[Cache] Fetching all projects from Firebase');
        return fetchAllProjects();
    },
    ['all-projects'],
    {
        revalidate: ONE_WEEK_IN_SECONDS,
        tags: ['projects'],
    }
);

// Cached version of getProjectById - revalidates every week
export const getProjectByIdCached = unstable_cache(
    async (id) => {
        console.log(`[Cache] Fetching project by id: ${id}`);
        return fetchProjectById(id);
    },
    ['project-by-id'],
    {
        revalidate: ONE_WEEK_IN_SECONDS,
        tags: ['projects'],
    }
);

// Export aliases for backwards compatibility
export { getAllProjectsCached as getAllProjects };
export { getProjectByIdCached as getProjectById };

// Re-export mutation functions from original service (these can't be cached)
import { createProject as createProjectOriginal, updateProject as updateProjectOriginal, deleteProject as deleteProjectOriginal } from './projects';

export async function createProject(data) {
    return createProjectOriginal(data);
}

export async function updateProject(id, data) {
    return updateProjectOriginal(id, data);
}

export async function deleteProject(id) {
    return deleteProjectOriginal(id);
}
