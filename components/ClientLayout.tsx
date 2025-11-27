"use client";

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { SongGenerator } from './SongGenerator';
import { useUser } from '@/context/UserContext';

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
    const [isSongGenOpen, setIsSongGenOpen] = useState(false);
    const { tier } = useUser();

    const handleOpenSongGen = () => {
        if (tier === 'Free') {
            alert("Upgrade para o GospIA Pro para acessar esta funcionalidade!");
            return;
        }
        setIsSongGenOpen(true);
    };

    return (
        <div className="flex h-screen w-full">
            <Sidebar onOpenSongGenerator={handleOpenSongGen} />
            {children}
            <SongGenerator isOpen={isSongGenOpen} onClose={() => setIsSongGenOpen(false)} />
        </div>
    );
};
