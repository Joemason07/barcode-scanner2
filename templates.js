// Page and component templates. Each function returns an HTML string that
// gets assigned to #app's innerHTML by app.js's render().

import { scans, scansThisWeek } from './state.js';

// Escapes user/product-supplied text before it's inserted into innerHTML,
// so a product name or barcode can never inject markup.
export const escapeHtml = (value = '') =>
  String(value).replace(/[&<>'"]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  }[char]));

// Renders a single row in the recent-scans / history list.
export const scanCard = item => `
  <a class="scan-card" href="#item/${encodeURIComponent(item.code)}">
    <div class="code">
      ${item.image ? `<img src="${escapeHtml(item.image)}" alt="" />` : item.icon}
    </div>
    <div>
      <b>${escapeHtml(item.name)}</b>
      <small>${escapeHtml(item.code)} · ${escapeHtml(item.time)}</small>
    </div>
    <span style="margin-left:auto;color:var(--muted)">›</span>
  </a>
`;

export const home = () => `
  <section class="hero">
    <div class="eyebrow" style="color:var(--lime)">Your everyday scanner</div>
    <h1>Know what’s behind every barcode.</h1>
    <p>Scan products, save what matters, and keep useful details close at hand.</p>
    <a class="scan-action" href="#scan"><span>⌗</span>Scan a barcode</a>
  </section>

  <div class="section-head"><h2>Your activity</h2></div>
  <div class="stats">
    <div class="stat"><strong>${scans.length}</strong><span>Total scans</span></div>
    <div class="stat"><strong>${scansThisWeek()}</strong><span>This week</span></div>
    <div class="stat"><strong>${scans.length}</strong><span>Products found</span></div>
  </div>

  <div class="section-head">
    <h2>Recent scans</h2>
    <a class="link" href="#history">View all</a>
  </div>
  ${scans.length
    ? scans.slice(0, 2).map(scanCard).join('')
    : `<div class="empty compact">
         <div class="empty-icon">⌗</div>
         <h2>No scans yet</h2>
         <p>Scan a barcode to begin your history.</p>
       </div>`
  }
`;

export const scan = () => `
  <section class="page-intro">
    <div class="eyebrow">Ready when you are</div>
    <h1>Scan a barcode</h1>
    <p>Position the barcode inside the frame. We’ll look up the product details.</p>
  </section>

  <section class="scanner" id="scanner">
    <div class="scanner-ui"></div>
    <div class="scanner-label" id="scanner-status">Opening your camera…</div>
  </section>

  <div class="scan-options">
    <button class="option" id="manual"><span>⌨</span>Enter code manually</button>
    <button class="option" id="image"><span>▧</span>Choose a photo</button>
  </div>
`;

export const history = () => `
  <section class="page-intro">
    <div class="eyebrow">Your library</div>
    <h1>Scan history</h1>
    <p>Everything you’ve scanned, in one calm place.</p>
  </section>

  <div class="section-head">
    <h2>Recent scans</h2>
    ${scans.length ? '<button class="link" id="clear-history">Clear history</button>' : ''}
  </div>

  ${scans.length
    ? scans.map(scanCard).join('')
    : `<div class="empty">
         <div class="empty-icon">⌗</div>
         <h2>Your history is clear</h2>
         <p>Scan a barcode to add your first product.</p>
       </div>`
  }
`;

export const settings = () => `
  <section class="page-intro">
    <div class="eyebrow">Make it yours</div>
    <h1>Settings</h1>
    <p>Control how Scanly works for you.</p>
  </section>

  <div style="margin-top:22px">
    <div class="setting">
      <div><b>Haptic feedback</b><small>Vibrate after a successful scan</small></div>
      <button class="toggle on" aria-label="Toggle haptic feedback"><i></i></button>
    </div>
    <div class="setting">
      <div><b>Save scan history</b><small>Keep your recent scans on this device</small></div>
      <button class="toggle on" aria-label="Toggle history saving"><i></i></button>
    </div>
    <div class="setting">
      <div><b>Dark appearance</b><small>Use the darker Scanly theme</small></div>
      <button class="toggle" id="dark-toggle" aria-label="Toggle dark appearance"><i></i></button>
    </div>
  </div>
`;

// Shown briefly on #item/<code> while api.js's lookupProduct() is fetching.
export const loadingItem = code => `
  <a class="link" href="#history">← Back to history</a>
  <div class="product-loading">
    <div class="loader"></div>
    <h2>Looking up product</h2>
    <p>Finding details for ${escapeHtml(code)}…</p>
  </div>
`;

// Renders one UK front-of-pack "traffic light" badge (Fat / Saturates / Sugars / Salt).
// `low` and `medium` are the per-100g thresholds that separate green/amber/red.
const trafficLight = (name, value, low, medium) => {
  const amount = Number(value);
  const level = !Number.isFinite(amount)
    ? 'unknown'
    : amount <= low ? 'green'
    : amount <= medium ? 'amber'
    : 'red';
  const display = Number.isFinite(amount)
    ? `${amount.toFixed(amount < 1 ? 2 : 1).replace(/\.0$/, '')}g`
    : '—';
  return `
    <div class="traffic-light ${level}" aria-label="${name}: ${display} per 100 grams, ${level}">
      <span class="traffic-dot"></span>
      <b>${name}</b>
      <strong>${display}</strong>
      <small>per 100g</small>
    </div>
  `;
};

// UK solid-food traffic-light thresholds (low, medium) per 100g:
//   Fat:       ≤3 green, ≤17.5 amber, else red
//   Saturates: ≤1.5 green, ≤5 amber, else red
//   Sugars:    ≤5 green, ≤22.5 amber, else red
//   Salt:      ≤0.3 green, ≤1.5 amber, else red
const trafficLights = values => `
  <section class="traffic-section">
    <div class="section-head">
      <h2>Traffic lights</h2>
      <span class="per-100">Per 100g</span>
    </div>
    <div class="traffic-lights">
      ${trafficLight('Fat', values.fat, 3, 17.5)}
      ${trafficLight('Saturates', values.saturates, 1.5, 5)}
      ${trafficLight('Sugars', values.sugars, 5, 22.5)}
      ${trafficLight('Salt', values.salt, 0.3, 1.5)}
    </div>
  </section>
`;

export const productItem = product => `
  <a class="link" href="#history">← Back to history</a>

  <div class="detail-hero">
    ${product.image
      ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" />`
      : '⌗'
    }
  </div>

  <section class="page-intro">
    <div class="eyebrow">Product found</div>
    <h1>${escapeHtml(product.name)}</h1>
    <p>${escapeHtml(product.brand || 'Brand not listed')}</p>
  </section>

  <div class="detail-code">${escapeHtml(product.code)}</div>

  <div class="product-grid">
    <div><span>Price</span><b>${escapeHtml(product.price || 'Not available')}</b></div>
    <div><span>Nutri-Score</span><b class="grade">${escapeHtml(product.grade || '—')}</b></div>
  </div>

  ${trafficLights(product.traffic)}

  <div class="section-head"><h2>About this product</h2></div>
  <p>${escapeHtml(product.description || 'No description is available for this product.')}</p>

  <div class="info-list">
    <div><span>Product type</span><b>${escapeHtml(product.type || 'Product')}</b></div>
    <div><span>Categories</span><b>${escapeHtml(product.categories || 'Not listed')}</b></div>
    <div><span>Ingredients</span><b>${escapeHtml(product.ingredients || 'Not listed')}</b></div>
    <div><span>Nutrition</span><b>${escapeHtml(product.nutrition || 'Not available')}</b></div>
  </div>

  <p class="data-note">
    The lookup searches Open Food Facts, Open Beauty Facts, Open Pet Food Facts,
    and Open Products Facts. Traffic-light colours use UK front-of-pack
    solid-food thresholds and are calculated from available per-100g data.
  </p>
`;

export const missingItem = code => `
  <a class="link" href="#history">← Back to history</a>
  <div class="empty">
    <div class="empty-icon">⌗</div>
    <h2>Product not found</h2>
    <p>We couldn’t find details for barcode ${escapeHtml(code)} in the product catalogue.</p>
    <button class="scan-action" id="try-another">Try another barcode</button>
  </div>
`;

export const errorItem = () => `
  <a class="link" href="#history">← Back to history</a>
  <div class="empty">
    <div class="empty-icon">!</div>
    <h2>Couldn’t load product details</h2>
    <p>Check your connection and try again.</p>
    <button class="scan-action" id="retry-lookup">Try again</button>
  </div>
`;
