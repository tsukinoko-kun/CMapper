(() => {
  const sidebarResize = document.getElementById("sidebarResize");
  if (sidebarResize) {
    let sidebarMoveMode = false;
    sidebarResize.addEventListener("mousedown", () => {
      sidebarMoveMode = true;
    });
    document.addEventListener("mouseup", () => {
      sidebarMoveMode = false;
    });
    document.addEventListener("mousemove", (ev) => {
      if (sidebarMoveMode) {
        const nw = Math.min(
          window.innerWidth * 0.75,
          Math.max(150, Math.round(ev.clientX))
        );
        document.body.style.setProperty("--sidebar-width", `${nw}px`);
      }
    });
  }
})();
