
var dev = require("../config/env/dev.json");
var config = {};

function resvolveConfig(env) {
    return new Promise((resolve,reject) => {
        if(config.server_port != undefined ){
            return config;
        }
            config = dev;
            resolve(config);
    }); 
}

function getConfig(){
    return config;
}

module.exports = {
    resvolveConfig:resvolveConfig,
    getConfig:getConfig
}
