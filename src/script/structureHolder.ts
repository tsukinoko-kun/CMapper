/// <reference path="ClassStructure/Class.ts"/>

class StructureHolder {
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
}
const structureHolder = new StructureHolder();
