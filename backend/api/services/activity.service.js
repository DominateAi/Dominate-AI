var activityModel = require("../models/activity.model");
var currentContext = require('../../common/currentContext');

var activityService = {
    getAllActivities: getAllActivities,
    getActivityById:getActivityById,
    addActivity: addActivity,
    updateActivity:updateActivity,
    deleteActivity:deleteActivity,
    getActivityByActivityName: getActivityByActivityName,
    getActivitiesByPage: getActivitiesByPage,
    getAllActivitiesCount: getAllActivitiesCount,
    getActivitiesByPageWithSort: getActivitiesByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchActivities: searchActivities
}

function addActivity(activityData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        activityData.createdBy = user.email;
        activityData.lastModifiedBy = user.email;
        activityData.user = user.userId;
        
        activityModel.create(activityData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updateActivity(id,activityData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        activityData.lastModifiedBy = user.email;
        
        activityModel.updateById(id,activityData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteActivity(id) {
    return new Promise((resolve,reject) => {
        activityModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllActivities(entityId, entityType) {
    return new Promise((resolve,reject) => {
        activityModel.search({
            $and: [ { 'entityId':  entityId }, {'entityType': entityType } ]
        }).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getActivityById(id) {
    return new Promise((resolve,reject) => {
        activityModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getActivityByActivityName(activityName, tenant){
    return new Promise((resolve,reject) => {
        activityModel.searchOne({'activityName': activityName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllActivitiesCount() {
    return new Promise((resolve, reject) => {
        activityModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getActivitiesByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        activityModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getActivitiesByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        activityModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        activityModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchActivities(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        activityModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


module.exports = activityService;

