/// <reference path="Page.ts"/>

class Build {
  private static mode: string;
  static build(mode: string = this.mode) {
    const files = new Array<Page>();
    if (!mode) {
      mode = (<HTMLSelectElement>document.getElementById("selectBuild"))?.value;
    }
    switch (mode) {
      case "cm":
        files.push(
          new Page(
            structureHolder.name,
            "cm",
            btoa(JSON.stringify(structureHolder.namespace))
          )
        );
        break;
      case "cs":
      case "ts":
        for (const cl of structureHolder.namespace) {
          files.push(cl.codeGen(mode));
        }
        break;
    }
    const zip = new JSZip();
    for (const f of files) {
      zip.file(f.fullName, f.data);
    }
    zip.generateAsync({ type: "blob" }).then(function (blob) {
      saveAs(<Blob>blob, structureHolder.name + ".zip");
    });
  }
  static updateMode(mode: string) {
    this.mode = mode;
  }
}
