function remSpCh(str: string) {
  return str.replace(/[^a-zA-Z0-9öäüÖÄÜß ]/g, "");
}
function remSpChCard(str: string) {
  return str.replace(/[^a-zA-Z0-9\söäüÖÄÜß\*\. ]/g, "");
}
