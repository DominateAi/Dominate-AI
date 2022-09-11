var pipelineModel = require("../models/pipeline.model");
var currentContext = require('../../common/currentContext');

var pipelineService = {
    getAllPipelines: getAllPipelines,
    getPipelineById: getPipelineById,
    addPipeline: addPipeline,
    addPipeline2: addPipeline2,
    updatePipeline: updatePipeline,
    deletePipeline: deletePipeline,
    getPipelineByPipelineName: getPipelineByPipelineName,
    getPipelinesByPage: getPipelinesByPage,
    getPipelinesByPageWithSort: getPipelinesByPageWithSort,
    getAllPipelinesCount: getAllPipelinesCount,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchPipelines: searchPipelines
}

function addPipeline(pipelineData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        pipelineData.createdBy = user.email;
        pipelineData.lastModifiedBy = user.email;
        pipelineModel.create(pipelineData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function addPipeline2(pipelineData, workspace) {
    return new Promise((resolve, reject) => {
        pipelineModel.create2(pipelineData, workspace).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function updatePipeline(id, pipelineData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        pipelineData.lastModifiedBy = user.email;

        pipelineModel.updateById(id, pipelineData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deletePipeline(id) {
    return new Promise((resolve, reject) => {
        pipelineModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllPipelines() {
    return new Promise((resolve, reject) => {
        pipelineModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllPipelinesCount() {
    return new Promise((resolve, reject) => {
        pipelineModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getPipelineById(id) {
    return new Promise((resolve, reject) => {
        pipelineModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPipelineByPipelineName(pipelineName, tenant) {
    return new Promise((resolve, reject) => {
        pipelineModel.searchOne({ 'name': pipelineName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPipelinesByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        pipelineModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPipelinesByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        pipelineModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        pipelineModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchPipelines(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        pipelineModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


module.exports = pipelineService;

