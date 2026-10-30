'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Share2, Link2, Flag, Check } from 'lucide-react';
import type { CatalogApp } from '@/lib/catalog';
import AppImage from '@/components/ui/AppImage';
import FavoriteButton from '@/components/ui/FavoriteButton';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

export default function DetailHeader({ app }: { app: CatalogApp }) {
    const { push } = useToast();
    const [copied, setCopied] = useState(false);

    const shareUrl = () => `${window.location.origin}/app-detail?id=${app.id}`;

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl());
            setCopied(true);
            push('success', 'Listing link copied to clipboard');
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            push('error', 'Clipboard is unavailable. Copy the address bar link instead.');
        }
    };

    const share = async () => {
        if (typeof navigator.share === 'function') {
            try {
                await navigator.share({ title: app.name, text: app.subtitle, url: shareUrl() });
                return;
            } catch {
                // user cancelled share sheet; fall through to copy
            }
        }
        await copyLink();
    };

    const reportBroken = () => {
        // BACKEND INTEGRATION: POST broken-link report to the owner's inbox or issue tracker.
        push('info', `Broken-link report for ${app.name} noted locally. The owner has no shared inbox in this build.`);
    };

    return (
        <header>
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-primary font-medium mb-4 min-h-[44px]">
                <ChevronLeft size={18} /> Today
            </Link>
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-7">
                <AppImage
                    src={app.icon}
                    alt={app.iconAlt}
                    width={152}
                    height={152}
                    priority
                    className="h-[120px] w-[120px] sm:h-[152px] sm:w-[152px] rounded-[30px] object-cover shadow-md shrink-0"
                />
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge tone="info">{app.type === 'game' ? 'Game' : 'App'}</Badge>
                        <Badge>{app.category}</Badge>
                        {app.versions.some((v) => v.isLatest) ? <Badge tone="success">Latest v{app.currentVersion}</Badge> : null}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{app.name}</h1>
                    <p className="text-lg text-muted-foreground mt-1">{app.subtitle}</p>
                    <p className="text-sm mt-2">
                        <a
                            href={app.developerWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary font-medium hover:underline"
                        >
                            {app.developer}
                        </a>
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-secondary px-4 py-2 text-sm font-bold text-primary">{app.priceLabel}</span>
                        <FavoriteButton appId={app.id} appName={app.name} variant="full" />
                        <button type="button" onClick={share} className="btn btn-ghost border border-border">
                            <Share2 size={16} /> Share
                        </button>
                        <button type="button" onClick={copyLink} className="btn btn-ghost border border-border" aria-live="polite">
                            {copied ? <Check size={16} /> : <Link2 size={16} />}
                            {copied ? 'Copied' : 'Copy link'}
                        </button>
                        <button type="button" onClick={reportBroken} className="btn btn-ghost">
                            <Flag size={16} /> Report broken link
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}