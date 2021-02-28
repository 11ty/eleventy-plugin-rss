const htmlEntities = require('html-entities');

module.exports = function(str) { 
  return htmlEntities.encode(str, {level: 'xml'});
};