const pad = require("./padDate");

const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const shortMonthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

/**
 * Given a Date object returns decomposed values
 * @param {Date} date
 * @returns {Object}
 */
module.exports = function(date) {
  const day = pad(date.getDate(), 2);

  const dayName = shortDayNames[date.getDay()];
  const month = pad(date.getMonth() + 1, 2);
  const monthName = shortMonthNames[date.getMonth()];
  const year = date.getFullYear();

  const hours = pad(date.getHours(), 2);
  const minutes = pad(date.getMinutes(), 2);
  const seconds = pad(date.getSeconds(), 2);

  return {
    day,
    dayName,
    month,
    monthName,
    year,
    hours,
    minutes,
    seconds
  };
};