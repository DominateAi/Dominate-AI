var pipelineListModel = require("../models/pipelineList.model");
var currentContext = require('../../common/currentContext');

var pipelineListService = {
    getAllPipelineLists: getAllPipelineLists,
    getPipelineListById: getPipelineListById,
    addPipelineList: addPipelineList,
    updatePipelineList: updatePipelineList,
    deletePipelineList: deletePipelineList,
    getPipelineListByPipelineListName: getPipelineListByPipelineListName,
    getPipelineListsByPage: getPipelineListsByPage,
    getPipelineListsByPageWithSort: getPipelineListsByPageWithSort,
    getAllPipelineListsCount: getAllPipelineListsCount,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchPipelineLists: searchPipelineLists
}

function addPipelineList(pipelineListData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        pipelineListData.createdBy = user.email;
        pipelineListData.lastModifiedBy = user.email;

        pipelineListModel.create(pipelineListData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function updatePipelineList(id, pipelineListData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        pipelineListData.lastModifiedBy = user.email;

        pipelineListModel.updateById(id, pipelineListData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deletePipelineList(id) {
    return new Promise((resolve, reject) => {
        pipelineListModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllPipelineLists() {
    return new Promise((resolve, reject) => {
        pipelineListModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllPipelineListsCount() {
    return new Promise((resolve, reject) => {
        pipelineListModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getPipelineListById(id) {
    return new Promise((resolve, reject) => {
        pipelineListModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPipelineListByPipelineListName(pipelineListName, tenant) {
    return new Promise((resolve, reject) => {
        pipelineListModel.searchOne({ 'pipelineListName': pipelineListName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPipelineListsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        pipelineListModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPipelineListsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        pipelineListModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        pipelineListModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchPipelineLists(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        pipelineListModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


module.exports = pipelineListService;

