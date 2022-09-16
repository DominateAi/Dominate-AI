var leadStageModel = require("../models/leadStage.model");
var currentContext = require('../../common/currentContext');

var leadStageService = {
    getAllLeadStages: getAllLeadStages,
    getLeadStageById: getLeadStageById,
    addLeadStage: addLeadStage,
    updateLeadStage: updateLeadStage,
    deleteLeadStage: deleteLeadStage,
    getLeadStageByLeadStageName: getLeadStageByLeadStageName,
    getLeadStagesByPage: getLeadStagesByPage,
    getLeadStagesByPageWithSort: getLeadStagesByPageWithSort,
    getAllLeadStagesCount: getAllLeadStagesCount,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchLeadStages: searchLeadStages
}

function addLeadStage(leadStageData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        leadStageData.createdBy = user.email;
        leadStageData.lastModifiedBy = user.email;

        leadStageModel.create(leadStageData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function updateLeadStage(id, leadStageData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        leadStageData.lastModifiedBy = user.email;

        leadStageModel.updateById(id, leadStageData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteLeadStage(id) {
    return new Promise((resolve, reject) => {
        leadStageModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllLeadStages() {
    return new Promise((resolve, reject) => {
        leadStageModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllLeadStagesCount() {
    return new Promise((resolve, reject) => {
        leadStageModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getLeadStageById(id) {
    return new Promise((resolve, reject) => {
        leadStageModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getLeadStageByLeadStageName(leadStageName, tenant) {
    return new Promise((resolve, reject) => {
        leadStageModel.searchOne({ 'leadStageName': leadStageName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getLeadStagesByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        leadStageModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getLeadStagesByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        leadStageModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        leadStageModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchLeadStages(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        leadStageModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}



module.exports = leadStageService;

