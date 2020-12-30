async function gitChangelog(): Promise<string> {
  try {
    const master = JSON.parse(
      await httpGet(
        "https://api.github.com/repos/Frank-Mayer/CMapper/commits/master"
      )
    );
    return `Last commit: "${master.commit.message}"`;
  } catch {
    return "";
  }
}
