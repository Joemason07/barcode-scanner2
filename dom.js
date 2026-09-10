// Shared DOM references and small UI helpers used across modules.

export const app = document.querySelector('#app');

// Shows a small floating message near the bottom nav for a couple of seconds.
export function toast(message) {
  document.querySelector('.toast')?.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  document.body.append(el);
  setTimeout(() => el.remove(), 2800);
}
