var itemModel = require("../models/item.model");
var currentContext = require('../../common/currentContext');
var activityService = require('../services/activity.service');

var itemService = {
    getAllItems: getAllItems,
    getItemById:getItemById,
    addItem: addItem,
    updateItem:updateItem,
    deleteItem:deleteItem,
    getItemByItemName: getItemByItemName,
    getItemsByPage: getItemsByPage,
    getAllItemsCount: getAllItemsCount,
    getItemsByPageWithSort: getItemsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchItems: searchItems,
    importItems: importItems
}

function addItem(itemData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        itemData.createdBy = user.email;
        itemData.lastModifiedBy = user.email;

        itemModel.create(itemData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function updateItem(id, itemData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        itemData.lastModifiedBy = user.email;

        itemModel.updateById(id, itemData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteItem(id) {
    return new Promise((resolve,reject) => {
        itemModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllItems() {
    return new Promise((resolve, reject) => {
        itemModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getItemById(id) {
    return new Promise((resolve,reject) => {
        itemModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getItemByItemName(itemName, tenant){
    return new Promise((resolve,reject) => {
        itemModel.searchOne({'itemName': itemName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllItemsCount() {
    return new Promise((resolve, reject) => {
        itemModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getItemsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        itemModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getItemsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        itemModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        itemModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchItems(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        itemModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function importItems(items) {
    return new Promise((resolve, reject) => {
        let all_promise = [];
        // let duplicateFree = _.uniqBy(contacts, 'email'); 
        // let contactsA = duplicateFree;
        var user = currentContext.getCurrentContext();
       console.log(user);
        items.forEach(item => {
            item['lastModifiedBy'] = user.email
            item['createdBy'] = user.email
        });
        for(i in items){
            all_promise.push( importSingle( items[i]) );
            }
            Promise.all( all_promise ).then((data)=>{resolve(data);})
    })
}

function importSingle(itemData) {
    return new Promise((resolve, reject) => {
       
        itemModel.create(itemData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

module.exports = itemService;

