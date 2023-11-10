var client = require('../config/redis');

var redisService = {
    getItem: getItem,
    saveItem: saveItem,
    deleteItem: deleteItem,
    sAdd: sAdd,
    sRem: sRem,
    getAllItem, getAllItem
}

function getItem(key) {
    return new Promise((resolve, reject) => {
        client.get(key, function (error, result) {
            if (error) {
                console.log(error);
                reject(error);
            }
            resolve(result);
        });
    })
}

function getAllItem(key) {
    return new Promise((resolve, reject) => {
        client.smembers(key, (error, result) => {
            if (error) {
                console.log(error);
                reject(error);
            }
            resolve(result);
        });
    })

}


function saveItem(key, item) {
    client.set(key, item, client.print);
}

function deleteItem(key) {
    client.del(key);
}

async function sAdd(key, item) {
    try {
        await client.sadd(key, item);
    } catch (error) {
        console.error(error);
    }

}

async function sRem(key, item) {
    try {
        await client.srem(key, item);
    } catch (error) {
        console.error(error);
    }
}

module.exports = redisService;