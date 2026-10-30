import React from 'react';
import type { CatalogApp } from '@/lib/catalog';
import AppCard from '@/app/components/AppCard';

export default function SimilarApps({ items }: { items: CatalogApp[] }) {
    if (items.length === 0) return null;
    return (
        <section aria-labelledby="similar-title" className="mt-12">
            <h2 id="similar-title" className="text-xl font-bold mb-3">Similar Listings</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((a) => (
                    <li key={`sim-${a.id}`}>
                        <AppCard app={a} />
                    </li>
                ))}
            </ul>
        </section>
    );
}