import React from 'react';
import AppLayout from '@/components/AppLayout';
import TodayHeader from '@/app/components/TodayHeader';
import HeroPair from '@/app/components/HeroPair';
import AppRail from '@/app/components/AppRail';
import TrendingCategories from '@/app/components/TrendingCategories';
import CollectionsGrid from '@/app/components/CollectionsGrid';
import { apps, sortByRelease, sortByUpdated } from '@/lib/catalog';

export default function TodayPage() {
    const featured = apps?.filter((a) => a?.featured);
    const newest = sortByRelease(apps)?.slice(0, 6);
    const updated = sortByUpdated(apps)?.slice(0, 6);
    const topFree = apps?.filter((a) => a?.price === 0 && a?.downloadable);
    const topPaid = apps?.filter((a) => a?.price > 0);
    const students = apps?.filter((a) => a?.tags?.includes('student'));
    const offline = apps?.filter((a) => a?.tags?.includes('offline'));
    const educational = apps?.filter((a) => a?.type === 'game' && a?.tags?.includes('education'));

    return (
        <AppLayout>
            <TodayHeader />
            <HeroPair />
            <AppRail id="rail-featured" title="Featured" subtitle="Hand-picked by the store owner" items={featured} />
            <AppRail id="rail-new" title="New Releases" subtitle="Ordered by release date" items={newest} />
            <AppRail id="rail-updated" title="Recently Updated" subtitle="Ordered by last update" items={updated} />
            <TrendingCategories />
            <AppRail id="rail-free" title="Top Free" subtitle="Free listings with a downloadable file" items={topFree} />
            <AppRail
                id="rail-paid"
                title="Top Paid"
                subtitle="Paid listings — price shown is set by the developer"
                items={topPaid}
                emptyText="No paid listings in the catalog yet."
            />
            <CollectionsGrid />
            <AppRail id="rail-students" title="Best Apps for Students" subtitle="Tagged “student” by the owner" items={students} />
            <AppRail id="rail-offline" title="Works Offline" subtitle="Tagged “offline” by the owner" items={offline} />
            <AppRail
                id="rail-edu-games"
                title="Educational Games"
                subtitle="Games tagged “education”"
                items={educational}
                emptyText="No educational games yet."
            />
        </AppLayout>
    );
}