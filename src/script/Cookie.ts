/// <reference path="alert.ts" />

const Cookie = (() => {
  class Cookie {
    private readonly days = 14;
    private bucket: Map<string, string>;
    public active: boolean;
    constructor() {
      this.bucket = new Map<string, string>();
      if (document.cookie.length > 0) {
        const ca = document.cookie.split(";");
        if (ca.length > 0) {
          const ckva = ca[0].split("=");
          if (ckva.length === 2) {
            for (const ckvs of JSON.parse(atob(ckva[1].replace(/\$/g, "=")))) {
              const ckv = ckvs.split("=");
              if (ckv.length === 2) {
                this.bucket.set(ckv[0], ckv[1]);
              }
            }
          }
        }
      }
      this.active = this.get("allow-cookies") === "true";
    }
    public save(): void {
      if (this.active) {
        var date = new Date();
        date.setTime(date.getTime() + this.days * 24 * 60 * 60 * 1000);
        var expires = "expires=" + date.toUTCString();
        const cookie = new Array<string>();
        const ckva = new Array<string>();
        this.bucket.forEach((v, k) => {
          ckva.push(`${k}=${v}`);
        });
        cookie.push(`bucket=${btoa(JSON.stringify(ckva)).replace(/\=/g, "$")}`);
        cookie.push(expires);
        cookie.push("path=/");
        document.cookie = cookie.join(";");
      }
    }
    public set(key: string, value: string): void {
      this.bucket.set(key.trim(), value.trim());
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

if (!Cookie.active) {
  alert(
    "Do you allow us to use cookies to save your settings? \nIf you decline, this app will still work, but none of your settings will be saved.",
    true,
    "Accept",
    "Reject"
  ).then((allow) => {
    if (allow) {
      setTimeout(() => {
        Cookie.set("allow-cookies", "true");
        Cookie.active = true;
        setInterval(Cookie.save, 3000);
      }, 1000);
    } else {
      document.cookie = "";
      Cookie.active = false;
    }
  });
} else {
  setInterval(Cookie.save, 3000);
}
