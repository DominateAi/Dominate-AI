var subscriptionModel = require("../models/subscription.model");
var currentContext = require('../../common/currentContext');

var subscriptionService = {
    getAllSubscriptions: getAllSubscriptions,
    getSubscriptionById:getSubscriptionById,
    addSubscription: addSubscription,
    updateSubscription:updateSubscription,
    deleteSubscription:deleteSubscription,
    getSubscriptionBySubscriptionName: getSubscriptionBySubscriptionName,
    getSubscriptionsByPage: getSubscriptionsByPage,
    getAllSubscriptionsCount: getAllSubscriptionsCount,
    getSubscriptionsByPageWithSort: getSubscriptionsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments
}

function addSubscription(subscriptionData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        subscriptionData.createdBy = user.email;
        subscriptionData.lastModifiedBy = user.email;
        
        subscriptionModel.create(subscriptionData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}
 
function updateSubscription(id,subscriptionData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        subscriptionData.lastModifiedBy = user.email;
        
        subscriptionModel.updateById(id,subscriptionData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteSubscription(id) {
    return new Promise((resolve,reject) => {
        subscriptionModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllSubscriptions() {
    return new Promise((resolve,reject) => {
        subscriptionModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getSubscriptionById(id) {
    return new Promise((resolve,reject) => {
        subscriptionModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getSubscriptionBySubscriptionName(subscriptionName, tenant){
    return new Promise((resolve,reject) => {
        subscriptionModel.searchOne({'subscriptionName': subscriptionName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllSubscriptionsCount() {
    return new Promise((resolve, reject) => {
        subscriptionModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getSubscriptionsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        subscriptionModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getSubscriptionsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        subscriptionModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        subscriptionModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports = subscriptionService;

