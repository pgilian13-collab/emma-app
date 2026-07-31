class BlobUrlCache {
  private urls = new Map<string, string>();

  set(id: string, blob: Blob): string {
    const existing = this.urls.get(id);
    if (existing) return existing;
    const url = URL.createObjectURL(blob);
    this.urls.set(id, url);
    return url;
  }

  get(id: string): string | undefined {
    return this.urls.get(id);
  }

  revoke(id: string): void {
    const url = this.urls.get(id);
    if (url) {
      URL.revokeObjectURL(url);
      this.urls.delete(id);
    }
  }

  clear(): void {
    for (const url of this.urls.values()) URL.revokeObjectURL(url);
    this.urls.clear();
  }
}

const cache = new BlobUrlCache();

export function getBlobUrlCache(): BlobUrlCache {
  return cache;
}