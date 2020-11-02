function remSpCh(str: string) {
  return str.replace(/[^a-zA-Z0-9öäüÖÄÜß ]/g, "");
}
function remSpChCard(str: string) {
  return str.replace(/[^a-zA-Z0-9\söäüÖÄÜß\*\. ]/g, "");
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
