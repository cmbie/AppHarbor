'use client';

import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Eye, EyeOff, X, Plus } from 'lucide-react';
import { collections as seed, apps, getApp, type CatalogCollection } from '@/lib/catalog';
import AppImage from '@/components/ui/AppImage';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

export default function CollectionManager() {
    const { push } = useToast();
    const [list, setList] = useState<CatalogCollection[]>(seed);

    const move = (idx: number, dir: -1 | 1) =>
        setList((prev) => {
            const next = [...prev];
            const j = idx + dir;
            if (j < 0 || j >= next.length) return prev;
            [next[idx], next[j]] = [next[j], next[idx]];
            return next;
        });

    const toggleVisible = (id: string) =>
        setList((p) => p.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)));

    const removeApp = (colId: string, appId: string) =>
        setList((p) => p.map((c) => (c.id === colId ? { ...c, appIds: c.appIds.filter((x) => x !== appId) } : c)));

    const addApp = (colId: string, appId: string) => {
        if (!appId) return;
        const col = list.find((c) => c.id === colId);
        if (col?.appIds.includes(appId)) {
            push('warning', 'That listing is already in this collection.');
            return;
        }
        setList((p) => p.map((c) => (c.id === colId ? { ...c, appIds: [...c.appIds, appId] } : c)));
        push('success', 'Listing added to collection');
    };

    return (
        <section aria-labelledby="cols-title">
            <h2 id="cols-title" className="text-xl font-bold mb-3">Collections</h2>
            <ul className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {list.map((c, i) => (
                    <li key={`mcol-${c.id}`} className={`rounded-lg border border-border bg-card overflow-hidden transition-opacity duration-150 ${c.visible ? '' : 'opacity-60'}`}>
                        <div className="relative h-32 bg-foreground">
                            <AppImage src={c.cover} alt={c.coverAlt} fill sizes="(max-width: 1280px) 100vw, 50vw" className="object-cover" />
                            <div className="absolute inset-0 scrim-bottom" />
                            <div className="absolute bottom-3 left-4 text-background">
                                <p className="font-bold">{c.title}</p>
                                <p className="text-xs opacity-90">{c.description}</p>
                            </div>
                            <div className="absolute top-2 right-2 flex gap-1">
                                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${c.title} earlier`} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-background text-foreground disabled:opacity-40"><ArrowUp size={16} /></button>
                                <button type="button" onClick={() => move(i, 1)} disabled={i === list.length - 1} aria-label={`Move ${c.title} later`} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-background text-foreground disabled:opacity-40"><ArrowDown size={16} /></button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <Badge tone={c.visible ? 'success' : 'neutral'}>{c.visible ? 'Visible' : 'Hidden'}</Badge>
                                <button type="button" onClick={() => toggleVisible(c.id)} className="btn btn-ghost !min-h-[40px] border border-border">
                                    {c.visible ? <EyeOff size={14} /> : <Eye size={14} />} {c.visible ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            <ul className="flex flex-wrap gap-2">
                                {c.appIds.map((aid) => {
                                    const a = getApp(aid);
                                    return (
                                        <li key={`${c.id}-${aid}`} className="inline-flex items-center gap-1 rounded-full bg-secondary pl-3 pr-1 py-1 text-xs">
                                            {a?.name ?? aid}
                                            <button type="button" onClick={() => removeApp(c.id, aid)} aria-label={`Remove ${a?.name ?? aid} from ${c.title}`} className="inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-muted">
                                                <X size={12} />
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="mt-3 flex gap-2">
                                <label htmlFor={`add-${c.id}`} className="sr-only">Add listing to {c.title}</label>
                                <select id={`add-${c.id}`} defaultValue="" onChange={(e) => { addApp(c.id, e.target.value); e.target.value = ''; }} className="field">
                                    <option value="">Add a listing…</option>
                                    {apps.map((a) => (
                                        <option key={`optadd-${c.id}-${a.id}`} value={a.id}>{a.name}</option>
                                    ))}
                                </select>
                                <span className="inline-flex items-center text-muted-foreground"><Plus size={16} /></span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}