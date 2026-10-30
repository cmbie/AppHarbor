import React from "react";
import type { Metadata } from "next";
import AppLayout from "@/components/AppLayout";
import AdminShell from "./components/AdminShell";

export const metadata: Metadata = {
    title: "Admin - Catalog Management | AppHarbor",
    description: "Owner tools for managing listings, versions, collections, featured slots and download links."
};

export default function AdminPage() {
    return (
        <AppLayout>
            <AdminShell />
        </AppLayout>
    );
}