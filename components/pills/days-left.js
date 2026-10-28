
import { escapeHtml } from '../../utils.js';
import { getBestBeforeStatus } from '../../state.js';

const statusLabels = {
  expired: 'Past date',
  soon: 'Expires soon',
  fresh: 'In date',
  unknown: 'No date set'
};

export function expiryStatusPill(bestBeforeDate, code = '') {
  const status = getBestBeforeStatus(bestBeforeDate);

  return `
    <span
      class="expiry-status expiry-status--${escapeHtml(status)}"
      ${code ? `data-expiry-status="${escapeHtml(code)}"` : ''}
      aria-live="polite"
    >
      ${escapeHtml(statusLabels[status] || statusLabels.unknown)}
    </span>
  `;
}

export function daysLeftPill(bestBeforeDate, code = '') {
  if (!bestBeforeDate) {
    return '';
  }

  const daysRemaining = Math.round(
    (
      new Date(`${bestBeforeDate}T00:00:00`).getTime() -
      new Date().setHours(0, 0, 0, 0)
    ) / (24 * 60 * 60 * 1000)
  );

  const daysLabel = daysRemaining < 0
    ? `${Math.abs(daysRemaining)} ${
        Math.abs(daysRemaining) === 1 ? 'day' : 'days'
      } overdue`
    : daysRemaining === 0
      ? 'Today'
      : `${daysRemaining} ${
          daysRemaining === 1 ? 'day' : 'days'
        } left`;

  const status = getBestBeforeStatus(bestBeforeDate);

  return `
    <span
      class="expiry-days-pill expiry-days-pill--${escapeHtml(status)}"
      ${code ? `data-expiry-days="${escapeHtml(code)}"` : ''}
      aria-label="${escapeHtml(daysLabel)}"
    >
      ${escapeHtml(daysLabel)}
    </span>
  `;
}
