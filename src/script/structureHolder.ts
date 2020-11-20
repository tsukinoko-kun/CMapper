/// <reference path="ClassStructure/Class.ts"/>

const structureHolder = (() => {
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
      return mmd.toString().replace(/<style>.+<\/style>/, "");
    }

    addClass(cl: Class): number {
      for (let index = 0; index < this.namespace.length; index++) {
        this.namespace[index].id = index;
      }
      let id = this.namespace.push(cl);
      cl.id = id - 1;
      return id;
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
          (<HTMLInputElement>(
            document.getElementById("projectName")
          )).value = this.name;
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

    /**
     * Rename Class
     */
    deepRename(oldName: string, newName: string) {
      for (const cl of this.namespace) {
        for (const f of cl.fields) {
          for (let i = 0; i < f.type.length; i++) {
            if (f.type[i] === oldName) {
              f.type[i] = newName;
            }
          }
        }
        for (const m of cl.methods) {
          if (cl.name === oldName && m.name === oldName) {
            m.name = newName;
          }
          for (let i = 0; i < m.type.length; i++) {
            if (m.type[i] === oldName) {
              m.type[i] = newName;
            }
          }
          for (const p of m.parameters) {
            for (let i = 0; i < p.type.length; i++) {
              if (p.type[i] === oldName) {
                p.type[i] = newName;
              }
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
        if (cl.name === oldName) {
          cl.name = newName;
        }
      }
    }
    rename(el: HTMLInputElement): void {
      const name = remSpCh(el.value);
      if (name.length > 0) {
        structureHolder.name = name;
        el.value = name;
      }
    }
  }
  return new StructureHolder();
})();
