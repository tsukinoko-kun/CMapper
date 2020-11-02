/// <reference path="ClassStructure/Class.ts"/>

class StructureHolder {
  name: string = "unknown";
  namespace: Array<Class>;

  constructor() {
    this.namespace = new Array<Class>();
  }

  private forEachClass(callback: (cl: Class) => void): void {
    for (const cl of this.namespace) {
      callback(cl);
    }
  }

  collectMmd(): string {
    if (this.namespace.length === 0) {
      return "";
    }
    const mmd = new StringBuilder();
    mmd.appendWithLinebreak("classDiagram");
    this.forEachClass((cl: Class) => {
      mmd.appendWithLinebreak(cl.toString());
    });
    mmd.append("\n");
    return mmd.toString();
  }

  addClass(cl: Class): number {
    const i = this.namespace.push(cl);
    cl.id = i - 1;
    return i;
  }

  findClass(name: string): Class | undefined {
    for (const cl of this.namespace) {
      if (cl.name === name) {
        return cl;
      }
    }
    return undefined;
  }

  loadFile(f: File): void {
    try {
      if (f.name.endsWith(".cm")) {
        this.name = f.name.substr(0, f.name.length - 3);
        var fr = new FileReader();
        fr.onload = function () {
          if (fr.result) {
            let res: string;
            if (typeof fr.result === "string") {
              res = fr.result;
            } else {
              var arr = new Uint8Array(fr.result);
              var array = new Array<number>();
              for (var i = 0; i < arr.byteLength; i++) {
                array[i] = arr[i];
              }
              var str = String.fromCharCode.apply(String, array);
              if (/[\u0080-\uffff]/.test(str)) {
                throw new Error(
                  "this string seems to contain (still encoded) multibytes"
                );
              }
              res = str;
            }
            structureHolder.importJson(atob(res));
          }
        };
        fr.readAsText(f);
      } else {
        throw "Unexpected FileType";
      }
    } catch (e) {
      alert(e);
    }
  }
  importJson(json: string): void {
    try {
      const obj: Array<Class> = JSON.parse(json);
      const tempNamespance = new Array<Class>();
      for (const clDta of obj) {
        const newCl = new Class(clDta.name);
        newCl.classifer = clDta.classifer;
        newCl.id = clDta.id;

        const tempFieldList = new Array<Field>();
        for (const flDta of clDta.fields) {
          tempFieldList.push(
            new Field(
              signToProtection(flDta.protection),
              flDta.type,
              flDta.name,
              flDta.classifer
            )
          );
        }
        newCl.fields = tempFieldList;

        const tempMethodList = new Array<Method>();
        for (const mthDta of clDta.methods) {
          const tempParamList = new Array<Field>();
          for (const pDta of mthDta.parameters) {
            tempParamList.push(
              new Field(Protection.internal, pDta.type, pDta.name)
            );
          }
          tempMethodList.push(
            new Method(
              signToProtection(mthDta.protection),
              mthDta.type,
              mthDta.name,
              mthDta.classifer,
              tempParamList
            )
          );
        }
        newCl.methods = tempMethodList;

        const tempRelationList = new Array<Relation>();
        for (const rDta of clDta.relations) {
          tempRelationList.push(
            new Relation(
              rDta.classA,
              rDta.classB,
              rDta.relation,
              rDta.cardinalityA,
              rDta.cardinalityB,
              rDta.comment
            )
          );
        }
        newCl.relations = tempRelationList;

        tempNamespance.push(newCl);
      }
      this.namespace = tempNamespance;
      Ui.unfocus();
      Ui.render();
    } catch (e) {
      alert(e);
    }
  }

  deepRename(oldName: string, newName: string) {
    for (const cl of this.namespace) {
      for (const f of cl.fields) {
        if (f.type === oldName) {
          f.type = newName;
        }
      }
      for (const m of cl.methods) {
        if (m.type === oldName) {
          m.type = newName;
        }
        for (const p of m.parameters) {
          if (p.type === oldName) {
            p.type = newName;
          }
        }
      }
      for (const r of cl.relations) {
        if (r.classA === oldName) {
          r.classA = newName;
        }
        if (r.classB === oldName) {
          r.classB = newName;
        }
      }
    }
  }
}
const structureHolder = new StructureHolder();
