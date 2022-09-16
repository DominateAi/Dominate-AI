var configResolve = require("../common/configResolver");
var environmentConfig = configResolve.getConfig();

function crosPermission() {
    this.permission = function (req, res, next) {
        res.header('Access-Control-Allow-Origin', "*");
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, content-type, Accept, workspaceId, Authorization');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        res.setHeader('Access-Control-Allow-Credentials', true);

        if (req.method === "OPTIONS") {
            return res.status(200).end();
        }
        
        next();
    }
}

module.exports = new crosPermission();