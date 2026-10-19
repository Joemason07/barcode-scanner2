
import { getProfile } from './profile.js';

export function profilePage() {
  const profile = getProfile();

  const displayName = escapeHTML(
    profile.displayName || 'Your profile'
  );

  const email = escapeHTML(
    profile.email || 'Add your email address'
  );

  const initials = getInitials(profile.displayName);

  return `
    <main class="profile-page">
      <header class="profile-header">
        <p class="eyebrow">YOUR ACCOUNT</p>
        <h1>Profile</h1>
        <p class="profile-subtitle">
          Manage your details and Scanly preferences.
        </p>
      </header>

      <section class="profile-card">
        <div class="profile-identity">
          <div class="profile-avatar">
            ${initials}
          </div>

          <div class="profile-identity-text">
            <h2>${displayName}</h2>
            <p>${email}</p>
          </div>
        </div>

        <button
          class="profile-edit-button"
          type="button"
          data-profile-edit
        >
          Edit profile
        </button>
      </section>

      <section class="profile-section">
        <h2>Your Scanly</h2>

        <a class="profile-link" href="#inventory">
          <span class="profile-link-icon">▦</span>
          <span>
            <strong>My inventory</strong>
            <small>View the products you have in stock</small>
          </span>
          <span class="profile-chevron">›</span>
        </a>

        <a class="profile-link" href="#history">
          <span class="profile-link-icon">↺</span>
          <span>
            <strong>Scan history</strong>
            <small>View your previously scanned products</small>
          </span>
          <span class="profile-chevron">›</span>
        </a>

        <a class="profile-link" href="#analytics">
          <span class="profile-link-icon">▥</span>
          <span>
            <strong>Nutrition analytics</strong>
            <small>Explore nutrition from your inventory</small>
          </span>
          <span class="profile-chevron">›</span>
        </a>
      </section>

      <section class="profile-section">
        <h2>Preferences</h2>

        <div class="profile-preference">
          <div>
            <strong>Nutrition display</strong>
            <small>Choose your preferred nutrition view</small>
          </div>

          <select data-profile-nutrition>
            <option value="per100g"
              ${profile.preferences.nutritionUnit === 'per100g' ? 'selected' : ''}>
              Per 100 g
            </option>
            <option value="wholeInventory"
              ${profile.preferences.nutritionUnit === 'wholeInventory' ? 'selected' : ''}>
              Whole inventory
            </option>
          </select>
        </div>
      </section>

      <p class="profile-local-note">
        Your profile is currently stored on this device.
      </p>

      <dialog class="profile-dialog" data-profile-dialog>
        <form data-profile-form>
          <div class="profile-dialog-header">
            <div>
              <p class="eyebrow">YOUR DETAILS</p>
              <h2>Edit profile</h2>
            </div>

            <button
              type="button"
              class="profile-close-button"
              data-profile-close
              aria-label="Close"
            >×</button>
          </div>

          <label for="profile-name">Display name</label>
          <input
            id="profile-name"
            name="displayName"
            type="text"
            maxlength="60"
            value="${escapeAttribute(profile.displayName)}"
            placeholder="Enter your name"
          />

          <label for="profile-email">Email address</label>
          <input
            id="profile-email"
            name="email"
            type="email"
            maxlength="254"
            value="${escapeAttribute(profile.email)}"
            placeholder="you@example.com"
          />

          <div class="profile-dialog-actions">
            <button type="button" data-profile-close>
              Cancel
            </button>

            <button type="submit" class="profile-save-button">
              Save changes
            </button>
          </div>
        </form>
      </dialog>
    </main>
  `;
}

function getInitials(name = '') {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (!words.length) return 'S';

  return words
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();
}

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function escapeAttribute(value = '') {
  return escapeHTML(value);
}
