// Node 20 undici/jsdom WebIDL compatibility preload via Module._load hook (CommonJS)
const Module = require('node:module');
const originalLoad = Module._load;

Module._load = function (request, parent, isMain) {
  const exports = originalLoad.apply(this, arguments);
  try {
    if (exports && (typeof exports === 'object' || typeof exports === 'function')) {
      if (!exports.util) {
        exports.util = {};
      }
      if (typeof exports.util.markAsUncloneable !== 'function') {
        exports.util.markAsUncloneable = (v) => v;
      }
    }
  } catch (e) {}
  return exports;
};
