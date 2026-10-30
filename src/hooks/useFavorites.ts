'use client';

import { useCallback, useEffect, useState } from 'react';
import { storage } from '@/lib/storage';

export function useFavorites() {
    const [ids, setIds] = useState<string[]>([]);

    useEffect(() => {
        setIds(storage.getFavorites());
    }, []);

    const toggle = useCallback((id: string) => {
        setIds((prev) => {
            const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
            storage.setFavorites(next);
            return next;
        });
    }, []);

    return { ids, toggle, has: (id: string) => ids.includes(id) };
}