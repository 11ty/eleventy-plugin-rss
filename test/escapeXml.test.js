const test = require("ava");
const escapeXml = require("../src/escapeXml.js");

test('parses string correctly', (t) => {
  const str = '&lt;Hey&mdash;there!&gt;'
  const parsedStr = escapeXml(str);
  t.is(parsedStr, '<Hey—there!>');
})
