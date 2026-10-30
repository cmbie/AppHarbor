'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, ShieldQuestion, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { checkLink, type LinkCheckResult } from '@/lib/linkChecker';
import { apps } from '@/lib/catalog';

interface Values {
    url: string;
}

const levelStyle = {
    success: { cls: 'bg-success/10 text-success', Icon: CheckCircle2 },
    warning: { cls: 'bg-warning/10 text-warning', Icon: AlertTriangle },
    error: { cls: 'bg-destructive/10 text-destructive', Icon: XCircle },
} as const;

export default function LinkChecker() {
    const [result, setResult] = useState<LinkCheckResult | null>(null);
    const [checked, setChecked] = useState('');
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<Values>({ defaultValues: { url: '' } });

    const onSubmit = handleSubmit(async ({ url }) => {
        setResult(null);
        setChecked(url);
        const res = await checkLink(url);
        setResult(res);
    });

    const known = apps.flatMap((a) => a.versions.flatMap((v) => v.sources.map((s) => ({ app: a.name, src: s }))));

    return (
        <section aria-labelledby="links-title" className="max-w-3xl">
            <h2 id="links-title" className="text-xl font-bold">Link check</h2>
            <p className="text-sm text-muted-foreground mb-4">
                Checks whether a download source appears reachable. A reachable URL does not mean the file is safe, authentic or
                virus-free.
            </p>

            <form onSubmit={onSubmit} noValidate className="rounded-lg border border-border bg-card p-5">
                <label htmlFor="lc-url" className="label">Download URL or same-site path</label>
                <input
                    id="lc-url"
                    className="field"
                    placeholder="https://example.org/app-1.0.0.apk or /downloads/app.zip"
                    {...register('url', { required: 'Enter a URL or path to check' })}
                />
                {errors.url ? <p className="error-text">{errors.url.message}</p> : <p className="helper">Only HTTPS URLs and paths starting with / are accepted.</p>}
                <button type="submit" disabled={isSubmitting} className="btn btn-primary mt-4 min-w-[140px]">
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <ShieldQuestion size={18} />}
                    {isSubmitting ? 'Checking…' : 'Check link'}
                </button>
            </form>

            {result ? (
                <div className={`mt-4 rounded-lg p-4 ${levelStyle[result.level].cls}`} role="status" aria-live="polite">
                    <div className="flex items-start gap-3">
                        {React.createElement(levelStyle[result.level].Icon, { size: 20, className: 'shrink-0 mt-0.5' })}
                        <div className="min-w-0">
                            <p className="font-semibold">{result.title}</p>
                            <p className="text-sm mt-1 text-foreground">{result.detail}</p>
                            <p className="text-xs mt-2 text-muted-foreground break-all">{checked}</p>
                            <dl className="mt-2 grid grid-cols-3 gap-2 text-xs text-foreground tabular">
                                <div><dt className="text-muted-foreground">HTTP status</dt><dd>{result.httpStatus ?? 'Not observable'}</dd></div>
                                <div><dt className="text-muted-foreground">Content type</dt><dd className="truncate">{result.contentType ?? 'Unknown'}</dd></div>
                                <div><dt className="text-muted-foreground">Length</dt><dd>{result.contentLength ?? 'Unknown'}</dd></div>
                            </dl>
                        </div>
                    </div>
                </div>
            ) : null}

            <h3 className="text-base font-bold mt-8 mb-2">Sources in this catalog</h3>
            <ul className="flex flex-col gap-2">
                {known.map(({ app, src }) => (
                    <li key={`known-${src.id}`} className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2">
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold truncate">{src.fileName}</p>
                            <p className="text-xs text-muted-foreground truncate">{app} · {src.platform}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setValue('url', src.url);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="btn btn-secondary !min-h-[40px]"
                        >
                            Load into checker
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}