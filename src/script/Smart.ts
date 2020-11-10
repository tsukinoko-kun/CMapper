class Smart {
  private static errors = new Array<string>();
  private static title = "Smart Spot";
  static showDialog(): void {
    if (this.errors.length > 0) {
      alert(
        this.errors.join("\n\n"),
        undefined,
        undefined,
        undefined,
        this.title
      );
    } else {
      alert(
        "No problems have been detected in the workspace so far",
        undefined,
        undefined,
        undefined,
        this.title
      );
    }
  }
  public static checkBeforeBuild(): Promise<boolean> {
    if (Smart.errors.length > 0) {
      return alert(
        Smart.errors.join("\n\n"),
        true,
        "Build Anyway",
        "Cancel",
        Smart.title
      );
    } else {
      return new Promise((resolve: (value: boolean) => void) => {
        resolve(true);
      });
    }
  }
  static update(): void {
    const indicator = document.getElementById("smart");
    if (indicator) {
      const memberId = (member: Field | Method): string => {
        return member.name + (member instanceof Method ? "()" : "");
      };
      this.errors = new Array<string>();
      for (const cl of structureHolder.namespace) {
        cl.forEachMember((m) => {
          if (cl.classifer === Classifer.static) {
            if (m.classifer === Classifer.default) {
              this.errors.push(
                `Cannot declare instance member '${cl.name}.${memberId(
                  m
                )}' in static class '${cl.name}'`
              );
            }
          }
          if (
            m.classifer === Classifer.abstract &&
            (m.protection === Protection.private ||
              m.protection === Protection.internal)
          ) {
            this.errors.push(
              `abstract member '${cl.name}.${memberId(
                m
              )}' cannot be private or internal`
            );
          }
          if (cl.classifer !== Classifer.abstract) {
            if (m.classifer === Classifer.abstract) {
              this.errors.push(
                `'${cl.name}.${memberId(
                  m
                )}' is abstract but it is contained in non-abstract class '${
                  cl.name
                }'`
              );
            }
          }
        });
        for (let i = 0; i < cl.relations.length; i++) {
          const a = cl.relations[i];
          const B = structureHolder.findClass(a.classB);
          if (B && B.classifer === Classifer.static) {
            this.errors.push(
              `class ${a.classA} cannot derive from static class ${a.classB}`
            );
          }
          for (let j = i + 1; j < cl.relations.length; j++) {
            const b = cl.relations[j];
            if (
              a.classA === b.classA &&
              a.classB === b.classB &&
              a.relation === b.relation
            ) {
              this.errors.push(
                `doubled relation from ${a.classA} to ${a.classB}`
              );
            }
          }
          for (const clB of structureHolder.namespace) {
            clB.forEachRelation((b) => {
              if (
                a.classA === b.classB &&
                a.classB === b.classA &&
                a.relation === relationType.inheritance &&
                b.relation === relationType.inheritance
              ) {
                this.errors.push(
                  `Circular base class dependency involving '${a.classA}' and '${a.classB}'`
                );
              } else if (
                a.classA === b.classB &&
                a.classB === b.classA &&
                a.relation === relationType.composition &&
                b.relation === relationType.composition
              ) {
                this.errors.push(
                  `'${a.classA}' cannot be contained in its own container '${a.classB}'`
                );
              }
            });
          }
          if (
            a.relation === relationType.composition ||
            a.relation === relationType.aggregation
          ) {
            if (B) {
              let fieldFound = false;
              for (const f of B.fields) {
                if (f.type.includes(a.classA)) {
                  fieldFound = true;
                  break;
                }
              }
              if (!fieldFound) {
                this.errors.push(
                  `According to relation '${a.toString()}', class '${
                    a.classB
                  }' should have a Field of type '${a.classA}'`
                );
              }
            }
          }
        }
        for (const f of cl.fields) {
          for (const t of f.type) {
            if (t !== cl.name) {
              const typeClass = structureHolder.findClass(t);
              if (typeClass) {
                let relationFound = false;
                for (const r of typeClass.relations) {
                  if (
                    r.classA === t &&
                    (r.relation === relationType.composition ||
                      r.relation === relationType.aggregation)
                  ) {
                    relationFound = true;
                    break;
                  }
                }
                if (!relationFound) {
                  this.errors.push(
                    `missing relation from '${t}' to '${cl.name}' of type composition or aggregation`
                  );
                }
              }
            }
          }
        }
      }
      indicator.innerHTML = this.errors.length.toString();
      indicator.style.color =
        this.errors.length > 0
          ? this.errors.length > 5
            ? "red"
            : "var(--orange)"
          : "white";
    }
  }
}
