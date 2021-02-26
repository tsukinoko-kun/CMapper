/// <reference path="../../../rocket.ts/Timer/retriggerableDelay.ts"/>
/// <reference path="../../../rocket.ts/DataStructures/IndexedDB.ts"/>
class Smart {
  private static errors = new Array<string>();
  private static title = "SmartBulb";
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
        "Cancel",
        "Build Anyway",
        Smart.title
      );
    } else {
      return new Promise((resolve: (value: boolean) => void) => {
        resolve(false);
      });
    }
  }
  static update(): void {
    const indicator = document.getElementById("smart");
    if (indicator) {
      const memberId = (member: Attribute | Method): string => {
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
          const relatedClassed = new Array<Class>();
          cl.forEachRelation((r) => {
            if (r.relation === relationType.inheritance) {
              const B = structureHolder.findClass(r.classB);
              if (B) {
                relatedClassed.push(B);
              }
            }
          });
          for (
            let secCount = 0;
            secCount < 100 && relatedClassed.length > 0;
            secCount++
          ) {
            const B = relatedClassed.shift();
            if (B) {
              if (B === cl) {
                this.errors.push(
                  `Circular base class dependency involving '${cl.name}'`
                );
                break;
              }
              B.forEachRelation((r) => {
                if (r.relation === relationType.inheritance) {
                  const C = structureHolder.findClass(r.classB);
                  if (C) {
                    relatedClassed.push(C);
                  }
                }
              });
            }
          }
          for (const clB of structureHolder.namespace) {
            clB.forEachRelation((b) => {
              if (
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
              let attributeFound = false;
              for (const f of B.attributes) {
                if (f.type.includes(a.classA)) {
                  attributeFound = true;
                  break;
                }
              }
              if (!attributeFound) {
                this.errors.push(
                  `According to relation '${a.toString()}', class '${
                    a.classB
                  }' should have a Attribute of type '${a.classA}'`
                );
              }
            }
          }
        }
        for (const f of cl.attributes) {
          for (const t of f.type) {
            if (t !== cl.name) {
              const typeClass = structureHolder.findClass(t);
              if (typeClass) {
                let relationFound = false;
                for (const r of typeClass.relations) {
                  if (
                    r.classA === t &&
                    (r.relation === relationType.composition ||
                      r.relation === relationType.aggregation ||
                      r.relation === relationType.solidLink ||
                      r.relation === relationType.dashedLink)
                  ) {
                    relationFound = true;
                    break;
                  }
                }
                if (!relationFound) {
                  this.errors.push(
                    `missing relation from '${t}' to '${cl.name}' of type composition, aggregation or link`
                  );
                }
              }
            }
          }
        }
      }
      indicator.innerHTML = this.errors.length.toString();
      const speachBubble = document.getElementById("speachBubble");
      if (this.errors.length > 0) {
        if (this.errors.length > 5) {
          indicator.style.color = "red";
        } else {
          indicator.style.color = "var(--orange)";
        }
        if (speachBubble && !Ui.hasClassInFocus()) {
          speachBubble.style.display = "block";
          retriggerableDelay("ErrorDetectedSpeachBubble", 2500, () => {
            const speachBubble = document.getElementById("speachBubble");
            if (speachBubble) {
              speachBubble.style.display = "none";
            }
          });
        }
      } else {
        indicator.style.color = "whitesmoke";
        if (speachBubble) {
          speachBubble.style.display = "none";
        }
      }
    }
  }
}
