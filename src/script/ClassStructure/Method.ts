/// <reference path="Classifer.ts"/>

class Method {
  protection: Protection;
  type: string;
  name: string;
  classifer: Classifer;
  parameters: Array<Field>;

  constructor(
    pr: Protection,
    type: string,
    name: string,
    classifer: Classifer = Classifer.default,
    parameters: Array<Field> = new Array<Field>()
  ) {
    this.protection = pr;
    this.type = type;
    this.name = name;
    this.classifer = classifer;
    this.parameters = parameters;
  }

  setParam(name: string, type: string) {
    for (const p of this.parameters) {
      if (p.name === name) {
        p.type = type;
        return;
      }
    }
    this.parameters.push(new Field(Protection.internal, type, name));
  }

  toString(): string {
    const strb = new StringBuilder();
    strb.append(this.protection);
    strb.append(this.name);
    strb.append("(");
    const params = new Array<string>();
    for (const p of this.parameters) {
      params.push(`${p.name}: ${p.type}`);
    }
    strb.append(params.join(", "));
    strb.append(")");
    strb.append(this.classifer);
    strb.append(" ");
    strb.append(this.type);
    return strb.toString();
  }

  codeGen(lng: string, p1: boolean | undefined = undefined): string {
    const code = new StringBuilder();
    const params = new Array<string>();
    let abstr = false;
    switch (lng) {
      case "cs":
        code.append(protectionToCode(this.protection));
        code.append(" ");
        if (this.classifer === Classifer.abstract) {
          code.append("abstract ");
          abstr = true;
        } else if (this.classifer === Classifer.static || p1) {
          code.append("static ");
        }
        code.append(typeMap(this.type, lng));
        code.append(" ");
        code.append(this.name);
        for (const p of this.parameters) {
          params.push(`${typeMap(p.type, lng)} ${p.name}`);
        }
        code.append(`(${params.join(", ")})`);

        if (abstr) {
          code.append(";");
        } else {
          code.append(
            "\n\t\t{\n\t\t\tthrow new NotImplementedException();\n\t\t}"
          );
        }
        break;
      case "ts":
        code.append(protectionToCode(this.protection));
        code.append(" ");
        if (this.classifer === Classifer.abstract) {
          code.append("abstract ");
          abstr = true;
        } else if (this.classifer === Classifer.static || p1) {
          code.append("static ");
        }
        code.append(this.name);
        for (const p of this.parameters) {
          params.push(`${p.name}: ${typeMap(p.type, lng)}`);
        }
        code.append(`(${params.join(", ")})`);
        code.append(": ");
        code.append(typeMap(this.type, lng));
        if (abstr) {
          code.append(";");
        } else {
          code.append(' {\n\t\tthrow new Error("NotImplemented");\n\t}');
        }
        break;
    }
    return code.toString();
  }
}
