import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { badges as allBadges, getLevelFromXP, type Badge } from '../data/badges';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: 'student' | 'instructor';
    disabilityTypes: string[];
    preferredFormat: 'video' | 'audio' | 'text';
    xp: number;
    streakDays: number;
    lessonsCompleted: number;
    coursesCompleted: number;
    badges: Badge[];
    isLoggedIn: boolean;
}

interface UserContextType {
    user: UserProfile;
    login: (email: string) => void;
    logout: () => void;
    addXP: (amount: number) => void;
    completeLesson: () => void;
    level: { level: number; currentXP: number; nextLevelXP: number };
}

const defaultUser: UserProfile = {
    id: 'u1', name: 'Harshith Kumar', email: 'harshith@inclusivelms.org',
    avatar: 'user', role: 'student', disabilityTypes: [],
    preferredFormat: 'video', xp: 8750, streakDays: 12,
    lessonsCompleted: 42, coursesCompleted: 3, badges: allBadges, isLoggedIn: false,
};

const demoAccounts: Record<string, Partial<UserProfile>> = {
    'demo-blind@test.com': { name: 'Alex (Visual)', disabilityTypes: ['visual'], preferredFormat: 'audio', avatar: 'user' },
    'demo-deaf@test.com': { name: 'Sam (Hearing)', disabilityTypes: ['hearing'], preferredFormat: 'text', avatar: 'user' },
    'teacher@test.com': { name: 'Dr. Sarah Chen', role: 'instructor', avatar: 'user' },
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile>(defaultUser);

    const login = useCallback((email: string) => {
        const demo = demoAccounts[email];
        setUser(prev => ({ ...prev, ...demo, email, isLoggedIn: true }));
    }, []);

    const logout = useCallback(() => {
        setUser({ ...defaultUser, isLoggedIn: false });
    }, []);

    const addXP = useCallback((amount: number) => {
        setUser(prev => ({ ...prev, xp: prev.xp + amount }));
    }, []);

    const completeLesson = useCallback(() => {
        setUser(prev => ({ ...prev, lessonsCompleted: prev.lessonsCompleted + 1, xp: prev.xp + 50 }));
    }, []);

    const level = getLevelFromXP(user.xp);

    return (
        <UserContext.Provider value={{ user, login, logout, addXP, completeLesson, level }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error('useUser must be used within UserProvider');
    return ctx;
}
