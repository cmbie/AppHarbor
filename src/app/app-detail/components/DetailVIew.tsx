import React from "react";
import type { CatalogApp } from "@/lib/catalog";
import AboutSection from "@/app/app-detail/components/AboutSection";
import DetailHeader from "@/app/app-detail/components/DetailHeader";
import DownloadPanel from "@/app/app-detail/components/DownloadPanel";
import ScreenshotGallery from "@/app/app-detail/components/ScreenshotGallery";
import VersionHistory from "@/app/app-detail/components/VersionHistory";
import InfoGrid from "@/app/app-detail/components/InfoGrid";
import ReviewsSection from "@/app/app-detail/components/ReviewsSection";
import SimilarApps from "@/app/app-detail/components/SimilarApps";
export default function DetailView({ app, similar }: { app: CatalogApp; similar: CatalogApp[] }) {
    return (
        <div className="max-w-screen-xl">
            <DetailHeader app={app} />
            <div className="grid grid-cols-1 xl:gri-cols-[1fr_380px] gap-8 mt-8">
                <div className="min-w-0 flex flex-col gap-10">
                    <ScreenshotGallery shots={app.screenshots} appName={app.name} />
                    <AboutSection app={app} />
                    <VersionHistory app={app} />
                    <ReviewsSection appId={app.id} appName={app.name} />
                </div>
                <aside className="flex flex-col gap-6 xl:sticky xl:top-24 self-start">
                    <DownloadPanel app={app} />
                    <InfoGrid app={app} />
                </aside>
            </div>
            <SimilarApps items={similar} />
        </div>
    )
}