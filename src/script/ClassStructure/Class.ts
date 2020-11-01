/// <reference path="Protection.ts"/>
/// <reference path="Field.ts"/>
/// <reference path="Method.ts"/>

class Class {
  name: string;
  relations: Array<Relation>;
  static: boolean;
  abstract: boolean;
  fields: Array<Field>;
  methods: Array<Method>;
  id: number = -1;

  constructor(name: string) {
    this.name = name;
    this.relations = new Array<Relation>();
    this.static = false;
    this.abstract = false;
    this.fields = new Array<Field>();
    this.methods = new Array<Method>();
  }

  toString(): string {
    const strb = new StringBuilder();
    if (this.fields.length > 0 || this.methods.length > 0) {
      strb.appendWithLinebreak(`class ${this.name}{`);
      if (this.abstract) {
        strb.appendWithLinebreak("<<abstract>>");
      } else if (this.static) {
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
        code.append("public ");
        if (this.static) {
          code.append("static ");
        } else if (this.abstract) {
          code.append("abstract ");
        }
        code.appendWithLinebreak(`class ${this.name}`);
        code.appendWithLinebreak("{");
        for (const f of this.fields) {
          code.appendWithLinebreak("\t" + f.codeGen(lng));
        }
        for (const m of this.methods) {
          code.appendWithLinebreak("\t" + m.codeGen(lng));
        }
        code.appendWithLinebreak("}");
    }
    return new Page(this.name, lng, code.toString());
  }
}
