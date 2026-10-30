'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, AppWindow, Settings2, Heart } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';


const items = [
    { id: 'nav-today', href: '/', label: 'Today', icon: Sparkles, badge: '' },
    { id: 'nav-app-detail', href: '/app-detail', label: 'App Detail', icon: AppWindow, badge: '' },
    { id: 'nav-admin', href: '/admin', label: 'Admin', icon: Settings2, badge: '1' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-16 xl:w-60 shrink-0 border-r border-border bg-secondary sticky top-0 h-screen transition-all duration-300">
            <div className="flex items-center gap-2 px-3 xl:px-5 h-16">
                <AppLogo size={36} />
                <span className="hidden xl:block text-lg font-bold tracking-tight">AppHarbor</span>
            </div>
            <p className="hidden xl:block px-5 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Discover
            </p>
            <nav className="flex flex-col gap-1 px-2 xl:px-3 mt-2" aria-label="Primary">
                {items?.map((it) => {
                    const active = pathname === it?.href;
                    const Icon = it?.icon;
                    return (
                        <Link
                            key={it?.id}
                            href={it?.href}
                            title={it?.label}
                            aria-current={active ? 'page' : undefined}
                            className={`group relative flex items-center gap-3 rounded-lg px-3 min-h-[44px] text-sm font-medium transition-all duration-150 ${active ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                                }`}
                        >
                            <Icon size={20} className="shrink-0" />
                            <span className="hidden xl:block">{it?.label}</span>
                            {it?.badge ? (
                                <span className="hidden xl:flex ml-auto h-5 min-w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] px-1.5">
                                    {it?.badge}
                                </span>
                            ) : null}
                        </Link>
                    );
                })}
            </nav>
            <div className="mt-auto p-3 xl:p-4">
                <div className="hidden xl:block rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground">
                    <Heart size={14} className="inline mr-1 text-primary" />
                    Favorites and reviews are saved in this browser only.
                </div>
            </div>
        </aside>
    );
}