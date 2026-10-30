'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { storage } from '@/lib/storage';

type ThemeChoice = 'light' | 'dark' | 'system';

interface ThemeContextValue {
    choice: ThemeChoice;
    setChoice: (c: ThemeChoice) => void;
}

const ThemeContext = createContext<ThemeContextValue>({ choice: 'system', setChoice: () => undefined });

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [choice, setChoiceState] = useState<ThemeChoice>('system');

    const apply = useCallback((c: ThemeChoice) => {
        const dark = c === 'dark' || (c === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.classList.toggle('dark', dark);
    }, []);

    useEffect(() => {
        const saved = storage.getTheme();
        setChoiceState(saved);
        apply(saved);
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = () => {
            if (storage.getTheme() === 'system') apply('system');
        };
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, [apply]);

    const setChoice = useCallback(
        (c: ThemeChoice) => {
            setChoiceState(c);
            storage.setTheme(c);
            apply(c);
        },
        [apply]
    );

    return <ThemeContext.Provider value={{ choice, setChoice }}>{children}</ThemeContext.Provider>;
}