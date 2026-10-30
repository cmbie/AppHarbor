'use client';

import React, { useRef, useState } from 'react';
import { Download, Upload, RotateCcw, AlertCircle } from 'lucide-react';
import { apps, categories, collections } from '@/lib/catalog';
import { storage } from '@/lib/storage';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

export default function ImportExport() {
    const { push } = useToast();
    const fileRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState('');
    const [confirmReset, setConfirmReset] = useState(false);

    const exportCatalog = () => {
        const payload = {
            schema: 'appharbor.catalog.v1',
            exportedAt: new Date().toISOString(),
            apps,
            categories,
            collections,
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'appharbor-catalog.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        push('success', 'Catalog exported as appharbor-catalog.json');
    };

    const importCatalog = async (file: File | undefined) => {
        setError('');
        if (!file) return;
        if (!file.name.endsWith('.json')) {
            setError('Please choose a .json file.');
            return;
        }
        try {
            const text = await file.text();
            const data = JSON.parse(text) as { schema?: string; apps?: unknown };
            if (data.schema !== 'appharbor.catalog.v1') {
                setError('Unrecognised schema. Expected “appharbor.catalog.v1”.');
                return;
            }
            if (!Array.isArray(data.apps)) {
                setError('The file has no “apps” array.');
                return;
            }
            const ids = (data.apps as { id?: string }[]).map((a) => a.id);
            if (ids.some((id) => !id) || new Set(ids).size !== ids.length) {
                setError('Every app needs a unique, non-empty id.');
                return;
            }
            // BACKEND INTEGRATION: write the validated catalog to disk or an API.
            push('success', `Validated ${ids.length} listings. Replace data/apps.json with this file to publish.`);
        } catch {
            setError('That file is not valid JSON.');
        }
    };

    const resetLocal = () => {
        storage.setFavorites([]);
        storage.setDownloads([]);
        storage.setReviews([]);
        setConfirmReset(false);
        push('success', 'Local favorites, download history and reviews cleared');
    };

    return (
        <section aria-labelledby="data-title" className="max-w-2xl">
            <h2 id="data-title" className="text-xl font-bold mb-1">Import and export</h2>
            <p className="text-sm text-muted-foreground mb-5">Move the catalog between browsers or into your deployment.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-border bg-card p-5">
                    <h3 className="font-bold">Export catalog</h3>
                    <p className="text-sm text-muted-foreground mt-1">Download apps, categories and collections as one JSON file.</p>
                    <button type="button" onClick={exportCatalog} className="btn btn-primary mt-4"><Download size={16} /> Export JSON</button>
                </div>
                <div className="rounded-lg border border-border bg-card p-5">
                    <h3 className="font-bold">Import catalog</h3>
                    <p className="text-sm text-muted-foreground mt-1">The file is validated before anything is applied.</p>
                    <button type="button" onClick={() => fileRef.current?.click()} className="btn btn-secondary mt-4"><Upload size={16} /> Choose JSON</button>
                    <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" aria-label="Import catalog JSON" onChange={(e) => { importCatalog(e.target.files?.[0]); e.target.value = ''; }} />
                </div>
            </div>

            {error ? (
                <div role="alert" className="mt-4 flex items-start gap-2 rounded-lg bg-destructive/10 text-destructive px-4 py-3 text-sm">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" /> {error}
                </div>
            ) : null}

            <div className="mt-6 rounded-lg border border-destructive/40 p-5">
                <h3 className="font-bold">Reset local data</h3>
                <p className="text-sm text-muted-foreground mt-1">Clears favorites, download history and local reviews in this browser. The catalog is not affected.</p>
                <button type="button" onClick={() => setConfirmReset(true)} className="btn btn-danger mt-4">
                    <RotateCcw size={16} /> Reset local data
                </button>
            </div>

            <Modal
                open={confirmReset}
                title="Reset local data?"
                onClose={() => setConfirmReset(false)}
                footer={
                    <>
                        <button type="button" className="btn btn-ghost" onClick={() => setConfirmReset(false)}>Cancel</button>
                        <button type="button" className="btn btn-danger" onClick={resetLocal}>Reset data</button>
                    </>
                }
            >
                <p className="text-sm">
                    Your saved favorites, download history and locally written reviews in this browser will be permanently removed.
                    This cannot be undone.
                </p>
            </Modal>
        </section>
    );
}