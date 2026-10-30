'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UploadCloud, FileArchive, ImageIcon, Trash2, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { ALLOWED_FILE_EXTENSIONS, formatBytes, validateDownloadFile, validateImageFile, extensionOf } from '@/lib/validation';
import { useToast } from '@/components/ui/Toast';

interface PickedFile {
    id: string;
    file: File;
    ok: boolean;
    message: string;
    previewUrl: string | null;
    kind: 'package' | 'image';
}

export default function FileUpload() {
    const { push } = useToast();
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [picked, setPicked] = useState<PickedFile[]>([]);
    const [platform, setPlatform] = useState('Windows');

    useEffect(() => {
        return () => {
            picked.forEach((p) => {
                if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
            });
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const addFiles = useCallback(
        (list: FileList | null) => {
            if (!list) return;
            const next: PickedFile[] = Array.from(list).map((file, i) => {
                const isImage = file.type.startsWith('image/');
                const check = isImage ? validateImageFile(file) : validateDownloadFile(file);
                return {
                    id: `pick-${Date.now()}-${i + 1}-${file.name}`,
                    file,
                    ok: check.ok,
                    message: check.message,
                    previewUrl: isImage && check.ok ? URL.createObjectURL(file) : null,
                    kind: isImage ? 'image' : 'package',
                };
            });
            setPicked((prev) => [...next, ...prev]);
            const bad = next.filter((n) => !n.ok).length;
            if (bad > 0) push('warning', `${bad} file${bad === 1 ? ' was' : 's were'} rejected. See the list for reasons.`);
        },
        [push]
    );

    const remove = (id: string) => {
        setPicked((prev) => {
            const target = prev.find((p) => p.id === id);
            if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
            return prev.filter((p) => p.id !== id);
        });
    };

    return (
        <section aria-labelledby="files-title" className="max-w-3xl">
            <h2 id="files-title" className="text-xl font-bold">File uploads</h2>
            <p className="text-sm text-muted-foreground mb-4">
                Select downloadable packages, icons or screenshots. Checks run in your browser before anything is saved.
            </p>

            <div className="flex items-start gap-2 rounded-lg bg-warning/10 px-4 py-3 text-sm mb-4">
                <Info size={18} className="text-warning shrink-0 mt-0.5" />
                <p>
                    Files chosen here exist only in this browser’s memory. They are <span className="font-semibold">not</span> uploaded
                    anywhere and visitors cannot download them. To publish a package, place it in <code className="font-mono">public/downloads</code>{' '}
                    or host it on an HTTPS URL, then reference it in the version’s sources.
                </p>
            </div>

            <div className="mb-4 max-w-xs">
                <label htmlFor="up-platform" className="label">Target platform</label>
                <select id="up-platform" value={platform} onChange={(e) => setPlatform(e.target.value)} className="field">
                    {['Windows', 'macOS', 'Android', 'Linux', 'Web', 'iOS'].map((p) => (
                        <option key={`plat-${p}`} value={p}>{p}</option>
                    ))}
                </select>
            </div>

            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    addFiles(e.dataTransfer.files);
                }}
                className={`flex flex-col items-center justify-center text-center rounded-lg border-2 border-dashed px-6 py-12 transition-colors duration-150 ${dragging ? 'border-primary bg-accent' : 'border-border bg-secondary'
                    }`}
            >
                <UploadCloud size={32} className="text-primary" />
                <p className="mt-3 text-sm font-semibold">Drag files here, or</p>
                <button type="button" onClick={() => inputRef.current?.click()} className="btn btn-primary mt-3">
                    Choose files
                </button>
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    className="sr-only"
                    aria-label="Choose files to upload"
                    onChange={(e) => {
                        addFiles(e.target.files);
                        e.target.value = '';
                    }}
                />
                <p className="helper mt-3">
                    Packages: {ALLOWED_FILE_EXTENSIONS.join(', ')} · Images: PNG, JPEG, WebP, SVG up to 2 MB
                </p>
            </div>

            {picked.length > 0 ? (
                <ul className="mt-5 flex flex-col gap-2">
                    {picked.map((p) => (
                        <li key={p.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                            {p.previewUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={p.previewUrl} alt={`Preview of ${p.file.name}`} className="h-12 w-12 rounded-lg object-cover" />
                            ) : p.kind === 'image' ? (
                                <ImageIcon size={28} className="text-muted-foreground" />
                            ) : (
                                <FileArchive size={28} className="text-muted-foreground" />
                            )}
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold truncate">{p.file.name}</p>
                                <p className="text-xs text-muted-foreground tabular">
                                    {formatBytes(p.file.size)} · .{extensionOf(p.file.name) || '?'}
                                    {p.kind === 'package' ? ` · ${platform}` : ''}
                                    {p.file.type ? ` · ${p.file.type}` : ''}
                                </p>
                                <p className={`text-xs mt-0.5 inline-flex items-center gap-1 ${p.ok ? 'text-success' : 'text-destructive'}`}>
                                    {p.ok ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />} {p.message}
                                </p>
                            </div>
                            <button type="button" onClick={() => remove(p.id)} aria-label={`Remove ${p.file.name}`} className="inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-muted">
                                <Trash2 size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : null}
        </section>
    );
}