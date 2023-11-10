var Minio = require("minio");
var configResolve = require("../common/configResolver");
var minioConfig = configResolve.getConfig().minio;
var environmentConfig = configResolve.getConfig();

var minioClient = new Minio.Client({
    endPoint: minioConfig.endPoint,
    port: minioConfig.port,
    useSSL: minioConfig.secure,
    accessKey: minioConfig.accessKey,
    secretKey: minioConfig.secretKey
});

minioClient.bucketExists(environmentConfig.fileServerRootBucket, function(error) {
    if(error) {
        return console.log(error);
    }
});

module.exports.minioClient = minioClient;