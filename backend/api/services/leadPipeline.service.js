var leadPipelineModel = require("../models/leadPipeline.model");
var stageModel = require("../models/leadStage.model");
var pipeLeadModel = require("../models/pipeLead.model");
var currentContext = require('../../common/currentContext');
const { WARM } = require("../../common/constants/LeadDegree");

var leadPipelineService = {
    getAllLeadPipelines: getAllLeadPipelines,
    getLeadPipelineById: getLeadPipelineById,
    addLeadPipeline: addLeadPipeline,
    addLeadPipeline2: addLeadPipeline2,
    updateLeadPipeline: updateLeadPipeline,
    countData: countData,
    deleteLeadPipeline: deleteLeadPipeline,
    getLeadPipelineByLeadPipelineName: getLeadPipelineByLeadPipelineName,
    getLeadPipelinesByPage: getLeadPipelinesByPage,
    getLeadPipelinesByPageWithSort: getLeadPipelinesByPageWithSort,
    getAllLeadPipelinesCount: getAllLeadPipelinesCount,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchLeadPipelines: searchLeadPipelines,
    kanbanView: kanbanView
}

function addLeadPipeline(leadPipelineData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        leadPipelineData.createdBy = user.email;
        leadPipelineData.lastModifiedBy = user.email;
        leadPipelineModel.create(leadPipelineData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function addLeadPipeline2(leadPipelineData, orgData) {
    return new Promise((resolve, reject) => {
        leadPipelineData.createdBy = orgData.defaultUserEmailId;
        leadPipelineData.lastModifiedBy = orgData.defaultUserEmailId;
        leadPipelineModel.create2(leadPipelineData, orgData.workspaceId).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function updateLeadPipeline(id, leadPipelineData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        leadPipelineData.lastModifiedBy = user.email;

        leadPipelineModel.updateById(id, leadPipelineData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteLeadPipeline(id) {
    return new Promise((resolve, reject) => {
        leadPipelineModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllLeadPipelines() {
    return new Promise((resolve, reject) => {
        leadPipelineModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllLeadPipelinesCount() {
    return new Promise((resolve, reject) => {
        leadPipelineModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getLeadPipelineById(id) {
    return new Promise((resolve, reject) => {
        leadPipelineModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getLeadPipelineByLeadPipelineName(leadPipelineName, tenant) {
    return new Promise((resolve, reject) => {
        leadPipelineModel.searchOne({ 'leadPipelineName': leadPipelineName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getLeadPipelinesByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        leadPipelineModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getLeadPipelinesByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        leadPipelineModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        leadPipelineModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchLeadPipelines(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise(async(resolve, reject) => {
    try{
      var result=[];
        var data = await leadPipelineModel.getPaginatedResult(query, options);
    //     await (async function() {for(pipeline of data){
    //         var superHot =0, hot=0, warm=0, cold=0, current = {}, result=[];
    //         superHot = await pipeLeadModel.countDocuments({$and:[{pipeline:pipeline._id},{degree:"SUPER_HOT"}]}) 
    //         hot = await pipeLeadModel.countDocuments({$and:[{pipeline:pipeline._id},{degree:"HOT"}]})
    //         warm = await pipeLeadModel.countDocuments({$and:[{pipeline:pipeline._id},{degree:"WARM"}]})
    //         cool = await pipeLeadModel.countDocuments({$and:[{pipeline:pipeline._id},{degree:"COOL"}]})
    //         cold = await pipeLeadModel.countDocuments({$and:[{pipeline:pipeline._id},{degree:"COLD"}]})
    //         current['data'] = pipeline, current['superHot'] = superHot, current['hot'] = hot
    //         current['warm'] = warm, current['cool'] = cool, current['cold'] = cold
    //         return result.push(current) 
    //     }
    // } ) ()   
        resolve(data);
    }catch{reject(err);}
    });
}

function countData(){
    return new Promise(async(resolve, reject) => {
        try{
    var superHot, hot, warm, cold, current = {}, result=[];
    var data = await leadPipelineModel.search({})
    for(pipeline of data){
        var superHot =0, hot=0, warm=0, cold=0, current = {};
        superHot = await pipeLeadModel.countDocuments({$and:[{pipeline:pipeline._id},{degree:"SUPER_HOT"}]}) 
            hot = await pipeLeadModel.countDocuments({$and:[{pipeline:pipeline._id},{degree:"HOT"}]})
            warm = await pipeLeadModel.countDocuments({$and:[{pipeline:pipeline._id},{degree:"WARM"}]})
            cool = await pipeLeadModel.countDocuments({$and:[{pipeline:pipeline._id},{degree:"COOL"}]})
            cold = await pipeLeadModel.countDocuments({$and:[{pipeline:pipeline._id},{degree:"COLD"}]})
            current['id'] = pipeline._id, current['superHot'] = superHot, current['hot'] = hot
            current['warm'] = warm, current['cool'] = cool, current['cold'] = cold
            result.push(current) 
    }
    resolve(result);
        }catch{reject(err)}
    });
}

function kanbanView(pipelineId) {
    return new Promise(async(resolve, reject) => {
        try{
            let stagesData = []
            stageQuery ={
                "pipeline":pipelineId
            }
            let stages = await stageModel.search(stageQuery)
            for(stage of stages){
                leadCount = await pipeLeadModel.countDocuments({"stage":stage._id})
                tempData = {"stageName":stage.leadStageName, "count":leadCount}
                stagesData.push(tempData)
            }
             resolve(stagesData)
        }catch(err){reject(err)}
    });
}


module.exports = leadPipelineService;

