class Page {
  readonly name: string;
  readonly ext: string;
  readonly content: Blob;
  constructor(name: string, ext: string, content: string) {
    this.name = name;
    this.ext = ext;
    this.content = new Blob([content], { type: "text/plain" });
    console.debug(content);
  }
  download() {
    console.debug(this.content);
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
