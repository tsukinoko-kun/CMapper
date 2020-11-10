enum Type {
  void,
  string,
  integer,
  float,
  boolean,
  datetime,
  List,
  Map,
}

const CsTypes = new Map<string, string>([
  ["void", "void"],
  ["string", "string"],
  ["integer", "int"],
  ["float", "float"],
  ["boolean", "bool"],
  ["datetime", "DateTime"],
  ["List", "List"],
  ["Map", "Dictionary"],
]);

const CppTypes = new Map<string, string>([
  ["void", "void"],
  ["string", "std::string"],
  ["integer", "int"],
  ["float", "float"],
  ["boolean", "bool"],
  ["datetime", "std::chrono::time_point"],
  ["List", "std::vector"],
  ["Map", "std::map"],
]);

const TsTypes = new Map<string, string>([
  ["void", "void"],
  ["string", "string"],
  ["integer", "number"],
  ["float", "number"],
  ["boolean", "boolean"],
  ["datetime", "Date"],
  ["List", "Array"],
  ["Map", "Map"],
]);

const PyTypes = new Map<string, string>([
  ["void", "void"],
  ["string", "str"],
  ["integer", "int"],
  ["float", "float"],
  ["boolean", "bool"],
  ["datetime", "datetime"],
  ["Map", "{}"],
  ["List", "[]"],
]);

const typeMap = (t: string, lng: string): string => {
  switch (lng) {
    case "cs":
      if (CsTypes.has(t)) {
        return <string>CsTypes.get(t);
      }
      break;
    case "h":
      if (CppTypes.has(t)) {
        return <string>CppTypes.get(t);
      }
      break;
    case "ts":
      if (TsTypes.has(t)) {
        return <string>TsTypes.get(t);
      }
      break;
    case "py":
      if (PyTypes.has(t)) {
        return <string>PyTypes.get(t);
      }
      break;
  }
  return t;
};

const typeString = (t: Type) => {
  return Type[t];
};
