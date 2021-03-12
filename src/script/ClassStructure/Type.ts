enum Type {
  void,
  boolean,
  integer,
  float,
  string,
  vector,
  datetime,
  object,
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
  ["object", "object"],
  ["vector", "Vector3"],
  ["List", "List"],
  ["Set", "HashSet"],
  ["Map", "Dictionary"],
]);

const CmTypes = new Map<string, string>([
  ["void", "Void"],
  ["string", "String"],
  ["integer", "Integer"],
  ["float", "FloatingPointNumber"],
  ["boolean", "Boolean"],
  ["datetime", "DateTime"],
  ["object", "object"],
  ["vector", "Vector3D"],
  ["List", "List"],
  ["Set", "Set"],
  ["Map", "Map"],
]);

const TsTypes = new Map<string, string>([
  ["void", "void"],
  ["string", "string"],
  ["integer", "number"],
  ["float", "number"],
  ["boolean", "boolean"],
  ["datetime", "Date"],
  ["object", "object"],
  ["vector", "Array<number>"],
  ["List", "Array"],
  ["Set", "Set"],
  ["Map", "Map"],
]);

const KtTypes = new Map<string, string>([
  ["void", "Unit"],
  ["string", "String"],
  ["integer", "Int"],
  ["float", "Double"],
  ["boolean", "Boolean"],
  ["datetime", "LocalDateTime"],
  ["object", "Object"],
  ["vector", "Vector"],
  ["List", "MutableList"],
  ["Set", "MutableSet"],
  ["Map", "HashMap"],
]);

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

const importKt = new Map<string, string>([
  ["datetime", "java.time.LocalDateTime"],
  ["list", "kotlin.collections"],
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
    case "ts":
      if (TsTypes.has(t)) {
        return <string>TsTypes.get(t);
      }
      break;
    case "kt":
      if (KtTypes.has(t)) {
        return <string>KtTypes.get(t);
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
    case "kt":
      if (importKt.has(t)) {
        return <string>importKt.get(t);
      }
      break;
  }
  return "";
};

const genericPlaceholder = "xxxxxxxxxx";
function displayType(type: Array<string>, lng?: string): string {
  const strb = new StringBuilder();
  if (lng) {
    strb.append(typeMap(type[0], lng));
  } else {
    const typeZero = structureHolder.findClass(type[0]);
    if (typeZero && typeZero.classifer == Classifer.enum) {
      strb.append(typeZero.displayEnum());
    } else {
      strb.append(typeMap(type[0], "cm"));
    }
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

  return strb.toString();
}
