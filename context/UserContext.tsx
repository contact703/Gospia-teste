"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Pastor, PASTORS, PastorTier } from '@/lib/personas';

interface User {
    name: string;
    email: string;
}

interface UserContextType {
    user: User | null;
    tier: PastorTier;
    selectedPastor: Pastor;
    login: (name: string, email: string, tier: PastorTier) => void;
    logout: () => void;
    upgrade: () => void;
    switchPastor: (pastorId: string) => boolean; // Returns true if successful, false if blocked
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [tier, setTier] = useState<PastorTier>('Free');
    const [selectedPastor, setSelectedPastor] = useState<Pastor>(PASTORS[0]); // Default to Elder

    // Load from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('gospia_user');
        const storedTier = localStorage.getItem('gospia_tier') as PastorTier;

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedTier) {
            setTier(storedTier);
        }
    }, []);

    const login = (name: string, email: string, selectedTier: PastorTier) => {
        const newUser = { name, email };
        setUser(newUser);
        setTier(selectedTier);
        localStorage.setItem('gospia_user', JSON.stringify(newUser));
        localStorage.setItem('gospia_tier', selectedTier);
    };

    const logout = () => {
        setUser(null);
        setTier('Free');
        setSelectedPastor(PASTORS[0]);
        localStorage.removeItem('gospia_user');
        localStorage.removeItem('gospia_tier');
    };

    const upgrade = () => {
        setTier('Pro');
        localStorage.setItem('gospia_tier', 'Pro');
    };

    const switchPastor = (pastorId: string): boolean => {
        const pastor = PASTORS.find(p => p.id === pastorId);
        if (!pastor) return false;

        if (pastor.tier === 'Pro' && tier === 'Free') {
            return false;
        }

        setSelectedPastor(pastor);
        return true;
    };

    return (
        <UserContext.Provider value={{ user, tier, selectedPastor, login, logout, upgrade, switchPastor }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
