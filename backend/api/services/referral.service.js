var referralModel = require("../models/referral.model");
var refCodeModel = require("../models/refCode.model")
var userModel = require("../models/user.model");
var leadModel = require("../models/lead.model");
var followupModel = require("../models/followup.model");
var currentContext = require('../../common/currentContext');
const { template, result } = require("lodash");

var referralService = {
    getAllReferrals: getAllReferrals,
    getReferralById: getReferralById,
    addReferral: addReferral,
    updateReferral: updateReferral,
    deleteReferral: deleteReferral,
    checkReferralUsed: checkReferralUsed,
    getReferralByReferralName: getReferralByReferralName,
    getReferralsByPage: getReferralsByPage,
    getReferralsByPageWithSort: getReferralsByPageWithSort,
    getAllReferralsCount: getAllReferralsCount,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchReferrals: searchReferrals
}

function addReferral(referralData) {
    return new Promise(async(resolve, reject) => {
      //search for refCode with the referral code and 
      //extract fromID from it and also refCode ID of the refCode object
      try{  
      var refCode = await refCodeModel.search({"referralCode":referralData.referralCode})
        if (data != undefined && data.length > 0) {
            return next(errorMethods.sendBadRequest(errorCode.REFERRAL_CODE_SEEMS_INCORRECT));
           } else {
        referralData.fromID = refCode[0].userId;
        referralData.refCodeId = refCode[0]._id;
        referralData.createdBy = referralData.toEmail;
        referralData.lastModifiedBy = referralData.toEmail;
        var data = await referralModel.create(referralData)
        resolve(data);
        }
    }catch{reject(err)}
    })

}


function updateReferral(id, referralData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        referralData.lastModifiedBy = user.email;

        referralModel.updateById(id, referralData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function checkReferralUsed(toID, tenant) {
    return new Promise((resolve, reject) => {
        referralModel.searchOne({ 'toID': toID }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function deleteReferral(id) {
    return new Promise((resolve, reject) => {
        referralModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllReferrals() {
    return new Promise((resolve, reject) => {
        referralModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllReferralsCount() {
    return new Promise((resolve, reject) => {
        referralModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getReferralById(id) {
    return new Promise((resolve, reject) => {
        referralModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getReferralByReferralName(referralName, tenant) {
    return new Promise((resolve, reject) => {
        referralModel.searchOne({ 'name': referralName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getReferralsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        referralModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getReferralsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        referralModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        referralModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function searchReferrals(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise(async(resolve, reject) => {
        var results = [];
        var referralData = await referralModel.getPaginatedResult(query, options)
        for(data of referralData){
            queryOne = {"_id":data.toID}
        console.log("workspaceId and query", data.toWorkspaceID, queryOne)
        var userData = await userModel.workspaceUserSearch(data.toWorkspaceID, queryOne)
        // if(rough !== undefined){
        //     var nRough = rough[0]
        // }else{
        //     nRough = rough
        // }
        newData = JSON.parse(JSON.stringify(data));
        // newRough = JSON.parse(JSON.stringify(nRough));
        var transit = {...newData, userData}
        results.push(transit)
        }
        resolve(results)
    });
}


module.exports = referralService;

