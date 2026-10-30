'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Sun, Moon, Monitor, X } from 'lucide-react';
import { apps, searchTrending } from '@/lib/catalog';
import { useTheme } from '@/components/ThemeProvider';
import AppImage from '@/components/ui/AppImage';

export default function Topbar() {
    const [query, setQuery] = useState('');
    const [focused, setFocused] = useState(false);
    const { choice, setChoice } = useTheme();

    const results = useMemo(() => {
        const q = query?.trim()?.toLowerCase();
        if (!q) return [];
        return apps?.filter(
            (a) =>
                a?.name?.toLowerCase()?.includes(q) ||
                a?.developer?.toLowerCase()?.includes(q) ||
                a?.category?.toLowerCase()?.includes(q) ||
                a?.tags?.some((t) => t?.includes(q))
        )?.slice(0, 5);
    }, [query]);

    const cycleTheme = () => setChoice(choice === 'light' ? 'dark' : choice === 'dark' ? 'system' : 'light');
    const ThemeIcon = choice === 'light' ? Sun : choice === 'dark' ? Moon : Monitor;

    return (
        <header className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-border">
            <div className="flex items-center gap-3 px-4 md:px-6 lg:px-8 h-16 max-w-screen-2xl mx-auto">
                <div className="relative flex-1 max-w-xl">
                    <label htmlFor="global-search" className="sr-only">
                        Search the catalog
                    </label>
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        id="global-search"
                        value={query}
                        onChange={(e) => setQuery(e?.target?.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => window.setTimeout(() => setFocused(false), 150)}
                        placeholder="Search apps, games, developers"
                        autoComplete="off"
                        className="field !pl-10 !rounded-full !bg-secondary"
                    />
                    {query ? (
                        <button
                            type="button"
                            aria-label="Clear search"
                            onClick={() => setQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                            <X size={16} />
                        </button>
                    ) : null}
                    {focused ? (
                        <div className="absolute left-0 right-0 mt-2 rounded-lg border border-border bg-card shadow-xl overflow-hidden">
                            {query?.trim() === '' ? (
                                <div className="p-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                        Trending searches
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {searchTrending?.map((t) => (
                                            <button
                                                key={`trend-${t}`}
                                                type="button"
                                                onMouseDown={() => setQuery(t)}
                                                className="rounded-full bg-muted px-3 py-1 text-xs hover:bg-accent hover:text-accent-foreground transition-colors duration-150"
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : results?.length === 0 ? (
                                <p className="p-4 text-sm text-muted-foreground">
                                    No catalog entries match “{query}”. Try a developer, category or tag.
                                </p>
                            ) : (
                                <ul>
                                    {results?.map((a) => (
                                        <li key={`sr-${a?.id}`}>
                                            <Link
                                                href={`/app-detail?id=${a?.id}`}
                                                className="flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors duration-150"
                                            >
                                                <AppImage src={a?.icon} alt={a?.iconAlt} width={36} height={36} className="h-9 w-9 rounded-lg object-cover" />
                                                <span className="min-w-0">
                                                    <span className="block text-sm font-semibold truncate">{a?.name}</span>
                                                    <span className="block text-xs text-muted-foreground truncate">
                                                        {a?.type === 'game' ? 'Game' : 'App'} · {a?.category} · {a?.developer}
                                                    </span>
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ) : null}
                </div>
                <button
                    type="button"
                    onClick={cycleTheme}
                    className="btn btn-ghost !px-3"
                    aria-label={`Theme: ${choice}. Click to change.`}
                    title={`Theme: ${choice}`}
                >
                    <ThemeIcon size={18} />
                    <span className="hidden sm:inline capitalize">{choice}</span>
                </button>
            </div>
        </header>
    );
}