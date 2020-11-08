declare class domtoimageoptions {
  filter?: (node: HTMLElement) => boolean;
  bgcolor?: string;
  height?: number;
  width?: number;
  style?: HTMLElement;
  quality?: number;
  cacheBust?: boolean;
  imagePlaceholder?: string;
}
declare class domtoimage {
  static toBlob(node: HTMLElement, options?: domtoimageoptions): Promise<Blob>;
  static toPixelData(
    node: HTMLElement,
    options?: domtoimageoptions
  ): Promise<Uint8Array>;
  static toJpeg(
    node: HTMLElement,
    options?: domtoimageoptions
  ): Promise<string>;
  static toPng(node: HTMLElement, options?: domtoimageoptions): Promise<string>;
  static toSvg(node: HTMLElement, options?: domtoimageoptions): Promise<string>;
}
