'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

export default function FavoriteButton({
    appId,
    appName,
    variant = 'icon',
}: {
    appId: string;
    appName: string;
    variant?: 'icon' | 'full';
}) {
    const { has, toggle } = useFavorites();
    const active = has(appId);

    if (variant === 'full') {
        return (
            <button
                type="button"
                onClick={() => toggle(appId)}
                aria-pressed={active}
                className="btn btn-secondary"
            >
                <Heart size={18} className={active ? 'fill-primary text-primary' : ''} />
                {active ? 'Saved to favorites' : 'Add to favorites'}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={() => toggle(appId)}
            aria-pressed={active}
            aria-label={active ? `Remove ${appName} from favorites` : `Add ${appName} to favorites`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-background/90 text-foreground hover:bg-muted transition-all duration-150 active:scale-95"
        >
            <Heart size={18} className={active ? 'fill-primary text-primary' : ''} />
        </button>
    );
}