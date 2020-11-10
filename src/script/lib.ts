function remSpCh(str: string) {
  return str.replace(/[^a-zA-Z0-9\ö\ä\ü\Ö\Ä\Ü\ß\_]/g, "");
}
function remSpChCard(str: string) {
  return str.replace(/[^a-zA-Z0-9\s\ö\ä\ü\Ö\Ä\Ü\ß\_\*\.]/g, "");
}
function vowel(str: string): string {
  return str
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/Ä/g, "Ae")
    .replace(/Ö/g, "Oe")
    .replace(/Ü/g, "Ue")
    .replace(/ß/g, "ss");
}
const genericPlaceholder = "xxxxxxxxxx";
function displayType(type: Array<string>, lng?: string): string {
  const strb = new StringBuilder();
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
  return strb.toString();
}
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
