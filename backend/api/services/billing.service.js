var billingModel = require("../models/billing.model");
var currentContext = require('../../common/currentContext');
var configResolve = require("../../common/configResolver");
var config = configResolve.getConfig();

var billingService = {
    getAllBillings: getAllBillings,
    getBillingById:getBillingById,
    addBilling: addBilling,
    updateBilling:updateBilling,
    deleteBilling:deleteBilling,
    getBillingByBillingName: getBillingByBillingName,
    getBillingsByPage: getBillingsByPage,
    getAllBillingsCount: getAllBillingsCount,
    getBillingsByPageWithSort: getBillingsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchBillings: searchBillings,
    getBillingByName: getBillingByName,
    getAllBillingsbyOrganizationId: getAllBillingsbyOrganizationId
}

function addBilling(billingData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        billingData.createdBy = user.email;
        billingData.lastModifiedBy = user.email;
        
        billingModel.create(billingData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updateBilling(id,billingData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        billingData.lastModifiedBy = user.email;
        
        billingModel.updateById(id,billingData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteBilling(id) {
    return new Promise((resolve,reject) => {
        billingModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllBillings() {
    return new Promise((resolve,reject) => {
        billingModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getBillingById(id) {
    return new Promise((resolve,reject) => {
        billingModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllBillingsbyOrganizationId(orgId) {
    return new Promise((resolve,reject) => {
        var context = currentContext.getCurrentContext();
        context.workspaceId = config.master_schema;

        let searchCriteria = {
            pageSize: 10000000,
            pageNo: 1,
            query:{'organizationId': orgId}
        }
        searchBillings(searchCriteria).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}



function getBillingByBillingName(billingName, tenant){
    return new Promise((resolve,reject) => {
        billingModel.searchOne({'billingName': billingName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllBillingsCount() {
    return new Promise((resolve, reject) => {
        billingModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getBillingsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        billingModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getBillingsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        billingModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        billingModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchBillings(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        billingModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getBillingByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve,reject) => {
        billingModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


module.exports = billingService;

