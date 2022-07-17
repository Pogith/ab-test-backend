const postRequestData = async (url, options) => {
  const defaultOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "no-cors",
  };

  try {
    if (options) {
      await fetch(url, options);
    } else {
      await fetch(url, defaultOptions);
    }
  } catch (err) {
    console.error(err);
  }
};

window.addEventListener("DOMContentLoaded", async () => {
  const url = window.location.href;
  const connectEvent = {
    name: "connect",
    url,
  };
  const connectEventUrl = `https://abtest.click/api/test-page/${key}?event=${JSON.stringify(connectEvent)}`;

  try {
    await postRequestData(connectEventUrl);

    console.log("Connect success");
  } catch (err) {
    console.error("Connect Error", err);
  }

  document.addEventListener("click", async (e) => {
    const clickEvent = {
      name: "click",
      x: e.pageX,
      y: e.pageY,
    };

    const clickEventUrl = `https://abtest.click/api/test-page/${key}?event=${JSON.stringify(clickEvent)}`;

    try {
      await postRequestData(clickEventUrl);

      console.log("Click success");
    } catch (error) {
      console.error("Click Error", error);
    }
  });
});

if (window.navigator.userAgent.indexOf("Firefox") > -1) {
  window.onunload = async () => {
    const unloadEvent = {
      name: "unload",
    };
    const unloadEventUrl = `https://abtest.click/api/test-page/${key}?event=${JSON.stringify(unloadEvent)}`;

    try {
      await postRequestData(unloadEventUrl);

      console.log("Unload success");
    } catch (err) {
      console.error("Unload Error", err);
    }
  };
}

if (window.navigator.userAgent.indexOf("Chrome") > -1) {
  window.onbeforeunload = async (e) => {
    e.preventDefault();

    const unloadEvent = {
      name: "unload",
    };
    const unloadEventUrl = `https://abtest.click/api/test-page/${key}?event=${JSON.stringify(unloadEvent)}`;

    try {
      await postRequestData(unloadEventUrl);

      console.log("Unload success");
    } catch (err) {
      console.error("Unload Error", err);
    }
  };
}
