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
  Enum,
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
  ["Enum", "enum0"],
]);

const CmTypes = new Map<string, string>([
  ["void", "Void"],
  ["string", "String"],
  ["integer", "Integer"],
  ["float", "FloatingPointNumber"],
  ["boolean", "Boolean"],
  ["datetime", "DateTime"],
  ["vector", "Vector3D"],
  ["List", "List"],
  ["Set", "Set"],
  ["Map", "Map"],
  ["Enum", "enum"],
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
  ["Enum", "enum0"],
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
  ["Enum", "enum0"],
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
  ["Enum", "enum0"],
]);

// const PyTypes = new Map<string, string>([
//   ["void", "Unit"],
//   ["string", "String"],
//   ["integer", "Int"],
//   ["float", "Float"],
//   ["boolean", "Bool"],
//   ["datetime", "DateTime"],
//   ["vector", "Vector3"],
//   ["List", "Array"],
//   ["Set", "Set"],
//   ["Map", "Map"],
//   ["Enum", "enum0"],
// ]);

const importCs = new Map<string, string>([
  ["boolean", "System"],
  ["float", "System"],
  ["integer", "System"],
  ["string", "System"],
  ["vector", "System.Numerics"],
  ["List", "System.Collections.Generic"],
  ["Set", "System.Collections.Generic"],
  ["Map", "System.Collections.Generic"],
  ["datetime", "System"],
]);

const importPy = new Map<string, string>([
  ["vector", "numpy"],
  ["datetime", "datetime"],
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
    case "cm":
      if (CmTypes.has(t)) {
        return <string>CmTypes.get(t);
      }
      break;
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
    case "py":
      return defaultPy([t]);
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
    case "py":
      if (importPy.has(t)) {
        return <string>importPy.get(t);
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

function defaultPy(type: Array<string>): string {
  switch (type[0]) {
    case "void":
      return "";
    case "string":
      return '""';
    case "integer":
    case "float":
      return "0";
    case "boolean":
      return "False";
    case "List":
    case "Map":
    case "Set":
      return displayType(type, "py");
  }
  return "";
}

const genericPlaceholder = "xxxxxxxxxx";
function displayType(type: Array<string>, lng?: string): string {
  const strb = new StringBuilder();
  switch (lng) {
    case "qs":
      if (type.length > 1) {
        if (type[0] === "List" || type[0] === "Set") {
          strb.append(typeMap(type[1], lng));
          strb.append("[]");
        } else if (type[0] === "Map") {
          strb.append("Dictionary<");
          strb.append(typeMap(type[1], lng));
          strb.append(",");
          strb.append(typeMap(type[2], lng));
          strb.append(">");
        } else {
          strb.append(typeMap(type[0], lng));
        }
      }
      break;
    default:
      if (lng) {
        strb.append(typeMap(type[0], lng));
      } else {
        strb.append(typeMap(type[0], "cm"));
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
      break;
  }

  return strb.toString();
}
