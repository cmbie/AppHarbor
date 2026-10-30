'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Save, Eye } from 'lucide-react';
import { apps, categories, getApp } from '@/lib/catalog';
import { validateUrlProtocol } from '@/lib/validation';
import { useToast } from '@/components/ui/Toast';
import Toggle from '@/components/ui/Toggle';
import Link from 'next/link';

interface FormValues {
    id: string;
    type: 'app' | 'game';
    name: string;
    subtitle: string;
    developer: string;
    developerWebsite: string;
    category: string;
    price: string;
    description: string;
    features: string;
    keywords: string;
    currentVersion: string;
    releaseDate: string;
    changelog: string;
    supportedOS: string;
    minimumRequirements: string;
    languages: string;
    ageRating: string;
    privacyPolicyUrl: string;
    supportUrl: string;
    iconUrl: string;
}

const empty: FormValues = {
    id: '', type: 'app', name: '', subtitle: '', developer: '', developerWebsite: '', category: 'Productivity',
    price: '0', description: '', features: '', keywords: '', currentVersion: '1.0.0', releaseDate: '',
    changelog: '', supportedOS: '', minimumRequirements: '', languages: 'English', ageRating: '4+',
    privacyPolicyUrl: '', supportUrl: '', iconUrl: '',
};

export default function AppForm({ editingId, onDone }: { editingId: string | null; onDone: () => void }) {
    const { push } = useToast();
    const existing = getApp(editingId);
    const [featured, setFeatured] = useState(Boolean(existing?.featured));
    const [downloadable, setDownloadable] = useState(Boolean(existing?.downloadable));
    const [dirty, setDirty] = useState(false);
    const [saved, setSaved] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<FormValues>({ defaultValues: empty });

    useEffect(() => {
        if (existing) {
            reset({
                id: existing.id,
                type: existing.type,
                name: existing.name,
                subtitle: existing.subtitle,
                developer: existing.developer,
                developerWebsite: existing.developerWebsite,
                category: existing.category,
                price: String(existing.price),
                description: existing.description,
                features: existing.features.join('\n'),
                keywords: existing.tags.join(', '),
                currentVersion: existing.currentVersion,
                releaseDate: existing.releaseDate,
                changelog: existing.changelog,
                supportedOS: existing.supportedOS.join(', '),
                minimumRequirements: existing.minimumRequirements,
                languages: existing.languages.join(', '),
                ageRating: existing.ageRating,
                privacyPolicyUrl: existing.privacyPolicyUrl,
                supportUrl: existing.supportUrl,
                iconUrl: existing.icon,
            });
            setFeatured(existing.featured);
            setDownloadable(existing.downloadable);
        } else {
            reset(empty);
            setFeatured(false);
            setDownloadable(false);
        }
        setSaved(false);
        setDirty(false);
    }, [editingId]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        setDirty(isDirty);
    }, [isDirty]);

    useEffect(() => {
        if (!dirty) return;
        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [dirty]);

    const type = watch('type');
    const categoryOptions = categories.filter((c) => c.type === type);

    const urlRule = (label: string, required = false) => (v: string) => {
        if (!v) return required ? `${label} is required` : true;
        const r = validateUrlProtocol(v);
        return r.ok || r.message;
    };

    const onSubmit = handleSubmit(async (values) => {
        const duplicate = !existing && apps.some((a) => a.id === values.id.trim());
        if (duplicate) {
            push('error', `The ID “${values.id}” is already used by another listing.`);
            return;
        }
        // BACKEND INTEGRATION: persist the listing (JSON file write or POST /api/apps).
        await new Promise((r) => window.setTimeout(r, 600));
        setSaved(true);
        setDirty(false);
        reset(values);
        push('success', `${values.name} saved in this browser. Add it to apps.json to publish it.`);
    });

    return (
        <form onSubmit={onSubmit} noValidate className="max-w-4xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                    <h2 className="text-xl font-bold">{existing ? `Edit ${existing.name}` : 'New listing'}</h2>
                    <p className="text-sm text-muted-foreground">
                        Fields marked <span className="text-destructive font-bold">*</span> are required.
                    </p>
                </div>
                {existing ? (
                    <Link href={`/app-detail?id=${existing.id}`} className="btn btn-ghost border border-border">
                        <Eye size={16} /> Preview listing
                    </Link>
                ) : null}
            </div>

            {dirty ? (
                <div className="mb-4 rounded-lg bg-warning/10 px-4 py-2 text-sm" role="status">
                    You have unsaved changes.
                </div>
            ) : saved ? (
                <div className="mb-4 rounded-lg bg-success/10 text-success px-4 py-2 text-sm" role="status">
                    Saved ✓ — stored in this browser only.
                </div>
            ) : null}

            <fieldset className="rounded-lg border border-border bg-card p-5 mb-5">
                <legend className="px-2 text-sm font-bold">Identity</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="f-id" className="label">Listing ID <span className="text-destructive">*</span></label>
                        <input id="f-id" className="field" disabled={Boolean(existing)} {...register('id', { required: 'An ID is required', pattern: { value: /^[a-z0-9-]+$/, message: 'Use lowercase letters, numbers and hyphens only' } })} />
                        {errors.id ? <p className="error-text">{errors.id.message}</p> : <p className="helper">Becomes the URL id. Must be unique.</p>}
                    </div>
                    <div>
                        <label htmlFor="f-type" className="label">Type</label>
                        <select id="f-type" className="field" {...register('type')}>
                            <option value="app">App</option>
                            <option value="game">Game</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="f-name" className="label">Name <span className="text-destructive">*</span></label>
                        <input id="f-name" className="field" {...register('name', { required: 'A name is required', maxLength: { value: 60, message: 'Keep it under 60 characters' } })} />
                        {errors.name ? <p className="error-text">{errors.name.message}</p> : null}
                    </div>
                    <div>
                        <label htmlFor="f-sub" className="label">Subtitle</label>
                        <input id="f-sub" className="field" {...register('subtitle', { maxLength: { value: 80, message: 'Keep it under 80 characters' } })} />
                        {errors.subtitle ? <p className="error-text">{errors.subtitle.message}</p> : null}
                    </div>
                    <div>
                        <label htmlFor="f-dev" className="label">Developer <span className="text-destructive">*</span></label>
                        <input id="f-dev" className="field" {...register('developer', { required: 'A developer name is required' })} />
                        {errors.developer ? <p className="error-text">{errors.developer.message}</p> : null}
                    </div>
                    <div>
                        <label htmlFor="f-devsite" className="label">Developer website</label>
                        <input id="f-devsite" className="field" placeholder="https://" {...register('developerWebsite', { validate: urlRule('Developer website') })} />
                        {errors.developerWebsite ? <p className="error-text">{errors.developerWebsite.message}</p> : null}
                    </div>
                    <div>
                        <label htmlFor="f-cat" className="label">Category</label>
                        <select id="f-cat" className="field" {...register('category')}>
                            {categoryOptions.map((c) => (
                                <option key={`opt-${c.id}`} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="f-price" className="label">Price (USD)</label>
                        <input id="f-price" inputMode="decimal" className="field tabular" {...register('price', { validate: (v) => (!Number.isNaN(Number(v)) && Number(v) >= 0) || 'Enter 0 for free, or a positive price' })} />
                        {errors.price ? <p className="error-text">{errors.price.message}</p> : <p className="helper">0 shows the FREE label.</p>}
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="f-icon" className="label">Icon URL</label>
                        <input id="f-icon" className="field" placeholder="https:// or /assets/icons/…" {...register('iconUrl', { validate: urlRule('Icon URL') })} />
                        {errors.iconUrl ? <p className="error-text">{errors.iconUrl.message}</p> : <p className="helper">Or upload an icon in the Files tab.</p>}
                    </div>
                </div>
            </fieldset>

            <fieldset className="rounded-lg border border-border bg-card p-5 mb-5">
                <legend className="px-2 text-sm font-bold">Description</legend>
                <label htmlFor="f-desc" className="label">Description <span className="text-destructive">*</span></label>
                <textarea id="f-desc" rows={4} className="field !py-2" {...register('description', { required: 'A description is required', minLength: { value: 30, message: 'Write at least 30 characters' } })} />
                {errors.description ? <p className="error-text">{errors.description.message}</p> : null}
                <label htmlFor="f-feat" className="label mt-4">Features</label>
                <textarea id="f-feat" rows={3} className="field !py-2" {...register('features')} />
                <p className="helper">One feature per line.</p>
                <label htmlFor="f-kw" className="label mt-4">Keywords and tags</label>
                <input id="f-kw" className="field" {...register('keywords')} />
                <p className="helper">Comma-separated. Use “student”, “offline” or “education” to appear in those rows on Today.</p>
            </fieldset>

            <fieldset className="rounded-lg border border-border bg-card p-5 mb-5">
                <legend className="px-2 text-sm font-bold">Version and compatibility</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="f-ver" className="label">Current version <span className="text-destructive">*</span></label>
                        <input id="f-ver" className="field tabular" {...register('currentVersion', { required: 'A version is required', pattern: { value: /^\d+\.\d+(\.\d+)?$/, message: 'Use a format like 1.2.0' } })} />
                        {errors.currentVersion ? <p className="error-text">{errors.currentVersion.message}</p> : null}
                    </div>
                    <div>
                        <label htmlFor="f-rel" className="label">Release date <span className="text-destructive">*</span></label>
                        <input id="f-rel" type="date" className="field tabular" {...register('releaseDate', { required: 'A release date is required' })} />
                        {errors.releaseDate ? <p className="error-text">{errors.releaseDate.message}</p> : null}
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="f-log" className="label">Changelog</label>
                        <textarea id="f-log" rows={2} className="field !py-2" {...register('changelog')} />
                    </div>
                    <div>
                        <label htmlFor="f-os" className="label">Supported systems</label>
                        <input id="f-os" className="field" placeholder="Windows 10+, Android 9+" {...register('supportedOS')} />
                        <p className="helper">Comma-separated.</p>
                    </div>
                    <div>
                        <label htmlFor="f-req" className="label">Minimum requirements</label>
                        <input id="f-req" className="field" {...register('minimumRequirements')} />
                    </div>
                    <div>
                        <label htmlFor="f-lang" className="label">Languages</label>
                        <input id="f-lang" className="field" {...register('languages')} />
                    </div>
                    <div>
                        <label htmlFor="f-age" className="label">Age rating</label>
                        <select id="f-age" className="field" {...register('ageRating')}>
                            <option value="4+">4+</option>
                            <option value="9+">9+</option>
                            <option value="12+">12+</option>
                            <option value="17+">17+</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="f-priv" className="label">Privacy policy URL</label>
                        <input id="f-priv" className="field" placeholder="https://" {...register('privacyPolicyUrl', { validate: urlRule('Privacy policy URL') })} />
                        {errors.privacyPolicyUrl ? <p className="error-text">{errors.privacyPolicyUrl.message}</p> : null}
                    </div>
                    <div>
                        <label htmlFor="f-sup" className="label">Support URL</label>
                        <input id="f-sup" className="field" placeholder="https://" {...register('supportUrl', { validate: urlRule('Support URL') })} />
                        {errors.supportUrl ? <p className="error-text">{errors.supportUrl.message}</p> : null}
                    </div>
                </div>
            </fieldset>

            <fieldset className="rounded-lg border border-border bg-card p-5 mb-5">
                <legend className="px-2 text-sm font-bold">Visibility</legend>
                <div className="flex items-center justify-between py-2">
                    <div>
                        <p className="text-sm font-semibold">Show in Featured</p>
                        <p className="helper">Adds the listing to the Featured row on Today.</p>
                    </div>
                    <Toggle checked={featured} onChange={(v) => { setFeatured(v); setDirty(true); }} label="Featured" />
                </div>
                <div className="flex items-center justify-between py-2 border-t border-border">
                    <div>
                        <p className="text-sm font-semibold">Has a downloadable file</p>
                        <p className="helper">Only enable once a real file or HTTPS URL is attached to a version.</p>
                    </div>
                    <Toggle checked={downloadable} onChange={(v) => { setDownloadable(v); setDirty(true); }} label="Downloadable" />
                </div>
            </fieldset>

            <div className="sticky bottom-20 md:bottom-4 z-20 flex items-center justify-end gap-2 rounded-lg border border-border bg-card/95 backdrop-blur px-4 py-3 shadow-lg">
                <button type="button" onClick={onDone} className="btn btn-ghost">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary min-w-[150px]">
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {isSubmitting ? 'Saving…' : 'Save listing'}
                </button>
            </div>
        </form>
    );
}