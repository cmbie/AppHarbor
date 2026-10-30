import React from 'react';
import { History } from 'lucide-react';
import type { CatalogApp } from '@/lib/catalog';
import { formatDate } from '@/lib/validation';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';

export default function VersionHistory({ app }: { app: CatalogApp }) {
    return (
        <section aria-labelledby="versions-title">
            <h2 id="versions-title" className="text-xl font-bold mb-3">Version History</h2>
            {app.versions.length === 0 ? (
                <EmptyState
                    icon={<History size={28} />}
                    title="No versions published"
                    body="The owner has not added a release for this listing yet."
                />
            ) : (
                <ol className="flex flex-col gap-3">
                    {app.versions.map((v) => (
                        <li key={`ver-${v.id}`} className="rounded-lg border border-border bg-card p-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-base font-bold tabular">v{v.version}</h3>
                                {v.isLatest ? <Badge tone="success">Latest</Badge> : null}
                                <span className="text-xs text-muted-foreground tabular ml-auto">{formatDate(v.releaseDate)}</span>
                            </div>
                            <p className="text-sm mt-2">{v.releaseNotes}</p>
                            {v.sources.length > 0 ? (
                                <ul className="mt-3 flex flex-col gap-1">
                                    {v.sources.map((s) => (
                                        <li key={`vs-${s.id}`} className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                            <span className="font-semibold text-foreground">{s.fileName}</span>
                                            <span>{s.platform}</span>
                                            <span className="tabular">{s.fileSize}</span>
                                            {s.checksum ? <span className="font-mono truncate max-w-[200px]">SHA {s.checksum}</span> : null}
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </li>
                    ))}
                </ol>
            )}
            <p className="text-xs text-muted-foreground mt-3">
                AppHarbor lists releases the owner has added. It does not detect or install native app updates for you.
            </p>
        </section>
    );
}