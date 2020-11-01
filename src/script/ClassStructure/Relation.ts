enum relationType {
  "none" = "",
  "inheritance" = "--|>",
  "composition" = "--*",
  "aggregation" = "--o",
  "association" = "-->",
  "solidLink" = "--",
  "dependency" = "..>",
  "realization" = "..|>",
  "dashedLink" = "..",
}

class Relation {
  classA: string;
  classB: string;
  relation: relationType;
  cardinalityA: string;
  cardinalityB: string;
  comment: string;

  constructor(
    a: Class | string,
    b: Class | string,
    rel: relationType,
    cardA: string = "",
    cardB: string = "",
    comment: string = ""
  ) {
    if (typeof a === "string") {
      this.classA = a;
    } else {
      this.classA = a.name;
    }
    if (typeof b === "string") {
      this.classB = b;
    } else {
      this.classB = b.name;
    }
    this.relation = rel;
    this.cardinalityA = cardA;
    this.cardinalityB = cardB;
    this.comment = comment;
  }

  toString(): string {
    const strb = new StringBuilder();
    strb.append(this.classA);
    strb.append(" ");
    if (this.cardinalityA.length > 0) {
      strb.append(JSON.stringify(this.cardinalityA));
      strb.append(" ");
    }
    strb.append(this.relation);
    strb.append(" ");
    if (this.cardinalityB.length > 0) {
      strb.append(JSON.stringify(this.cardinalityB));
      strb.append(" ");
    }
    strb.append(this.classB);
    if (this.comment.length > 0) {
      strb.append(" : ");
      strb.append(this.comment);
    }
    return strb.toString();
  }

  static fromString(str: string): string {
    switch (str) {
      case relationType.aggregation:
        return "aggregation";
      case relationType.association:
        return "association";
      case relationType.composition:
        return "composition";
      case relationType.dashedLink:
        return "dashedLink";
      case relationType.dependency:
        return "dependency";
      case relationType.inheritance:
        return "inheritance";
      case relationType.realization:
        return "realization";
      case relationType.solidLink:
        return "solidLink";
      default:
        return relationType.none;
    }
  }

  static readonly typeFromString = <(str: string) => relationType>(
    new Function("str", "return relationType[str]")
  );
}
