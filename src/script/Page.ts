class Page {
  readonly name: string;
  readonly ext: string;
  readonly fullName: string;
  readonly content: Blob;
  readonly data: string;
  constructor(name: string, ext: string, content: string) {
    this.name = name;
    this.ext = ext;
    this.fullName = this.name + "." + this.ext;
    this.data = content;
    this.content = new Blob([content], { type: "text/plain" });
  }
  download() {
    window.URL = window.URL || window.webkitURL;
    const a = document.createElement("a");
    a.setAttribute("href", window.URL.createObjectURL(this.content));
    a.setAttribute("download", this.name + "." + this.ext);
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}
