var followupModel = require("../models/followup.model");
var leadModel = require("../models/lead.model");
var dealModel = require("../models/deal.model");
var currentContext = require('../../common/currentContext');
const Status = require('../../common/constants/Status');
var activityService = require('../services/activity.service');
var wactService = require("./workactivity.service");
const notificationClient = require('../../common/notificationClient');
const NotificationType = require('../../common/constants/NotificationType');

var followupService = {
    getAllFollowups: getAllFollowups,
    getFollowupById: getFollowupById,
    addFollowup: addFollowup,
    updateFollowup: updateFollowup,
    deleteFollowup: deleteFollowup,
    getFollowupByFollowupName: getFollowupByFollowupName,
    getFollowupsByPage: getFollowupsByPage,
    getAllFollowupsCount: getAllFollowupsCount,
    getFollowupsByPageWithSort: getFollowupsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchFollowups: searchFollowups,
    getFollowupByName: getFollowupByName,
    getAllFollowUpsByDate: getAllFollowUpsByDate,
    getAllFollowUpsByDateAndUser : getAllFollowUpsByDateAndUser,
    commOverview: commOverview,
    commOverviewChart:commOverviewChart,
    portfolioCount: portfolioCount,
    followupCount: followupCount
}

function addFollowup(followupData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        followupData.createdBy = user.email;
        followupData.lastModifiedBy = user.email;
        followupData.organizer = user.userId;
        followupData.followupAtDate = new Date(followupData.followupAtDate).toDateString();
        if(followupData.entityType == undefined){
            followupData.entityType = 'LEAD'
        }
        if(followupData.entityId == undefined){
            followupData.entityId = followupData.assigned
        }

        followupModel.create(followupData).then((data) => {
            var entityType;
            
            var activity = {
                'entityType': followupData.entityType,
                'entityId': followupData.entityId,
                'data': followupData,
                'activityType': 'FOLLOWUP_CREATED'
            }
            notificationClient.notify(NotificationType.FOLLOWUP_ADDED, activity, user.workspaceId, followupData.entityId);
            activityService.addActivity(activity).then((adata) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        })
    })

}

function updateFollowup(id, followupData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        followupData.lastModifiedBy = user.email;
        followupData.organizer = user.userId;
        followupData.followupAtDate = new Date(followupData.followupAtDate).toDateString();
        followupModel.getById(id).then((prevData)=>{
        followupModel.updateById(id, followupData).then((data) => {
            var activity = {
                'entityType': followupData.entityType,
                'entityId': followupData.entityId,
                'data': followupData,
                'activityType': 'FOLLOWUP_UPDATED'
            }
            notificationClient.notify(NotificationType.FOLLOWUP_UPDATED, activity, user.workspaceId, followupData.entityId);
            activityService.addActivity(activity).then((adata) => {
                if(followupData.status == "COMPLETED"){ wactService.addWact(followupData, "FOLLOWUP", "UPDATE", prevData).then((dataA)=>{resolve(data);}).catch((err) => {
                    reject(err);
                });    }else{resolve(data)}
           
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        }) }).catch((err) => {
            reject(err);
        })
    })

}

function deleteFollowup(id) {
    return new Promise((resolve, reject) => {
        followupModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllFollowups(entityId, entityType) {
    return new Promise((resolve, reject) => {
        followupModel.search({
            'entityId': entityId,
            'entityType': entityType
        }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFollowupById(id) {
    return new Promise((resolve, reject) => {
        followupModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFollowupByFollowupName(followupName, tenant) {
    return new Promise((resolve, reject) => {
        followupModel.searchOne({ 'followupName': followupName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllFollowupsCount() {
    return new Promise((resolve, reject) => {
        followupModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFollowupsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        followupModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFollowupsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        followupModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        followupModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchFollowups(searchCriteria) {
    return new Promise((resolve, reject) => {
            followupModel.search(searchCriteria).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFollowupByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve, reject) => {
        followupModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getAllFollowUpsByDate(date) {
    var user = currentContext.getCurrentContext();

    var query = {
        "$and": [
            {
                "followupAtDate": {
                    "$eq": new Date(date).toDateString()
                }
            }, {
                "createdBy": {
                    "$eq": user.email
                }
            }
        ]
    };


    return new Promise((resolve, reject) => {
        followupModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllFollowUpsByDateAndUser( date, isOrganisation ) {
    var user = currentContext.getCurrentContext();
    var query = { "$and": [
            { "followupAtDate": { "$eq": new Date(date).toDateString() } }, 
            { "createdBy": { "$eq": user.email } }
        ]};
    if( isOrganisation ){
        query = { "followupAtDate": { "$eq": new Date(date).toDateString() } }
    }

    return new Promise((resolve, reject) => {
        followupModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function commOverview(user, startDate, endDate) {
    return new Promise(async (resolve, reject) => {
        try{
        let call = await followupModel.countDocuments({
            "organizer": user,
            "type":"CALL",
            "followupAtDate":{$gt:new Date(startDate), $lt: new Date(endDate)}
        })

        let whatsapp = await followupModel.countDocuments({
            "organizer": user,
            "type":"WHATSAPP",
            "followupAtDate":{$gt:new Date(startDate), $lt: new Date(endDate)}
        })

        let sms =  await followupModel.countDocuments({
            "organizer": user,
            "type":"SMS",
            "followupAtDate":{$gt:new Date(startDate), $lt: new Date(endDate)}
        })

        let email = await followupModel.countDocuments({
            "organizer": user,
            "type":"EMAIL",
            "followupAtDate":{$gt:new Date(startDate), $lt: new Date(endDate)}
        })

        let result ={
            "call": call,
            "whatsapp":whatsapp,
            "sms":sms,
            "email":email
        }

        resolve (result)
        }catch(err){reject(err)} 
    });
}

function commOverviewChart(user, startDate, endDate) {
    return new Promise(async(resolve, reject) => {
        try{
      let data = await commOverview(user, startDate, endDate)
      total = data.call + data.email + data.whatsapp + data.sms
      call = (data.call/total)*100
      email = (data.email/total)*100
      whatsapp = (data.whatsapp/total)*100
      sms= (data.sms/total)*100
      let percentage = {
          "call":call,
          "email":email,
          "whatsapp":whatsapp,
          "sms":sms
      }
      resolve(percentage)
        }catch(err){reject(err)}
    });
}

function portfolioCount(user, startDate, endDate) {
    return new Promise(async(resolve, reject) => {
        try{
        let lead = await leadModel.countDocuments({
            "assigned":user, 
            "createdAt":{$gt:new Date(startDate), $lt: new Date(endDate)}
        })
        let deal = await dealModel.countDocuments({
            "salesperson":user, 
            "createdAt":{$gt:new Date(startDate), $lt: new Date(endDate)}
        })
        let account = await leadModel.userAccCount(user, startDate, endDate)
        if(Array.isArray(account) && account.length){
        var accCount = account[0].count
        }
        else{var accCount = 0;}
        let followup = await followupModel.countDocuments({
            "organizer": user,
            "followupAtDate":{$gt:new Date(startDate), $lt: new Date(endDate)}
        })
      let result = {
          "lead":lead,
          "deal":deal,
          "account":accCount,
          "followup":followup
      }
      resolve(result)
        }catch(err){reject(err)}
    });
}

function followupCount(type, query) {
    return new Promise(async(resolve, reject) => {
        try{
    var finalQuery = {}
    switch(type){
//even when we send count of all leads, we have to ensure it doesn't count archived leads and hidden leads




//NEED TO FLIP THE LOGIC BUT IN NODEJS ITSELF, FIRST SEARCH USING THE QUERY, THEN USE FILTER FUNCTION
        case 'ALL':
        allQuery = {$and:[{$ne:{"assigned.status":"ARCHIVE"}}, {$ne:{"assigned.status":"HIDDEN"}}]}
        finalQuery = {...query, allQuery}
        data = await followupModel.search(finalQuery)
        
        case 'HIDDEN':
        hiddenQuery = {"assigned.hidden" : true}
        finalQuery = {...query, hiddenQuery}
        data = await followupModel.search(finalQuery)
        

        case 'ASSIGNED':
        assignedQuery = {"assigned._id": assigned}
        finalQuery = {...query, assignedQuery}
        data = await followupModel.search(finalQuery)
        
        case 'ARCHIVED':
        archivedQuery = {"assigned.status": "ARCHIVE"}
        finalQuery = {...query, archivedQuery}
        data = await followupModel.search(finalQuery)
    }
        resolve(data)
        }catch(err){reject(Err)}
    });
}

module.exports = followupService;

