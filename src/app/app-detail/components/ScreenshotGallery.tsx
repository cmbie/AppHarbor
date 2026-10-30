'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ImageOff } from 'lucide-react';
import type { Screenshot } from '@/lib/catalog';
import AppImage from '@/components/ui/AppImage';
import EmptyState from '@/components/ui/EmptyState';

export default function ScreenshotGallery({ shots, appName }: { shots: Screenshot[]; appName: string }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const touchStart = useRef<number | null>(null);

    const close = useCallback(() => setOpenIndex(null), []);
    const next = useCallback(
        () => setOpenIndex((i) => (i === null ? null : (i + 1) % shots.length)),
        [shots.length]
    );
    const prev = useCallback(
        () => setOpenIndex((i) => (i === null ? null : (i - 1 + shots.length) % shots.length)),
        [shots.length]
    );

    useEffect(() => {
        if (openIndex === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [openIndex, close, next, prev]);

    if (shots.length === 0) {
        return (
            <section aria-labelledby="shots-title">
                <h2 id="shots-title" className="text-xl font-bold mb-3">Preview</h2>
                <EmptyState
                    icon={<ImageOff size={28} />}
                    title="No screenshots yet"
                    body="The owner has not added screenshots for this listing."
                />
            </section>
        );
    }

    const current = openIndex !== null ? shots[openIndex] : null;

    return (
        <section aria-labelledby="shots-title">
            <h2 id="shots-title" className="text-xl font-bold mb-3">Preview</h2>
            <ul className="flex gap-3 overflow-x-auto no-scrollbar snap-x pb-2">
                {shots.map((s, i) => (
                    <li key={`shot-${s.id}`} className="snap-start shrink-0">
                        <button
                            type="button"
                            onClick={() => setOpenIndex(i)}
                            aria-label={`Open screenshot ${i + 1} of ${shots.length}: ${s.caption || s.alt}`}
                            className="block overflow-hidden rounded-lg border border-border transition-transform duration-150 hover:scale-[1.01] active:scale-95"
                        >
                            <AppImage
                                src={s.url}
                                alt={s.alt}
                                width={420}
                                height={280}
                                loading="lazy"
                                className="h-[200px] sm:h-[240px] w-auto object-cover"
                            />
                        </button>
                        {s.caption ? <p className="text-xs text-muted-foreground mt-1 max-w-[320px] truncate">{s.caption}</p> : null}
                    </li>
                ))}
            </ul>

            {current ? (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${appName} screenshot viewer`}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 p-4"
                    onTouchStart={(e) => {
                        touchStart.current = e.touches[0].clientX;
                    }}
                    onTouchEnd={(e) => {
                        if (touchStart.current === null) return;
                        const dx = e.changedTouches[0].clientX - touchStart.current;
                        if (dx > 50) prev();
                        if (dx < -50) next();
                        touchStart.current = null;
                    }}
                >
                    <button type="button" aria-label="Close viewer" onClick={close} className="absolute top-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-background text-foreground">
                        <X size={20} />
                    </button>
                    {shots.length > 1 ? (
                        <>
                            <button type="button" aria-label="Previous screenshot" onClick={prev} className="absolute left-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-background text-foreground">
                                <ChevronLeft size={22} />
                            </button>
                            <button type="button" aria-label="Next screenshot" onClick={next} className="absolute right-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-background text-foreground">
                                <ChevronRight size={22} />
                            </button>
                        </>
                    ) : null}
                    <figure className="max-w-4xl w-full">
                        <AppImage
                            src={current.url}
                            alt={current.alt}
                            width={1200}
                            height={800}
                            className="w-full h-auto max-h-[75vh] object-contain rounded-lg"
                        />
                        <figcaption className="text-center text-background text-sm mt-3 tabular">
                            {openIndex !== null ? openIndex + 1 : 0} / {shots.length}
                            {current.caption ? ` · ${current.caption}` : ''}
                        </figcaption>
                    </figure>
                </div>
            ) : null}
        </section>
    );
}