/// <reference path="Protection.ts"/>
/// <reference path="Attribute.ts"/>
/// <reference path="Method.ts"/>

class Class {
  name: string;
  relations: Array<Relation>;
  classifer: Classifer;
  attributes: Array<Attribute>;
  methods: Array<Method>;
  id: number = -1;

  constructor(name: string) {
    this.name = name;
    this.relations = new Array<Relation>();
    this.classifer = Classifer.default;
    this.attributes = new Array<Attribute>();
    this.methods = new Array<Method>();
  }

  toString(): string {
    const strb = new StringBuilder();
    if (
      this.attributes.length > 0 ||
      this.methods.length > 0 ||
      this.classifer !== Classifer.default
    ) {
      strb.appendWithLinebreak(`class ${this.name}{`);
      if (this.classifer === Classifer.abstract) {
        strb.appendWithLinebreak("<<abstract>>");
      } else if (this.classifer === Classifer.static) {
        strb.appendWithLinebreak("<<static>>");
      }
      this.forEachAttribute((f: Attribute) => {
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

  addAttribute(f: Attribute): void {
    this.attributes.push(f);
  }

  addMethod(m: Method): void {
    this.methods.push(m);
  }

  addRelation(r: Relation): void {
    this.relations.push(r);
  }

  public forEachAttribute(callback: (f: Attribute) => void): void {
    for (const f of this.attributes) {
      callback(f);
    }
    return;
  }

  public forEachMethod(callback: (m: Method) => void): void {
    for (const m of this.methods) {
      callback(m);
    }
    return;
  }

  public forEachMember(
    callback: (m: Attribute | Method, $break: () => void) => void
  ): void {
    let ex = true;
    const _break = () => {
      ex = false;
    };
    for (const f of this.attributes) {
      if (ex) {
        callback(f, _break);
      } else {
        return;
      }
    }
    for (const m of this.methods) {
      if (ex) {
        callback(m, _break);
      } else {
        return;
      }
    }
    return;
  }

  public forEachRelation(callback: (rel: Relation) => void): void {
    for (const rel of this.relations) {
      callback(rel);
    }
  }

  codeGen(lng: string): Page {
    const code = new StringBuilder();
    let stat = false;
    let inheritance = false;
    const imp = new Set<string>();
    const libImp = new Set<string>();
    const inheritanceList = new Array<string>();
    for (const rel of this.relations) {
      if (rel.relation === relationType.inheritance) {
        inheritanceList.push(rel.classB);
        imp.add(rel.classB);
      }
    }
    for (const f of this.attributes) {
      for (const t of f.type) {
        if (structureHolder.findClass(t)) {
          imp.add(t);
        } else {
          libImp.add(getTypeImport(t, lng));
        }
      }
    }
    for (const m of this.methods) {
      for (const t of m.type) {
        if (structureHolder.findClass(t)) {
          imp.add(t);
        } else {
          libImp.add(getTypeImport(t, lng));
        }
      }
      for (const p of m.parameters) {
        for (const t of p.type) {
          if (structureHolder.findClass(t)) {
            imp.add(t);
          } else {
            libImp.add(getTypeImport(t, lng));
          }
        }
      }
    }
    libImp.delete("");
    imp.delete(this.name);
    switch (lng) {
      case "cs":
        for (const using of libImp) {
          code.appendWithLinebreak(`using ${using};`);
        }
        if (libImp.size > 0) {
          code.append("\n");
        }
        code.appendWithLinebreak(`namespace ${structureHolder.name}\n{`);
        code.append("\tpublic ");
        if (this.classifer === Classifer.static) {
          stat = true;
          code.append("static ");
        } else if (this.classifer === Classifer.abstract) {
          code.append("abstract ");
        }
        code.append(`class ${this.name}`);
        inheritance = false;
        for (const rel of this.relations) {
          if (rel.relation === relationType.inheritance) {
            if (inheritance) {
              alert(
                "The selected language does not support multiple inheritance!"
              );
              break;
            } else {
              inheritance = true;
              code.append(` : ${rel.classB}`);
            }
          }
        }
        code.appendWithLinebreak("\n\t{");
        for (const f of this.attributes) {
          code.appendWithLinebreak("\t\t" + f.codeGen(lng));
        }
        for (const m of this.methods) {
          code.appendWithLinebreak("\t\t" + m.codeGen(lng, stat, this.name));
        }
        code.appendWithLinebreak("\t}\n}");
        break;
      case "h":
        for (const module of imp) {
          code.appendWithLinebreak(`#include "${module}.h"`);
        }
        if (imp.size > 0) {
          code.append("\n");
        }
        code.appendWithLinebreak(`namespace ${structureHolder.name}\n{`);
        code.append("\t");
        if (this.classifer === Classifer.static) {
          stat = true;
          code.append("static ");
        } else if (this.classifer === Classifer.abstract) {
          code.append("abstract ");
        }
        code.append(`class ${this.name}`);
        inheritance = false;
        for (const rel of this.relations) {
          if (rel.relation === relationType.inheritance) {
            if (inheritance) {
              alert(
                "The selected language does not support multiple inheritance!"
              );
              break;
            } else {
              inheritance = true;
              code.append(` : ${rel.classB}`);
            }
          }
        }
        code.appendWithLinebreak("\n\t{");
        // Attributes
        const publicAttributes = new StringBuilder();
        publicAttributes.appendWithLinebreak("\t\tpublic: ");
        const protectedAttributes = new StringBuilder();
        protectedAttributes.appendWithLinebreak("\t\tprotected: ");
        const privateAttributes = new StringBuilder();
        privateAttributes.appendWithLinebreak("\t\tprivate: ");
        for (const f of this.attributes) {
          switch (f.protection) {
            case Protection.public:
              publicAttributes.appendWithLinebreak("\t\t\t" + f.codeGen(lng));
              break;
            case Protection.protected:
              protectedAttributes.appendWithLinebreak(
                "\t\t\t" + f.codeGen(lng)
              );
              break;
            case Protection.private:
            case Protection.internal:
              privateAttributes.appendWithLinebreak("\t\t\t" + f.codeGen(lng));
              break;
          }
        }
        if (publicAttributes.length > 11) {
          code.appendWithLinebreak(publicAttributes.toString());
        }
        if (protectedAttributes.length > 14) {
          code.appendWithLinebreak(protectedAttributes.toString());
        }
        if (privateAttributes.length > 12) {
          code.appendWithLinebreak(privateAttributes.toString());
        }
        // Methods
        const publicMethods = new StringBuilder();
        publicMethods.appendWithLinebreak("\t\tpublic: ");
        const protectedMethods = new StringBuilder();
        protectedMethods.appendWithLinebreak("\t\tprotected: ");
        const privateMethods = new StringBuilder();
        privateMethods.appendWithLinebreak("\t\tprivate: ");
        for (const m of this.methods) {
          switch (m.protection) {
            case Protection.public:
              publicMethods.appendWithLinebreak("\t\t\t" + m.codeGen(lng));
              break;
            case Protection.protected:
              protectedMethods.appendWithLinebreak("\t\t\t" + m.codeGen(lng));
              break;
            case Protection.private:
            case Protection.internal:
              privateMethods.appendWithLinebreak("\t\t\t" + m.codeGen(lng));
              break;
          }
        }
        if (publicMethods.length > 11) {
          code.appendWithLinebreak(publicMethods.toString());
        }
        if (protectedMethods.length > 14) {
          code.appendWithLinebreak(protectedMethods.toString());
        }
        if (privateMethods.length > 12) {
          code.appendWithLinebreak(privateMethods.toString());
        }
        code.appendWithLinebreak("\t}\n}");
        break;
      case "ts":
        for (const module of imp) {
          code.appendWithLinebreak(`/// <reference path="${module}.ts"/>`);
        }
        if (imp.size > 0) {
          code.append("\n");
        }
        let abstr = false;
        for (const m of this.methods) {
          if (m.classifer === Classifer.abstract) {
            abstr = true;
            break;
          }
        }
        if (!abstr && this.classifer === Classifer.static) {
          stat = true;
        } else if (this.classifer === Classifer.abstract || abstr) {
          code.append("abstract ");
        }
        if (stat) {
          code.append(`const ${this.name} = (() => {\n\t`);
        }
        code.append(`class ${this.name} `);
        inheritance = false;
        for (const rel of this.relations) {
          if (rel.relation === relationType.inheritance) {
            if (inheritance) {
              alert(
                "The selected language does not support multiple inheritance!"
              );
              break;
            } else {
              inheritance = true;
              code.append(`extends ${rel.classB} `);
            }
          }
        }
        code.appendWithLinebreak("{");
        for (const f of this.attributes) {
          if (stat) {
            code.append("\t");
          }
          code.appendWithLinebreak("\t" + f.codeGen(lng, stat));
        }
        for (const m of this.methods) {
          if (stat) {
            code.append("\t");
          }
          code.appendWithLinebreak(
            "\t" + m.codeGen(lng, stat, this.name, inheritance)
          );
        }
        if (stat) {
          code.append("\t");
        }
        code.appendWithLinebreak("}");
        if (stat) {
          code.appendWithLinebreak(`\treturn new ${this.name}();\n})();`);
        }
        break;
      case "qs":
        code.append(`namespace Quantum.${structureHolder.name} {\n\n`);
        libImp.add("Microsoft.Quantum.Canon");
        libImp.add("Microsoft.Quantum.Intrinsic");
        for (const using of libImp) {
          code.appendWithLinebreak(`\topen ${using};`);
        }
        for (const using of imp) {
          code.appendWithLinebreak(`\topen Quantum.${using};`);
        }
        code.append("\n");
        for (const m of this.methods) {
          code.appendWithLinebreak("\t" + m.codeGen(lng, undefined, this.name));
        }
        code.appendWithLinebreak("}");
        break;
      case "py":
        for (const using of libImp) {
          code.appendWithLinebreak(`import ${using}`);
        }
        for (const using of imp) {
          code.appendWithLinebreak(`from ${using} import ${using}`);
        }
        if (libImp.size > 0 || imp.size > 0) {
          code.append("\n");
        }
        code.append(`class ${this.name}`);
        if (inheritanceList.length > 0) {
          code.append(`(${inheritanceList.join(", ")})`);
        }
        code.append(":\n");
        for (const m of this.methods) {
          code.appendWithLinebreak("\t" + m.codeGen(lng, undefined, this.name));
        }
        for (const f of this.attributes) {
          code.appendWithLinebreak("\t" + f.codeGen(lng));
        }
        break;
    }
    return new Page(this.name, lng, code.toString());
  }
}
