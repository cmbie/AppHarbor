'use client';

import React, { useMemo, useState } from 'react';
import { Search, Pencil, Copy, Trash2, Plus, PackageOpen, ArrowUpDown } from 'lucide-react';
import { apps as seedApps, type CatalogApp, type LinkStatus } from '@/lib/catalog';
import AppImage from '@/components/ui/AppImage';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { formatDate } from '@/lib/validation';

type SortKey = 'name' | 'lastUpdated' | 'category';

function linkSummary(app: CatalogApp): { status: LinkStatus | 'none'; label: string } {
    const sources = app.versions.flatMap((v) => v.sources);
    if (sources.length === 0) return { status: 'none', label: 'No file' };
    if (sources.some((s) => s.linkStatus === 'broken')) return { status: 'broken', label: 'Broken link' };
    if (sources.some((s) => s.linkStatus === 'unverifiable')) return { status: 'unverifiable', label: 'Unverifiable' };
    if (sources.every((s) => s.linkStatus === 'reachable')) return { status: 'reachable', label: 'Reachable' };
    return { status: 'unchecked', label: 'Unchecked' };
}

const tone = {
    none: 'warning',
    broken: 'danger',
    unverifiable: 'warning',
    reachable: 'success',
    unchecked: 'neutral',
} as const;

export default function CatalogTable({ onEdit }: { onEdit: (id: string | null) => void }) {
    const { push } = useToast();
    const [rows, setRows] = useState<CatalogApp[]>(seedApps);
    const [query, setQuery] = useState('');
    const [type, setType] = useState<'all' | 'app' | 'game'>('all');
    const [sortKey, setSortKey] = useState<SortKey>('lastUpdated');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
    const [pendingDelete, setPendingDelete] = useState<CatalogApp | null>(null);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [selected, setSelected] = useState<string[]>([]);

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        const filtered = rows.filter(
            (a) =>
                (type === 'all' || a.type === type) &&
                (!q || a.name.toLowerCase().includes(q) || a.developer.toLowerCase().includes(q) || a.category.toLowerCase().includes(q))
        );
        return [...filtered].sort((a, b) => {
            const dir = sortDir === 'asc' ? 1 : -1;
            return String(a[sortKey]).localeCompare(String(b[sortKey])) * dir;
        });
    }, [rows, query, type, sortKey, sortDir]);

    const toggleSort = (k: SortKey) => {
        if (sortKey === k) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        else {
            setSortKey(k);
            setSortDir('asc');
        }
    };

    const duplicate = (a: CatalogApp) => {
        const copy: CatalogApp = {
            ...a,
            id: `${a.id}-copy-${rows.length + 1}`,
            name: `${a.name} (copy)`,
            isAppOfDay: false,
            isGameOfDay: false,
        };
        setRows((r) => [copy, ...r]);
        push('success', `Duplicated ${a.name}. Edit the copy to change its details.`);
    };

    const confirmDelete = () => {
        if (!pendingDelete) return;
        const id = pendingDelete.id;
        const name = pendingDelete.name;
        setPendingDelete(null);
        setRemovingId(id);
        window.setTimeout(() => {
            setRows((r) => r.filter((x) => x.id !== id));
            setSelected((s) => s.filter((x) => x !== id));
            setRemovingId(null);
            push('success', `${name} removed from this browser’s catalog view`);
        }, 250);
    };

    const bulkDelete = () => {
        const n = selected.length;
        setRows((r) => r.filter((x) => !selected.includes(x.id)));
        setSelected([]);
        push('success', `${n} ${n === 1 ? 'listing' : 'listings'} removed`);
    };

    const allSelected = visible.length > 0 && visible.every((a) => selected.includes(a.id));

    return (
        <section aria-labelledby="catalog-title">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
                <div>
                    <h2 id="catalog-title" className="text-xl font-bold">Catalog</h2>
                    <p className="text-sm text-muted-foreground tabular">{visible.length} of {rows.length} listings</p>
                </div>
                <button type="button" onClick={() => onEdit(null)} className="btn btn-primary">
                    <Plus size={18} /> Add app or game
                </button>
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
                <div className="relative flex-1 min-w-[220px]">
                    <label htmlFor="catalog-search" className="sr-only">Filter listings</label>
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        id="catalog-search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Filter by name, developer or category"
                        className="field !pl-9"
                    />
                </div>
                <div>
                    <label htmlFor="catalog-type" className="sr-only">Type</label>
                    <select id="catalog-type" value={type} onChange={(e) => setType(e.target.value as 'all' | 'app' | 'game')} className="field">
                        <option value="all">All types</option>
                        <option value="app">Apps</option>
                        <option value="game">Games</option>
                    </select>
                </div>
            </div>

            {selected.length > 0 ? (
                <div className="mb-3 flex items-center justify-between rounded-lg bg-accent text-accent-foreground px-4 py-2 text-sm animate-[slideUp_200ms_ease-out]">
                    <span className="tabular">{selected.length} selected</span>
                    <button type="button" onClick={bulkDelete} className="btn btn-danger !min-h-[36px]">
                        <Trash2 size={14} /> Remove selected
                    </button>
                </div>
            ) : null}

            {visible.length === 0 ? (
                <EmptyState
                    icon={<PackageOpen size={28} />}
                    title="No listings match"
                    body="Clear the filter or add a new app or game."
                    action={<button type="button" className="btn btn-primary" onClick={() => onEdit(null)}>Add app or game</button>}
                />
            ) : (
                <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-sm min-w-[920px]">
                        <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
                            <tr>
                                <th className="px-3 py-3 w-10">
                                    <input
                                        type="checkbox"
                                        aria-label="Select all listings"
                                        checked={allSelected}
                                        onChange={(e) => setSelected(e.target.checked ? visible.map((a) => a.id) : [])}
                                        className="accent-primary h-4 w-4"
                                    />
                                </th>
                                <th className="px-3 py-3">
                                    <button type="button" onClick={() => toggleSort('name')} className="inline-flex items-center gap-1 font-semibold">
                                        Listing <ArrowUpDown size={12} />
                                    </button>
                                </th>
                                <th className="px-3 py-3">Type</th>
                                <th className="px-3 py-3">
                                    <button type="button" onClick={() => toggleSort('category')} className="inline-flex items-center gap-1 font-semibold">
                                        Category <ArrowUpDown size={12} />
                                    </button>
                                </th>
                                <th className="px-3 py-3">Version</th>
                                <th className="px-3 py-3">Price</th>
                                <th className="px-3 py-3">Link status</th>
                                <th className="px-3 py-3">Featured</th>
                                <th className="px-3 py-3">
                                    <button type="button" onClick={() => toggleSort('lastUpdated')} className="inline-flex items-center gap-1 font-semibold">
                                        Updated <ArrowUpDown size={12} />
                                    </button>
                                </th>
                                <th className="px-3 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map((a, idx) => {
                                const ls = linkSummary(a);
                                return (
                                    <tr
                                        key={`row-${a.id}`}
                                        className={`group border-t border-border transition-all duration-200 hover:bg-muted/50 ${idx % 2 === 1 ? 'bg-secondary/40' : ''
                                            } ${removingId === a.id ? 'opacity-0' : 'opacity-100'}`}
                                    >
                                        <td className="px-3 py-3">
                                            <input
                                                type="checkbox"
                                                aria-label={`Select ${a.name}`}
                                                checked={selected.includes(a.id)}
                                                onChange={(e) =>
                                                    setSelected((s) => (e.target.checked ? [...s, a.id] : s.filter((x) => x !== a.id)))
                                                }
                                                className="accent-primary h-4 w-4"
                                            />
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <AppImage src={a.icon} alt={a.iconAlt} width={40} height={40} className="h-10 w-10 rounded-[10px] object-cover shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="font-semibold truncate max-w-[200px]">{a.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{a.developer}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3"><Badge tone="info">{a.type === 'game' ? 'Game' : 'App'}</Badge></td>
                                        <td className="px-3 py-3">{a.category}</td>
                                        <td className="px-3 py-3 tabular">v{a.currentVersion}</td>
                                        <td className="px-3 py-3 tabular">{a.priceLabel}</td>
                                        <td className="px-3 py-3"><Badge tone={tone[ls.status]}>{ls.label}</Badge></td>
                                        <td className="px-3 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {a.isAppOfDay ? <Badge tone="info">App of Day</Badge> : null}
                                                {a.isGameOfDay ? <Badge tone="info">Game of Day</Badge> : null}
                                                {a.featured && !a.isAppOfDay && !a.isGameOfDay ? <Badge>Featured</Badge> : null}
                                                {!a.featured && !a.isAppOfDay && !a.isGameOfDay ? <span className="text-muted-foreground">—</span> : null}
                                            </div>
                                        </td>
                                        <td className="px-3 py-3 tabular text-muted-foreground">{formatDate(a.lastUpdated)}</td>
                                        <td className="px-3 py-3">
                                            <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-150">
                                                <button type="button" onClick={() => onEdit(a.id)} aria-label={`Edit ${a.name}`} title="Edit" className="inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-muted">
                                                    <Pencil size={16} />
                                                </button>
                                                <button type="button" onClick={() => duplicate(a)} aria-label={`Duplicate ${a.name}`} title="Duplicate" className="inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-muted">
                                                    <Copy size={16} />
                                                </button>
                                                <button type="button" onClick={() => setPendingDelete(a)} aria-label={`Delete ${a.name}`} title="Delete this listing — cannot be undone" className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                open={pendingDelete !== null}
                title="Delete this listing?"
                onClose={() => setPendingDelete(null)}
                footer={
                    <>
                        <button type="button" className="btn btn-ghost" onClick={() => setPendingDelete(null)}>Cancel</button>
                        <button type="button" className="btn btn-danger" onClick={confirmDelete}>Delete listing</button>
                    </>
                }
            >
                <p className="text-sm">
                    <span className="font-semibold">{pendingDelete?.name}</span> and its version records will be removed from this
                    browser’s catalog.
                    {pendingDelete && pendingDelete.versions.some((v) => v.sources.length > 0)
                        ? ' Its downloadable sources will also stop being offered.'
                        : ''}{' '}
                    This cannot be undone.
                </p>
            </Modal>
            <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </section>
    );
}