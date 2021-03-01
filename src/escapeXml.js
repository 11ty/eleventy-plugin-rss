const htmlEntities = require('html-entities');

module.exports = function(str) { 
  return htmlEntities.decode(str);
};