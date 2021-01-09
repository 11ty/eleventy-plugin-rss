
module.exports = function(dateObj) {
  let s = dateObj.toISOString();

  // remove milliseconds
  let split = s.split(".");
  split.pop();

  return split.join("") + "Z";
}
