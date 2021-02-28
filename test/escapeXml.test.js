const test = require("ava");
const escapeXml = require("../src/escapeXml.js");

test('parses string correctly', (t) => {
  const str = '<Hey—there!>';
  const parsedStr = escapeXml(str)
  t.is(parsedStr, '&lt;Hey—there!&gt;')
})
