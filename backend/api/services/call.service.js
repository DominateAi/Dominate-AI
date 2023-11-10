var callModel = require("../models/call.model");
var currentContext = require('../../common/currentContext');
const callers = require('../../common/caller');
const CallDirection = require('../../common/constants/CallDirection');
var configResolve = require("../../common/configResolver");
var config = configResolve.getConfig();
const CallStatus = require('../../common/constants/CallStatus');
var uuid = require('node-uuid');
var userAuthCodeService = require('../services/userAuthCode.service');

var callService = {
    getAllCalls: getAllCalls,
    getCallById:getCallById,
    addCall: addCall,
    updateCall:updateCall,
    deleteCall:deleteCall,
    getCallByCallName: getCallByCallName,
    getCallsByPage: getCallsByPage,
    getAllCallsCount: getAllCallsCount,
    getCallsByPageWithSort: getCallsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchCalls: searchCalls,
    getCallBySid: getCallBySid,
    dial: dial,
    getBill: getBill
}

function addCall(callData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        callData.createdBy = user.email;
        callData.lastModifiedBy = user.email;
        
        callModel.create(callData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updateCall(id,callData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        callData.lastModifiedBy = user.email;
        
        callModel.updateById(id,callData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteCall(id) {
    return new Promise((resolve,reject) => {
        callModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllCalls() {
    return new Promise((resolve,reject) => {
        callModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getCallById(id) {
    return new Promise((resolve,reject) => {
        callModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getCallByCallName(callName, tenant){
    return new Promise((resolve,reject) => {
        callModel.searchOne({'callName': callName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllCallsCount() {
    return new Promise((resolve, reject) => {
        callModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getCallsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        callModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getCallsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        callModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        callModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchCalls(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        callModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getCallBySid(sid) {
    var query = {
        callSid: sid
    }
    return new Promise((resolve,reject) => {
        callModel.searchOne(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function dial(callData){
    return new Promise((resolve,reject) => {
        let currentUser = currentContext.getCurrentContext();
        var authCode = {};
        authCode.email = currentUser.email;
        authCode.type = 'calling';
        authCode.workspaceId = currentUser.workspaceId;
        authCode.authCode = uuid.v1();
        callData.direction = CallDirection.OUTBOUND;
        callData.callerId = config.exotel.callerId;
        callData.status = CallStatus.IN_PROGRESS;
        userAuthCodeService.addUserAuthCode(authCode).then((result) => {
            callers.dial(callData, authCode.authCode).then((callingData)=>{
                callData.data = callingData;
                callData.callSid = callingData.TwilioResponse.Call.Sid;
                addCall(callData).then((data)=>{
                    resolve(data);
                }).catch((err) => {
                    reject(err);
                });
            })
        });
    });
}

function getBill(callSid){
    return new Promise((resolve,reject) => {
        callers.callStatus(callSid).then((callingData)=>{
            resolve(callingData);
        }).catch((err) => {
            reject(err);
        });
    });
}


module.exports = callService;

