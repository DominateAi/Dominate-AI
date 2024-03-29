const redis = require('redis');
const client = redis.createClient({
  host: 'redis',
  port: 6379
});
client.on('connect', function () {
  console.log('Redis client connected');
  client.flushall();
});
client.on('error', function (err) {
  console.log('Something went wrong ' + err);
});
module.exports = client;