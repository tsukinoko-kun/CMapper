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
}
