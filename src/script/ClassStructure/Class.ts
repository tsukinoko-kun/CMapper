/// <reference path="Protection.ts"/>
/// <reference path="Field.ts"/>
/// <reference path="Method.ts"/>

class Class {
  name: string;
  relations: Array<Relation>;
  classifer: Classifer;
  fields: Array<Field>;
  methods: Array<Method>;
  id: number = -1;

  constructor(name: string) {
    this.name = name;
    this.relations = new Array<Relation>();
    this.classifer = Classifer.default;
    this.fields = new Array<Field>();
    this.methods = new Array<Method>();
  }

  toString(): string {
    const strb = new StringBuilder();
    if (
      this.fields.length > 0 ||
      this.methods.length > 0 ||
      this.classifer !== Classifer.default
    ) {
      strb.appendWithLinebreak(`class ${this.name}{`);
      if (this.classifer === Classifer.abstract) {
        strb.appendWithLinebreak("<<abstract>>");
      } else if (this.classifer === Classifer.static) {
        strb.appendWithLinebreak("<<static>>");
      }
      this.forEachField((f: Field) => {
        strb.append("\t");
        strb.appendWithLinebreak(f.toString());
      });
      this.forEachMethod((m: Method) => {
        strb.append("\t");
        strb.appendWithLinebreak(m.toString());
      });
      strb.appendWithLinebreak("}");
    } else {
      strb.appendWithLinebreak(`class ${this.name}`);
    }
    this.forEachRelation((rel: Relation) => {
      strb.appendWithLinebreak(rel.toString());
    });
    return strb.toString();
  }

  addField(f: Field): void {
    this.fields.push(f);
  }

  addMethod(m: Method): void {
    this.methods.push(m);
  }

  private forEachField(callback: (f: Field) => void): void {
    for (const f of this.fields) {
      callback(f);
    }
    return;
  }

  private forEachMethod(callback: (m: Method) => void): void {
    for (const m of this.methods) {
      callback(m);
    }
    return;
  }

  private forEachRelation(callback: (rel: Relation) => void): void {
    for (const rel of this.relations) {
      callback(rel);
    }
  }

  codeGen(lng: string): Page {
    const code = new StringBuilder();
    switch (lng) {
      case "cs":
        code.append("using System;\n\n");
        code.appendWithLinebreak(`namespace ${structureHolder.name}\n{`);
        code.append("\tpublic ");
        if (this.classifer === Classifer.static) {
          code.append("static ");
        } else if (this.classifer === Classifer.abstract) {
          code.append("abstract ");
        }
        code.appendWithLinebreak(`class ${this.name}`);
        code.appendWithLinebreak("\t{");
        for (const f of this.fields) {
          code.appendWithLinebreak("\t\t" + f.codeGen(lng));
        }
        for (const m of this.methods) {
          code.appendWithLinebreak("\t\t" + m.codeGen(lng));
        }
        code.appendWithLinebreak("\t}\n}");
        break;
      case "ts":
        let stat = false;
        let abstr = false;
        for (const m of this.methods) {
          if (m.classifer === Classifer.abstract) {
            abstr = true;
            break;
          }
        }
        if (this.classifer === Classifer.static) {
          stat = true;
        } else if (this.classifer === Classifer.abstract || abstr) {
          code.append("abstract ");
        }
        code.appendWithLinebreak(`class ${this.name}`);
        code.appendWithLinebreak("{");
        for (const f of this.fields) {
          code.appendWithLinebreak("\t" + f.codeGen(lng, stat));
        }
        for (const m of this.methods) {
          code.appendWithLinebreak("\t" + m.codeGen(lng, stat));
        }
        code.appendWithLinebreak("}");
        break;
    }
    return new Page(this.name, lng, code.toString());
  }
}
