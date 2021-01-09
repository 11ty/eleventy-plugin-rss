const test = require("ava");
const dateToISO = require("../src/dateToISO.js");

test("Test to ISO without millseconds", t => {
  let d = new Date('05 October 2011 14:48 UTC');
  t.is(dateToISO(d), "2011-10-05T14:48:00Z");
});
