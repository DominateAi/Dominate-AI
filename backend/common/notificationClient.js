const io = require('socket.io-client');
const configResolve = require("./configResolver");
const server_url = configResolve.getConfig().server_url;
const systemToken = configResolve.getConfig().systemToken;
var socket;

function initNotificationClient() {

    socket = io.connect(server_url, {
        "transports": ["false", "websocket"],
        "query": {
            "token": systemToken
        }
    });

    socket.on('connect', function () { console.log("server socket client connected..."); });
}

function notifyAll(type, payload, toUserWorkSpaceId) {

    socket.emit("notify_all",
        {
            "notification": payload,
            "workspaceId": toUserWorkSpaceId,
            "notificationType": type
        }
    );
}

function notify(type, payload, toUserWorkSpaceId, toUserId) {

    socket.emit("notify",
        {
            "to": toUserId,
            "notification": payload,
            "workspaceId": toUserWorkSpaceId,
            "notificationType": type
        }
    );
}

module.exports = {
    initNotificationClient: initNotificationClient,
    notifyAll: notifyAll,
    notify: notify
}