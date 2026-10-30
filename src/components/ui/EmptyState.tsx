import React from 'react';

export default function EmptyState({
    icon,
    title,
    body,
    action,
}: {
    icon: React.ReactNode;
    title: string;
    body: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col items-center text-center rounded-lg border border-dashed border-border bg-secondary px-6 py-12">
            <div className="text-muted-foreground mb-3">{icon}</div>
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">{body}</p>
            {action ? <div className="mt-4">{action}</div> : null}
        </div>
    );
}