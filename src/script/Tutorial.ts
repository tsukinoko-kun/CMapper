/// <reference path="alert.ts"/>
(async (): Promise<void> => {
  setTimeout(async (): Promise<void> => {
    const tutorial =
      "true" ==
      (await db.get("tutorial").catch((e) => {
        console.debug(e);
      }));
    if (!tutorial) {
      const wiki = new StringBuilder();
      wiki.append(
        'Create new Class: Right click (or long tap on touch) into the main graph, to open the context-menu. Click "New Class"\n\n'
      );
      wiki.appendLine(
        "For more information click the book symbol in the info bar (at the bottom), you will be redirected to the wiki of the GitHub repository."
      );
      await alert(wiki.toString());
      db.set("tutorial", "true").catch((e) => {
        console.debug(e);
      });
    }
  }, 500);
  return;
})();
