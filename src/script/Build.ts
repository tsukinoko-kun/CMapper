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
    for (const f of files) {
      f.download();
    }
  }
  static updateMode(mode: string) {
    this.mode = mode;
  }
}
