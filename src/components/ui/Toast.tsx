'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


type ToastTone = 'success' | 'warning' | 'error' | 'info';
interface ToastItem { id: string; tone: ToastTone; message: string }

const ToastContext = createContext<{ push: (tone: ToastTone, message: string) => void }>({ push: () => undefined });

export function useToast() {
    return useContext(ToastContext);
}

const icons = { success: CheckCircle2, warning: AlertTriangle, error: XCircle, info: Info };
const toneClass: Record<ToastTone, string> = {
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-destructive',
    info: 'text-primary',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<ToastItem[]>([]);

    const push = useCallback((tone: ToastTone, message: string) => {
        const id = `toast-${Date.now()}-${Math.floor(performance.now())}`;
        setItems((prev) => [...prev, { id, tone, message }]);
        window.setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3500);
    }, []);

    return (
        <ToastContext.Provider value={{ push }}>
            {children}
            <div aria-live="polite" className="fixed bottom-24 md:bottom-6 right-4 z-[60] flex flex-col gap-2">
                {items.map((t) => {
                    const Icon = icons[t.tone];
                    return (
                        <div
                            key={t.id}
                            className="flex items-start gap-2 rounded-lg border border-border bg-card text-card-foreground shadow-lg px-4 py-3 max-w-sm text-sm"
                        >
                            <Icon size={18} className={`${toneClass[t.tone]} mt-0.5 shrink-0`} />
                            <span>{t.message}</span>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}