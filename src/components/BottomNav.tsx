'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, AppWindow, Settings2 } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const items = [
    { id: 'bn-today', href: '/', label: 'Today', icon: Sparkles },
    { id: 'bn-detail', href: '/app-detail', label: 'App Detail', icon: AppWindow },
    { id: 'bn-admin', href: '/admin', label: 'Admin', icon: Settings2 },
];

export default function BottomNav() {
    const pathname = usePathname();
    return (
        <nav
            aria-label="Primary mobile"
            className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur"
        >
            <ul className="grid grid-cols-3">
                {items?.map((it) => {
                    const active = pathname === it?.href;
                    const Icon = it?.icon;
                    return (
                        <li key={it?.id}>
                            <Link
                                href={it?.href}
                                aria-current={active ? 'page' : undefined}
                                className={`flex flex-col items-center justify-center gap-0.5 min-h-[56px] text-[11px] font-semibold transition-colors duration-150 ${active ? 'text-primary' : 'text-muted-foreground'
                                    }`}
                            >
                                <Icon size={22} />
                                {it?.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}