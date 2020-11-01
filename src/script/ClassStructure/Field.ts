/// <reference path="Classifer.ts"/>

class Field {
  protection: Protection;
  type: string;
  name: string;
  classifer: Classifer;
  constructor(
    pr: Protection,
    type: string,
    name: string,
    classifer: Classifer = Classifer.default
  ) {
    this.protection = pr;
    this.type = type;
    this.name = name;
    this.classifer = classifer;
  }

  toString(): string {
    const strb = new StringBuilder();
    strb.append(this.protection);
    strb.append(this.type);
    strb.append(" ");
    strb.append(this.name);
    strb.append(this.classifer);
    return strb.toString();
  }

  codeGen(lng: string): string {
    const code = new StringBuilder();
    code.append(protectionToCode(this.protection));
    code.append(" ");
    switch (this.classifer) {
      case Classifer.abstract:
        code.append("abstract ");
        break;
      case Classifer.static:
        code.append("static ");
        break;
    }
    code.append(typeMap(this.type, lng));
    code.append(" ");
    code.append(this.name);
    code.append(";");
    return code.toString();
  }
}
