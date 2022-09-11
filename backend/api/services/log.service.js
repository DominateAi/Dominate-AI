var logModel = require("../models/log.model");
var currentContext = require('../../common/currentContext');

var logService = {
    getAllLogs: getAllLogs,
    getLogById: getLogById,
    addLog: addLog,
    updateLog: updateLog,
    deleteLog: deleteLog,
    getLogByLogName: getLogByLogName,
    getLogsByPage: getLogsByPage,
    getLogsByPageWithSort: getLogsByPageWithSort,
    getAllLogsCount: getAllLogsCount,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchLogs: searchLogs
}

function addLog(logData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        logData.createdBy = user.email;
        logData.lastModifiedBy = user.email;

        logModel.create(logData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function updateLog(id, logData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        logData.lastModifiedBy = user.email;

        logModel.updateById(id, logData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteLog(id) {
    return new Promise((resolve, reject) => {
        logModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllLogs() {
    return new Promise((resolve, reject) => {
        logModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllLogsCount() {
    return new Promise((resolve, reject) => {
        logModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getLogById(id) {
    return new Promise((resolve, reject) => {
        logModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getLogByLogName(logName, tenant) {
    return new Promise((resolve, reject) => {
        logModel.searchOne({ 'logName': logName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getLogsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        logModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getLogsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        logModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        logModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchLogs(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        logModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}



module.exports = logService;

