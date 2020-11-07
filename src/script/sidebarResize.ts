(() => {
  const sidebarResize = document.getElementById("sidebarResize");
  if (sidebarResize) {
    let sidebarMoveMode = false;
    sidebarResize.addEventListener("mousedown", () => {
      sidebarMoveMode = true;
    });
    document.addEventListener("mouseup", (ev) => {
      if (sidebarMoveMode) {
        sidebarMoveMode = false;
        ev.preventDefault();
      }
    });
    document.addEventListener("mousemove", (ev) => {
      if (sidebarMoveMode) {
        let ow = Number(
          document.documentElement.style
            .getPropertyValue("--sidebar-width")
            .replace(/[^0-9]/g, "")
        );
        const nw = Math.min(
          window.innerWidth * 0.45,
          Math.max(150, Math.round(ev.clientX))
        );
        document.documentElement.style.setProperty(
          "--sidebar-width",
          `${nw}px`
        );
        if (ow !== NaN && ow > 0) {
          const graph = <HTMLDivElement>document.getElementById("graph");
          if (graph) {
            graph.scrollLeft = graph.scrollLeft - (ow - nw);
          }
        }
      }
    });
  }
})();
