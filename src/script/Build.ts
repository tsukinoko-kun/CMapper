/// <reference path="Page.ts"/>

class Build {
  private static mode: string = "cs";
  static build(mode: string = this.mode) {
    const files = new Array<Page>();
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
    }
    for (const f of files) {
      f.download();
    }
  }
  static updateMode(mode: string) {
    this.mode = mode;
  }
}
