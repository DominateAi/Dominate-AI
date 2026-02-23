
var dev = require("../config/env/dev.json");
var config = {};

function resvolveConfig(env) {
    return new Promise((resolve,reject) => {
        if(config.server_port != undefined ){
            return config;
        }
            config = dev;
            // Allow environment variables to override critical config values
            if (process.env.MONGO_DATABASE) config.master_schema = process.env.MONGO_DATABASE;
            if (process.env.REDIS_HOST) config.redisHost = process.env.REDIS_HOST;
            if (process.env.MINIO_ENDPOINT) config.minio = Object.assign({}, config.minio, { endPoint: process.env.MINIO_ENDPOINT });
            if (process.env.BACKEND_URL) config.server_url = process.env.BACKEND_URL;
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
