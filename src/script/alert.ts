function alert(
  message: string,
  cancel?: boolean,
  okText?: string,
  cancelText?: string
): Promise<boolean> {
  return new Promise(function (resolve: (value: boolean) => void) {
    const alert = document.createElement("div");
    alert.className = "alert";
    const window = document.createElement("div");
    window.className = "window";
    alert.appendChild(window);
    const titleBar = document.createElement("div");
    titleBar.className = "titleBar";
    titleBar.innerText = "Alert";
    window.appendChild(titleBar);
    const content = document.createElement("div");
    content.className = "content";
    window.appendChild(content);
    const msg = document.createElement("p");
    msg.style.padding = "8px";
    msg.innerText = message;
    content.appendChild(msg);
    const buttons = document.createElement("div");
    buttons.className = "buttons";
    window.appendChild(buttons);
    const Ok = document.createElement("button");
    Ok.className = "focus";
    if (okText) {
      Ok.innerText = okText;
    } else {
      Ok.innerHTML = "OK";
    }
    buttons.appendChild(Ok);
    Ok.addEventListener("click", () => {
      alert.remove();
      resolve(true);
    });
    if (cancel) {
      const Cancel = document.createElement("button");
      if (cancelText) {
        Cancel.innerText = cancelText;
      } else {
        Cancel.innerHTML = "Cancel";
      }
      buttons.appendChild(Cancel);
      Cancel.addEventListener("click", () => {
        alert.remove();
        resolve(false);
      });
    }
    document.body.appendChild(alert);
  });
}
