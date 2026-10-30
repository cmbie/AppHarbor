// BACKEND INTEGRATION: a server-side HEAD check would give accurate status for cross-origin URLs.
import { validateUrlProtocol } from '@/lib/validation';

export interface LinkCheckResult {
    level: 'success' | 'warning' | 'error';
    title: string;
    detail: string;
    httpStatus: number | null;
    contentType: string | null;
    contentLength: string | null;
}

export async function checkLink(url: string): Promise<LinkCheckResult> {
    const proto = validateUrlProtocol(url);
    if (!proto.ok) {
        return { level: 'error', title: 'URL rejected', detail: proto.message, httpStatus: null, contentType: null, contentLength: null };
    }
    const target = url.trim();
    const isSameSite = target.startsWith('/');
    try {
        const res = await fetch(target, { method: 'HEAD', cache: 'no-store' });
        const contentType = res.headers.get('content-type');
        const contentLength = res.headers.get('content-length');
        if (res.ok) {
            return {
                level: 'success',
                title: 'Source responded',
                detail: 'The server answered. This does not prove the file is safe, authentic or virus-free.',
                httpStatus: res.status, contentType, contentLength,
            };
        }
        return {
            level: 'error',
            title: res.status === 404 ? 'File not found' : 'Server returned an error',
            detail: `The source returned HTTP ${res.status}. The link may be missing or expired.`,
            httpStatus: res.status, contentType, contentLength,
        };
    } catch {
        if (isSameSite) {
            return {
                level: 'error', title: 'Could not reach file',
                detail: 'The same-site request failed. Check that the file exists in /public/downloads.',
                httpStatus: null, contentType: null, contentLength: null,
            };
        }
        return {
            level: 'warning', title: 'Cannot inspect remote file',
            detail: 'The browser blocked the request (likely CORS) or the host is offline. The link may still work in a normal download — it just cannot be verified from here.',
            httpStatus: null, contentType: null, contentLength: null,
        };
    }
}