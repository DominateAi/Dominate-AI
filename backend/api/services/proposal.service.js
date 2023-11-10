var proposalModel = require("../models/proposal.model");
var currentContext = require('../../common/currentContext');
var mailer = require('../../common/aws_mailer');
var leadService = require('./lead.service');
var minioClient = require('../../config/minioClient').minioClient;
var configResolve = require("../../common/configResolver");
var environmentConfig = configResolve.getConfig();

var proposalService = {
    getAllProposals: getAllProposals,
    getProposalById:getProposalById,
    addProposal: addProposal,
    updateProposal:updateProposal,
    deleteProposal:deleteProposal,
    getProposalByProposalName: getProposalByProposalName,
    getProposalsByPage: getProposalsByPage,
    getAllProposalsCount: getAllProposalsCount,
    getProposalsByPageWithSort: getProposalsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchProposals: searchProposals,
    getAllProposalOverview: getAllProposalOverview,
    sendProposal:sendProposal
}

function addProposal(proposalData, token) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        proposalData.createdBy = user.email;
        proposalData.lastModifiedBy = user.email;
        
        proposalModel.create(proposalData).then(async (data)=>{
            if (data.status === 'SENT') {
                const leadInfo = await leadService.getLeadById(data.entityId);
                const fileName = proposalData.attachment + `&token=${token}`;
                var messageBody = "Please find attached Proposal.";
                var subject = "Proposal";
                mailer.mail(leadInfo.email, subject, messageBody, undefined,null, fileName);
            }
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updateProposal(id,proposalData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        proposalData.lastModifiedBy = user.email;
        
        proposalModel.updateById(id,proposalData).then(async (data)=>{
            if (data.status === 'SENT') {
                const leadInfo = await leadService.getLeadById(data.lead);
                const fileName = proposalData.attachment;
                var messageBody = "Please find attached Proposal.";
                var subject = "Proposal";
                mailer.mail(leadInfo.email, subject, messageBody, undefined,null, fileName);
            }
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteProposal(id) {
    return new Promise((resolve,reject) => {
        proposalModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllProposals() {
    return new Promise((resolve,reject) => {
        proposalModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getProposalById(id) {
    return new Promise((resolve,reject) => {
        proposalModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getProposalByProposalName(proposalName, tenant){
    return new Promise((resolve,reject) => {
        proposalModel.searchOne({'proposalName': proposalName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllProposalsCount(query) {
    return new Promise((resolve, reject) => {
        proposalModel.countDocuments(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getProposalsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        proposalModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getProposalsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        proposalModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        proposalModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchProposals(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        proposalModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllProposalOverview(){
    return new Promise((resolve, reject) => {
        var promises = [];
        promises.push(getAllProposalsCount({}));
        promises.push(getAllProposalsCount({'status':'DRAFT'}));
        promises.push(getAllProposalsCount({'status':'SENT'}));

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

function sendProposal(){
    return new Promise( async( resolve, reject ) => {
        try{

        } catch ( err ){
            reject( err );
        }
    });
}

module.exports = proposalService;

