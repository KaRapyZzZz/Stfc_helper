export function openExternalUrl(url) {
  if (!url) return;
  if (window.electronAPI && typeof window.electronAPI.openExternal === 'function') {
    window.electronAPI.openExternal(url);
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
