import React from 'react';
import Link from 'next/link';
import type { CatalogApp } from '@/lib/catalog';
import AppImage from '@/components/ui/AppImage';
import FavoriteButton from '@/components/ui/FavoriteButton';
import Badge from '@/components/ui/Badge';

export default function AppCard({ app }: { app: CatalogApp }) {
    return (
        <article className="group relative h-full rounded-[18px] border border-border bg-card text-card-foreground p-4 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5">
            <div className="absolute top-2 right-2 z-10">
                <FavoriteButton appId={app.id} appName={app.name} />
            </div>
            <Link href={`/app-detail?id=${app.id}`} className="block" aria-label={`Open ${app.name}`}>
                <AppImage
                    src={app.icon}
                    alt={app.iconAlt}
                    width={72}
                    height={72}
                    className="h-[72px] w-[72px] rounded-[18px] object-cover"
                />
                <h3 className="mt-3 text-base font-semibold truncate">{app.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{app.subtitle}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge tone="info">{app.type === 'game' ? 'Game' : 'App'}</Badge>
                    <Badge>{app.category}</Badge>
                    {!app.downloadable ? <Badge tone="warning">No file yet</Badge> : null}
                </div>
                <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">{app.priceLabel}</span>
                    <span className="text-xs text-muted-foreground tabular">v{app.currentVersion}</span>
                </div>
            </Link>
        </article>
    );
}