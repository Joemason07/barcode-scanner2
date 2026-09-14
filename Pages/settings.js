export function settings() {
  return `
    <section class="page-intro">
      <div class="eyebrow">
        Make it yours
      </div>

      <h1>Settings</h1>

      <p>
        Control how Scanly works for you.
      </p>
    </section>


    <div class="settings-list">

      <div class="setting">

        <div>
          <b>Haptic feedback</b>
          <small>
            Vibrate after a successful scan
          </small>
        </div>

        <button
          class="toggle on"
          aria-label="Toggle haptic feedback"
        >
          <i></i>
        </button>

      </div>


      <div class="setting">

        <div>
          <b>Save scan history</b>
          <small>
            Keep your recent scans on this device
          </small>
        </div>

        <button
          class="toggle on"
          aria-label="Toggle history saving"
        >
          <i></i>
        </button>

      </div>


      <div class="setting">

        <div>
          <b>Dark appearance</b>
          <small>
            Use the darker Scanly theme
          </small>
        </div>

        <button
          class="toggle"
          id="dark-toggle"
          aria-label="Toggle dark appearance"
        >
          <i></i>
        </button>

      </div>

    </div>
  `;
}