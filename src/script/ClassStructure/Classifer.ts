enum Classifer {
  abstract = "*",
  static = "$",
  default = "",
  enum = "enumeration",
}

function classiferFromString(str: string): Classifer {
  str = str.trim().toLowerCase();
  switch (str) {
    case "abstract":
    case Classifer.abstract:
      return Classifer.abstract;
    case "static":
    case Classifer.static:
      return Classifer.static;
    default:
      return Classifer.default;
  }
}
