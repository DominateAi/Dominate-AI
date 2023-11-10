const redisUtil = require("./redisUtils");

module.exports = function () {

    function addClient(client) {
        redisUtil.saveItem(client.decoded.user._id, client.id);
        redisUtil.sAdd(client.decoded.user.workspaceId, client.decoded.user._id);
    }

    function removeClient(client) {
        redisUtil.deleteItem(client.decoded.user._id);
        redisUtil.sRem(client.decoded.user.workspaceId, client.decoded.user._id);
    }

    async function getAvailableUsers(workspaceId) {
        const data = await redisUtil.getAllItem(workspaceId);
        return data;
    }

    async function getAvailableClients(workspaceId) {
        const data = await redisUtil.getAllItem(workspaceId);

        let clients = [];

        for (clientId of data) {
            const result = await getUserByIdWithWorkspace(workspaceId, clientId);
            clients.push(result);
        }

        return clients;
    }

    function getUserByIdWithWorkspace(workspaceId, id) {
        return new Promise(async (resolve, reject) => {
            const data = await redisUtil.getAllItem(workspaceId);

            if (data.includes(id)) {

                redisUtil.getItem(id).then((data) => {
                    resolve(data);
                }, (error) => {
                    console.error("error");
                    reject(error);
                });
            } else {
                reject("CROSS Workspace");
            }
        })
    }

    function getUserById(id) {
        return new Promise((resolve, reject) => {
            redisUtil.getItem(id).then((data) => {
                resolve(data);
            }, (error) => {
                console.error("error");
                reject(error);
            });
        })
    }

    return {
        addClient,
        removeClient,
        getAvailableUsers,
        getUserByIdWithWorkspace: getUserByIdWithWorkspace,
        getUserById: getUserById,
        getAvailableClients
    }
}