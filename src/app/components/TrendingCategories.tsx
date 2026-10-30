import React from 'react';
import { categories, apps } from '@/lib/catalog';
import { Layers } from 'lucide-react';

export default function TrendingCategories() {
    const counted = categories?.map((c) => ({ ...c, count: apps?.filter((a) => a?.category === c?.name)?.length }))?.filter((c) => c?.count > 0)?.sort((a, b) => b?.count - a?.count);

    return (
        <section aria-labelledby="trend-cat-title" className="mb-10">
            <h2 id="trend-cat-title" className="text-xl md:text-2xl font-bold tracking-tight">
                Browse by Category
            </h2>
            <p className="text-sm text-muted-foreground mb-3">Ordered by number of listings in this catalog</p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {counted?.map((c) => (
                    <li
                        key={`trend-${c?.id}`}
                        className="flex items-start gap-3 rounded-lg border border-border bg-secondary p-4 hover:bg-accent transition-colors duration-150"
                    >
                        <Layers size={20} className="text-primary mt-0.5 shrink-0" />
                        <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{c?.name}</p>
                            <p className="text-xs text-muted-foreground tabular">
                                {c?.count} {c?.count === 1 ? 'listing' : 'listings'} · {c?.type === 'game' ? 'Games' : 'Apps'}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}