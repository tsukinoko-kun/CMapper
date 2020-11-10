enum Type {
  void,
  boolean,
  integer,
  float,
  string,
  vector,
  datetime,
  List,
  Set,
  Map,
}

const CsTypes = new Map<string, string>([
  ["void", "void"],
  ["string", "string"],
  ["integer", "int"],
  ["float", "float"],
  ["boolean", "bool"],
  ["datetime", "DateTime"],
  ["vector", "Vector3"],
  ["List", "List"],
  ["Set", "HashSet"],
  ["Map", "Dictionary"],
]);

const CppTypes = new Map<string, string>([
  ["void", "void"],
  ["string", "std::string"],
  ["integer", "int"],
  ["float", "float"],
  ["boolean", "bool"],
  ["datetime", "std::chrono::time_point"],
  ["vector", "float"],
  ["List", "std::vector"],
  ["Set", "std::set"],
  ["Map", "std::map"],
]);

const TsTypes = new Map<string, string>([
  ["void", "void"],
  ["string", "string"],
  ["integer", "number"],
  ["float", "number"],
  ["boolean", "boolean"],
  ["datetime", "Date"],
  ["vector", "Array<number>"],
  ["List", "Array"],
  ["Set", "Set"],
  ["Map", "Map"],
]);

const importCs = new Map<string, string>([
  ["boolean", "System"],
  ["float", "System"],
  ["integer", "System"],
  ["string", "System"],
  ["vector", "System.Numerics"],
  ["List", "System.Collection.Generic"],
  ["Set", "System.Collection.Generic"],
  ["Map", "System.Collection.Generic"],
  ["datetime", "System"],
]);

const importCpp = new Map<string, string>([
  ["List", "vector"],
  ["Set", "set"],
  ["Map", "map"],
  ["datetime", "System"],
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
  }
  return t;
};

const typeString = (t: Type) => {
  return Type[t];
};

const getTypeImport = (t: string, lng: string): string => {
  switch (lng) {
    case "cs":
    case "qs":
      if (importCs.has(t)) {
        return <string>importCs.get(t);
      }
      break;
    case "h":
      if (importCpp.has(t)) {
        return <string>importCpp.get(t);
      }
      break;
  }
  return "";
};
