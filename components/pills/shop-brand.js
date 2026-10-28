
import { escapeHtml } from '../../utils.js';

const SHOPS = {
  Tesco: {
    colour: '#00539F',
    text: '#FFFFFF',
    logo: 'TESCO',
    image: 'tesco.svg'
  },
  Aldi: {
    colour: '#001E5A',
    text: '#FFFFFF',
    logo: 'ALDI',
    image: 'aldi.svg'
  },
  Lidl: {
    colour: '#0050AA',
    text: '#FFFFFF',
    logo: 'LIDL',
    image: 'lidl.svg'
  },
  "Sainsbury's": {
    colour: '#F06C00',
    text: '#FFFFFF',
    logo: "Sainsbury's",
    image: 'sainsburys.svg'
  },
  Asda: {
    colour: '#78BE20',
    text: '#153B13',
    logo: 'ASDA',
    image: 'asda.svg'
  },
  Morrisons: {
    colour: '#006341',
    text: '#FFFFFF',
    logo: 'MORRISONS',
    image: 'morrisons.svg'
  },
  Waitrose: {
    colour: '#174734',
    text: '#FFFFFF',
    logo: 'WAITROSE',
    image: 'waitrose.svg'
  },
  'Co-op': {
    colour: '#0067A0',
    text: '#FFFFFF',
    logo: 'CO-OP',
    image: 'coop.svg'
  },
  Iceland: {
    colour: '#003DA5',
    text: '#FFFFFF',
    logo: 'ICELAND',
    image: 'iceland.svg'
  },
  Other: {
    colour: '#666666',
    text: '#FFFFFF',
    logo: 'OTHER',
    image: null
  }
};

export function getShopBrand(shop) {
  return SHOPS[shop] || null;
}

export function shopBadge(shop) {
  const brand = getShopBrand(shop);

  if (!brand) return '';

  const logo = brand.image
    ? `
      <img
        class="shop-brand-image"
        src="./assets/stores/${brand.image}"
        alt=""
        loading="lazy"
      />
    `
    : `
      <span class="shop-brand-logo">
        ${escapeHtml(brand.logo)}
      </span>
    `;

  return `
    <span
      class="shop-brand-badge"
      style="--shop-colour:${brand.colour};--shop-text:${brand.text}"
      aria-label="Purchased from ${escapeHtml(shop)}"
    >
      ${logo}
      </span>
    </span>
  `;
}
