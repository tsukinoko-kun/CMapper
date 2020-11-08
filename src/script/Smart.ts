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
                `'${cl.name}.${
                  m.name + memberId(m)
                }' is abstract but it is contained in non-abstract class '${
                  cl.name
                }'`
              );
            }
          }
        });
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
