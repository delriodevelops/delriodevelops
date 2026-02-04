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
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'projects';

// Get all projects
export async function getAllProjects() {
    try {
        const projectsRef = collection(db, COLLECTION_NAME);

        // Try to get with ordering first
        let snapshot;
        try {
            const q = query(projectsRef, orderBy('order', 'asc'));
            snapshot = await getDocs(q);
        } catch (orderError) {
            // Fallback to unordered if index doesn't exist
            console.warn('Order index not available, fetching without order:', orderError.message);
            snapshot = await getDocs(projectsRef);
        }

        const projects = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        }));

        // Sort client-side if we couldn't sort server-side
        return projects.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

// Get a single project by ID
export async function getProjectById(id) {
    try {
        const projectRef = doc(db, COLLECTION_NAME, id);
        const snapshot = await getDoc(projectRef);

        if (!snapshot.exists()) return null;

        return {
            id: snapshot.id,
            ...snapshot.data(),
            createdAt: snapshot.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            updatedAt: snapshot.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        };
    } catch (error) {
        console.error('Error fetching project:', error);
        return null;
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
