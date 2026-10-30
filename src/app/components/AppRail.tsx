import React from 'react';
import { PackageOpen } from 'lucide-react';
import type { CatalogApp } from '@/lib/catalog';
import AppCard from '@/app/components/AppCard';
import EmptyState from '@/components/ui/EmptyState';

export default function AppRail({
    id,
    title,
    subtitle,
    items,
    emptyText,
}: {
    id: string;
    title: string;
    subtitle: string;
    items: CatalogApp[];
    emptyText?: string;
}) {
    return (
        <section aria-labelledby={`${id}-title`} className="mb-10">
            <div className="flex items-end justify-between mb-3">
                <div>
                    <h2 id={`${id}-title`} className="text-xl md:text-2xl font-bold tracking-tight">
                        {title}
                    </h2>
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                </div>
                <span className="text-xs text-muted-foreground tabular">{items.length} listings</span>
            </div>
            {items.length === 0 ? (
                <EmptyState
                    icon={<PackageOpen size={28} />}
                    title={`Nothing in ${title} yet`}
                    body={emptyText ?? 'Add or tag listings in Admin to fill this row.'}
                />
            ) : (
                <ul className="flex gap-4 overflow-x-auto no-scrollbar snap-x pb-2 -mx-1 px-1">
                    {items.map((a) => (
                        <li key={`${id}-${a.id}`} className="snap-start shrink-0 w-[260px] sm:w-[300px]">
                            <AppCard app={a} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}