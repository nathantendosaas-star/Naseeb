/**
 * Helper to resolve video URLs using jsDelivr CDN backed by GitHub repository
 * with local fallback.
 */
export function getCdnVideoUrl(path?: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `https://cdn.jsdelivr.net/gh/nathantendosaas-star/Naseeb@main/public/${cleanPath}`;
}
