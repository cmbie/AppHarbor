'use client';

import React, { useState } from 'react';
import { ShieldAlert, LayoutGrid, FileText, Link2, Layers, FolderKanban, Star, DatabaseBackup } from 'lucide-react';
import HealthSummary from '@/app/admin/components/HealthSummary';
import CatalogTable from '@/app/admin/components/CategoryTable';
import AppForm from '@/app/admin/components/AppForm';
import FileUpload from '@/app/admin/components/FileUpload';
import LinkChecker from '@/app/admin/components/LinkChecker';
import CategoryManager from '@/app/admin/components/CategoryManager';
import CollectionManager from '@/app/admin/components/CollectionManager';
import FeaturedSlots from '@/app/admin/components/FeaturedSlots';
import ImportExport from '@/app/admin/components/ImportExport';
import Icon from '@/components/ui/AppIcon';


const tabs = [
    { id: 'tab-catalog', label: 'Catalog', icon: LayoutGrid },
    { id: 'tab-editor', label: 'App Editor', icon: FileText },
    { id: 'tab-files', label: 'Files', icon: Layers },
    { id: 'tab-links', label: 'Link Check', icon: Link2 },
    { id: 'tab-categories', label: 'Categories', icon: FolderKanban },
    { id: 'tab-collections', label: 'Collections', icon: Layers },
    { id: 'tab-featured', label: 'Featured', icon: Star },
    { id: 'tab-data', label: 'Import / Export', icon: DatabaseBackup },
] as const;

type TabId = (typeof tabs)[number]['id'];

export default function AdminShell() {
    const [active, setActive] = useState<TabId>('tab-catalog');
    const [editingId, setEditingId] = useState<string | null>(null);

    const openEditor = (id: string | null) => {
        setEditingId(id);
        setActive('tab-editor');
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Admin</h1>
                <p className="text-sm text-muted-foreground mt-1">Owner console for the catalog, files and featured placement.</p>
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-warning/10 px-4 py-3 mb-6 text-sm">
                <ShieldAlert size={20} className="text-warning shrink-0 mt-0.5" />
                <p>
                    This is an owner-operated local tool, not a secure public admin system. There is no authentication, so anyone
                    who can open this page can use it. For production, edit the JSON catalog at deployment time or add a secured
                    backend. Changes made here live in this browser only.
                </p>
            </div>

            <HealthSummary />

            <div role="tablist" aria-label="Admin sections" className="mt-8 flex gap-1 overflow-x-auto no-scrollbar border-b border-border">
                {tabs.map((t) => {
                    const Icon = t.icon;
                    const isActive = active === t.id;
                    return (
                        <button
                            key={t.id}
                            type="button"
                            role="tab"
                            id={t.id}
                            aria-selected={isActive}
                            aria-controls={`${t.id}-panel`}
                            onClick={() => setActive(t.id)}
                            className={`inline-flex items-center gap-2 whitespace-nowrap px-4 min-h-[44px] text-sm font-semibold border-b-2 transition-colors duration-150 ${isActive ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Icon size={16} /> {t.label}
                        </button>
                    );
                })}
            </div>

            <div role="tabpanel" id={`${active}-panel`} aria-labelledby={active} className="pt-6">
                {active === 'tab-catalog' ? <CatalogTable onEdit={openEditor} /> : null}
                {active === 'tab-editor' ? <AppForm editingId={editingId} onDone={() => setActive('tab-catalog')} /> : null}
                {active === 'tab-files' ? <FileUpload /> : null}
                {active === 'tab-links' ? <LinkChecker /> : null}
                {active === 'tab-categories' ? <CategoryManager /> : null}
                {active === 'tab-collections' ? <CollectionManager /> : null}
                {active === 'tab-featured' ? <FeaturedSlots /> : null}
                {active === 'tab-data' ? <ImportExport /> : null}
            </div>
        </div>
    );
}