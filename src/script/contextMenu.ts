class ContextMenu {
  static show(x: number, y: number, target: HTMLElement) {
    const cm = document.getElementById("contextMenu");
    if (cm) {
      Ui.copyHover();
      if (target) {
        let ids = new Array<string>();
        ids.push(target.id);
        if (target.parentElement) {
          ids.push(target.parentElement.id);
          if (target.parentElement.parentElement) {
            ids.push(target.parentElement.parentElement.id);
          }
        }
        if (ids.includes("sidebar_fields")) {
          cm.classList.add("field");
          cm.classList.remove("relation");
          cm.classList.remove("method");
        } else if (ids.includes("sidebar_methods")) {
          cm.classList.add("method");
          cm.classList.remove("relation");
          cm.classList.remove("field");
        } else if (
          ids.includes("sidebar_relations") &&
          structureHolder.namespace.length > 1
        ) {
          cm.classList.add("relation");
          cm.classList.remove("field");
          cm.classList.remove("method");
        } else {
          cm.classList.remove("relation");
          cm.classList.remove("field");
          cm.classList.remove("method");
        }
      }
      cm.style.top = `${y}px`;
      cm.style.left = `${x}px`;
      cm.style.display = "block";
    }
  }
  static hide() {
    const cm = document.getElementById("contextMenu");
    if (cm) {
      cm.style.display = "none";
    }
  }
}

(async () => {
  const cm = document.getElementById("contextMenu");
  var touch = -1;
  if (cm) {
    window.addEventListener("contextmenu", (ev) => {
      Ui.touch = false;
      ContextMenu.show(ev.pageX, ev.pageY, <HTMLElement>ev.target);
      ev.preventDefault();
    });
    window.addEventListener("touchstart", () => {
      if (Ui.touch) {
        touch = new Date().valueOf();
      }
    });
    window.addEventListener("touchend", (ev) => {
      if (Ui.touch) {
        const time = new Date().valueOf() - touch;
        if (time > 750) {
          // long touch
          if (ev.touches.length > 0) {
            ContextMenu.show(
              ev.touches[0].pageX,
              ev.touches[0].pageY,
              <HTMLElement>ev.target
            );
          } else {
            const t = <HTMLElement>ev.target;
            const rect = t.getBoundingClientRect();
            ContextMenu.show(
              rect.x + rect.width / 2,
              rect.y + rect.height / 2,
              t
            );
          }
          ev.preventDefault();
        } else if (time > 0) {
          // touch click
        }
        touch = -1;
      }
    });
    window.addEventListener("click", () => {
      ContextMenu.hide();
    });
  }
})();
