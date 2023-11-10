var chatModel = require("../models/chat.model");
var currentContext = require('../../common/currentContext');
var userService = require('./user.service');
var Status = require('../../common/constants/Status');


var chatService = {
    getAllChats: getAllChats,
    getChatById: getChatById,
    addChat: addChat,
    updateChat: updateChat,
    deleteChat: deleteChat,
    getChatByChatName: getChatByChatName,
    getChatsByPage: getChatsByPage,
    getAllChatsCount: getAllChatsCount,
    getChatsByPageWithSort: getChatsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchChats: searchChats,
    getChatByName: getChatByName,
    getAllUsersForChats:getAllUsersForChats,
    readAllChats:readAllChats,
    textSearch: textSearch
}

function addChat(ChatData, workspaceId) {
    return new Promise((resolve, reject) => {
        ChatData.isRead = false
        chatModel.create(ChatData, workspaceId).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
}

function updateChat(id, ChatData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        ChatData.lastModifiedBy = user.email;

        chatModel.updateById(id, ChatData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteChat(id) {
    return new Promise((resolve, reject) => {
        chatModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllChats() {
    return new Promise((resolve, reject) => {
        chatModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getChatById(id) {
    return new Promise((resolve, reject) => {
        chatModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getChatByChatName(ChatName, tenant) {
    return new Promise((resolve, reject) => {
        chatModel.searchOne({ 'ChatName': ChatName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllChatsCount() {
    return new Promise((resolve, reject) => {
        chatModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getChatsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        chatModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getChatsByPageWithSort(pageNo, pageSize, sortBy, toId) {

    var user = currentContext.getCurrentContext();

    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = -1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    const query = {
        "$or": [
            {
                "$and": [
                    {
                        "to": {
                            "$eq": toId
                        }
                    }, {
                        "from": {
                            "$eq": user.userId
                        }
                    }

                ]
            },
            {
                "$and": [
                    {
                        "to": {
                            "$eq": user.userId
                        }
                    }, {
                        "from": {
                            "$eq": toId
                        }
                    }

                ]
            }
        ]
    };
    /*     query.to = toId;
        query.from = user.userId; */

    return new Promise((resolve, reject) => {
        chatModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        chatModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchChats(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        chatModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getChatByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve, reject) => {
        chatModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllUsersForChats(){
    let payload = {
        "pageNo":1,
        "pageSize":100000,
        "query":{
            "status":Status.ACTIVE
        }
    }
    return new Promise( async ( resolve, reject ) => {
        try{
            let all_users = await userService.searchUsers(payload);
            var loggedUser = currentContext.getCurrentContext();
            let all_promise = [];
            all_users.forEach( user => {
             let query = {
                 "isRead":false,
                 "from":user._id,
                 "to":loggedUser.userId
            }
             all_promise.push( chatModel.search(query) );
            });
            Promise.all( all_promise ).then( data => {
                let results = JSON.parse(JSON.stringify(all_users));
                let i = 0;
                while( i < results.length ){
                    results[i].chats = data[i];
                    results[i].role = { _id : results[i].role._id , name: results[i].role.name }
                    i++;
                }
                resolve(results);
            } ).catch( err => reject( err ) )
        } catch ( err ) {
            reject( err );
        }
    });
}

function readAllChats( id ){
    return new Promise( async (resolve, reject ) => {
        try{
            var user = currentContext.getCurrentContext();
            let all_unread_chats = await chatModel.search({ from : id , to : user.Id, isRead : false });
            let all_promise = [];
            all_unread_chats.forEach( chat => {
                all_promise.push( chatModel.updateById( chat._id , { isRead:true } ) ); 
            })
            Promise.all( all_promise ).then( data => {
                resolve( data )
            } ).catch ( err  => reject(err));
        } catch ( err ){
            reject( err );
        }
    });
}
function textSearch(text) {
    return new Promise((resolve, reject) => {
        chatModel.getTextSearchResult(text).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports = chatService;

