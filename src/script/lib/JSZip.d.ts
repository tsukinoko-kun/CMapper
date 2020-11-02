declare class JSZip {
  file(filename: string, data: string): void;
  generateAsync(param: object): Promise<string | Blob>;
}
