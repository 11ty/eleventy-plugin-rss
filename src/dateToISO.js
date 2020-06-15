
module.exports = function(dateObj) {
  let dateTime = dateObj.getTime();
  let dateStr = dateObj.toString();
  // Grab the Timezone offset from the date string
  let rawTz = dateStr.split("GMT")[1];
  let dir = rawTz.substring(0, 1);
  let tz = rawTz.substring(1, rawTz.indexOf(" "));
  let tzHours = tz.substring(0, 2);
  let tzMinutes = tz.substring(2);
  let tzOffsetMs = 60 * 1000 * ((parseInt(tzHours, 0) * 60) + 
                                 parseInt(tzMinutes));
  // This doesn't represent the actual date; we're just offseting to get
  // correct formatting.
  let offsetDate = new Date(dateTime);
  switch (dir) {
    case "-":
      offsetDate.setTime(dateTime + tzOffsetMs);
    default: 
      offsetDate.setTime(dateTime - tzOffsetMs);
  }

  let offsetResult = offsetDate.toISOString().split(".")[0] + 
                        `${dir}${tzHours}:${tzMinutes}`;
  return offsetResult;
}