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

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
