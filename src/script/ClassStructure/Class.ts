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
      let isEnum = false;
      strb.appendLine(`class ${this.name}{`);
      if (this.classifer === Classifer.abstract) {
        strb.appendLine("<<abstract>>");
      } else if (this.classifer === Classifer.static) {
        strb.appendLine("<<static>>");
      } else if (this.classifer === Classifer.enum) {
        strb.appendLine("<<enumeration>>");
        isEnum = true;
      }
      if (isEnum) {
        this.forEachAttribute((f: Attribute) => {
          strb.append("\t");
          strb.appendLine(f.name);
        });
      } else {
        this.forEachAttribute((f: Attribute) => {
          strb.append("\t");
          strb.appendLine(f.toString());
        });
        this.forEachMethod((m: Method) => {
          strb.append("\t");
          strb.appendLine(m.toString());
        });
      }
      strb.appendLine("}");
    } else {
      strb.appendLine(`class ${this.name}`);
    }
    this.forEachRelation((rel: Relation) => {
      strb.appendLine(rel.toString());
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
    if (this.classifer === Classifer.enum) {
      const enumerations = new Array<string>();
      this.forEachAttribute((f) => {
        enumerations.push(f.name);
      });
      switch (lng) {
        case "cs":
          code.appendLine(`namespace ${structureHolder.name}\n{`);
          code.appendLine(`\tpublic enum ${this.name}`);
          code.appendLine("\t{");
          code.appendLine(`\t\t${enumerations.join(",\n\t\t")}`);
          code.appendLine("\t}\n}");
          break;
        case "ts":
          code.appendLine(`enum ${this.name} {`);
          code.appendLine(`\t${enumerations.join(",\n\t")}`);
          code.appendLine("}");
          break;
        case "kt":
          code.appendLine(`enum class ${this.name} {`);
          code.appendLine(`\t${enumerations.join(",\n\t")}`);
          code.appendLine("}");
          break;
      }
    } else {
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

      let abstr = false;

      switch (lng) {
        case "cs":
          for (const using of libImp) {
            code.appendLine(`using ${using};`);
          }
          if (libImp.size > 0) {
            code.append("\n");
          }
          code.appendLine(`namespace ${structureHolder.name}\n{`);
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
          code.appendLine("\n\t{");
          for (const f of this.attributes) {
            code.appendLine("\t\t" + f.codeGen(lng));
          }
          for (const m of this.methods) {
            code.appendLine("\t\t" + m.codeGen(lng, stat, this.name));
          }
          code.appendLine("\t}\n}");
          break;
        case "ts":
          for (const mod of imp) {
            code.appendLine(`/// <reference path="${mod}.ts"/>`);
          }
          if (imp.size > 0) {
            code.append("\n");
          }
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
          code.appendLine("{");
          for (const f of this.attributes) {
            if (stat) {
              code.append("\t");
            }
            code.appendLine("\t" + f.codeGen(lng, stat));
          }
          for (const m of this.methods) {
            if (stat) {
              code.append("\t");
            }
            code.appendLine(
              "\t" + m.codeGen(lng, stat, this.name, inheritance)
            );
          }
          if (stat) {
            code.append("\t");
          }
          code.appendLine("}");
          if (stat) {
            code.appendLine(`\treturn new ${this.name}();\n})();`);
          }
          break;
        case "kt":
          for (const mod of libImp) {
            code.appendLine(`import ${mod}`);
          }
          for (const mod of imp) {
            code.appendLine(`import ${mod}`);
          }
          if (libImp.size + imp.size > 0) {
            code.append("\n");
          }

          for (const m of this.methods) {
            if (m.classifer === Classifer.abstract) {
              abstr = true;
              break;
            }
          }
          if (!abstr && this.classifer === Classifer.static) {
            code.append("object ");
          } else if (this.classifer === Classifer.abstract || abstr) {
            code.append("abstract class ");
          } else {
            code.append("class ");
          }
          code.append(`${this.name} `);
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
                code.append(`: ${rel.classB} `);
              }
            }
          }
          code.appendLine("{");
          this.forEachAttribute((f) => code.appendLine("\t" + f.codeGen(lng)));
          this.forEachMethod((m) => code.appendLine("\t" + m.codeGen(lng)));
          code.appendLine("}");
          break;
      }
    }
    return new Page(this.name, lng, code.toString());
  }
}
