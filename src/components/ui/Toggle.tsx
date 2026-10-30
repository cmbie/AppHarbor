'use client';

import React from 'react';

export default function Toggle({
    checked,
    onChange,
    label,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-150 ${checked ? 'bg-primary' : 'bg-input'
                }`}
        >
            <span
                className={`inline-block h-5 w-5 rounded-full bg-background shadow transition-transform duration-150 ${checked ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />
        </button>
    );
}