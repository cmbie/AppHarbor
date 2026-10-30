'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowUp, ArrowDown, Plus, Trash2 } from 'lucide-react';
import { categories as seed, apps, type CatalogCategory } from '@/lib/catalog';
import { useToast } from '@/components/ui/Toast';
import Badge from '@/components/ui/Badge';

interface Values {
    name: string;
    type: 'app' | 'game';
    description: string;
}

export default function CategoryManager() {
    const { push } = useToast();
    const [list, setList] = useState<CatalogCategory[]>(seed);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Values>({ defaultValues: { name: '', type: 'app', description: '' } });

    const move = (idx: number, dir: -1 | 1) => {
        setList((prev) => {
            const next = [...prev];
            const j = idx + dir;
            if (j < 0 || j >= next.length) return prev;
            [next[idx], next[j]] = [next[j], next[idx]];
            return next;
        });
    };

    const onSubmit = handleSubmit((v) => {
        const name = v.name.trim();
        if (list.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
            push('error', `A category named “${name}” already exists.`);
            return;
        }
        setList((p) => [...p, { id: `cat-${name.toLowerCase().replace(/\s+/g, '-')}-${p.length + 1}`, name, type: v.type, description: v.description }]);
        reset();
        push('success', `Category “${name}” added`);
    });

    const remove = (c: CatalogCategory) => {
        const used = apps.filter((a) => a.category === c.name).length;
        if (used > 0) {
            push('warning', `${used} ${used === 1 ? 'listing uses' : 'listings use'} “${c.name}”. Reassign them before deleting.`);
            return;
        }
        setList((p) => p.filter((x) => x.id !== c.id));
        push('success', `Category “${c.name}” removed`);
    };

    return (
        <section aria-labelledby="cats-title" className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
            <div>
                <h2 id="cats-title" className="text-xl font-bold mb-3">Categories</h2>
                <ul className="flex flex-col gap-2">
                    {list.map((c, i) => {
                        const used = apps.filter((a) => a.category === c.name).length;
                        return (
                            <li key={`cat-${c.id}`} className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 hover:bg-muted/50 transition-colors duration-150">
                                <div className="flex flex-col">
                                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${c.name} up`} className="h-6 w-8 inline-flex items-center justify-center disabled:opacity-30">
                                        <ArrowUp size={14} />
                                    </button>
                                    <button type="button" onClick={() => move(i, 1)} disabled={i === list.length - 1} aria-label={`Move ${c.name} down`} className="h-6 w-8 inline-flex items-center justify-center disabled:opacity-30">
                                        <ArrowDown size={14} />
                                    </button>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold truncate">{c.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{c.description || 'No description'}</p>
                                </div>
                                <Badge tone="info">{c.type === 'game' ? 'Games' : 'Apps'}</Badge>
                                <span className="text-xs text-muted-foreground tabular w-16 text-right">{used} used</span>
                                <button type="button" onClick={() => remove(c)} aria-label={`Delete ${c.name}`} className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10">
                                    <Trash2 size={16} />
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <form onSubmit={onSubmit} noValidate className="rounded-lg border border-border bg-card p-5 self-start">
                <h3 className="text-base font-bold mb-3">Add category</h3>
                <label htmlFor="cm-name" className="label">Name</label>
                <input id="cm-name" className="field" {...register('name', { required: 'A category name is required', maxLength: { value: 40, message: 'Keep it under 40 characters' } })} />
                {errors.name ? <p className="error-text">{errors.name.message}</p> : null}
                <label htmlFor="cm-type" className="label mt-3">Applies to</label>
                <select id="cm-type" className="field" {...register('type')}>
                    <option value="app">Apps</option>
                    <option value="game">Games</option>
                </select>
                <label htmlFor="cm-desc" className="label mt-3">Description</label>
                <input id="cm-desc" className="field" {...register('description')} />
                <button type="submit" className="btn btn-primary mt-4 w-full"><Plus size={16} /> Add category</button>
            </form>
        </section>
    );
}