class ContextMenu {
  static show(x: number, y: number, target: HTMLElement) {
    const cm = document.getElementById("contextMenu");
    if (cm) {
      Ui.copyHover();
      if (target) {
        const fcn = Ui.getFocusedClassName();
        const selectedClass = fcn ? structureHolder.findClass(fcn) : undefined;
        const isClass: boolean = selectedClass
          ? selectedClass.classifer == Classifer.default ||
            selectedClass.classifer == Classifer.abstract ||
            selectedClass.classifer == Classifer.static
          : false;
        const isInterface = selectedClass
          ? selectedClass.classifer == Classifer.interface
          : false;
        const isEnum = selectedClass
          ? selectedClass.classifer == Classifer.enum
          : false;
        let ids = new Set<string>();
        ids.add(target.id);
        if (target.parentElement) {
          ids.add(target.parentElement.id);
          if (target.parentElement.parentElement) {
            ids.add(target.parentElement.parentElement.id);
          }
        }
        cm.classList.remove("relation");
        cm.classList.remove("attribute");
        cm.classList.remove("method");
        if (Ui.hasClassInFocus()) {
          cm.classList.add("class");
          if (ids.has("sidebar_attributes") && (isClass || isEnum)) {
            cm.classList.add("attribute");
            cm.classList.remove("relation");
            cm.classList.remove("method");
          } else if (ids.has("sidebar_methods") && (isClass || isInterface)) {
            cm.classList.add("method");
            cm.classList.remove("relation");
            cm.classList.remove("attribute");
          } else if (
            ids.has("sidebar_relations") &&
            isClass &&
            structureHolder.namespace.length > 1
          ) {
            cm.classList.add("relation");
            cm.classList.remove("attribute");
            cm.classList.remove("method");
          } else {
            const focusedClassName = Ui.getFocusedClassName();
            if (
              focusedClassName &&
              (() => {
                for (const id of ids) {
                  if (id.startsWith("classid-" + focusedClassName)) {
                    return true;
                  }
                }
                return false;
              })()
            ) {
              if (isClass || isInterface) {
                if (structureHolder.namespace.length > 1) {
                  cm.classList.add("relation");
                } else {
                  cm.classList.remove("class");
                }
                cm.classList.add("method");
              }
              if (isClass || isEnum) {
                cm.classList.add("attribute");
              }
            }
          }
        } else {
          cm.classList.remove("class");
        }
      }
      if (Ui.hasClassInFocus()) {
        if (Ui.hasHover()) {
          cm.classList.add("deletemember");
          cm.classList.remove("deleteclass");
        } else {
          cm.classList.add("deleteclass");
          cm.classList.remove("deletemember");
        }
      } else {
        cm.classList.remove("deleteclass");
        cm.classList.remove("deletemember");
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
