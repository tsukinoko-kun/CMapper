/// <reference path="Cookie.ts"/>
/// <reference path="Page.ts"/>

class Build {
  private static mode: string;
  static build(mode: string = this.mode) {
    const files = new Array<Page>();
    if (!mode) {
      mode = (<HTMLSelectElement>document.getElementById("selectBuild"))?.value;
    }
    if (mode === "cm") {
      saveAs(
        new Page(
          structureHolder.name,
          "cm",
          btoa(JSON.stringify(structureHolder.namespace))
        ).content,
        structureHolder.name + ".cm"
      );
    } else {
      Smart.checkBeforeBuild().then((rv) => {
        if (rv) {
          for (const cl of structureHolder.namespace) {
            files.push(cl.codeGen(mode));
          }
          const zip = new JSZip();
          for (const f of files) {
            zip.file(f.fullName, f.data);
          }
          zip.generateAsync({ type: "blob" }).then(function (blob) {
            saveAs(<Blob>blob, structureHolder.name + "." + mode + ".zip");
          });
        }
      });
    }
  }
  static updateMode(mode: string) {
    this.mode = mode;
    Cookie.set("build-lng", mode);
  }
  static image(): void {
    const mddSvg = document.getElementById(mddSvgId);
    if (mddSvg) {
      mddSvg.classList.add("print");
      domtoimage.toJpeg(mddSvg, { quality: 1.0 }).then(function (blob) {
        saveAs(blob, `${structureHolder.name}.jpeg`);
        mddSvg.classList.remove("print");
      });
    } else {
      alert("Could not find data to export");
    }
  }
}
(() => {
  const mode = Cookie.get("build-lng");
  if (mode) {
    Build.updateMode(mode);
    (<HTMLSelectElement>document.getElementById("selectBuild")).value = mode;
  }
})();
