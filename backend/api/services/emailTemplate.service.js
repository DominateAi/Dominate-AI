var emailTemplateModel = require("../models/emailTemplate.model");
var currentContext = require('../../common/currentContext');

var emailTemplateService = {
    getAllEmailTemplates: getAllEmailTemplates,
    getEmailTemplateById:getEmailTemplateById,
    addEmailTemplate: addEmailTemplate,
    updateEmailTemplate:updateEmailTemplate,
    deleteEmailTemplate:deleteEmailTemplate,
    getEmailTemplateByEmailTemplateName: getEmailTemplateByEmailTemplateName,
    getEmailTemplatesByPage: getEmailTemplatesByPage,
    getAllEmailTemplatesCount: getAllEmailTemplatesCount,
    getEmailTemplatesByPageWithSort: getEmailTemplatesByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchEmailTemplates: searchEmailTemplates,
    getEmailTemplateByName: getEmailTemplateByName
}

function addEmailTemplate(emailTemplateData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        emailTemplateData.createdBy = user.email;
        emailTemplateData.lastModifiedBy = user.email;
        
        emailTemplateModel.create(emailTemplateData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updateEmailTemplate(id,emailTemplateData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        emailTemplateData.lastModifiedBy = user.email;
        
        emailTemplateModel.updateById(id,emailTemplateData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteEmailTemplate(id) {
    return new Promise((resolve,reject) => {
        emailTemplateModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllEmailTemplates() {
    return new Promise((resolve,reject) => {
        emailTemplateModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getEmailTemplateById(id) {
    return new Promise((resolve,reject) => {
        emailTemplateModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getEmailTemplateByEmailTemplateName(emailTemplateName, tenant){
    return new Promise((resolve,reject) => {
        emailTemplateModel.searchOne({'emailTemplateName': emailTemplateName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllEmailTemplatesCount() {
    return new Promise((resolve, reject) => {
        emailTemplateModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getEmailTemplatesByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        emailTemplateModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getEmailTemplatesByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        emailTemplateModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        emailTemplateModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchEmailTemplates(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        emailTemplateModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getEmailTemplateByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve,reject) => {
        emailTemplateModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


module.exports = emailTemplateService;

