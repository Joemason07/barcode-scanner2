
 // Barcode scanner page.
 //
 // Displays the camera scanner and alternative
 // ways to find a product.

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

      <div class="scan-divider">
        <span>OR FIND A PRODUCT</span>
      </div>

      <section class="product-search">

        <label for="product-search-input">
          Search by product name
        </label>

        <form id="product-search-form">

          <div class="product-search-field">

            <span aria-hidden="true">⌕</span>

            <input
              id="product-search-input"
              type="search"
              placeholder="e.g. Tesco chicken breast"
              autocomplete="off"
              required
            />

            <button
              type="submit"
              id="product-search-submit"
            >
              Search
            </button>

          </div>

        </form>

        <p class="product-search-hint">
          Find a product without scanning its barcode.
        </p>

        <div
          id="product-search-results"
          aria-live="polite"
        ></div>

      </section>

    </section>
  `;
}
