const test = require("ava");
const dateRfc822 = require("../src/dateRfc822.js");

// RFC-822 date format
// <pubDate>Wed, 02 Oct 2002 08:00:00 EST</pubDate>

test('parses date correctly (specified date)', (t) => {
  const date = new Date(2015, 9, 21, 7, 28, 2, 450);
  const parsedDate = dateRfc822(date);
  t.true(parsedDate.startsWith('Wed, 21 Oct 2015 07:28:02'));
});

test('formats midnight correctly', (t) => {
  const date = new Date(2015, 9, 21, 0, 0, 0, 0);
  const parsedDate = dateRfc822(date);
  t.regex(parsedDate, /^Wed, 21 Oct 2015 00:00:00/);
});

test('formats numerical time zones correctly', (t) => {
  const date = new Date("2025-05-24T01:00:00+11:00");
  const parsedDate = dateRfc822(date, "America/New_York"); // Bit of a hack to force a specific timezone (default is system time zone)
  t.regex(parsedDate, / \-0400$/);
})

test('parses dates correctly (open-ended)', (t) => {
  const d = new Date();
  const pubDate = dateRfc822(d);

  const rfc822_date = /^([MTWFS][\w]{2},) (\d{2}) ([JFMASOND][a-z]{2}) (\d{4})/;
  const rfc822_time = /( \d{2}:\d{2}:\d{2} )/;
  const rfc822_zone = /([A-Z]{2,3}|(\+|\-)\d{4})$/;

  t.regex(pubDate, rfc822_date); // Tue, 04 Jun 2024
  t.regex(pubDate, rfc822_time); // 04:02:01
  t.regex(pubDate, rfc822_zone); // GMT or ±1000 (depends where test runs)
});
