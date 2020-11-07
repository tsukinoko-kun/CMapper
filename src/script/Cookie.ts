const Cookie = (() => {
  class Cookie {
    constructor() {
      for (const part of document.cookie.split(";")) {
        if (part.length > 1) {
          const partKV: string[] = part.split("=");
          if (partKV.length === 2) {
            this.bucket.set(partKV[0], partKV[1]);
          } else {
            console.error(`Could not read cookie: "${part}"`);
          }
        }
      }
    }
    private bucket = new Map<string, string>();
    private save(): void {
      const cookie = new Array<string>();
      this.bucket.forEach((v: string, k: string) => {
        const part = new StringBuilder();
        part.append(k);
        part.append("=");
        part.append(v);
        cookie.push(part.toString());
      });
      document.cookie = cookie.join("; ");
    }
    public set(key: string, value: string): void {
      this.bucket.set(key.replace(/[=;]/g, ""), value.replace(/[=;]/g, ""));
      this.save();
    }
    public setNumber(key: string, value: number): void {
      this.set(key, value.toString());
    }
    public get(key: string): string | undefined {
      return this.bucket.get(key);
    }
    public getNumber(key: string): number | undefined {
      const r = this.bucket.get(key);
      if (r) {
        return Number(r);
      }
      return undefined;
    }
  }
  return new Cookie();
})();
