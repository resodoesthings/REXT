document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('settings-back').addEventListener('click', () => {
       window.location.href = 'window.html';
    });

    document.addEventListener('DOMContentLoaded', () => {
  const filterCheckbox = document.getElementById('enable-filter');

  if (filterCheckbox) {
    chrome.storage.local.get(['filterEnabled'], (result) => {
      filterCheckbox.checked = result.filterEnabled !== false;
    });
    filterCheckbox.addEventListener('change', (e) => {
      chrome.storage.local.set({ filterEnabled: e.target.checked });
    });
  }
});

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

});