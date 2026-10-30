import React from 'react';
import Link from 'next/link';
import { collections, getApp } from '@/lib/catalog';
import AppImage from '@/components/ui/AppImage';

export default function CollectionsGrid() {
    const visible = collections?.filter((c) => c?.visible);
    return (
        <section aria-labelledby="collections-title" className="mb-10">
            <h2 id="collections-title" className="text-xl md:text-2xl font-bold tracking-tight">
                Curated Collections
            </h2>
            <p className="text-sm text-muted-foreground mb-3">Organised by the store owner</p>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {visible?.map((c) => {
                    const first = getApp(c?.appIds?.[0]);
                    return (
                        <li
                            key={`col-${c?.id}`}
                            className="group relative overflow-hidden rounded-[20px] min-h-[260px] bg-foreground"
                        >
                            <AppImage
                                src={c?.cover}
                                alt={c?.coverAlt}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 scrim-bottom" />
                            <div className="absolute bottom-0 p-5 text-background">
                                <h3 className="text-xl font-bold">{c?.title}</h3>
                                <p className="text-sm opacity-90 mt-1">{c?.description}</p>
                                <p className="text-xs opacity-80 mt-2 tabular">{c?.appIds?.length} listings</p>
                                {first ? (
                                    <Link
                                        href={`/app-detail?id=${first?.id}`}
                                        className="btn btn-secondary mt-3 !min-h-[40px]"
                                    >
                                        Start with {first?.name}
                                    </Link>
                                ) : null}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}