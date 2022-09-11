var configResolve = require("./configResolver");
var config = configResolve.getConfig();
 

var helper = {
  resolveImagePath: resolveImagePath,
  getPathFromImage: getPathFromImage,
  randomString: randomString
}

function resolveImagePath(path, workspaceId){
  if(path == undefined){
    return path;
  }else{
    return config.protocol + workspaceId + "." + config.server_domain + path;
  }
}

function getPathFromImage(imageUrl, workspaceId){
    let host = config.protocol + workspaceId + "." + config.server_domain;
    if(imageUrl.includes(host)){
      return imageUrl.split(host)[1];
    }else if ( imageUrl.includes(config.server_url)){
      return imageUrl.split(config.server_url)[1];
    }else{
      return imageUrl;
    }
    
}

function randomString(length) {
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}


module.exports = helper;