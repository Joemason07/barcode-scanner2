export function scan() {
  return `
    <section class="page-intro">
      <div class="eyebrow">
        Ready when you are
      </div>

      <h1>Scan a barcode</h1>

      <p>
        Position the barcode inside the frame.
        We’ll look up the product details.
      </p>
    </section>


    <section class="scanner" id="scanner">
      <div class="scanner-ui"></div>

      <div class="scanner-label" id="scanner-status">
        Opening your camera…
      </div>
    </section>


    <div class="scan-options">

      <button class="option" id="manual">
        <span>⌨</span>
        Enter code manually
      </button>

      <button class="option" id="image">
        <span>▧</span>
        Choose a photo
      </button>

    </div>
  `;
}
