/** @flow */

export function dateOrNull(dStr: ?string): ?Date {
  if (dStr) {
    const dObj = new Date(dStr);
    return Number.isFinite(dObj.getTime()) ? dObj : null;
  } else {
    return null;
  }
}
