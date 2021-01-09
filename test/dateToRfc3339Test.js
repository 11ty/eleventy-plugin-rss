const test = require("ava");
const dateRfc3339 = require("../src/dateRfc3339.js");

test("Test to ISO without millseconds", t => {
  let d = new Date('05 October 2011 14:48 UTC');
  t.is(dateRfc3339(d), "2011-10-05T14:48:00Z");
});
