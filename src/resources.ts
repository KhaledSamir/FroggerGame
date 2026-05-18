class ResourceLoader {
  private cache = new Map<string, HTMLImageElement | false>();
  private readyCallbacks: Array<() => void> = [];

  load(urls: string[]): void {
    urls.forEach((url) => this.loadOne(url));
  }

  get(url: string): HTMLImageElement | false {
    return this.cache.get(url) ?? false;
  }

  onReady(callback: () => void): void {
    this.readyCallbacks.push(callback);
  }

  isReady(): boolean {
    for (const value of this.cache.values()) {
      if (value === false) return false;
    }
    return this.cache.size > 0;
  }

  private loadOne(url: string): void {
    if (this.cache.has(url)) return;

    this.cache.set(url, false);
    const img = new Image();
    img.onload = () => {
      this.cache.set(url, img);
      if (this.isReady()) {
        this.readyCallbacks.forEach((cb) => cb());
      }
    };
    img.src = url;
  }
}

export const Resources = new ResourceLoader();
