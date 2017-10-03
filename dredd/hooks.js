var hooks = require('hooks');

hooks.beforeEachValidation(function (transaction) {
  try {
    // attempt to strip charset from content-type headers
    // because dredd is weirdly (and wrongly) specific about this
    update(transaction.real.headers, 'content-type', removeCharset);
  } catch (ex) {
    // if it didn't work, don't worry about it
  }
  hooks.log(require('util').format('%j', transaction.real));
});

function update(obj, key, fn) {
  obj[key] = fn(obj[key]);
}

function removeCharset(header) {
  return header.replace(/; charset=.*$/, '');
}
