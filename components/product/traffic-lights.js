// Nutrition traffic lights.
//
// Converts per-100g nutrition values into UK-style
// green, amber, or red traffic-light indicators.


// --------------------------------------------------
// Individual traffic light
// --------------------------------------------------

function trafficLight(
  name,
  value,
  low,
  medium
) {
  const amount = Number(value);

  const level =
    !Number.isFinite(amount)
      ? 'unknown'
      : amount <= low
        ? 'green'
        : amount <= medium
          ? 'amber'
          : 'red';

  const display =
    Number.isFinite(amount)
      ? `${amount
          .toFixed(amount < 1 ? 2 : 1)
          .replace(/\.0$/, '')}g`
      : '—';

  return `
    <div
      class="traffic-light ${level}"
      aria-label="${name}: ${display} per 100 grams, ${level}"
    >

      <span
        class="traffic-dot"
        aria-hidden="true"
      ></span>

      <b>
        ${name}
      </b>

      <strong>
        ${display}
      </strong>

      <small>
        per 100g
      </small>

    </div>
  `;
}


// --------------------------------------------------
// Traffic lights
// --------------------------------------------------

export function trafficLights(values = {}) {
  return `
    <section class="traffic-section">

      <div class="section-head">

        <h2>
          Traffic lights
        </h2>

        <span class="per-100">
          Per 100g
        </span>

      </div>


      <div class="traffic-lights">

        ${trafficLight(
          'Fat',
          values.fat,
          3,
          17.5
        )}

        ${trafficLight(
          'Saturates',
          values.saturates,
          1.5,
          5
        )}

        ${trafficLight(
          'Sugars',
          values.sugars,
          5,
          22.5
        )}

        ${trafficLight(
          'Salt',
          values.salt,
          0.3,
          1.5
        )}

      </div>

    </section>
  `;
}