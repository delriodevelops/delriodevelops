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
 * Write path for projects, used by the admin panel. Reads live in
 * ./firestore-rest.js so they can run on the server. See the note in blog.js.
 */

const COLLECTION_NAME = 'projects';

/** Live, uncached read for the admin dashboard only. See the note in blog.js. */
export async function getAllProjects() {
    try {
        const projectsRef = collection(db, COLLECTION_NAME);

        let snapshot;
        try {
            snapshot = await getDocs(query(projectsRef, orderBy('order', 'asc')));
        } catch (orderError) {
            console.warn('Order index not available:', orderError.message);
            snapshot = await getDocs(projectsRef);
        }

        return snapshot.docs
            .map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
                createdAt: docSnap.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                updatedAt: docSnap.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            }))
            .sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

// Create a new project
export async function createProject(projectData) {
    try {
        const projectsRef = collection(db, COLLECTION_NAME);
        const docRef = await addDoc(projectsRef, {
            ...projectData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return { id: docRef.id, ...projectData };
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
}

// Update a project
export async function updateProject(id, projectData) {
    try {
        const projectRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(projectRef, {
            ...projectData,
            updatedAt: serverTimestamp(),
        });

        return { id, ...projectData };
    } catch (error) {
        console.error('Error updating project:', error);
        throw error;
    }
}

// Delete a project
export async function deleteProject(id) {
    try {
        const projectRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(projectRef);
        return true;
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
}
