const apis = require('../config/api-config');
const io = apis.socketIO;
const socketClientManager = require('./socketClientManager')();
const jwtTokenParser = require('./tokenParserUtil');
const chatService = require('../api/services/chat.service');
const notificationService = require('../api/services/notification.service');
const socketIORedis = require('socket.io-redis');
const configResolve = require("../common/configResolver");
const redisHost = configResolve.getConfig().redisHost;

function initRealTimeEventManager() {

    io.adapter(socketIORedis({ host: redisHost, port: 6379 }));

//middleware for authenticating users on socket
    io.use(function (socket, next) {
        if (socket.handshake.query && socket.handshake.query.token) {
            const decoded = jwtTokenParser.parseToken(socket.handshake.query.token);
            if (decoded) {
                socket.decoded = decoded;
                next();
            } else {
                next(new Error('Invalid token'));
            }
        } else {
            next(new Error('Authentication error'));
        }
    })
    //when io is connected, this is the io.on method
        .on('connection', function (socket) {

            socketClientManager.addClient(socket);

            socket.on('disconnect', function () {
                socketClientManager.removeClient(socket);
            })
            // this is the regular socket.on function within io.on
            socket.on('send_message', async (data) => {
                try {
                    const destSocketId = await socketClientManager.getUserByIdWithWorkspace(socket.decoded.user.workspaceId, data.to);
                    //this is the guy from whom the message is going.
                    data['from'] = socket.decoded.user._id;
                    //this is the crud part of chatservice, where we store it in database.
                    chatService.addChat(data, socket.decoded.user.workspaceId).then((res) => {
                        //destsocketid is the guy to whom the message will go to
                        if (destSocketId) {
                            io.to(destSocketId).emit('receive_message', data);
                        } else {
                            console.log("failed to send message... User is offline... message saved.");
                        }
                    }).catch((err) => {
                        console.log("failed to save");
                    });
                } catch (err) {
                    console.error(err);
                }
            })
            //function that sends list of online users to the front end
            socket.on('online_users', function () {

                socketClientManager.getAvailableUsers(socket.decoded.user.workspaceId).then(data => {
                    socket.emit('online_users', data);
                }).catch((err) => {
                    console.error("Failed to emit online_users notification.");
                });

            })
            //function for notification
            socket.on('notify', async (data) => {
                try {
                    if (data.to) {
                        let destSocketId;
                        if ((socket.decoded.sub === 'System_Token')) {
                            destSocketId = await socketClientManager.getUserById(data.to);
                        } else {
                            destSocketId = await socketClientManager.getUserByIdWithWorkspace(socket.decoded.user.workspaceId, data.to);
                        }

                        data['from'] = socket.decoded.user._id;
                        notificationService.addNotification(data, data.workspaceId).then((res) => {
                            if (destSocketId) {
                                io.to(destSocketId).emit('notifications', data);
                            } else {
                                console.log("failed to notify... User is offline... notification saved.");
                            }
                        }).catch((err) => {
                            console.log("failed to save");
                        });
                    }
                } catch (err) {
                    console.error("failed to notify");
                }
            })

            socket.on('notify_all', function (data) {
                var targetWorkspaceId;
                if (socket.decoded.sub === 'System_Token') {
                    targetWorkspaceId = data.workspaceId;
                } else {
                    targetWorkspaceId = socket.decoded.user.workspaceId;
                }

                socketClientManager.getAvailableClients(targetWorkspaceId).then(clients => {
                    data['from'] = socket.decoded.user._id;
                    data['to'] = '*';
                    //this is the CRUD function of notification 
                    notificationService.addNotification(data, targetWorkspaceId).then((res) => {
                        clients.forEach(c => io.to(c).emit('notifications', data));
                    }).catch((err) => {
                        console.log("failed to save");
                    });
                }).catch((err) => {
                    console.error("Failed to emit notify_all notification.");
                });
            })
        });
}

module.exports = {
    initRealTimeEventManager: initRealTimeEventManager
}