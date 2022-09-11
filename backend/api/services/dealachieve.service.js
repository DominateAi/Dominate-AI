var dealachieveModel = require("../models/dealachieve.model");
var currentContext = require('../../common/currentContext');

var dealachieveService = {
    getAllDealachieves: getAllDealachieves,
    getDealachieveById: getDealachieveById,
    addDealachieve: addDealachieve,
    updateDealachieve: updateDealachieve,
    deleteDealachieve: deleteDealachieve,
    getDealachieveByDealachieveName: getDealachieveByDealachieveName,
    getDealachievesByPage: getDealachievesByPage,
    getDealachievesByPageWithSort: getDealachievesByPageWithSort,
    getAllDealachievesCount: getAllDealachievesCount,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchDealachieves: searchDealachieves,
    match: match
}

function addDealachieve(dealachieveData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        dealachieveData.createdBy = user.email;
        dealachieveData.lastModifiedBy = user.email;

        dealachieveModel.create(dealachieveData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function updateDealachieve(id, dealachieveData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        dealachieveData.lastModifiedBy = user.email;

        dealachieveModel.updateById(id, dealachieveData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteDealachieve(id) {
    return new Promise((resolve, reject) => {
        dealachieveModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllDealachieves() {
    return new Promise((resolve, reject) => {
        dealachieveModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllDealachievesCount() {
    return new Promise((resolve, reject) => {
        dealachieveModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getDealachieveById(id) {
    return new Promise((resolve, reject) => {
        dealachieveModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getDealachieveByDealachieveName(Id, tenant) {
    return new Promise((resolve, reject) => {
        dealachieveModel.searchOne({ '_id': Id }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getDealachievesByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        dealachieveModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getDealachievesByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        dealachieveModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        dealachieveModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchDealachieves(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        dealachieveModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function match(lead, type) {
    return new Promise((resolve, reject) => {
        dealachieveModel.match(lead, type).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports = dealachieveService;

