import React from 'react';
import Link from 'next/link';
import { apps } from '@/lib/catalog';
import AppImage from '@/components/ui/AppImage';
import FavoriteButton from '@/components/ui/FavoriteButton';
import EmptyState from '@/components/ui/EmptyState';
import { Star } from 'lucide-react';

export default function HeroPair() {
    const appOfDay = apps?.find((a) => a?.isAppOfDay);
    const gameOfDay = apps?.find((a) => a?.isGameOfDay);

    const slots = [
        { id: 'hero-app', label: 'App of the Day', item: appOfDay, missing: 'No App of the Day selected. Choose one in Admin → Featured.' },
        { id: 'hero-game', label: 'Game of the Day', item: gameOfDay, missing: 'No Game of the Day selected. Choose one in Admin → Featured.' },
    ];

    return (
        <section aria-label="Daily picks" className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
            {slots?.map((s) =>
                s?.item ? (
                    <article
                        key={s?.id}
                        className="group relative overflow-hidden rounded-[22px] bg-foreground min-h-[380px] md:min-h-[440px] shadow-sm"
                    >
                        <AppImage
                            src={s?.item?.banner}
                            alt={s?.item?.bannerAlt}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 scrim-bottom" />
                        <div className="absolute top-4 left-4">
                            <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-foreground">
                                {s?.label}
                            </span>
                        </div>
                        <div className="absolute top-3 right-3">
                            <FavoriteButton appId={s?.item?.id} appName={s?.item?.name} />
                        </div>
                        <div className="absolute bottom-0 inset-x-0 p-5 md:p-6 text-background">
                            <h2 className="text-hero-xl font-bold">{s?.item?.name}</h2>
                            <p className="mt-1 text-sm opacity-90">{s?.item?.subtitle}</p>
                            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-background/90 text-foreground p-3 backdrop-blur">
                                <AppImage
                                    src={s?.item?.icon}
                                    alt={s?.item?.iconAlt}
                                    width={56}
                                    height={56}
                                    className="h-14 w-14 rounded-[14px] object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold truncate">{s?.item?.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {s?.item?.developer} · v{s?.item?.currentVersion}
                                    </p>
                                </div>
                                <Link
                                    href={`/app-detail?id=${s?.item?.id}`}
                                    className="btn btn-primary"
                                    aria-label={`View ${s?.item?.name}`}
                                >
                                    {s?.item?.priceLabel}
                                </Link>
                            </div>
                        </div>
                    </article>
                ) : (
                    <EmptyState
                        key={s?.id}
                        icon={<Star size={28} />}
                        title={s?.label}
                        body={s?.missing}
                    />
                )
            )}
        </section>
    );
}