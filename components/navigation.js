// Bottom navigation.
//
// Renders the navigation used throughout Scanly
// and updates the active item when the route changes.


// --------------------------------------------------
// Navigation markup
// --------------------------------------------------

export function navigation() {
  return `
    <nav
      class="bottom-nav"
      aria-label="Main navigation"
    >

      <a
        href="#home"
        data-nav="home"
      >
        <span
          class="nav-icon"
          aria-hidden="true"
        >
          ⌂
        </span>

        <span>
          Home
        </span>
      </a>


      <a
        href="#scan"
        data-nav="scan"
      >
        <span
          class="nav-icon"
          aria-hidden="true"
        >
          ⌕
        </span>

        <span>
          Scan
        </span>
      </a>


      <a
        href="#inventory"
        data-nav="inventory"
      >
        <span
          class="nav-icon"
          aria-hidden="true"
        >
          ▤
        </span>

        <span>
          Inventory
        </span>
      </a>


      <a
        href="#history"
        data-nav="history"
      >
        <span
          class="nav-icon"
          aria-hidden="true"
        >
          ◷
        </span>

        <span>
          History
        </span>
      </a>


      <a
        href="#settings"
        data-nav="settings"
      >
        <span
          class="nav-icon"
          aria-hidden="true"
        >
          ⚙
        </span>

        <span>
          Settings
        </span>
      </a>

    </nav>
  `;
}


// --------------------------------------------------
// Active navigation item
// --------------------------------------------------

export function updateNavigation(page) {
  document
    .querySelectorAll('[data-nav]')
    .forEach(link => {
      link.classList.toggle(
        'active',
        link.dataset.nav === page
      );
    });
}