var presentationModel = require("../models/presentation.model");
var currentContext = require('../../common/currentContext');
var mailer = require('../../common/aws_mailer');
var leadService = require('./lead.service');
var minioClient = require('../../config/minioClient').minioClient;
var configResolve = require("../../common/configResolver");
var environmentConfig = configResolve.getConfig();

var presentationService = {
    getAllPresentations: getAllPresentations,
    getPresentationById:getPresentationById,
    addPresentation: addPresentation,
    updatePresentation:updatePresentation,
    deletePresentation:deletePresentation,
    getPresentationByPresentationName: getPresentationByPresentationName,
    getPresentationsByPage: getPresentationsByPage,
    getAllPresentationsCount: getAllPresentationsCount,
    getPresentationsByPageWithSort: getPresentationsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchPresentations: searchPresentations,
    getAllPresentationOverview: getAllPresentationOverview,
    sendPresentation:sendPresentation
}

function addPresentation(presentationData, token) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        presentationData.createdBy = user.email;
        presentationData.lastModifiedBy = user.email;
        
        presentationModel.create(presentationData).then(async (data)=>{
            if (data.status === 'SENT') {
                const leadInfo = await leadService.getLeadById(data.entityId);
                const fileName = presentationData.attachment + `&token=${token}`;
                var messageBody = "Please find attached Presentation.";
                var subject = "Presentation";
                mailer.mail(leadInfo.email, subject, messageBody, undefined,null, fileName);
            }
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updatePresentation(id,presentationData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        presentationData.lastModifiedBy = user.email;
        
        presentationModel.updateById(id,presentationData).then(async (data)=>{
            if (data.status === 'SENT') {
                const leadInfo = await leadService.getLeadById(data.lead);
                const fileName = presentationData.attachment;
                var messageBody = "Please find attached Presentation.";
                var subject = "Presentation";
                mailer.mail(leadInfo.email, subject, messageBody, undefined,null, fileName);
            }
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deletePresentation(id) {
    return new Promise((resolve,reject) => {
        presentationModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllPresentations() {
    return new Promise((resolve,reject) => {
        presentationModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPresentationById(id) {
    return new Promise((resolve,reject) => {
        presentationModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPresentationByPresentationName(presentationName, tenant){
    return new Promise((resolve,reject) => {
        presentationModel.searchOne({'presentationName': presentationName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllPresentationsCount(query) {
    return new Promise((resolve, reject) => {
        presentationModel.countDocuments(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPresentationsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        presentationModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPresentationsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        presentationModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        presentationModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchPresentations(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        presentationModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllPresentationOverview(){
    return new Promise((resolve, reject) => {
        var promises = [];
        promises.push(getAllPresentationsCount({}));
        promises.push(getAllPresentationsCount({'status':'DRAFT'}));
        promises.push(getAllPresentationsCount({'status':'SENT'}));

        Promise.all(promises).then((data)=>{
            var result = {
                'all': data[0],
                'draft': data[1],
                'sent': data[2]
            };
            resolve(result);
        })
    }).catch((err)=>{
        console.log(err);
        reject(err);
    });
}

function sendPresentation(){
    return new Promise( async( resolve, reject ) => {
        try{

        } catch ( err ){
            reject( err );
        }
    });
}

module.exports = presentationService;

