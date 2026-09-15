// Settings page.
//
// Displays Scanly's user preferences.

export function settings() {
  return `
    <section class="page settings-page">

      <div class="page-header">

        <p class="eyebrow">
          Make it yours
        </p>

        <h1>
          Settings
        </h1>

        <p>
          Control how Scanly works for you.
        </p>

      </div>


      <div class="settings-list">

        <!-- Haptic feedback -->

        <div class="setting">

          <div>
            <b>
              Haptic feedback
            </b>

            <small>
              Vibrate after a successful scan
            </small>
          </div>

          <button
            class="toggle on"
            type="button"
            aria-label="Toggle haptic feedback"
          >
            <i></i>
          </button>

        </div>


        <!-- Save history -->

        <div class="setting">

          <div>
            <b>
              Save scan history
            </b>

            <small>
              Keep your recent scans on this device
            </small>
          </div>

          <button
            class="toggle on"
            type="button"
            aria-label="Toggle history saving"
          >
            <i></i>
          </button>

        </div>


        <!-- Dark appearance -->

        <div class="setting">

          <div>
            <b>
              Dark appearance
            </b>

            <small>
              Use the darker Scanly theme
            </small>
          </div>

          <button
            class="toggle"
            id="dark-toggle"
            type="button"
            aria-label="Toggle dark appearance"
          >
            <i></i>
          </button>

        </div>

      </div>

    </section>
  `;
}