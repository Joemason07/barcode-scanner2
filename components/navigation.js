
const SECTION_KEY = 'scanly-navigation-section';

// Main categories and the existing pages available in each section.
const sections = {
  home: {
    label: 'Home',
    icon: '⌂',
    items: [
      { page: 'home', label: 'Home', icon: '⌂' },
      { page: 'scan', label: 'Quick scan', icon: '⌕' },
      { page: 'history', label: 'Recent scans', icon: '◷' }
    ]
  },

  scanning: {
    label: 'Scanning',
    icon: '⌕',
    items: [
      { page: 'scan', label: 'Scan', icon: '⌕' },
      { page: 'history', label: 'History', icon: '◷' }
    ]
  },

  inventory: {
    label: 'Inventory',
    icon: '▤',
    items: [
      { page: 'inventory', label: 'All items', icon: '▤' },
      { page: 'scan', label: 'Add item', icon: '+' },
      { page: 'history', label: 'Scan history', icon: '◷' }
    ]
  },

  nutrition: {
    label: 'Nutrition',
    icon: '◉',
    items: [
      { page: 'analytics', label: 'Overview', icon: '◉' },
      { page: 'inventory', label: 'Products', icon: '▤' },
      { page: 'history', label: 'Scan history', icon: '◷' }
    ]
  },

  profile: {
    label: 'Profile',
    icon: '♙',
    items: [
      { page: 'profile', label: 'My profile', icon: '♙' },
      { page: 'settings', label: 'Preferences', icon: '⚙' }
    ]
  },

  settings: {
    label: 'Settings',
    icon: '⚙',
    items: [
      { page: 'settings', label: 'Settings', icon: '⚙' },
      { page: 'profile', label: 'Profile', icon: '♙' }
    ]
  }
};

// Determine a sensible default section from the current route.
function sectionForPage(page) {
  const pageSections = {
    home: 'home',
    scan: 'scanning',
    inventory: 'inventory',
    history: 'home',
    analytics: 'nutrition',
    profile: 'profile',
    settings: 'settings',
    item: 'inventory'
  };

  return pageSections[page] || 'home';
}

function getSelectedSection(page) {
  try {
    const saved = sessionStorage.getItem(SECTION_KEY);

    if (saved && sections[saved]) {
      return saved;
    }
  } catch (error) {
    // Fall back to the current route if storage is unavailable.
  }

  return sectionForPage(page);
}

function renderBottomNavigation(section, currentPage) {
  const nav = document.querySelector('.bottom-nav');

  if (!nav) return;

  const selected = sections[section] || sections.home;

  nav.innerHTML = selected.items.map(item => `
    <a
      href="#${item.page}"
      data-nav="${item.page}"
      class="${item.page === currentPage ? 'active' : ''}"
      ${item.page === currentPage ? 'aria-current="page"' : ''}
    >
      <span class="nav-icon" aria-hidden="true">
        ${item.icon}
      </span>
      <span>${item.label}</span>
    </a>
  `).join('');
}

// Main navigation and bottom navigation markup.
export function navigation() {
  return `
    <div class="main-menu">
      <button
        class="main-menu-toggle"
        type="button"
        aria-label="Open main menu"
        aria-expanded="false"
        aria-controls="main-menu-drawer"
        data-menu-toggle
      >
        <span aria-hidden="true">☰</span>
      </button>

      <div
        class="main-menu-backdrop"
        data-menu-backdrop
        hidden
      ></div>

      <aside
        class="main-menu-drawer"
        id="main-menu-drawer"
        aria-label="Main menu"
        aria-hidden="true"
        inert
      >
        <div class="main-menu-header">
          <div>
            <p class="main-menu-eyebrow">SCANLY</p>
            <h2>Explore</h2>
          </div>

          <button
            type="button"
            class="main-menu-close"
            data-menu-close
            aria-label="Close main menu"
          >×</button>
        </div>

        <nav class="main-menu-links" aria-label="Main categories">
          ${Object.entries(sections).map(([key, section]) => `
            <a
              href="#${({
                home: 'home',
                scanning: 'scan',
                inventory: 'inventory',
                nutrition: 'analytics',
                profile: 'profile',
                settings: 'settings'
              })[key]}"
              data-main-section="${key}"
            >
              <span class="main-menu-icon" aria-hidden="true">
                ${section.icon}
              </span>
              <span>${section.label}</span>
              <span class="main-menu-chevron" aria-hidden="true">›</span>
            </a>
          `).join('')}
        </nav>
      </aside>
    </div>

    <nav class="bottom-nav" aria-label="Section navigation">
    </nav>
  `;
}

// Highlight the current route and update the subcategory menu.
export function updateNavigation(page) {
  const section = getSelectedSection(page);

  renderBottomNavigation(section, page);

  document.querySelectorAll('[data-main-section]').forEach(link => {
    const isActive = link.dataset.mainSection === section;

    link.classList.toggle('active', isActive);

    if (isActive) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  // Bind menu interactions once, even when the router renders again.
  if (document.documentElement.dataset.scanlyMenuBound === 'true') {
    return;
  }

  document.documentElement.dataset.scanlyMenuBound = 'true';

  function closeMenu() {
    const drawer = document.querySelector('[data-menu-toggle]');
    const panel = document.querySelector('[data-menu-backdrop]');
    const menu = document.querySelector('.main-menu-drawer');

    if (!drawer || !panel || !menu) return;

    drawer.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-label', 'Open main menu');

    panel.hidden = true;
    menu.setAttribute('aria-hidden', 'true');
    menu.setAttribute('inert', '');
    document.body.classList.remove('main-menu-open');
  }

  document.addEventListener('click', event => {
    const toggle = event.target.closest('[data-menu-toggle]');
    const close = event.target.closest('[data-menu-close]');
    const backdrop = event.target.closest('[data-menu-backdrop]');
    const mainLink = event.target.closest('[data-main-section]');

    if (toggle) {
      const panel = document.querySelector('[data-menu-backdrop]');
      const menu = document.querySelector('.main-menu-drawer');

      if (!panel || !menu) return;

      const isOpen = toggle.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        closeMenu();
      } else {
        panel.hidden = false;
        menu.removeAttribute('inert');
        menu.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Close main menu');
        document.body.classList.add('main-menu-open');
      }

      return;
    }

    if (close || backdrop) {
      closeMenu();
      return;
    }

    if (mainLink) {
      const nextSection = mainLink.dataset.mainSection;

      try {
        sessionStorage.setItem(SECTION_KEY, nextSection);
      } catch (error) {
        // Navigation still works without session storage.
      }

      closeMenu();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
}
