// Node 20 undici/jsdom WebIDL compatibility preload (CommonJS)
const fs = require('node:fs');
const path = require('node:path');

// Automatically patch undici's cachestorage.js to comment out markAsUncloneable call if present
try {
  const csPath = path.join(__dirname, '../node_modules/undici/lib/web/cache/cachestorage.js');
  if (fs.existsSync(csPath)) {
    let content = fs.readFileSync(csPath, 'utf8');
    if (content.includes('webidl.util.markAsUncloneable')) {
      content = content.replace('webidl.util.markAsUncloneable(this)', '// webidl.util.markAsUncloneable(this)');
      fs.writeFileSync(csPath, content, 'utf8');
    }
  }
} catch (e) {}

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
