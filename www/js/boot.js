(function () {
  var SITE_URL = "https://inmotion.sbdesigns.is-a.dev/";
  var statusEl;

  function setStatus(msg) {
    if (!statusEl) statusEl = document.getElementById("status");
    if (statusEl) statusEl.textContent = msg || "";
  }

  function isOffline() {
    // Plugin signal (preferred)
    if (navigator.connection && navigator.connection.type === "none") return true;
    // Browser fallback
    if (typeof navigator.onLine === "boolean" && !navigator.onLine) return true;
    return false;
  }

  function goOnline() {
    location.replace(SITE_URL);
  }

  function goOffline() {
    location.replace("offline.html");
  }

  function decideRoute() {
    if (isOffline()) {
      setStatus("No network detected.");
      goOffline();
    } else {
      setStatus("Network OK. Loading site…");
      goOnline();
    }
  }

  // Add a banner to the current page inside the WebView
  function injectOfflineBanner() {
    var script = `
      (function() {
        if (!document.getElementById("offline-banner")) {
          var banner = document.createElement("div");
          banner.id = "offline-banner";
          banner.textContent = "You are offline. Some features may not work.";
          banner.style.position = "fixed";
          banner.style.top = "0";
          banner.style.left = "0";
          banner.style.right = "0";
          banner.style.background = "#ff4444";
          banner.style.color = "#fff";
          banner.style.padding = "10px";
          banner.style.textAlign = "center";
          banner.style.fontFamily = "sans-serif";
          banner.style.zIndex = "9999";
          document.body.appendChild(banner);
        }
      })();
    `;
    if (window.cordova && window.cordova.InAppBrowser) {
      // If using InAppBrowser, we'd inject via executeScript
    } else {
      // Inject directly if we're in the same WebView
      var tag = document.createElement("script");
      tag.innerHTML = script;
      document.body.appendChild(tag);
    }
  }

  function removeOfflineBanner() {
    var script = `
      var banner = document.getElementById("offline-banner");
      if (banner) banner.remove();
    `;
    var tag = document.createElement("script");
    tag.innerHTML = script;
    document.body.appendChild(tag);
  }

  document.addEventListener("deviceready", function () {
    document.addEventListener("offline", injectOfflineBanner, false);
    document.addEventListener("online", removeOfflineBanner, false);

    decideRoute();
  }, false);

  // Safety fallback if deviceready never fires
  setTimeout(function () {
    decideRoute();
  }, 2500);
})();
