/// <reference path="Classifer.ts"/>

class Attribute {
  protection: Protection;
  type: Array<string>;
  name: string;
  classifer: Classifer;
  constructor(
    pr: Protection,
    type: Array<string>,
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
    strb.append(this.name);
    strb.append(": ");
    strb.append(displayType(this.type));
    strb.append(" ");
    strb.append(this.classifer);
    return vowel(strb.toString());
  }

  codeGen(lng: string, p1: boolean | undefined = undefined): string {
    const code = new StringBuilder();
    switch (lng) {
      case "cs":
        code.append(protectionToCode(this.protection));
        code.append(" ");
        if (this.classifer === Classifer.static) {
          code.append("static ");
        }
        code.append(displayType(this.type, lng));
        code.append(" ");
        code.append(this.name);
        // if (this.protection === Protection.public) {
        code.append(" { get; set; }");
        // } else {
        //   code.append(";");
        // }
        break;
      case "ts":
        code.append(protectionToCode(this.protection));
        code.append(" ");
        if (this.classifer === Classifer.static || p1) {
          code.append("static ");
        }
        code.append(this.name);
        code.append(": ");
        code.append(displayType(this.type, lng));
        code.append(";");
        break;
      case "kt":
        code.append(protectionToCode(this.protection));
        code.append(" ");
        if (this.classifer === Classifer.static) {
          code.append("static ");
        }
        code.append("lateinit var ");
        code.append(this.name);
        code.append(": ");
        code.append(displayType(this.type, lng));
        break;
    }
    return code.toString();
  }
}
