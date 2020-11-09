class Smart {
  private static errors = new Array<string>();
  static showDialog(): void {
    if (this.errors.length > 0) {
      alert(this.errors.join("\n\n"));
    } else {
      alert("No problems have been detected in the workspace so far");
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
          for (let j = i + 1; j < cl.relations.length; j++) {
            const a = cl.relations[i];
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
