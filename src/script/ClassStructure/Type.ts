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

const QsTypes = new Map<string, string>([
  ["void", "Unit"],
  ["string", "String"],
  ["integer", "Int"],
  ["float", "Float"],
  ["boolean", "Bool"],
  ["datetime", "DateTime"],
  ["vector", "Vector3"],
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

const importQs = new Map<string, string>([
  ["vector", "System.Numerics"],
  ["List", "System.Collection.Generic"],
  ["Set", "System.Collection.Generic"],
  ["Map", "System.Collection.Generic"],
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
    case "qs":
      if (QsTypes.has(t)) {
        return <string>QsTypes.get(t);
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
      if (importCs.has(t)) {
        return <string>importCs.get(t);
      }
      break;
    case "h":
      if (importCpp.has(t)) {
        return <string>importCpp.get(t);
      }
      break;
    case "qs":
      if (importQs.has(t)) {
        return <string>importQs.get(t);
      }
      break;
  }
  return "";
};

function defaultQs(type: Array<string>): string {
  switch (type[0]) {
    case "void":
      return "()";
    case "string":
      return '""';
    case "integer":
    case "float":
      return "0";
    case "boolean":
      return "false";
    case "List":
    case "Map":
    case "Set":
      return displayType(type, "qs");
  }
  return "";
}

const genericPlaceholder = "xxxxxxxxxx";
function displayType(type: Array<string>, lng?: string): string {
  const strb = new StringBuilder();
  if (lng === "qs") {
    switch (type[0]) {
      case "List":
      case "Set":
        return defaultQs([type[1], "", ""]) + "[]";
      case "Map":
        return (
          "(" +
          defaultQs([type[1], "", ""]) +
          " , " +
          defaultQs([type[2], "", ""]) +
          ")"
        );
      default:
        return typeMap(type[0], lng);
    }
  } else {
    if (lng) {
      strb.append(typeMap(type[0], lng));
    } else {
      strb.append(type[0]);
    }
    if (
      type.length > 1 &&
      (type[0] === "List" || type[0] === "Set" || type[0] === "Map")
    ) {
      if (lng) {
        strb.append("<");
        strb.append(typeMap(type[1], lng));
      } else {
        strb.append("~");
        strb.append(type[1]);
      }
      if (type.length > 2 && type[0] === "Map") {
        if (lng) {
          strb.append(", ");
          strb.append(typeMap(type[2], lng));
        } else {
          strb.append(genericPlaceholder);
          strb.append(type[2]);
        }
      }
      if (lng) {
        strb.append(">");
      } else {
        strb.append("~");
      }
    }
  }
  return strb.toString();
}
