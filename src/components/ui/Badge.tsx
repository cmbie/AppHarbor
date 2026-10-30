import React from 'react';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const tones: Record<Tone, string> = {
    neutral: 'bg-muted text-foreground',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-destructive/10 text-destructive',
    info: 'bg-accent text-accent-foreground',
};

export default function Badge({ tone = 'neutral', children }: { tone?: Tone; children: React.ReactNode }) {
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>
            {children}
        </span>
    );
}