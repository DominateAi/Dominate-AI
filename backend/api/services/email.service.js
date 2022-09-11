var emailModel = require("../models/email.model");
var currentContext = require('../../common/currentContext');
var mailer = require('../../common/aws_mailer');
var activityService = require('../services/activity.service');
var EmailStatus = require('../../common/constants/EmailStatus');

var emailService = {
    getAllEmails: getAllEmails,
    getEmailById:getEmailById,
    addEmail: addEmail,
    updateEmail:updateEmail,
    deleteEmail:deleteEmail,
    getEmailByEmailName: getEmailByEmailName,
    getEmailsByPage: getEmailsByPage,
    getAllEmailsCount: getAllEmailsCount,
    getEmailsByPageWithSort: getEmailsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    groupByKeyAndCountDocumentsWithTimeframe: groupByKeyAndCountDocumentsWithTimeframe,
    searchEmails: searchEmails
}

function addEmail(emailData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        var sender = undefined;
        
        emailData.createdBy = user.email;
        emailData.lastModifiedBy = user.email;
        emailData.organizer = user.userId;

        if(emailData.from == undefined){
            sender = user.email;
        }else{
            sender = emailData.from;
        }
        
        emailModel.create(emailData).then((data)=>{
            mailer.mail(emailData.to, emailData.subject, emailData.body, undefined, sender).then((result)=>{
                var activity = {
                    'entityType': emailData.entityType,
                    'entityId' : emailData.entityId,
                    'data': emailData,
                    'activityType': 'EMAIL_CREATED'
                }
                activityService.addActivity(activity).then((adata)=>{
                    console.log("mail sent");
                }).catch((err)=>{
                    reject(err);
                });
              }).catch((err)=>{
                reject(err);
              });
        }).catch((err) => {
            reject(err);
        })
        resolve("mail sent");
    })
   
}

function updateEmail(id,emailData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        emailData.lastModifiedBy = user.email;
        emailData.organizer = user.userId;
        
        emailModel.updateById(id,emailData).then((data)=>{
            var activity = {
                'entityType': emailData.entityType,
                'entityId' : emailData.entityId,
                'data': emailData,
                'activityType': 'EMAIL_UPDATED'
            }
            activityService.addActivity(activity).then((adata)=>{
                resolve(data);
            }).catch((err)=>{
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteEmail(id, emailData) {
    return new Promise((resolve,reject) => {
        emailData.status = EmailStatus.ARCHIVE;
        emailModel.updateById(id, emailData).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        });
    })
}

function getAllEmails(entityId, entityType, status) {
    if(status == undefined){
        status = EmailStatus.NEW;
    }
    return new Promise((resolve,reject) => {
        emailModel.search({
            'entityId': entityId,
            'entityType': entityType,
            'status' : status
        }).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getEmailById(id) {
    return new Promise((resolve,reject) => {
        emailModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getEmailByEmailName(emailName, tenant){
    return new Promise((resolve,reject) => {
        emailModel.searchOne({'emailName': emailName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllEmailsCount() {
    return new Promise((resolve, reject) => {
        emailModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getEmailsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        emailModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getEmailsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        emailModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        emailModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocumentsWithTimeframe(key, startDate, endDate) {
    return new Promise((resolve,reject) => {
        emailModel.groupByKeyAndCountDocumentsWithTimeframe(key, startDate, endDate).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchEmails(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        emailModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports = emailService;

