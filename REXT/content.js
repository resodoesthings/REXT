const REMOTE_BLACKLIST_URL = 'https://raw.githubusercontent.com/resodoesthings/REXT/main/blacklist-data.txt';

let blockedGameIds = new Set();
let isFilterEnabled = true;

let observer = null;

function removeBlockedGames() {
  if (typeof chrome === 'undefined' || !chrome.runtime?.id) {
    if (observer) observer.disconnect();
    return;
  }

  if (!isFilterEnabled || blockedGameIds.size === 0) {
    chrome.storage.local.set({ hiddenCount: 0 });
    return;
  }

  const gameLinks = document.querySelectorAll('a[href*="/games/"], a[href*="placeId="], a[href*="universeId="]');

  gameLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const placeIdMatch = href.match(/(?:\/games\/|placeId=)(\d+)/);
    const universeIdMatch = href.match(/universeId=(\d+)/);

    const placeId = placeIdMatch ? placeIdMatch[1] : null;
    const universeId = universeIdMatch ? universeIdMatch[1] : null;

    const isPlaceBlocked = placeId && placeId.length > 3 && blockedGameIds.has(placeId);
    const isUniverseBlocked = universeId && universeId.length > 3 && blockedGameIds.has(universeId);

    if (isPlaceBlocked || isUniverseBlocked) {
      const card = link.closest('li.list-item') || 
                   link.closest('[data-testid="wide-game-tile"]') || 
                   link.closest('.hover-game-tile') || 
                   link.closest('.game-card-container');

      if (card) {
        card.classList.add('rext-hidden');
        card.style.display = 'none';
      }
    }
  });

  const hiddenCount = document.querySelectorAll('.rext-hidden').length;
  try {
    chrome.storage.local.set({ hiddenCount: hiddenCount });
  } catch (e) {
    if (observer) observer.disconnect();
  }
}

function observeDOM() {
  if (observer) return;

  observer = new MutationObserver(() => {
    removeBlockedGames();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

if (typeof chrome !== 'undefined' && chrome.storage) {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.filterEnabled !== undefined) {
      isFilterEnabled = changes.filterEnabled.newValue;
      
      if (isFilterEnabled) {
        removeBlockedGames();
      } else {
        location.reload();
      }
    }
  });

  chrome.storage.local.get(['filterEnabled'], (result) => {
    isFilterEnabled = result.filterEnabled !== false;
    loadAllBlacklists(); 
  });
} else {
  loadAllBlacklists();
}