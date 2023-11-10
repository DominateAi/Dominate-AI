var fieldModel = require("../models/field.model");
var currentContext = require('../../common/currentContext');
//let fieldStatus = require('../../common/constants/FieldStatus')
var _ = require('lodash');

var fieldService = {
    getAllFields: getAllFields,
    getFieldById:getFieldById,
    addField: addField,
    updateField:updateField,
    deleteField:deleteField,
    getFieldByFieldName: getFieldByFieldName,
    getFieldsByPage: getFieldsByPage,
    getAllFieldsCount: getAllFieldsCount,
    getFieldsByPageWithSort: getFieldsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchFields: searchFields,
    textSearch: textSearch,
    getAllFieldsOverview: getAllFieldsOverview,
    getAggregateCount: getAggregateCount,
    getFieldCountByTimestamp: getFieldCountByTimestamp
}

function addField(fieldData) {
    console.log(fieldData);
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        fieldData.createdBy = user.email;
        fieldData.lastModifiedBy = user.email;
        
        fieldModel.create(fieldData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updateField(id,fieldData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        fieldData.lastModifiedBy = user.email;
        
        fieldModel.updateById(id,fieldData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}
function deleteField(id) {
    return new Promise((resolve, reject) => {
        fieldModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllFields(startsWith, assigned) {
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
        fieldModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFieldById(id) {
    return new Promise((resolve,reject) => {
        fieldModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFieldByFieldName(fieldName, tenant){
    console.log(fieldName);
    return new Promise((resolve,reject) => {
        fieldModel.searchOne({'name': fieldName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllFieldsCount(query) {
    return new Promise((resolve, reject) => {
        fieldModel.countDocuments(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFieldsByPage(pageNo, pageSize, startsWith, assigned) {
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
        fieldModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFieldsByPageWithSort(pageNo, pageSize, sortBy, assigned) {
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
    }
    if(startsWith == undefined && assigned == undefined){
        query = {}
    }

    return new Promise((resolve, reject) => {
        fieldModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        fieldModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchFields(searchCriteria) {
   let query = searchCriteria;
    // let pageSize = searchCriteria.pageSize;
    // let pageNo = searchCriteria.pageNo;
    // const options = {};
    // options.skip = pageSize * (pageNo - 1);
    // options.limit = pageSize;
    return new Promise((resolve, reject) => {
        fieldModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function textSearch(text, assigned, status) {
    return new Promise((resolve, reject) => {
        fieldModel.getTextSearchResult(text).then((data) => {
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

function getAllFieldsOverview(){
    return new Promise((resolve, reject) => {
        var promises = [];
        promises.push(getAllFieldsCount({'status':'NEW'}));
        promises.push(getAllFieldsCount({'status':'ACTIVE'}));
        promises.push(getAllFieldsCount({'status':'INACTIVE'}));
        promises.push(getAllFieldsCount({'status':'ARCHIVE'}));

        
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
        fieldModel.getAggregateCount(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFieldCountByTimestamp(key, year, status){
    return new Promise((resolve, reject) => {
        fieldModel.groupByKeyAndCountDocumentsByMonth(key, year, status).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject(err);
        })
    });
}

module.exports = fieldService;

