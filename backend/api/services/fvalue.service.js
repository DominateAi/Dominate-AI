var fvalueModel = require("../models/fvalue.model");
var fieldModel = require("../models/field.model");
var currentContext = require('../../common/currentContext');
//let fvalueStatus = require('../../common/constants/FvalueStatus')
var _ = require('lodash');

var fvalueService = {
    getAllFvalues: getAllFvalues,
    getFvalueById:getFvalueById,
    addFvalue: addFvalue,
    updateFvalue:updateFvalue,
    deleteFvalue:deleteFvalue,
    getFvalueByFvalueName: getFvalueByFvalueName,
    getFvaluesByPage: getFvaluesByPage,
    getAllFvaluesCount: getAllFvaluesCount,
    getFvaluesByPageWithSort: getFvaluesByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchFvalues: searchFvalues,
    textSearch: textSearch,
    getAllFvaluesOverview: getAllFvaluesOverview,
    getAggregateCount: getAggregateCount,
    getFvalueCountByTimestamp: getFvalueCountByTimestamp
}

function addFvalue(fvalueData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        fvalueData.createdBy = user.email;
        fvalueData.lastModifiedBy = user.email;
        
        fvalueModel.create(fvalueData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updateFvalue(id,fvalueData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        fvalueData.lastModifiedBy = user.email;
        
        fvalueModel.updateById(id,fvalueData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteFvalue(id) {
    return new Promise((resolve, reject) => {
        fvalueModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}


function getAllFvalues(startsWith, assigned) {
    var query = {
        "$and": []
    };
    if(!_.isEmpty(startsWith)){
        query['$and'].push({
            'name' : {$regex: "^"+startsWith, $options: "i"}
        }); 
    }

    if (assigned != undefined) {
        query['$and'].push({
            'assigned': assigned
        });
    }
    if(startsWith == undefined && assigned == undefined){
        query = {}
    }
    return new Promise((resolve,reject) => {
        fvalueModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFvalueById(id) {
    return new Promise((resolve,reject) => {
        fvalueModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFvalueByFvalueName(fvalueName, tenant){
    return new Promise((resolve,reject) => {
        fvalueModel.searchOne({'name': fvalueName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllFvaluesCount(query) {
    return new Promise((resolve, reject) => {
        fvalueModel.countDocuments(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFvaluesByPage(pageNo, pageSize, startsWith, assigned) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    var query = {
        "$and": []
    };
    if(startsWith != undefined){
        query['$and'].push({
            'name' : {$regex: "^"+startsWith, $options: "i"}
        }); 
    }
    if (assigned != undefined) {
        query['$and'].push({
            'assigned': assigned
        });
    }

    if(startsWith == undefined && assigned == undefined){
        query = {}
    }

    return new Promise((resolve, reject) => {
        fvalueModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFvaluesByPageWithSort(pageNo, pageSize, sortBy, assigned) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    var query = {
        "$and": []
    };
    if(startsWith != undefined){
        query['$and'].push({
            'name' : {$regex: "^"+startsWith, $options: "i"}
        }); 
    }

    if (assigned != undefined) {
        query['$and'].push({
            'assigned': assigned
        });
    } resolve(data);
    if(startsWith == undefined && assigned == undefined){
        query = {}
    }

    return new Promise((resolve, reject) => {
        fvalueModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        fvalueModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function searchFvalues(searchCriteria) {
   let response = [];
    let query = searchCriteria;
    return new Promise(async (resolve, reject) => {
        let data = await fvalueModel.search(query)
        for(i in data){
            temp = data[i]._doc
            test = data[i].field
            dataA = await fieldModel.getById(test)
            dataB = dataA._doc;
            Object.assign(temp, {fieldData: dataB})
            console.log(temp);
            response.push(temp);
        }
        resolve(response);
    });
}

function textSearch(text, assigned, status) {
    return new Promise((resolve, reject) => {
        fvalueModel.getTextSearchResult(text).then((data) => {
            if(!_.isEmpty(assigned)){
                data = _.filter(data, ['assigned._id' , assigned]);
            }
            if(!_.isEmpty(status)){
                data = _.filter(data, ['status' , status]);
            }
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllFvaluesOverview(){
    return new Promise((resolve, reject) => {
        var promises = [];
        promises.push(getAllFvaluesCount({'status':'NEW'}));
        promises.push(getAllFvaluesCount({'status':'ACTIVE'}));
        promises.push(getAllFvaluesCount({'status':'INACTIVE'}));
        promises.push(getAllFvaluesCount({'status':'ARCHIVE'}));

        
        Promise.all(promises).then((data)=>{
            var result = {
                'new': data[0],
                'active': data[1],
                'inActive': data[2],
                'archive': data[3]
            }
            resolve(result);
        })
    }).catch((err)=>{
        console.log(err);
        reject(err);
    });
}

function getAggregateCount(key) {
    const query = [
        { "$group": { _id: "$" + key, count: { $sum: 1 } } }
    ];
    return new Promise((resolve, reject) => {
        fvalueModel.getAggregateCount(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFvalueCountByTimestamp(key, year, status){
    return new Promise((resolve, reject) => {
        fvalueModel.groupByKeyAndCountDocumentsByMonth(key, year, status).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject(err);
        })
    });
}

module.exports = fvalueService;

