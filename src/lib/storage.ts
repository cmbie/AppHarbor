// BACKEND INTEGRATION: LocalStorage is per-browser only. Swap for a shared API if multi-visitor data is needed.
export type DownloadStatus = 'initiated' | 'downloading' | 'completed' | 'failed' | 'unavailable';

export interface DownloadRecord {
    id: string;
    appId: string;
    appName: string;
    sourceId: string;
    fileName: string;
    fileSize: string;
    version: string;
    url: string;
    status: DownloadStatus;
    startedAt: string;
    note: string;
}

export interface LocalReview {
    id: string;
    appId: string;
    rating: number;
    text: string;
    createdAt: string;
    helpful: number;
}

const KEYS = {
    favorites: 'appharbor.favorites',
    downloads: 'appharbor.downloads',
    reviews: 'appharbor.reviews',
    theme: 'appharbor.theme',
} as const;

function read<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
        const raw = window.localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

function write<T>(key: string, value: T): { ok: boolean; error?: string } {
    if (typeof window === 'undefined') return { ok: false, error: 'No window' };
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return { ok: true };
    } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : 'Storage quota exceeded' };
    }
}

export const storage = {
    getFavorites: () => read<string[]>(KEYS.favorites, []),
    setFavorites: (ids: string[]) => write(KEYS.favorites, Array.from(new Set(ids))),
    getDownloads: () => read<DownloadRecord[]>(KEYS.downloads, []),
    setDownloads: (list: DownloadRecord[]) => write(KEYS.downloads, list),
    getReviews: () => read<LocalReview[]>(KEYS.reviews, []),
    setReviews: (list: LocalReview[]) => write(KEYS.reviews, list),
    getTheme: () => read<'light' | 'dark' | 'system'>(KEYS.theme, 'system'),
    setTheme: (t: 'light' | 'dark' | 'system') => write(KEYS.theme, t),
};