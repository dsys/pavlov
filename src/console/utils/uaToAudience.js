export default function uaToAudience(ua) {
  return `${ua.browser.name} v${ua.browser.version} on ${ua.os.name} v${ua.os
    .version}`;
}
