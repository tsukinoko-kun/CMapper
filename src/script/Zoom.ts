const Zoom = (() => {
  class Zoom {
    constructor() {
      window.addEventListener("keypress", (ev) => {
        if (
          ev.target === document.body ||
          ev.target === document ||
          ev.target === window
        ) {
          if (ev.key.toUpperCase() === "F") {
            this.toggle();
          } else if (ev.key === "+") {
            this.zoom(1);
            ev.preventDefault();
          } else if (ev.key === "-") {
            this.zoom(-1);
            ev.preventDefault();
          }
        }
      });
    }
    private toggle() {
      (<HTMLDivElement>document.getElementById("graph"))?.classList.toggle(
        "fullscreen"
      );
    }
    private zoom(factor: number) {
      const graph = <HTMLDivElement>document.getElementById("graph");
      if (graph) {
        let z = Number(graph.style.getPropertyValue("--zoom"));
        if (z === 0 || z === NaN) {
          z = 1;
        }
        z = Math.max(Math.min(z + factor / 4, 2.25), 0.25);
        graph.style.setProperty("--zoom", z.toString());
      }
    }
  }

  return new Zoom();
})();
