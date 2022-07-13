window.addEventListener("DOMContentLoaded", async () => {
  const url = window.location.href;

  const connectEvent = {
    name: "connect",
    url,
  };

  fetch(
    `http://localhost:8080/api/test-page/${key}?event=${JSON.stringify(connectEvent)}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "no-cors"
    }
  )
    .then(() => console.log("receive response!"))
    .catch((err) => console.error("Connect Error", err));

  document.body.addEventListener("click", (event) => {
    const clickEvent = {
      name: "click",
      x: event.pageX,
      y: event.pageY,
    };

    fetch(
      `http://localhost:8080/api/test-page/${key}?event=${JSON.stringify(clickEvent)}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "no-cors"
      }
    )
      .then(() => console.log("receive response!"))
      .catch((err) => console.error("Click Error", err));
  });
});

if (window.navigator.userAgent.indexOf("Firefox") > -1) {
  window.onunload = () => {
    const event = {
      name: "unload",
    };

    fetch(
      `http://localhost:8080/api/test-page/${key}?event=${JSON.stringify(event)}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "no-cors"
      }
    )
      .then(() => console.log("receive response!"))
      .catch((err) => console.error("Error", err));
  };
}

if (window.navigator.userAgent.indexOf("Chrome") > -1) {
  window.onbeforeunload = (e) => {
    e.preventDefault();

    const event = {
      name: "unload",
    };

    fetch(
      `http://localhost:8080/api/test-page/${key}?event=${JSON.stringify(event)}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "no-cors"
      }
    )
      .then(() => console.log("receive response!"))
      .catch((err) => console.error("Unload Error", err));
  };
}
