import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthChange, loginWithGoogle, loginWithEmail, signupWithEmail, loginWithPhone, logout, trackEvent } from '../lib/firebase';
import { hydrateFromSupabase } from '../services/eventTracker';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDemoMode, setIsDemoMode] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthChange((firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName || 'BharatApp User',
                    photoURL: firebaseUser.photoURL,
                    phoneNumber: firebaseUser.phoneNumber,
                });
                trackEvent('login', { method: 'auto' });
                // Hydrate events + affinity vectors from Supabase (survives page refresh)
                hydrateFromSupabase(firebaseUser.uid);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        // If Firebase is not configured, switch to demo mode after a short delay
        const timer = setTimeout(() => {
            if (loading) {
                setIsDemoMode(true);
                setUser({
                    uid: 'demo-user',
                    email: 'demo@bharatapp.in',
                    displayName: 'Shivam Srivastava',
                    photoURL: null,
                    phoneNumber: '+91 98765 43210',
                });
                setLoading(false);
            }
        }, 2000);

        return () => {
            unsubscribe();
            clearTimeout(timer);
        };
    }, []);

    const handleLoginWithGoogle = async () => {
        try {
            const firebaseUser = await loginWithGoogle();
            trackEvent('login', { method: 'google' });
            return firebaseUser;
        } catch (error) {
            if (error.message.includes('not configured')) {
                // Demo mode fallback
                setIsDemoMode(true);
                setUser({
                    uid: 'demo-google',
                    email: 'demo@gmail.com',
                    displayName: 'Google User',
                    photoURL: null,
                });
                return null;
            }
            throw error;
        }
    };

    const handleLoginWithEmail = async (email, password) => {
        try {
            const firebaseUser = await loginWithEmail(email, password);
            trackEvent('login', { method: 'email' });
            return firebaseUser;
        } catch (error) {
            if (error.message.includes('not configured')) {
                setIsDemoMode(true);
                setUser({
                    uid: 'demo-email',
                    email: email,
                    displayName: email.split('@')[0],
                    photoURL: null,
                });
                return null;
            }
            throw error;
        }
    };

    const handleSignup = async (email, password) => {
        try {
            const firebaseUser = await signupWithEmail(email, password);
            trackEvent('sign_up', { method: 'email' });
            return firebaseUser;
        } catch (error) {
            if (error.message.includes('not configured')) {
                setIsDemoMode(true);
                setUser({
                    uid: 'demo-new',
                    email: email,
                    displayName: email.split('@')[0],
                    photoURL: null,
                });
                return null;
            }
            throw error;
        }
    };

    const handleLoginWithPhone = async (phone, recaptchaContainer) => {
        try {
            return await loginWithPhone(phone, recaptchaContainer);
        } catch (error) {
            if (error.message.includes('not configured')) {
                setIsDemoMode(true);
                setUser({
                    uid: 'demo-phone',
                    email: null,
                    displayName: 'Phone User',
                    phoneNumber: phone,
                    photoURL: null,
                });
                return null;
            }
            throw error;
        }
    };

    const handleLogout = async () => {
        await logout();
        setUser(null);
        setIsDemoMode(false);
        trackEvent('logout');
    };

    const value = {
        user,
        loading,
        isDemoMode,
        loginWithGoogle: handleLoginWithGoogle,
        loginWithEmail: handleLoginWithEmail,
        signup: handleSignup,
        loginWithPhone: handleLoginWithPhone,
        logout: handleLogout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
