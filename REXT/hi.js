document.addEventListener('DOMContentLoaded', () => {
  const theme = document.getElementById('theme-toggle');
  const logoImg = document.getElementById('logo-img');

  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get(['theme'], (result) => {
      if (result.theme === 'dark') {
        e_DM(true);
      }
    });
  }

  theme.addEventListener('click', () => {
    const dark = document.body.classList.toggle('dark-mode');
    updassets(dark);

    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ theme: dark ? 'dark' : 'light' });
    }
  });

  function e_DM(enable) {
    if (enable) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    updassets(enable);
  }

  function updassets(dark) {
    if (logoImg) {
      logoImg.src = dark ? 'REXTtitlewhite.png' : 'REXTtitleblack.png';
    }
  }

    document.getElementById('settings-btn').addEventListener('click', () => {
       window.location.href = 'settings.html';
    });

  const hiddenCountEl = document.getElementById('hidden-count');

  if (hiddenCountEl) {
    chrome.storage.local.get(['hiddenCount'], (result) => {
      hiddenCountEl.textContent = result.hiddenCount || 0;
    });

    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local' && changes.hiddenCount !== undefined) {
        hiddenCountEl.textContent = changes.hiddenCount.newValue || 0;
      }
    });
  }
});

