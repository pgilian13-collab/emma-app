class FileRegistry {
  private files = new Map<string, File>();
  private blobUrls = new Map<string, string>();

  register(file: File): void {
    this.files.set(makeKey(file), file);
  }

  registerById(id: string, file: File): void {
    this.files.set(id, file);
  }

  has(id: string): boolean {
    return this.files.has(id);
  }

  get(id: string): File | undefined {
    return this.files.get(id);
  }

  remove(id: string): void {
    const url = this.blobUrls.get(id);
    if (url) {
      URL.revokeObjectURL(url);
      this.blobUrls.delete(id);
    }
    this.files.delete(id);
  }

  clear(): void {
    for (const url of this.blobUrls.values()) {
      URL.revokeObjectURL(url);
    }
    this.files.clear();
    this.blobUrls.clear();
  }

  getOrCreateUrl(id: string): string | null {
    const file = this.files.get(id);
    if (!file) return null;
    const cached = this.blobUrls.get(id);
    if (cached) return cached;
    const url = URL.createObjectURL(file);
    this.blobUrls.set(id, url);
    return url;
  }
}

function makeKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

const registry = new FileRegistry();

export function getFileRegistry(): FileRegistry {
  return registry;
}