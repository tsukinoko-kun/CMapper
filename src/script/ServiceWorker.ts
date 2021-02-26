((): void => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("sw.js")
      .then((sw) => {
        console.info("Service worker registered\n", sw);
      })
      .catch((error) => {
        console.warn("Service worker not registered\n", error);
      });
  }
})();
