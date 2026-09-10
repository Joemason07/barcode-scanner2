// Entry point: hash-based router + event binding. This is the file
// index.html loads (as a module) — it pulls everything else together.

import { app, toast } from './dom.js';
import { scans, clearHistory } from './state.js';
import { home, scan, history as historyPage, settings, loadingItem } from './templates.js';
import { lookupProduct } from './api.js';
import { startCamera, stopCamera } from './camera.js';

// Reads the current URL hash, e.g. "#item/5000112548167", and:
//  - stops any active camera stream from the previous page
//  - picks the matching page template
//  - swaps it into #app
//  - highlights the matching bottom-nav icon
//  - calls bindPage() to wire up that page's buttons
function render() {
  stopCamera();

  const route = location.hash.slice(1) || 'home';
  const [page, rawId] = route.split('/');
  const id = decodeURIComponent(rawId || '');

  app.innerHTML =
    page === 'scan' ? scan() :
    page === 'history' ? historyPage() :
    page === 'settings' ? settings() :
    page === 'item' ? loadingItem(id) :
    home();

  document.querySelectorAll('[data-nav]').forEach(link =>
    link.classList.toggle('active', link.dataset.nav === page)
  );

  app.focus();
  bindPage(page, id);
}

// Wires up interactive elements for whichever page was just rendered.
// Called at the end of every render().
function bindPage(page, id) {
  // Every toggle switch on the Settings page just flips its own "on" class.
  document.querySelectorAll('.toggle').forEach(button =>
    button.onclick = () => button.classList.toggle('on')
  );

  if (page === 'item') lookupProduct(id);

  if (page === 'scan') {
    startCamera();

    document.querySelector('#manual').onclick = () => {
      const code = prompt('Enter the barcode number');
      if (code?.trim()) location.hash = `item/${encodeURIComponent(code.trim())}`;
    };

    document.querySelector('#image').onclick = () =>
      toast('Photo scanning can be connected here next.');
  }

  document.querySelector('#clear-history')?.addEventListener('click', () => {
    clearHistory();
    render();
  });
}

document.querySelector('#theme-toggle').onclick = () =>
  document.body.classList.toggle('dark');

window.addEventListener('hashchange', render);
render();
