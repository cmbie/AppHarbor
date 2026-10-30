export const ALLOWED_FILE_EXTENSIONS = ['apk', 'zip', 'exe', 'msi', 'dmg', 'pkg', 'html', 'ipa', 'deb', 'appimage'];
export const MAX_ICON_BYTES = 2 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

export function extensionOf(name: string): string {
    const i = name.lastIndexOf('.');
    return i >= 0 ? name.slice(i + 1).toLowerCase() : '';
}

export function validateUrlProtocol(raw: string): { ok: boolean; message: string } {
    const value = raw.trim();
    if (!value) return { ok: false, message: 'Enter a URL or a path starting with /' };
    if (value.startsWith('/')) return { ok: true, message: 'Same-site path accepted.' };
    try {
        const u = new URL(value);
        if (u.protocol !== 'https:') {
            return { ok: false, message: `Protocol "${u.protocol}" is not allowed. Use https:// or a same-site path.` };
        }
        return { ok: true, message: 'HTTPS URL format is valid.' };
    } catch {
        return { ok: false, message: 'This is not a valid URL.' };
    }
}

export function validateDownloadFile(file: File): { ok: boolean; message: string } {
    const ext = extensionOf(file.name);
    if (!ALLOWED_FILE_EXTENSIONS.includes(ext)) {
        return { ok: false, message: `.${ext || '?'} is not in the allowed list (${ALLOWED_FILE_EXTENSIONS.join(', ')}).` };
    }
    return { ok: true, message: 'Extension allowed. Extension alone does not prove a file is safe.' };
}

export function validateImageFile(file: File): { ok: boolean; message: string } {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return { ok: false, message: `${file.type || 'Unknown type'} is not an accepted image type.` };
    }
    if (file.size > MAX_ICON_BYTES) {
        return { ok: false, message: 'Image is larger than the 2 MB limit.' };
    }
    return { ok: true, message: 'Image accepted.' };
}

export function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function formatDate(iso: string): string {
    // Locale-independent formatter to keep SSR and CSR output identical
    const parts = iso.slice(0, 10).split('-');
    if (parts.length !== 3) return iso;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const m = months[Number(parts[1]) - 1] ?? parts[1];
    return `${m} ${Number(parts[2])}, ${parts[0]}`;
}