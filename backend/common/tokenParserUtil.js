const jwt = require('jsonwebtoken');
var configResolve = require("./configResolver");
var server_secert = configResolve.getConfig().server_secert;


var tokenPareUtil = {
  parseToken: parseToken
}

function parseToken(token){
  try {
    var decoded = jwt.verify(token, server_secert);
    return decoded;
  } catch(err) {
    console.log("Error while decoding token");
  }
}


module.exports = tokenPareUtil;