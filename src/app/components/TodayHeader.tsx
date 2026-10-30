'use client';

import React, { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { apps } from '@/lib/catalog';

export default function TodayHeader() {
    const [today, setToday] = useState('');

    useEffect(() => {
        const d = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        setToday(`${days?.[d?.getDay()]}, ${months?.[d?.getMonth()]} ${d?.getDate()}`);
    }, []);

    const downloadable = apps?.filter((a) => a?.downloadable)?.length;

    return (
        <section className="mb-6">
            <p className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground min-h-[1rem]">{today}</p>
            <div className="flex flex-wrap items-end justify-between gap-3 mt-1">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Today</h1>
                <p className="text-sm text-muted-foreground tabular">
                    {apps?.length} listings · {downloadable} with a downloadable file
                </p>
            </div>
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-accent text-accent-foreground px-4 py-3 text-sm">
                <Info size={18} className="mt-0.5 shrink-0" />
                <p>
                    AppHarbor is an independent marketplace and is not affiliated with Apple. Downloading a file does not install
                    it — follow your device’s own install steps.
                </p>
            </div>
        </section>
    );
}