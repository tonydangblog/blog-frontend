/* Utils: Reload if Cached. */
function reloadIfCachedListener(): void {
  /* Reload if page loaded from browser cache. */
  window.addEventListener('pageshow', (event: PageTransitionEvent): void => {
    if (event.persisted) window.location.reload();
  });
}

export { reloadIfCachedListener };
