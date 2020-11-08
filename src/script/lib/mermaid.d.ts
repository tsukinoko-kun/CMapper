declare class mermaid {
  static initialize(config: {
    theme: string;
    fontSize: number;
    logLevel: string;
    securityLevel: string;
    startOnLoad: boolean;
    arrowMarkerAbsolute: boolean;
  });
  static render(
    ElementId: string,
    markdown: string,
    callback: (svg: string) => void
  );
}
