enum Type {
  void,
  string,
  integer,
  float,
  boolean,
}

const CsTypes = new Map<string, string>([
  ["void", "void"],
  ["string", "string"],
  ["integer", "int"],
  ["float", "float"],
  ["boolean", "bool"],
]);

const TsTypes = new Map<string, string>([
  ["void", "void"],
  ["string", "string"],
  ["integer", "number"],
  ["float", "number"],
  ["boolean", "boolean"],
]);

const typeMap = (t: string, lng: string): string => {
  switch (lng) {
    case "cs":
      if (CsTypes.has(t)) {
        return <string>CsTypes.get(t);
      }
      break;
    case "ts":
      if (TsTypes.has(t)) {
        return <string>TsTypes.get(t);
      }
      break;
  }
  return t;
};

const typeString = (t: Type) => {
  return Type[t];
};
