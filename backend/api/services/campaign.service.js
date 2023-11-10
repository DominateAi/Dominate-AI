var campaignModel = require("../models/campaign.model");
var currentContext = require('../../common/currentContext');
const notificationClient = require('../../common/notificationClient');
const NotificationType = require('../../common/constants/NotificationType');
var mailService = require("./serverlessemail.service");
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');

var campaignService = {
    getAllCampaigns: getAllCampaigns,
    getCampaignById: getCampaignById,
    addCampaign: addCampaign,
    updateCampaign: updateCampaign,
    deleteCampaign: deleteCampaign,
    getCampaignByCampaignName: getCampaignByCampaignName,
    getCampaignsByPage: getCampaignsByPage,
    getAllCampaignsCount: getAllCampaignsCount,
    getCampaignsByPageWithSort: getCampaignsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchCampaigns: searchCampaigns,
    getCampaignByName: getCampaignByName,
    getAllCampaignsByDate: getAllCampaignsByDate,
    getAllCampaignsByDateAndUser:getAllCampaignsByDateAndUser,
    campaignProfileCompleted: campaignProfileCompleted,
    changeStatus: changeStatus
}

function addCampaign(campaignData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        campaignData.createdBy = user.email;
        campaignData.lastModifiedBy = user.email;
        campaignData.campaignScheduled =  false;
        campaignData.isEnabled = false;
        campaignData.campaignId = "";
        campaignModel.create(campaignData).then((data) => {
            campaignModel.getById(data.id).then((campaignResult) => {
                notificationClient.notify(NotificationType.MEETING_CREATED, campaignResult, user.workspaceId, user.userId);
                resolve(campaignResult);
            }).catch((err) => {
                reject(err);
            })
        }).catch((err) => {
            reject(err);
        })
    })

}

function updateCampaign(id, campaignData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        campaignData.lastModifiedBy = user.email;

        campaignModel.updateById(id, campaignData).then((data) => {
            notificationClient.notify(NotificationType.MEETING_UPDATED, data, user.workspaceId, data.assigned);
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteCampaign(id) {
    return new Promise((resolve, reject) => {
        campaignModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllCampaigns() {
    return new Promise((resolve, reject) => {
        campaignModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getCampaignById(id) {
    return new Promise((resolve, reject) => {
        campaignModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getCampaignByCampaignName(campaignName, tenant) {
    return new Promise((resolve, reject) => {
        campaignModel.searchOne({ 'campaignName': campaignName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllCampaignsCount() {
    return new Promise((resolve, reject) => {
        campaignModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getCampaignsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        campaignModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getCampaignsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        campaignModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        campaignModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchCampaigns(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        campaignModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getCampaignByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve, reject) => {
        campaignModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllCampaignsByDate(date) {
    console.log("campaign date", date)
    var user = currentContext.getCurrentContext();
    var query = {
        "$and": [
            {
                "campaignDate": {
                    "$eq": new Date(date).toDateString()
                }
            },
            {
                "$or": [
                    {
                        "assigned": {
                            "$eq": user.userId
                        }
                    }, {
                        "organizer": {
                            "$eq": user.userId
                        }
                    }

                ]
            }
        ]
    };


    return new Promise((resolve, reject) => {
        campaignModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getAllCampaignsByDateAndUser( date, isOrganisation ) {
    var user = currentContext.getCurrentContext();
    var query = { "$and": [
            { "campaignDate": { "$eq": new Date(date).toDateString() } },
            { "$or": [
                    { "assigned": { "$eq": user.userId } }, 
                    { "organizer": {"$eq": user.userId } }
                ]
            }
        ]};
    if( isOrganisation ){
        query = { "$and": [
            { "campaignDate": { "$eq": new Date(date).toDateString() } },
            { "$or": [
                    { "assigned": { "$eq": user.userId } }, 
                    { "organizer": {"$eq": user.userId } }
                ]
            }
        ]};
    }

    return new Promise((resolve, reject) => {
        campaignModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function campaignProfileCompleted(id) {
    return new Promise(async(resolve, reject) => {
        try{
        var campaign = await campaignModel.getById(id)
        var data = campaign.data
        if(data.emailFrom && data.emailToList && data.schedules){
        var served = await mailService.createCampaign(campaign.data)
        campaign.campaignScheduled = true, campaign.isEnabled = true, campaign.campaignId = served.data
        updatedCampaign = await campaignModel.updateById(id, campaign)
        resolve("ok");
    }
        resolve(errorMethods.sendBadRequest(errorCode.CAMPAIGN_DATA_NOT_COMPLETE));
        }catch(err){reject(err)}
    });
}

function changeStatus(id, status) {
    return new Promise(async(resolve, reject) => {
        try{
        var campaign = await campaignModel.getById(id)
        var served = await mailService.changeStatus(campaign.campaignId, status)
        status == 'enable' ? campaign.isEnabled = true : campaign.isEnabled = false
        updatedCampaign = await campaignModel.updateById(id, campaign)
            resolve("ok");
        }catch(err){reject(err)}
    });
}

module.exports = campaignService;

