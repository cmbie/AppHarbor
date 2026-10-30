import React from "react";
import type { Metadata } from "next";
import AppLayout from "@/components/AppLayout";
import { apps, getApp } from "@/lib/catalog";
import DetailView from "@/app/app-detail/components/DetailVIew";

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ id?: string }>;
}): Promise<Metadata> {
    const { id } = await searchParams;
    const app = getApp(id) ?? apps[0];
    return {
        title: `${app.name} - ${app.subtitle} | AppHarbor`,
        description: app.description.slice(0, 155),
    };
}

export default async function AppDetailPage({
    searchParams,
}: {
    searchParams: Promise<{ id?: string }>;
}) {
    const { id } = await searchParams;
    const app = getApp(id) ?? apps[0];
    const similar = app.similarIds.map((sid) => getApp(sid)).filter((x): x is NonNullable<typeof x> => Boolean(x));

    return (
        <AppLayout>
            <DetailView app={app} similar={similar} />
        </AppLayout>
    );
}