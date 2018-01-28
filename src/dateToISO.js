const { DateTime } = require("luxon");

module.exports = function(dateObj) {
  return DateTime.fromJSDate(dateObj).toISO({ includeOffset: true, suppressMilliseconds: true });
}