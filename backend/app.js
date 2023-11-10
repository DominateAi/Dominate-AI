const args = require('yargs').argv;
var configResolve = require("./common/configResolver");
console.log("program argument:" + args.production); 
global.__basedir = __dirname;



configResolve.resvolveConfig(args.env).then((config)=>{
    const PORT = config.server_port;
    const apis = require("./config/api-config");
    var routerConfig = require('./config/router-config');
    const realTimeEventManager = require('./common/realTimeEventManager');
    const notificationClient = require('./common/notificationClient');
    
    apis.httpServer.listen(PORT, '0.0.0.0', async function() {
        console.log("server connected to port " + PORT);
        await realTimeEventManager.initRealTimeEventManager();
        console.log("initRealTimeEventManager is UP");
        await notificationClient.initNotificationClient();
        console.log("socketClient is UP");
    });
})

