import React from 'react';
import { PackageCheck, LinkIcon, Star, AlertTriangle } from 'lucide-react';
import { apps } from '@/lib/catalog';

export default function HealthSummary() {
    const sources = apps?.flatMap((a) => a?.versions?.flatMap((v) => v?.sources));
    const reachable = sources?.filter((s) => s?.linkStatus === 'reachable')?.length;
    const unverifiable = sources?.filter((s) => s?.linkStatus === 'unverifiable')?.length;
    const broken = sources?.filter((s) => s?.linkStatus === 'broken')?.length;
    const unchecked = sources?.filter((s) => s?.linkStatus === 'unchecked')?.length;
    const total = Math.max(1, sources?.length);
    const downloadable = apps?.filter((a) => a?.downloadable)?.length;
    const noFile = apps?.length - downloadable;
    const appOfDay = apps?.find((a) => a?.isAppOfDay);
    const gameOfDay = apps?.find((a) => a?.isGameOfDay);
    const slotsFilled = Number(Boolean(appOfDay)) + Number(Boolean(gameOfDay));

    const segs = [
        { id: 'seg-ok', label: 'Reachable', count: reachable, cls: 'bg-success' },
        { id: 'seg-unv', label: 'Unverifiable', count: unverifiable, cls: 'bg-warning' },
        { id: 'seg-bad', label: 'Broken', count: broken, cls: 'bg-destructive' },
        { id: 'seg-un', label: 'Unchecked', count: unchecked, cls: 'bg-input' },
    ];

    return (
        <section aria-label="Catalog health" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="xl:col-span-2 rounded-lg border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <LinkIcon size={14} /> Link health
                </div>
                <p className="text-3xl font-bold tabular mt-2">
                    {sources?.length} <span className="text-base font-medium text-muted-foreground">download sources</span>
                </p>
                <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-muted" role="img" aria-label="Link health distribution">
                    {segs?.map((s) =>
                        s?.count > 0 ? (
                            <div key={s?.id} className={`${s?.cls} h-full`} style={{ width: `${(s?.count / total) * 100}%` }} />
                        ) : null
                    )}
                </div>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {segs?.map((s) => (
                        <li key={`legend-${s?.id}`} className="inline-flex items-center gap-1.5 tabular">
                            <span className={`h-2.5 w-2.5 rounded-full ${s?.cls}`} />
                            {s?.label} {s?.count}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <PackageCheck size={14} /> Listings with a file
                </div>
                <p className="text-3xl font-bold tabular mt-2">
                    {downloadable}
                    <span className="text-base font-medium text-muted-foreground"> / {apps?.length}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2">{noFile} listing{noFile === 1 ? '' : 's'} without a real file</p>
            </div>

            <div className={`rounded-lg border p-5 ${slotsFilled < 2 || broken > 0 ? 'border-warning/40 bg-warning/10' : 'border-border bg-card'}`}>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {broken > 0 ? <AlertTriangle size={14} className="text-warning" /> : <Star size={14} />} Needs attention
                </div>
                <ul className="mt-2 text-sm flex flex-col gap-1">
                    <li className="tabular">{broken} broken {broken === 1 ? 'link' : 'links'}</li>
                    <li className="tabular">{slotsFilled}/2 daily picks set</li>
                    <li className="tabular">{unchecked} not yet checked</li>
                </ul>
            </div>
        </section>
    );
}