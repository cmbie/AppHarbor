'use client';

import React, { useState } from 'react';
import { Star, Save } from 'lucide-react';
import { apps } from '@/lib/catalog';
import { useToast } from '@/components/ui/Toast';

export default function FeaturedSlots() {
    const { push } = useToast();
    const [appPick, setAppPick] = useState(apps.find((a) => a.isAppOfDay)?.id ?? '');
    const [gamePick, setGamePick] = useState(apps.find((a) => a.isGameOfDay)?.id ?? '');
    const [featuredIds, setFeaturedIds] = useState<string[]>(apps.filter((a) => a.featured).map((a) => a.id));

    const apps_ = apps.filter((a) => a.type === 'app');
    const games = apps.filter((a) => a.type === 'game');

    const save = () => {
        // BACKEND INTEGRATION: persist featured flags to the catalog JSON or API.
        push('success', 'Featured placement saved in this browser. Update apps.json to publish it.');
    };

    return (
        <section aria-labelledby="feat-title" className="max-w-3xl">
            <h2 id="feat-title" className="text-xl font-bold mb-1">Featured placement</h2>
            <p className="text-sm text-muted-foreground mb-5">Controls the hero cards and Featured row on Today.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-lg border border-border bg-card p-4">
                    <label htmlFor="slot-app" className="label inline-flex items-center gap-1"><Star size={14} className="text-primary" /> App of the Day</label>
                    <select id="slot-app" value={appPick} onChange={(e) => setAppPick(e.target.value)} className="field">
                        <option value="">None selected</option>
                        {apps_.map((a) => (
                            <option key={`oa-${a.id}`} value={a.id}>{a.name}</option>
                        ))}
                    </select>
                    {!appPick ? <p className="error-text">Today will show an empty slot until you pick one.</p> : null}
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                    <label htmlFor="slot-game" className="label inline-flex items-center gap-1"><Star size={14} className="text-primary" /> Game of the Day</label>
                    <select id="slot-game" value={gamePick} onChange={(e) => setGamePick(e.target.value)} className="field">
                        <option value="">None selected</option>
                        {games.map((a) => (
                            <option key={`og-${a.id}`} value={a.id}>{a.name}</option>
                        ))}
                    </select>
                    {!gamePick ? <p className="error-text">Today will show an empty slot until you pick one.</p> : null}
                </div>
            </div>

            <fieldset className="rounded-lg border border-border bg-card p-4">
                <legend className="px-2 text-sm font-bold">Featured row</legend>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {apps.map((a) => (
                        <li key={`ft-${a.id}`}>
                            <label className="flex items-center gap-3 rounded-lg px-3 min-h-[44px] hover:bg-muted cursor-pointer transition-colors duration-150">
                                <input
                                    type="checkbox"
                                    checked={featuredIds.includes(a.id)}
                                    onChange={(e) => setFeaturedIds((p) => (e.target.checked ? [...p, a.id] : p.filter((x) => x !== a.id)))}
                                    className="accent-primary h-4 w-4"
                                />
                                <span className="text-sm">{a.name}</span>
                                <span className="ml-auto text-xs text-muted-foreground">{a.type === 'game' ? 'Game' : 'App'}</span>
                            </label>
                        </li>
                    ))}
                </ul>
            </fieldset>

            <button type="button" onClick={save} className="btn btn-primary mt-5"><Save size={16} /> Save placement</button>
        </section>
    );
}