export const black = '#333';
export const black2 = '#444';
export const black3 = '#666';
export const gray1 = '#AAA';
export const gray2 = '#EEE';
export const gray3 = '#DDD';
export const green = '#7ED321';
export const purple1 = '#3C1053';
export const purple2 = '#5C068C';
export const purple3 = '#8246AF';
export const purple4 = 'rgb(215, 150, 251)';
export const purple5 = 'rgb(234, 199, 253)';
export const overlay = 'rgba(0, 0, 0, .2)';
export const purpleTransparent = 'rgba(130, 70, 175, 0.2)';
export const blackTransparent = 'rgba(0, 0, 0, 0.1)';
export const whiteTransparent = 'rgba(255, 255, 255, 0)';
export const red = '#E82C0C';
export const red2 = '#7F1807';
export const white = 'white';
export const yellow = '#F2B809';

export const labels = {
  DEFAULT: { fg: white, bg: black },
  PENDING: { fg: white, bg: black3 },
  APPROVE: { fg: white, bg: green },
  TRUE: { fg: white, bg: green },
  REVIEW: { fg: white, bg: yellow },
  ESCALATE: { fg: white, bg: purple2 },
  HEADS: { fg: white, bg: gray1 },
  DENY: { fg: white, bg: red },
  FALSE: { fg: white, bg: red },
  ERROR: { fg: white, bg: red2 }
};

export function forLabel(label) {
  return label in labels ? labels[label] : labels.DEFAULT;
}

export default exports;
