// Barcode scanner page.
//
// Displays the camera scanner and alternative
// ways to enter a barcode.

export function scan() {
  return `
    <section class="page scan-page">

      <div class="page-header">

        <p class="eyebrow">
          Ready when you are
        </p>

        <h1>
          Scan a barcode
        </h1>

        <p>
          Position the barcode inside the frame.
          We'll look up the product details.
        </p>

      </div>

      <section
        class="scanner"
        id="scanner"
      >
        <div class="scanner-ui"></div>

        <div
          class="scanner-label"
          id="scanner-status"
        >
          Opening your camera…
        </div>
      </section>

      <div class="scan-options">

        <button
          class="option"
          id="manual"
          type="button"
        >
          <span aria-hidden="true">⌨</span>
          Enter code manually
        </button>

        <button
          class="option"
          id="image"
          type="button"
        >
          <span aria-hidden="true">▧</span>
          Choose a photo
        </button>

      </div>

    </section>
  `;
}