const test = require("ava");
const dateRfc822 = require("../src/dateRfc822.js");

test('parses date correctly', (t) => {
  const date = new Date(2015, 9, 21, 7, 28, 2, 450);
  const parsedDate = dateRfc822(date);
  t.is(parsedDate, 'Wed, 21 Oct 2015 07:28:02 +0000');
});