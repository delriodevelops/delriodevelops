'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

const AuthContext = createContext({});

// Your authorized email(s) - only these can access the dashboard
const AUTHORIZED_EMAILS = [
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'iamdelrioo@gmail.com',
];

/**
 * `auth` is null whenever the NEXT_PUBLIC_FIREBASE_* vars are missing — see
 * lib/firebase.js, which already degrades rather than throwing. Every entry
 * point below has to respect that: passing null into onAuthStateChanged threw
 * a hard TypeError and took the whole /admin route down in local development.
 */
const isConfigured = Boolean(auth);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(isConfigured);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!auth) return undefined;

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const authorized = AUTHORIZED_EMAILS.includes(user.email);
                setUser(user);
                setIsAuthorized(authorized);
            } else {
                setUser(null);
                setIsAuthorized(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async () => {
        if (!auth || !googleProvider) {
            throw new Error('Authentication is not configured on this deployment.');
        }

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const authorized = AUTHORIZED_EMAILS.includes(result.user.email);

            if (!authorized) {
                await firebaseSignOut(auth);
                throw new Error('Unauthorized email');
            }

            return result.user;
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    };

    const signOut = async () => {
        if (!auth) return;

        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthorized, isConfigured, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
