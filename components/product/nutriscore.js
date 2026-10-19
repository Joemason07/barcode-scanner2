
const GRADES = [
  { grade: 'A', label: 'Excellent', colour: '#038141' },
  { grade: 'B', label: 'Good', colour: '#85BB2F' },
  { grade: 'C', label: 'Moderate', colour: '#FECB02' },
  { grade: 'D', label: 'Poor', colour: '#EE8100' },
  { grade: 'E', label: 'Bad', colour: '#E63E11' },
];

const SCORE_MIN = -15;
const SCORE_MAX = 40;

export function nutriScore(product) {
  const grade = String(product?.grade ?? '')
    .trim()
    .toUpperCase();

  // Only display a valid grade supplied by the API.
  if (!GRADES.some((item) => item.grade === grade)) {
    return '';
  }

  // Support common numerical score field names.
  const rawScore =
    product.nutriscoreScore ??
    product.nutriscore_score ??
    product.nutriscoreScoreValue;

  const hasScore =
    rawScore !== null &&
    rawScore !== undefined &&
    String(rawScore).trim() !== '' &&
    Number.isFinite(Number(rawScore));

  const score = hasScore ? Number(rawScore) : null;

  // Map the score to the illustrative scale.
  // These endpoints are not official grade thresholds.
  const scorePosition = hasScore
    ? Math.max(
        0,
        Math.min(
          100,
          ((score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100
        )
      )
    : 0;

  const description = {
    A: 'A more favourable nutritional profile.',
    B: 'A favourable nutritional profile.',
    C: 'A moderate nutritional profile.',
    D: 'A less favourable nutritional profile.',
    E: 'A less favourable nutritional profile.',
  }[grade];

  return `
    <section class="nutriscore-card" aria-label="Nutri-Score">

      <div class="nutriscore-heading">
        <div>
          <span class="nutriscore-eyebrow">
            NUTRITION RATING
          </span>

          <h2>Nutri-Score</h2>
        </div>

        <span class="nutriscore-grade-large nutriscore-grade-${grade.toLowerCase()}">
          ${grade}
        </span>
      </div>

      <p class="nutriscore-description">
        ${description}
      </p>

      <div
        class="nutriscore-scale"
        role="img"
        aria-label="Nutri-Score grades A to E. Product grade: ${grade}"
      >
        ${GRADES.map((item) => `
          <div
            class="nutriscore-grade ${item.grade === grade ? 'is-active' : ''}"
            style="--grade-colour: ${item.colour}"
            ${item.grade === grade ? 'aria-current="true"' : ''}
          >
            <span class="nutriscore-letter">
              ${item.grade}
            </span>

            ${
              item.grade === grade
                ? '<span class="nutriscore-indicator">Your product</span>'
                : ''
            }
          </div>
        `).join('')}
      </div>

      ${
        hasScore
          ? `
            <div class="nutriscore-score">
              <span>Nutri-Score points</span>

              <strong>
                ${score > 0 ? '+' : ''}${score}
              </strong>
            </div>

            <div
              class="nutriscore-points-scale"
              role="img"
              aria-label="Illustrative numerical scale. Product score: ${score} points."
            >
              <div class="nutriscore-points-track">
                <div
                  class="nutriscore-points-marker"
                  style="--score-position: ${scorePosition}%"
                ></div>
              </div>

              <div class="nutriscore-points-labels">
                <span>More favourable</span>
                <span>Less favourable</span>
              </div>

              <div class="nutriscore-points-range">
                <span>${SCORE_MIN}</span>
                <span>0</span>
                <span>+${SCORE_MAX}</span>
              </div>
            </div>
          `
          : ''
      }

      <p class="nutriscore-footnote">
        Nutri-Score summarises nutritional quality. It does not
        represent a complete measure of whether a food is healthy.
        The numerical scale is illustrative, not an official
        universal scoring range.
      </p>

    </section>
  `;
}
