import React from 'react';
import type { CatalogApp } from '@/lib/catalog';
import { formatDate } from '@/lib/validation';

export default function InfoGrid({ app }: { app: CatalogApp }) {
    const rows = [
        { id: 'dev', label: 'Developer', value: app.developer },
        { id: 'cat', label: 'Category', value: app.category },
        { id: 'ver', label: 'Version', value: `v${app.currentVersion}` },
        { id: 'rel', label: 'Released', value: formatDate(app.releaseDate) },
        { id: 'upd', label: 'Last updated', value: formatDate(app.lastUpdated) },
        app.fileSize ? { id: 'size', label: 'File size', value: app.fileSize } : null,
        app.supportedOS.length ? { id: 'os', label: 'Supported systems', value: app.supportedOS.join(', ') } : null,
        app.minimumRequirements ? { id: 'req', label: 'Requirements', value: app.minimumRequirements } : null,
        app.languages.length ? { id: 'lang', label: 'Languages', value: app.languages.join(', ') } : null,
        { id: 'age', label: 'Age rating', value: app.ageRating },
        app.privacyPolicyUrl
            ? {
                id: 'priv',
                label: 'Privacy policy',
                value: (
                    <a href={app.privacyPolicyUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        View policy
                    </a>
                ),
            }
            : null,
        app.supportUrl
            ? {
                id: 'sup',
                label: 'Support',
                value: (
                    <a href={app.supportUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Get help
                    </a>
                ),
            }
            : null,
    ].filter((r): r is NonNullable<typeof r> => r !== null);

    return (
        <section aria-labelledby="info-title" className="rounded-lg border border-border bg-card p-5">
            <h2 id="info-title" className="text-base font-bold mb-3">Information</h2>
            <dl className="flex flex-col divide-y divide-border">
                {rows.map((r) => (
                    <div key={`info-${r.id}`} className="flex justify-between gap-4 py-2 text-sm">
                        <dt className="text-muted-foreground">{r.label}</dt>
                        <dd className="text-right font-medium tabular">{r.value}</dd>
                    </div>
                ))}
            </dl>
            <p className="text-xs text-muted-foreground mt-3">
                Fields the owner has not provided are hidden rather than filled with placeholders.
            </p>
        </section>
    );
}