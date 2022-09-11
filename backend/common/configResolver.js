var prod = require("../config/env/production.json");
var dev = require("../config/env/dev.json");
var qa = require("../config/env/qa.json");
var config = {};

function resvolveConfig(env) {
    return new Promise((resolve,reject) => {
        if(config.server_port != undefined ){
            return config;
        }
        if(env == 'production'){
            config = prod;
            resolve(config);
        }else if(env == 'qa'){
            config = qa;
            resolve(config);
        }else if(env == 'dev'){
            config = dev;
            resolve(config);
        }
    }); 
}

function getConfig(){
    return config;
}

module.exports = {
    resvolveConfig:resvolveConfig,
    getConfig:getConfig
}
