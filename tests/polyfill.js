// Node 20 undici/jsdom WebIDL compatibility preload
try {
  const webidl = require('webidl-conversions');
  if (webidl) {
    if (!webidl.util) webidl.util = {};
    if (!webidl.util.markAsUncloneable) {
      webidl.util.markAsUncloneable = (v) => v;
    }
  }
} catch (e) {
  // Ignore if module not present yet during install
}
