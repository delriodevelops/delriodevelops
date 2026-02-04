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

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
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
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthorized, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
