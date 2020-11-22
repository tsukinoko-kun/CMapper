/// <reference path="structureHolder.ts"/>
/// <reference path="DB.ts"/>

const mddSvgId = "mddSvg";

const Ui = (() => {
  class _Ui {
    private readonly cb: (svg: string) => void;
    private focused: number = -1;
    private focusedClass: Class | undefined = undefined;
    private hover: string = "";
    private saverHoverCopy: string = "";
    public touch = true;

    public hasHover(): boolean {
      return this.saverHoverCopy.length > 0;
    }

    public getFocusedClassName(): string | undefined {
      if (this.focusedClass) {
        return this.focusedClass.name;
      }
      return undefined;
    }

    public setHover(id: string, t: string): void {
      this.hover = JSON.stringify({ id, t });
    }
    public removeHover(id: string, t: string): void {
      if (this.hover === JSON.stringify({ id, t })) {
        this.hover = "";
      }
    }
    public copyHover(): void {
      this.saverHoverCopy = this.hover;
    }
    editMember: Attribute | Method | Relation | undefined = undefined;

    constructor() {
      let config = {
        theme: "default",
        fontSize: 16,
        logLevel: "fatal",
        securityLevel: "strict",
        startOnLoad: true,
        arrowMarkerAbsolute: false,
      };
      mermaid.initialize(config);

      loadFromIndexedDB<string>("--zoom-ui")
        .then((zui) => {
          if (zui) {
            document.documentElement.style.setProperty("--zoom-ui", zui);
          }
        })
        .catch((e) => {
          console.debug(e);
        });

      document.addEventListener("click", (ev): void => {
        const t = <HTMLElement>ev.target;
        if (
          this.focused >= 0 &&
          (t.id === "prerendered" || t.id === "graph" || t.id === mddSvgId)
        ) {
          this.focused = -1;
          this.focusedClass = undefined;
          this.sidebarClass();
          this.render();
        }
      });

      this.cb = function (svg: string): void {
        (<HTMLDivElement>(
          document.getElementById("graph")
        )).innerHTML = svg.replace(genericPlaceholder, ", ");
      };

      this.sidebarClass();
    }

    public hasClassInFocus(): boolean {
      return this.focused >= 0;
    }

    static escapeHtml(str: string): string {
      return str
        .replace(/&/g, "&amp;")
        .replace(/\"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    toggleFolder(folderId: string): void {
      const folder = document.getElementById(folderId);
      if (folder) {
        folder.classList.toggle("folderClosed");
      }
    }

    private readonly sidebar = {
      sidebar(): HTMLElement {
        return <HTMLElement>document.getElementById("sidebar");
      },
      classname(): HTMLInputElement {
        return <HTMLInputElement>document.getElementById("sidebar_classname");
      },
      classifer(): HTMLSelectElement {
        return <HTMLSelectElement>document.getElementById("sidebar_classifer");
      },
      attributes(): HTMLUListElement {
        return <HTMLUListElement>document.getElementById("sidebar_attributes");
      },
      methods(): HTMLUListElement {
        return <HTMLUListElement>document.getElementById("sidebar_methods");
      },
      relations(): HTMLUListElement {
        return <HTMLUListElement>document.getElementById("sidebar_relations");
      },
    };
    readonly editDialog = {
      checkSelect(a: string, b: string): " selected" | "" {
        if (a === b) {
          return " selected";
        } else {
          return "";
        }
      },
      createProtectionSelector(value: Protection): string {
        const id = "edit_protection";
        const sel = new StringBuilder();
        sel.append(`<tr><td><label for="${id}">Protection: </label></td>`);
        sel.append(
          `<td><select oninput="Ui.editDialog.updateVisible()" name="${id}" id="${id}">`
        );

        sel.append('<option value="');
        sel.append(Protection.public);
        sel.append('"');
        sel.append(this.checkSelect(value, Protection.public));
        sel.append(">");
        sel.append("Public</option>");

        sel.append('<option value="');
        sel.append(Protection.protected);
        sel.append('"');
        sel.append(this.checkSelect(value, Protection.protected));
        sel.append(">");
        sel.append("Protected</option>");

        sel.append('<option value="');
        sel.append(Protection.private);
        sel.append('"');
        sel.append(this.checkSelect(value, Protection.private));
        sel.append(">");
        sel.append("Private</option>");

        sel.append('<option value="');
        sel.append(Protection.internal);
        sel.append('"');
        sel.append(this.checkSelect(value, Protection.internal));
        sel.append(">");
        sel.append("Internal</option>");

        sel.append("</select></td></tr>");
        return sel.toString();
      },
      createClassiferSelector(value: Classifer): string {
        const id = "edit_classifer";
        const sel = new StringBuilder();
        sel.append(`<tr><td><label for="${id}">Classifer: </label></td>`);
        sel.append(
          `<td><select oninput="Ui.editDialog.updateVisible()" name="${id}" id="${id}">`
        );

        sel.append('<option value="');
        sel.append(Classifer.default);
        sel.append('"');
        sel.append(this.checkSelect(value, Classifer.default));
        sel.append(">");
        sel.append("Default</option>");

        sel.append('<option value="');
        sel.append(Classifer.abstract);
        sel.append('"');
        sel.append(this.checkSelect(value, Classifer.abstract));
        sel.append(">");
        sel.append("Abstract</option>");

        sel.append('<option value="');
        sel.append(Classifer.static);
        sel.append('"');
        sel.append(this.checkSelect(value, Classifer.static));
        sel.append(">");
        sel.append("Static</option>");

        sel.append("</select></td></tr>");
        return sel.toString();
      },
      createTypeSelector(value: string[], isParam: boolean = false): string {
        const names = ["Main", "T1", "T2"];
        const sel = new StringBuilder();
        for (let i = 0; i < 3; i++) {
          const v = value[i];
          const id = `edit_type${i}`;
          if (isParam) {
            sel.append(
              `<select oninput="Ui.editDialog.updateVisible()" class="${id}">`
            );
          } else {
            sel.append(
              `<tr><td><label for="${id}">${names[i]} Type: </label></td>`
            );
            sel.append(
              `<td><select oninput="Ui.editDialog.updateVisible()" name="${id}" id="${id}">`
            );
          }

          const types = Object.keys(Type).filter(
            (key: any) =>
              !isNaN(Number(Type[key])) && (!isParam || key !== "void")
          );
          const classNames = new Array<string>();
          for (const cl of structureHolder.namespace) {
            classNames.push(cl.name);
          }
          const appendOptions = (list: Array<string>, name: string) => {
            if (list.length === 0) {
              return "";
            }
            const html = new StringBuilder();
            html.append(`<optgroup label="${name}">`);
            for (const t of list) {
              html.append(`<option value="${t}"`);
              html.append(this.checkSelect(v, t));
              html.append(">");
              html.append(t.charAt(0).toUpperCase() + t.slice(1));
              html.append("</option>");
            }
            html.append("</optgroup>");
            return html.toString();
          };
          sel.append(appendOptions(types, "Default Types"));
          sel.append(appendOptions(classNames, "Classes"));
          sel.append("</select>");
          if (!isParam) {
            sel.append("</td></tr>");
          }
        }
        return sel.toString();
      },
      createClassSelector(value: string, excludeClass: string): string {
        const id = "edit_class";
        const sel = new StringBuilder();
        sel.append(`<tr><td><label for="${id}">Class B: </label></td>`);
        sel.append(
          `<td><select oninput="Ui.editDialog.updateVisible()" name="${id}" id="${id}">`
        );
        const classNames = new Array<string>();
        for (const cl of structureHolder.namespace) {
          if (cl.name !== excludeClass) {
            classNames.push(cl.name);
          }
        }
        for (const c of classNames) {
          sel.append(`<option value="${c}"`);
          sel.append(this.checkSelect(value, c));
          sel.append(">");
          sel.append(c);
          sel.append("</option>");
        }
        sel.append("</select>");
        sel.append("</td></tr>");
        return sel.toString();
      },
      createRelationSelector(value: string): string {
        value = Relation.fromString(value);
        const id = "edit_relation";
        const sel = new StringBuilder();
        sel.append(`<tr><td><label for="${id}">Relation: </label></td>`);
        sel.append(
          `<td><select oninput="Ui.editDialog.updateVisible()" name="${id}" id="${id}">`
        );
        for (const r of Object.keys(relationType)) {
          sel.append(`<option value="${r}"`);
          sel.append(this.checkSelect(value, r));
          sel.append(">");
          sel.append(r);
          sel.append("</option>");
        }
        sel.append("</select>");
        sel.append("</td></tr>");
        return sel.toString();
      },
      addParameter(): void {
        if (Ui.editMember instanceof Method) {
          const paramList = document.getElementById("edit_param_list");
          if (paramList) {
            // save state of existing params
            let selects: HTMLCollectionOf<HTMLSelectElement> = paramList.getElementsByTagName(
              "select"
            );
            const selectValues = new Array<string>();
            {
              for (let i = 0; i < selects.length; i++) {
                selectValues.push(selects[i].value);
              }
            }
            /////

            const li = new StringBuilder();
            const paramName = `param${Math.ceil(Math.random() * 1000)}`;
            li.append("<li>");
            li.append(
              `<input type="text" max="100" value="${paramName}" class="edit_name"/>`
            );
            li.append(this.createTypeSelector([Type[Type.string]], true));
            li.append(
              `<button onclick='Ui.editDialog.removeParameter("${paramName}")'>Remove</button>`
            );
            li.append("</li>");
            paramList.innerHTML += li.toString();

            // reapply presaved values of select elements
            selects = paramList.getElementsByTagName("select");
            for (let i = 0; i < selectValues.length; i++) {
              selects[i].value = selectValues[i];
            }
            /////

            this.updateVisible();
          }
        }
      },
      removeParameter(name: string): void {
        if (Ui.editMember instanceof Method) {
          const paramUList = document.getElementById("edit_param_list");
          if (paramUList) {
            const paramList = paramUList.getElementsByTagName("li");
            for (let i = 0; i < paramList.length; i++) {
              const nameEl = <HTMLInputElement>(
                paramList[i].querySelector("input.edit_name")
              );
              if (nameEl && nameEl.value === name) {
                paramList[i].remove();
              }
            }
          }
        }
      },
      close(): void {
        Ui.editMember = undefined;
        const editDialog = document.getElementById("editDialog");
        if (editDialog) {
          editDialog.style.display = "none";
        }
      },
      async delete(): Promise<void> {
        let id: string;
        let t: string;
        if (Ui.editMember instanceof Attribute) {
          id = Ui.editMember.name;
          t = "attribute";
        } else if (Ui.editMember instanceof Method) {
          id = Ui.editMember.name;
          t = "method";
        } else if (Ui.editMember instanceof Relation) {
          id = Ui.editMember.toString();
          t = "relation";
        } else {
          return;
        }
        Ui.setHover(id, t);
        Ui.copyHover();
        if (await Ui.delete()) {
          this.close();
        }
        Ui.removeHover(id, t);
      },
      updateVisible(): void {
        const typeEls = new Array<HTMLSelectElement>();
        const typeParentEls = new Array<HTMLElement>();
        const typeParamEls = new Array<Array<HTMLSelectElement>>();
        for (let i = 0; i < 3; i++) {
          const paramTypes = document.getElementsByClassName(`edit_type${i}`);
          for (let j = 0; j < paramTypes.length; j++) {
            const p = <HTMLSelectElement>paramTypes[j];
            if (p) {
              if (typeParamEls.length > j) {
                typeParamEls[j].push(p);
              } else {
                typeParamEls.push([p]);
              }
            }
          }
          const type = <HTMLSelectElement>(
            document.getElementById(`edit_type${i}`)
          );
          if (type) {
            const td = type.parentElement;
            if (td) {
              const tr = td.parentElement;
              if (tr) {
                typeEls.push(type);
                typeParentEls.push(<HTMLElement>tr);
              }
            }
          }
        }
        if (typeParentEls.length > 1) {
          if (typeEls[0].value === "List" || typeEls[0].value === "Set") {
            typeParentEls[1].style.display = "table-row";
            typeParentEls[2].style.display = "none";
          } else if (typeEls[0].value === "Map") {
            typeParentEls[1].style.display = "table-row";
            typeParentEls[2].style.display = "table-row";
          } else {
            typeParentEls[1].style.display = "none";
            typeParentEls[2].style.display = "none";
          }
        }
        for (const inputs of typeParamEls) {
          if (inputs[0].value === "List" || inputs[0].value === "Set") {
            inputs[1].style.display = "inline-block";
            inputs[2].style.display = "none";
          } else if (inputs[0].value === "Map") {
            inputs[1].style.display = "inline-block";
            inputs[2].style.display = "inline-block";
          } else {
            inputs[1].style.display = "none";
            inputs[2].style.display = "none";
          }
        }
      },
      apply(): void {
        if (Ui.editMember instanceof Attribute) {
          const name = <HTMLInputElement>document.getElementById("edit_name");
          if (name) {
            Ui.editMember.name = remSpCh(name.value);
          }
          const protection = <HTMLSelectElement>(
            document.getElementById("edit_protection")
          );
          if (protection) {
            Ui.editMember.protection = ProtectionFromString(protection.value);
          }
          const classifer = <HTMLSelectElement>(
            document.getElementById("edit_classifer")
          );
          if (classifer) {
            Ui.editMember.classifer = classiferFromString(classifer.value);
          }
          for (let i = 0; i < 3; i++) {
            const type = <HTMLSelectElement>(
              document.getElementById(`edit_type${i}`)
            );
            if (type) {
              if ((type.style.display = "inline-block")) {
                Ui.editMember.type[i] = type.value;
              } else {
                Ui.editMember.type[i] = "";
              }
            }
          }
        } else if (Ui.editMember instanceof Method) {
          const name = <HTMLInputElement>document.getElementById("edit_name");
          if (name) {
            Ui.editMember.name = remSpCh(name.value);
          }
          const protection = <HTMLSelectElement>(
            document.getElementById("edit_protection")
          );
          if (protection) {
            Ui.editMember.protection = ProtectionFromString(protection.value);
          }
          const classifer = <HTMLSelectElement>(
            document.getElementById("edit_classifer")
          );
          if (classifer) {
            Ui.editMember.classifer = classiferFromString(classifer.value);
          }
          for (let i = 0; i < 3; i++) {
            const type = <HTMLSelectElement>(
              document.getElementById(`edit_type${i}`)
            );
            if (type) {
              Ui.editMember.type[i] = type.value;
            }
          }
          const paramList = <HTMLUListElement>(
            document.getElementById("edit_param_list")
          );
          if (paramList) {
            // check if a parameter was removed
            const inputs = paramList.getElementsByTagName("input");
            for (let p = 0; p < Ui.editMember.parameters.length; p++) {
              let found = false;
              for (let i = 0; i < inputs.length; i++) {
                if (
                  remSpCh(Ui.editMember.parameters[p].name) ===
                  remSpCh(inputs[i].value)
                ) {
                  found = true;
                  break;
                }
              }
              if (!found) {
                delete Ui.editMember.parameters[p];
                Ui.editMember.parameters.splice(p, 1);
              }
            }
            // check if there are new parameters
            const pLiS = paramList.getElementsByTagName("li");
            for (let i = 0; i < pLiS.length; i++) {
              const pLi = pLiS[i];
              const pName = (<HTMLCollectionOf<HTMLInputElement>>(
                pLi.getElementsByClassName("edit_name")
              ))[0].value;
              const pType = new Array<string>();
              for (let j = 0; j < 3; j++) {
                const id = `edit_type${j}`;
                const pEl = <HTMLInputElement>pLi.getElementsByClassName(id)[0];
                if (pEl) {
                  pType.push(pEl.value);
                }
              }
              Ui.editMember.setParam(remSpCh(pName), pType);
            }
          }
        } else if (Ui.editMember instanceof Relation) {
          const clBInp = <HTMLSelectElement>(
            document.getElementById("edit_class")
          );
          if (clBInp) {
            Ui.editMember.classB = clBInp.value;
          }
          const rel = <HTMLSelectElement>(
            document.getElementById("edit_relation")
          );
          if (rel) {
            Ui.editMember.relation = Relation.typeFromString(rel.value);
          }
          const cardinalityA = <HTMLSelectElement>(
            document.getElementById("edit_cardinalityA")
          );
          if (cardinalityA) {
            Ui.editMember.cardinalityA = remSpChCard(cardinalityA.value);
          }
          const cardinalityB = <HTMLSelectElement>(
            document.getElementById("edit_cardinalityB")
          );
          if (cardinalityB) {
            Ui.editMember.cardinalityB = remSpChCard(cardinalityB.value);
          }
          const comment = <HTMLSelectElement>(
            document.getElementById("edit_comment")
          );
          if (comment) {
            Ui.editMember.comment = remSpChCard(comment.value);
          }
        }
        Ui.render();
        this.close();
      },
      display(type: string, name: string) {
        const html = new StringBuilder();
        //Attribute
        if (type === "attribute") {
          let v: Attribute | undefined = undefined;
          if (!Ui.focusedClass) {
            return;
          }
          for (v of Ui.focusedClass.attributes) {
            if (v.name === name) {
              break;
            }
          }
          if (!v) {
            return;
          }
          Ui.editMember = v;
          html.append('<tr><td><label for="edit_name">Name: </label></td>');
          html.append('<td><input type="text" max="100" value="');
          html.append(v.name);
          html.append('" id="edit_name"/></td></tr>');
          html.append(this.createProtectionSelector(v.protection));
          html.append(this.createTypeSelector(v.type));
          html.append(this.createClassiferSelector(v.classifer));
        }
        //Method
        else if (type === "method") {
          let v: Method | undefined = undefined;
          if (!Ui.focusedClass) {
            return;
          }
          for (v of Ui.focusedClass.methods) {
            if (v.name === name) {
              break;
            }
          }
          if (!v) {
            return;
          }
          Ui.editMember = v;
          html.append('<tr><td><label for="edit_name">Name: </label></td>');
          html.append('<td><input type="text" max="100" value="');
          html.append(v.name);
          html.append('" id="edit_name"/></td></tr>');
          html.append(this.createProtectionSelector(v.protection));
          html.append(this.createTypeSelector(v.type));
          html.append(this.createClassiferSelector(v.classifer));
          html.append("<tr><td><label>Parameters: </label></td>");
          html.append('<td><ul id="edit_param_list">');
          for (const p of v.parameters) {
            html.append("<li>");
            html.append(
              `<input type="text" max="100" value="${p.name}" class="edit_name"/>`
            );
            html.append(this.createTypeSelector(p.type, true));
            html.append(
              `<button onclick='Ui.editDialog.removeParameter("${p.name}")'>Remove</button>`
            );
            html.append("</li>");
          }
          html.append("</ul>");
          html.append(
            '<p onclick="Ui.editDialog.addParameter()" style="cursor: pointer">+ Parameter</p>'
          );
          html.append("</td></tr>");
        }
        // Relation
        else if (type === "relation") {
          let v: Relation | undefined = undefined;
          if (!Ui.focusedClass) {
            return;
          }
          for (v of Ui.focusedClass.relations) {
            if (v.toString() === name) {
              break;
            }
          }
          if (!v) {
            return;
          }
          Ui.editMember = v;
          html.append("<tr><td><label>Class A: </label></td><td>");
          html.append(v.classA);
          html.append("</td></tr>");
          {
            html.append(
              '<tr><td><label for="edit_cardinalityA">Cardinality A: </label></td><td>'
            );
            html.append(
              `<input type="text" max="100" value="${v.cardinalityA}" id="edit_cardinalityA" name="edit_cardinalityA"/>`
            );
            html.append("</td></tr>");
          }
          html.append(this.createRelationSelector(v.relation));
          {
            html.append(
              '<tr><td><label for="edit_cardinalityB">Cardinality B: </label></td><td>'
            );
            html.append(
              `<input type="text" max="100" value="${v.cardinalityB}" id="edit_cardinalityB" name="edit_cardinalityB"/>`
            );
            html.append("</td></tr>");
          }
          html.append(this.createClassSelector(v.classB, v.classA));
          {
            html.append(
              '<tr><td><label for="edit_comment">Comment: </label></td><td>'
            );
            html.append(
              `<input type="text" max="100" value="${v.comment}" id="edit_comment" name="edit_comment"/>`
            );
            html.append("</td></tr>");
          }
        } else {
          throw new Error("Unexpectet type");
        }
        const editDialogContent = document.getElementById("editDialogContent");
        if (editDialogContent) {
          editDialogContent.innerHTML = html.toString();
          const editDialog = document.getElementById("editDialog");
          if (editDialog) {
            editDialog.style.display = "block";
          }
          this.updateVisible();
        }
      },
    };

    private sidebarClass(cl: Class | undefined = undefined) {
      if (cl) {
        this.focusedClass = cl;
      } else if (!this.focusedClass) {
        this.sidebar.classname().value = "";
        this.sidebar.classifer().value = "";
        this.sidebar.attributes().innerHTML =
          '<li onclick="Ui.toggleFolder(\'sidebar_attributes\')" class="head"><img src="img/folder.svg" />&nbsp;<b>Attributes</b></li>';
        this.sidebar.methods().innerHTML =
          '<li onclick="Ui.toggleFolder(\'sidebar_methods\')" class="head"><img src="img/folder.svg" />&nbsp;<b>Methods</b></li>';
        this.sidebar.relations().innerHTML =
          '<li onclick="Ui.toggleFolder(\'sidebar_relations\')" class="head"><img src="img/folder.svg" />&nbsp;<b>Relations</b></li>';
        return;
      }
      this.sidebar.classname().value = this.focusedClass.name; // Edit Classname
      this.sidebar.classifer().value = this.focusedClass.classifer;

      // Attributes
      const attribute = new StringBuilder();
      attribute.append(
        '<li onclick="Ui.toggleFolder(\'sidebar_attributes\')" class="head"><img src="img/folder.svg" />&nbsp;<b>Attributes</b></li>'
      );
      for (const f of this.focusedClass.attributes) {
        attribute.append(
          `<li onclick="Ui.editDialog.display('attribute', '${f.name}')"`
        );
        if (f.type[0] === "List") {
          attribute.append(
            ` class="type1_${f.type[1]} type2_${f.type[1]} type0_list"`
          );
        } else if (f.type[0] === "Set") {
          attribute.append(
            ` class="type1_${f.type[1]} type2_${f.type[1]} type0_set"`
          );
        } else if (f.type[0] === "Map") {
          attribute.append(
            ` class="type1_${f.type[1]} type2_${f.type[2]} type0_map"`
          );
        } else {
          attribute.append(
            ` class="type1_${f.type[0]} type2_${f.type[0]} type0_single"`
          );
        }
        attribute.append(
          ` onmouseover="Ui.setHover('${f.name}','attribute')" onmouseout="Ui.removeHover('${f.name}','attribute')">`
        );
        attribute.append(_Ui.escapeHtml(f.name));
        attribute.append("</li>");
      }
      this.sidebar.attributes().innerHTML = attribute.toString();

      // Methods
      const method = new StringBuilder();
      method.append(
        '<li onclick="Ui.toggleFolder(\'sidebar_methods\')" class="head"><img src="img/folder.svg" />&nbsp;<b>Methods</b></li>'
      );
      for (const m of this.focusedClass.methods) {
        method.append(
          `<li onclick="Ui.editDialog.display('method', '${m.name}')" `
        );
        if (m.type[0] === "List") {
          method.append(
            ` class="type1_${m.type[1]} type2_${m.type[1]} type0_list"`
          );
        } else if (m.type[0] === "Set") {
          method.append(
            ` class="type1_${m.type[1]} type2_${m.type[1]} type0_set"`
          );
        } else if (m.type[0] === "Map") {
          method.append(
            ` class="type1_${m.type[1]} type2_${m.type[2]} type0_map"`
          );
        } else {
          method.append(
            ` class="type1_${m.type[0]} type2_${m.type[0]} type0_single"`
          );
        }
        method.append(
          `onmouseover="Ui.setHover('${m.name}','method')" onmouseout="Ui.removeHover('${m.name}','method')" >`
        );
        method.append(_Ui.escapeHtml(m.name));
        method.append("</li>");
      }
      this.sidebar.methods().innerHTML = method.toString();

      // Relations
      const relation = new StringBuilder();
      relation.append(
        '<li onclick="Ui.toggleFolder(\'sidebar_relations\')" class="head"><img src="img/folder.svg" />&nbsp;<b>Relations</b></li>'
      );
      for (const r of this.focusedClass.relations) {
        const rString = r.toString();
        relation.append(
          `<li onclick='Ui.editDialog.display("relation", \`${rString}\`)'`
        );
        relation.append(
          ` onmouseover='Ui.setHover(\`${rString}\`,"relation")' onmouseout='Ui.removeHover(\`${rString}\`,"relation")'>`
        );
        relation.append(_Ui.escapeHtml(rString));
        relation.append("</li>");
      }
      this.sidebar.relations().innerHTML = relation.toString();
    }

    public zoomUi(factor: number) {
      let zoomUi = Number(
        document.documentElement.style.getPropertyValue("--zoom-ui")
      );
      if (zoomUi === 0 || zoomUi === NaN) {
        zoomUi = 1;
      }
      zoomUi = Math.min(2.25, Math.max(0.75, zoomUi + factor / 4));
      saveToIndexedDB("--zoom-ui", zoomUi).catch((e) => {
        console.debug(e);
      });
      document.documentElement.style.setProperty(
        "--zoom-ui",
        zoomUi.toString()
      );
    }

    private async applyStyleRules() {
      let mddSvg = document.getElementById("mddSvg");
      if (mddSvg) {
        for await (const text of <any>mddSvg.getElementsByTagName("text")) {
          const tspans = text.getElementsByTagName("tspan");
          if (tspans.length === 2) {
            if (text.textContent.startsWith("«abstract»")) {
              tspans[0].style.fontStyle = "italic";
              tspans[1].style.fontStyle = "italic";
            } else if (text.textContent.startsWith("«static»")) {
              tspans[0].style.textDecoration = "underline";
              tspans[1].style.textDecoration = "underline";
            }
          }
        }
        if (this.focused >= 0) {
          for await (const g of <any>mddSvg.getElementsByTagName("g")) {
            let classname = g.id.split("-")[1];
            if (g.id.length > 0) {
              (<HTMLElement>g).setAttribute(
                "onclick",
                `if(Ui.focus("${classname}")){Ui.render();}`
              );
            }
            for await (const cl of structureHolder.namespace) {
              if (cl.name === classname && cl.id === this.focused) {
                (<HTMLElement>g).style.setProperty("--blue", "var(--accent)");
                (<HTMLElement>g).scrollIntoView({
                  behavior: "smooth",
                  inline: "center",
                  block: "center",
                });
                this.sidebarClass(cl);
                break;
              }
            }
          }
        } else {
          for await (const g of <any>mddSvg.getElementsByTagName("g")) {
            if (g.id.length > 0) {
              (<HTMLElement>g).setAttribute(
                "onclick",
                `Ui.focus("${g.id.split("-")[1]}");Ui.render();`
              );
            }
          }
        }
      }
    }

    render(): void {
      console.clear();
      Smart.update();
      const md = structureHolder.collectMmd();
      const complexityIndicator = document.getElementById("complexity");
      if (complexityIndicator) {
        complexityIndicator.innerHTML = Math.max(
          0,
          md.split("\n").length - 1
        ).toString();
      }
      if (md.length > 0) {
        let x = 0;
        let y = 0;
        const graph = document.getElementById("graph");
        if (graph) {
          x = graph.scrollLeft;
          y = graph.scrollTop;
          graph.classList.remove("waterMark");
        }
        mermaid.render(mddSvgId, structureHolder.collectMmd(), this.cb);
        if (graph) {
          graph.scrollLeft = x;
          graph.scrollTop = y;
        }
        this.applyStyleRules();
      } else {
        this.cb("");
        const graph = document.getElementById("graph");
        if (graph) {
          graph.classList.add("waterMark");
        }
      }
      Ui.fullscreenGraph(!Ui.hasClassInFocus());
    }

    unfocus(): void {
      this.focused = -1;
      this.focusedClass = undefined;
      this.sidebarClass();
    }

    focus(id: number | string): boolean {
      if (typeof id === "number" && id !== this.focused) {
        this.focused = id;
        for (const cl of structureHolder.namespace) {
          if (cl.id === id) {
            this.focusedClass = cl;
          }
        }
        return true;
      } else if (typeof id === "string") {
        if (this.focusedClass && this.focusedClass.name === id) {
          return false;
        }
        for (const cl of structureHolder.namespace) {
          if (cl.name === id) {
            this.focused = cl.id;
            this.focusedClass = cl;
            return true;
          }
        }
      }
      return false;
    }

    private doesClassnameExist(name: string): boolean {
      for (const cl of structureHolder.namespace) {
        if (cl.name === name) {
          return true;
        }
      }
      return false;
    }

    async delete(): Promise<boolean> {
      if (this.saverHoverCopy.length > 0 && this.focusedClass) {
        const hover = JSON.parse(this.saverHoverCopy);
        if (
          !(await alert(
            `Do you really want to permanently delete the "${hover.id}" ${hover.t}?`,
            true,
            "Delete"
          ))
        ) {
          return false;
        }
        switch (hover.t) {
          case "attribute":
            for (let i = 0; i < this.focusedClass.attributes.length; i++) {
              if (this.focusedClass.attributes[i].name === hover.id) {
                delete this.focusedClass.attributes[i];
                this.focusedClass.attributes.splice(i, 1);
                break;
              }
            }
            break;
          case "method":
            for (let i = 0; i < this.focusedClass.methods.length; i++) {
              if (this.focusedClass.methods[i].name === hover.id) {
                delete this.focusedClass.methods[i];
                this.focusedClass.methods.splice(i, 1);
                break;
              }
            }
            break;
          case "relation":
            for (let i = 0; i < this.focusedClass.relations.length; i++) {
              if (this.focusedClass.relations[i].toString() === hover.id) {
                delete this.focusedClass.relations[i];
                this.focusedClass.relations.splice(i, 1);
                break;
              }
            }
            break;
        }
        this.sidebarClass();
        this.render();
        return true;
      } else if (this.focusedClass) {
        if (
          !(await alert(
            `Do you really want to permanently delete the "${this.focusedClass.name}" class?`,
            true,
            "Delete"
          ))
        ) {
          return false;
        }
        for (const cl of structureHolder.namespace) {
          if (cl === this.focusedClass) {
            continue;
          }
          for (const r of cl.relations) {
            if (r.classB === this.focusedClass.name) {
              alert(
                "A class that is linked to other class by relations can not be deleted. " +
                  `\n${r.classA} → ${r.classB}`
              );
              return false;
            }
          }
          for (const f of cl.attributes) {
            if (f.type.includes(this.focusedClass.name)) {
              alert(
                "A class that is used as a type by attributes of another class can not be deleted." +
                  `\n${displayType(f.type, "cs")} ${cl.name}::${f.name}`
              );
              return false;
            }
          }
          for (const m of cl.methods) {
            if (m.type.includes(this.focusedClass.name)) {
              alert(
                "A class that is used as a return type by methods of another class may be deleted." +
                  `\n${displayType(m.type, "cs")} ${cl.name}::${m.name}()`
              );
              return false;
            }
            for (const p of m.parameters) {
              if (p.type.includes(this.focusedClass.name)) {
                alert(
                  "A class that is used as a parameter type by methods of another class can not be deleted." +
                    `\n${displayType(m.type, "cs")} ${cl.name}::${m.name}(${
                      p.type
                    } ${p.name})`
                );
                return false;
              }
            }
          }
        }
        for (let i = 0; i < structureHolder.namespace.length; i++) {
          if (structureHolder.namespace[i] === this.focusedClass) {
            delete structureHolder.namespace[i];
            structureHolder.namespace.splice(i, 1);
            break;
          }
        }
        this.focusedClass = undefined;
        this.focused = -1;
        this.sidebarClass();
        this.render();
        return true;
      }
      return false;
    }

    newClass(): void {
      let className = "Class";
      if (this.doesClassnameExist(className)) {
        for (let i = 1; i < 100; i++) {
          let newClassName = `Class${i}`;
          if (!this.doesClassnameExist(newClassName)) {
            className = newClassName;
            break;
          }
        }
      }
      structureHolder.addClass(new Class(className));
      if (this.focus(className)) {
        this.render();
      }
    }

    newAttribute(): void {
      if (this.focusedClass) {
        const newAttribute = new Attribute(
          Protection.public,
          [typeString(Type.string)],
          "NewAttribute" + Math.floor(Math.random() * 1000).toString()
        );
        this.focusedClass.attributes.push(newAttribute);
        this.sidebarClass();
        this.render();
        this.editDialog.display("attribute", newAttribute.name);
      }
    }

    newMethod(): void {
      if (this.focusedClass) {
        const newMethod = new Method(
          Protection.public,
          [typeString(Type.void)],
          "NewMethod" + Math.floor(Math.random() * 1000).toString()
        );
        this.focusedClass.methods.push(newMethod);
        this.sidebarClass();
        this.render();
        this.editDialog.display("method", newMethod.name);
      }
    }
    newRelation(): void {
      if (this.focusedClass) {
        let b: Class;
        if (structureHolder.namespace[0] === this.focusedClass) {
          b = structureHolder.namespace[1];
        } else {
          b = structureHolder.namespace[0];
        }
        const newRel = new Relation(
          this.focusedClass,
          b,
          relationType.inheritance
        );
        this.focusedClass.relations.push(newRel);
        this.sidebarClass();
        this.render();
        this.editDialog.display("relation", newRel.toString());
      }
    }
    swapRelation(): void {
      if (this.saverHoverCopy.length > 0 && this.focusedClass) {
        const hover = JSON.parse(this.saverHoverCopy);
        if (hover.t === "relation") {
          for (let i = 0; i < this.focusedClass.relations.length; i++) {
            if (this.focusedClass.relations[i].toString() === hover.id) {
              const editRel = this.focusedClass.relations[i];
              const cardinalityA = editRel.cardinalityA;
              const cardinalityB = editRel.cardinalityB;
              const classA = editRel.classA;
              const classB = editRel.classB;
              editRel.cardinalityA = cardinalityB;
              editRel.cardinalityB = cardinalityA;
              editRel.classA = classB;
              editRel.classB = classA;
              structureHolder.findClass(classB)?.addRelation(editRel);
              this.focusedClass.relations.splice(i, 1);
              this.sidebarClass();
              this.render();
              break;
            }
          }
        }
      }
    }
    setClassName(): void {
      if (this.focusedClass) {
        const newName = capitalizeFirstLetter(
          remSpCh(this.sidebar.classname().value.trim())
        );
        if (
          newName.length > 0 &&
          !Object.keys(Type)
            .filter((key: any) => !isNaN(Number(Type[key])))
            .includes(newName) &&
          !structureHolder.findClass(newName)
        ) {
          const oldName = this.focusedClass.name;
          if (structureHolder.findClass(newName)) {
            alert(`class name "${newName}" already in use`);
            this.sidebar.classname().value = oldName;
            return;
          }
          structureHolder.deepRename(oldName, newName);
          this.focusedClass = structureHolder.findClass(newName);
          this.render();
        }
      } else {
        this.sidebar.classname().value = "";
      }
    }
    setClassClassifer(c: string): void {
      if (this.focusedClass) {
        switch (c) {
          case Classifer.default:
            this.focusedClass.classifer = Classifer.default;
            this.render();
            break;
          case Classifer.static:
            this.focusedClass.classifer = Classifer.static;
            this.render();
            break;
          case Classifer.abstract:
            this.focusedClass.classifer = Classifer.abstract;
            this.render();
            break;
        }
      } else {
        this.sidebar.classifer().value = "";
      }
    }
    loadFile(): void {
      const fileUpload = document.getElementById("fileUpload");
      fileUpload?.click();
    }

    fullscreenGraph(fs?: boolean) {
      if (fs === undefined) {
        document.body.classList.toggle("fullscreen");
      } else if (fs === true) {
        document.body.classList.add("fullscreen");
      } else if (fs === false) {
        document.body.classList.remove("fullscreen");
      }
    }
  }
  return new _Ui();
})();
