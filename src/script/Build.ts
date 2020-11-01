/// <reference path="Page.ts"/>

class Build {
  private static mode: string;
  static build() {
    const files = new Array<Page>();
    switch (this.mode) {
      case "cm":
        files.push(
          new Page(
            "unknown",
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
