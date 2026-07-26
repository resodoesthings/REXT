const current_version = chrome.runtime.getManifest().version;
const version_check_url = "https://raw.githubusercontent.com/resodoesthings/REXT/other/version.json?t=" + Date.now();

const check_icon = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 12 12" style="vertical-align: middle; margin-left: 4px; color: var(--version-icon-color);">
  <path d="M0 0h12v12H0z" fill="none" />
  <path fill="currentColor" d="m6.933.332l.113.101l.89.89l1.26.001a1.48 1.48 0 0 1 1.453 1.198l.02.138l.007.143l-.002 1.259l.893.892a1.48 1.48 0 0 1 .19 1.86l-.089.12l-.101.112l-.893.891l.001 1.258c0 .659-.432 1.224-1.056 1.415l-.136.035l-.142.023l-.144.007h-1.26l-.891.892a1.48 1.48 0 0 1-1.86.19l-.12-.089l-.112-.101l-.892-.893l-1.258.001A1.48 1.48 0 0 1 1.35 9.48l-.02-.139l-.006-.142V7.936l-.89-.89a1.48 1.48 0 0 1-.19-1.86l.088-.12l.101-.112l.89-.891l.001-1.26c0-.72.516-1.32 1.198-1.452l.139-.02l.142-.007h1.26l.891-.89a1.48 1.48 0 0 1 1.98-.102zm1.212 3.657l-.085.071L5.5 6.62L4.44 5.56a.63.63 0 0 0-.88 0a.63.63 0 0 0-.071.795l.071.085l1.5 1.5a.625.625 0 0 0 .804.065l.076-.065l3-3a.61.61 0 0 0 0-.88a.63.63 0 0 0-.795-.071" />
</svg>`;

const x_icon = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" style="vertical-align: middle; margin-left: 4px; color: var(--version-icon-color);">
  <path d="M0 0h24v24H0z" fill="none" />
  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M12 16h.008M12 8v5m10-1c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10s10-4.477 10-10" />
</svg>`;

function displayversion(status_icon = "") {
  const version_element = document.getElementById("app-version");
  if (version_element) {
    version_element.innerHTML = `v${current_version}${status_icon}`;
  }
}

async function checkforupdates() {
  displayversion();

  try {
    const response = await fetch(version_check_url, { cache: "no-store" });
    if (!response.ok) {
      displayversion(x_icon);
      return;
    }

    const data = await response.json();
    const latestversion = data.version;

    if (latestversion !== current_version) {
      displayversion(x_icon);

      chrome.storage.local.get(["dismissed_version"], (result) => {
        if (result.dismissed_version !== latestversion) {
          showupdateoverlay(latestversion);
        }
      });
    } else {
      displayversion(check_icon);
    }
  } catch (error) {
    console.error("Failed to check for updates:", error);
    displayversion(x_icon);
  }
}

function showupdateoverlay(latestversion) {
  if (document.getElementById("update-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "update-overlay";

  Object.assign(overlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "999999",
    fontFamily: "Geist Pixel",
    boxSizing: "border-box",
    padding: "10px"
  });

  overlay.innerHTML = `
    <div style="
      background: rgba(20, 20, 20, 0.95);
      border: 1px solid #444;
      padding: 16px;
      border-radius: 12px;
      text-align: center;
      color: #ffffff;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      width: 100%;
      box-sizing: border-box;
    ">
      <h2 style="margin-top: 0; font-size: 16px; display: flex; align-items: center; justify-content: center; gap: 6px;">
        WARNING
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <g fill="none">
            <path fill="currentColor" fill-opacity=".16" d="M10.575 5.217L3.517 17a1.667 1.667 0 0 0 1.425 2.5h14.116a1.666 1.666 0 0 0 1.425-2.5L13.426 5.217a1.666 1.666 0 0 0-2.85 0" />
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M12 16h.008M12 10v3m-1.425-7.783L3.517 17a1.667 1.667 0 0 0 1.425 2.5h14.116a1.666 1.666 0 0 0 1.425-2.5L13.426 5.217a1.666 1.666 0 0 0-2.85 0" />
          </g>
        </svg>
      </h2>
      <p style="margin-bottom: 16px; font-size: 12px; line-height: 1.4;">
        Deprecated version, download the new version or dismiss this notification.
      </p>
      <div style="display: flex; gap: 8px; justify-content: center;">
        <a href="https://github.com/resodoesthings/REXT/releases" target="_blank" style="
          display: inline-block;
          padding: 8px 12px;
          background-color: #007bff;
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          font-size: 12px;
        ">download!</a>
        <button id="dismiss-btn" style="
          padding: 8px 12px;
          background-color: #444;
          color: #ffffff;
          font-family: 'Geist Pixel';
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          font-size: 12px;
        ">Dismiss</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("dismiss-btn").addEventListener("click", () => {
    chrome.storage.local.set({ dismissed_version: latestversion }, () => {
      overlay.remove();
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", checkforupdates);
} else {
  checkforupdates();
}