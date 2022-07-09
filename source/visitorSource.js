window.addEventListener("DOMContentLoaded", async () => {
  const url = window.location.href;

  const connectEvent = {
    name: "connect",
    url,
  };

  const ip = await fetch("https://api.ipify.org?format=json", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((response) => response.ip)
    .catch((err) => console.error("Error", err));

  console.log("connected and start");

  fetch(
    `http://localhost:8080/api/test-page/${key}?event=${JSON.stringify(connectEvent)}&ip=${ip}`,
    {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "no-cors"
    }
  )
    .then((res) => console.log("receive response!"))
    .catch((err) => console.error("Connect Error", err));

  document.body.addEventListener("click", (event) => {
    const clickEvent = {
      name: "click",
      x: event.pageX,
      y: event.pageY,
    };

    console.log("send click event");

    fetch(
      `http://localhost:8080/api/test-page/${key}?event=${JSON.stringify(clickEvent)}&ip=${ip}`,
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
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

    console.log("Firefox is unloaded");

    fetch(
      `http://localhost:8080/api/test-page/${key}?event=${JSON.stringify(event)}`,
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
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
    const event = {
      name: "unload",
    };

    console.log("Chrome is unloaded");

    fetch(
      `http://localhost:8080/api/test-page/${key}?event=${JSON.stringify(event)}`,
      {
        method: "POST",
        headers: {
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

const key = "1o2w0e507l5asrx57";
