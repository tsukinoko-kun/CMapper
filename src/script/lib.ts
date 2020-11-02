function remSpCh(str: string) {
  return str.replace(/[^a-zA-Z0-9 ]/g, "");
}
function remSpChCard(str: string) {
  return str.replace(/[^a-zA-Z0-9\*\. ]/g, "");
}
