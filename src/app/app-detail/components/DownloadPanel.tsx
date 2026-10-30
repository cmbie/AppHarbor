'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Download, RotateCw, Copy, ExternalLink, CircleAlert, CheckCircle2, Loader2, Info } from 'lucide-react';
import type { CatalogApp, DownloadSource } from '@/lib/catalog';
import { platformLabel } from '@/lib/catalog';
import { storage, type DownloadRecord, type DownloadStatus } from '@/lib/storage';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

const statusCopy: Record<DownloadStatus | 'idle', { label: string; tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger' }> = {
    idle: { label: 'Not downloaded', tone: 'neutral' },
    initiated: { label: 'Download initiated', tone: 'info' },
    downloading: { label: 'Downloading', tone: 'info' },
    completed: { label: 'Completed', tone: 'success' },
    failed: { label: 'Failed', tone: 'danger' },
    unavailable: { label: 'Source unavailable', tone: 'warning' },
};

export default function DownloadPanel({ app }: { app: CatalogApp }) {
    const { push } = useToast();
    const latest = app.versions.find((v) => v.isLatest) ?? app.versions[0];
    const sources = latest?.sources ?? [];
    const [selectedId, setSelectedId] = useState<string>(sources[0]?.id ?? '');
    const [status, setStatus] = useState<DownloadStatus | 'idle'>('idle');
    const [progress, setProgress] = useState<number | null>(null);
    const [message, setMessage] = useState('');
    const busyRef = useRef(false);

    const selected: DownloadSource | undefined = sources.find((s) => s.id === selectedId) ?? sources[0];

    useEffect(() => {
        setSelectedId(sources[0]?.id ?? '');
        setStatus('idle');
        setProgress(null);
        setMessage('');
    }, [app.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const record = (src: DownloadSource, st: DownloadStatus, note: string) => {
        const list = storage.getDownloads();
        const rec: DownloadRecord = {
            id: `dl-${Date.now()}-${list.length + 1}`,
            appId: app.id,
            appName: app.name,
            sourceId: src.id,
            fileName: src.fileName,
            fileSize: src.fileSize,
            version: latest?.version ?? app.currentVersion,
            url: src.url,
            status: st,
            startedAt: new Date().toISOString(),
            note,
        };
        const result = storage.setDownloads([rec, ...list].slice(0, 100));
        if (!result.ok) push('warning', 'Download history could not be saved (browser storage is full).');
    };

    const startDownload = async () => {
        if (!selected || busyRef.current) return;
        busyRef.current = true;
        setStatus('initiated');
        setProgress(null);
        setMessage('The browser was asked to download this file. A browser-managed download cannot report completion to this page.');

        const sameSite = selected.url.startsWith('/');

        try {
            if (sameSite) {
                const res = await fetch(selected.url, { method: 'HEAD', cache: 'no-store' });
                if (!res.ok) {
                    setStatus('unavailable');
                    setMessage(`The file returned HTTP ${res.status}. The owner may not have uploaded it yet.`);
                    record(selected, 'unavailable', `HTTP ${res.status}`);
                    push('error', `${selected.fileName} is not available (HTTP ${res.status}).`);
                    return;
                }
                const total = Number(res.headers.get('content-length') ?? 0);
                if (total > 0) {
                    // Same-site with known length: stream into a blob for observable progress only when small enough
                    if (total <= 50 * 1024 * 1024) {
                        setStatus('downloading');
                        setProgress(0);
                        const full = await fetch(selected.url, { cache: 'no-store' });
                        const reader = full.body?.getReader();
                        if (reader) {
                            const chunks: Uint8Array[] = [];
                            let received = 0;
                            for (; ;) {
                                const { done, value } = await reader.read();
                                if (done) break;
                                if (value) {
                                    chunks.push(value);
                                    received += value.length;
                                    setProgress(Math.min(100, Math.round((received / total) * 100)));
                                }
                            }
                            const blob = new Blob(chunks as BlobPart[]);
                            const objUrl = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = objUrl;
                            a.download = selected.fileName;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            URL.revokeObjectURL(objUrl);
                            setStatus('completed');
                            setMessage('All bytes were received and handed to the browser save dialog. Downloaded is not installed.');
                            record(selected, 'completed', 'Bytes fully received (observed)');
                            push('success', `${selected.fileName} downloaded. Open it to install.`);
                            return;
                        }
                    }
                }
            }
            // Browser-managed download: completion cannot be confirmed
            const a = document.createElement('a');
            a.href = selected.url;
            a.download = selected.fileName;
            a.rel = 'noopener noreferrer';
            if (!sameSite) a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            a.remove();
            setStatus('initiated');
            record(selected, 'initiated', 'Browser-managed; completion not observable');
            push('info', 'Download initiated. Check your browser’s downloads list for progress.');
        } catch {
            setStatus('failed');
            setMessage('The request failed. Check your connection, then retry or open the source directly.');
            record(selected, 'failed', 'Networkerror');
            push('error', 'Download request failed. You can retry or open the source.');
        } finally {
            busyRef.current = false;
        }
    };

    const copyLink = async () => {
        if (!selected) return;
        const full = selected.url.startsWith('/') ? `${window.location.origin}${selected.url}` : selected.url;
        try {
            await navigator.clipboard.writeText(full);
            push('success', 'Download link copied');
        } catch {
            push('error', 'Clipboard is unavailable in this browser.');
        }
    };

    const copy = statusCopy[status];
    const isBusy = status === 'downloading';
    const isIpa = selected?.fileType.toLowerCase() === 'ipa';

    if (!app.downloadable || !latest || sources.length === 0) {
        return (
            <section aria-labelledby="dl-title" className="rounded-lg border border-border bg-card p-5">
                <h2 id="dl-title" className="text-base font-bold">Download</h2>
                <div className="mt-3 flex items-start gap-3 rounded-lg bg-warning/10 p-4 text-sm">
                    <CircleAlert size={18} className="text-warning mt-0.5 shrink-0" />
                    <div>
                        <p className="font-semibold text-foreground">No downloadable file yet</p>
                        <p className="text-muted-foreground mt-1">
                            The owner has not attached a real file or URL to this listing. A download button is only shown once a
                            source exists. Owners can add one under Admin → Apps → Version sources.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section aria-labelledby="dl-title" className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
                <h2 id="dl-title" className="text-base font-bold">Download</h2>
                <Badge tone={copy.tone}>{copy.label}</Badge>
            </div>

            <fieldset className="mt-4">
                <legend className="label">Choose a package</legend>
                <div className="flex flex-col gap-2">
                    {sources.map((s) => (
                        <label
                            key={`src-${s.id}`}
                            className={`flex items-center gap-3 rounded-lg border px-3 py-2 cursor-pointer transition-colors duration-150 ${selected?.id === s.id ? 'border-primary bg-accent' : 'border-border hover:bg-muted'
                                }`}
                        >
                            <input
                                type="radio"
                                name="download-source"
                                checked={selected?.id === s.id}
                                onChange={() => {
                                    setSelectedId(s.id);
                                    setStatus('idle');
                                    setProgress(null);
                                    setMessage('');
                                }}
                                className="accent-primary"
                            />
                            <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold truncate">{s.fileName}</span>
                                <span className="block text-xs text-muted-foreground">
                                    {s.platform} · {platformLabel(s.fileType, s.platform)}
                                    {s.fileSize ? ` · ${s.fileSize}` : ''}
                                </span>
                            </span>
                            {s.linkStatus === 'broken' ? <Badge tone="danger">Broken</Badge> : null}
                            {s.linkStatus === 'unverifiable' ? <Badge tone="warning">Unverified</Badge> : null}
                        </label>
                    ))}
                </div>
            </fieldset>

            {isIpa ? (
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-warning/10 p-3 text-xs">
                    <CircleAlert size={16} className="text-warning shrink-0 mt-0.5" />
                    <p>An .ipa file cannot be installed on a normal iPhone directly from a website.</p>
                </div>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={startDownload} disabled={isBusy || !selected} className="btn btn-primary flex-1 min-w-[160px]">
                    {isBusy ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                    {isBusy ? 'Downloading…' : status === 'idle' ? `Download ${selected?.fileSize ?? ''}`.trim() : 'Download again'}
                </button>
                {(status === 'failed' || status === 'unavailable') ? (
                    <button type="button" onClick={startDownload} className="btn btn-secondary">
                        <RotateCw size={16} /> Retry
                    </button>
                ) : null}
            </div>

            {progress !== null ? (
                <div className="mt-4" aria-live="polite">
                    <div className="flex justify-between text-xs text-muted-foreground tabular mb-1">
                        <span>Observed progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-150" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            ) : null}

            {message ? (
                <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground" aria-live="polite">
                    {status === 'completed' ? (
                        <CheckCircle2 size={16} className="text-success shrink-0" />
                    ) : (
                        <Info size={16} className="shrink-0" />
                    )}
                    <p>{message}</p>
                </div>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                <button type="button" onClick={copyLink} className="btn btn-ghost !min-h-[40px] border border-border">
                    <Copy size={14} /> Copy link
                </button>
                {selected ? (
                    <a
                        href={selected.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost !min-h-[40px] border border-border"
                    >
                        <ExternalLink size={14} /> Open source
                    </a>
                ) : null}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
                Downloading a file is not installing it. AppHarbor cannot see whether an app is installed on your device, and a
                reachable URL does not prove a file is safe.
            </p>
        </section>
    );
}