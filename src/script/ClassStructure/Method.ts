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
}
