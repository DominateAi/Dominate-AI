const redis = require('redis');
const configResolve = require("../common/configResolver");
const redisHost = configResolve.getConfig().redisHost;

const client = redis.createClient({ host: redisHost, port: 6379 });

client.on('connect', function () {
    console.log('Redis client connected');
    client.flushall();
});

client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

module.exports = client;