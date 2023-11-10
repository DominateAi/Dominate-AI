var refCodeModel = require("../models/refCode.model");
var userModel = require("../models/user.model");
var leadModel = require("../models/lead.model");
var followupModel = require("../models/followup.model");
var referralCodes = require("referral-codes");
var currentContext = require('../../common/currentContext');
const { template } = require("lodash");
var configResolve = require("../../common/configResolver");

var refCodeService = {
    getAllRefCodes: getAllRefCodes,
    getRefCodeById: getRefCodeById,
    addRefCode: addRefCode,
    updateRefCode: updateRefCode,
    deleteRefCode: deleteRefCode,
    getRefCodeByRefCodeName: getRefCodeByRefCodeName,
    getRefCodesByPage: getRefCodesByPage,
    getRefCodesByPageWithSort: getRefCodesByPageWithSort,
    getAllRefCodesCount: getAllRefCodesCount,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchRefCodes: searchRefCodes
}

function addRefCode(refCodeData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        refCodeData.createdBy = user.email;
        refCodeData.lastModifiedBy = user.email;
        var referralId = referralCodes.generate({
            length: 5,
            count: 1
        });
        refCodeData.referralCode = referralId[0];
        const workspaceURL = configResolve.getConfig().protocol + "login" + "." + configResolve.getConfig().server_domain;      
        var URL = workspaceURL + "/useReferralCode/" + referralId[0];
        refCodeData.URL = URL;
        refCodeModel.create(refCodeData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function updateRefCode(id, refCodeData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        refCodeData.lastModifiedBy = user.email;

        refCodeModel.updateById(id, refCodeData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteRefCode(id) {
    return new Promise((resolve, reject) => {
        refCodeModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllRefCodes() {
    return new Promise((resolve, reject) => {
        refCodeModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllRefCodesCount() {
    return new Promise((resolve, reject) => {
        refCodeModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getRefCodeById(id) {
    return new Promise((resolve, reject) => {
        refCodeModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getRefCodeByRefCodeName(refCodeName, tenant) {
    return new Promise((resolve, reject) => {
        refCodeModel.searchOne({ 'name': refCodeName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getRefCodesByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        refCodeModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getRefCodesByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        refCodeModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        refCodeModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function searchRefCodes(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        refCodeModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


module.exports = refCodeService;

