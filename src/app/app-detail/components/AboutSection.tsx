import React from "react";
import { Check } from "lucide-react";
import type { CatalogApp } from "@/lib/catalog";
import { formatDate } from "@/lib/validation";

export default function AboutSection({
    app
}: { app: CatalogApp }) {
    return (
        <section ara-labelledby="about-title">
            <h2 id="about-title" className="text-xl font-bold mb-3">About</h2>
            <p className="text-sm leading-relaxed text-foreground">
                {app.description}
            </p>
            {app.features.length > 0 ? (<ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {app.features.map((f) => (<li key={`feat-${app.id}-${f}`} className="flex items-start gap-2 rounded-lg bg-secondary px-3 py-2 text-sm">
                    <Check size={16} className="text-primary mt-0.5 shrink-0" />
                    <span>{f}</span>
                </li>
                ))}
            </ul>

            ) : null}
            <div className="mt-6 rounded-lg border border-border bg-card p-4">
                <h3 className="text-sm font-bold">What's new in v{app.currentVersion}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 tabular">Updated {formatDate(app.lastUpdated)}</p>
                <p className="text-sm mt-2">{app.changelog}</p>
            </div>
        </section>
    );
}