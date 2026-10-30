'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({
    open,
    title,
    onClose,
    children,
    footer,
}: {
    open: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        ref.current?.focus();
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close dialog"
                onClick={onClose}
                className="absolute inset-0 bg-foreground/50"
            />
            <div
                ref={ref}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                tabIndex={-1}
                className="relative w-full max-w-lg rounded-lg bg-card text-card-foreground shadow-2xl border border-border animate-[fadeScale_180ms_ease-out]"
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button type="button" onClick={onClose} aria-label="Close" className="btn btn-ghost !px-2">
                        <X size={18} />
                    </button>
                </div>
                <div className="px-5 py-4">{children}</div>
                {footer ? <div className="px-5 py-4 border-t border-border flex justify-end gap-2">{footer}</div> : null}
            </div>
            <style>{`@keyframes fadeScale{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}`}</style>
        </div>
    );
}