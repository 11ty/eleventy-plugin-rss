module.exports = function pubDateRFC822(value) {
  const date = new Date(value);
  const options = {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',

    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,

    timeZoneName: 'short',
  };

  const formatedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  const [wkd, mmm, dd, yyyy, time, z] = formatedDate.replace(/([,\s+\-]+)/g, ' ').split(' ');
  const tz = `${z}`.replace(/UTC/, 'GMT');

  return `${wkd}, ${dd} ${mmm} ${yyyy} ${time} ${tz}`;
}
