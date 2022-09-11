var customerModel = require("../models/customer.model");
var currentContext = require('../../common/currentContext');
let customerStatus = require('../../common/constants/CustomerStatus')
var _ = require('lodash');

var customerService = {
    getAllCustomers: getAllCustomers,
    getCustomerById:getCustomerById,
    addCustomer: addCustomer,
    updateCustomer:updateCustomer,
    deleteCustomer:deleteCustomer,
    getCustomerByCustomerName: getCustomerByCustomerName,
    getCustomersByPage: getCustomersByPage,
    getAllCustomersCount: getAllCustomersCount,
    getCustomersByPageWithSort: getCustomersByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchCustomers: searchCustomers,
    textSearch: textSearch,
    getAllCustomersOverview: getAllCustomersOverview,
    getAggregateCount: getAggregateCount,
    getCustomerCountByTimestamp: getCustomerCountByTimestamp
}

function addCustomer(customerData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        customerData.createdBy = user.email;
        customerData.lastModifiedBy = user.email;
        
        customerModel.create(customerData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updateCustomer(id,customerData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        customerData.lastModifiedBy = user.email;
        
        customerModel.updateById(id,customerData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteCustomer(id, customer) {
    customer.status = customerStatus.ARCHIVE;
    return updateCustomer(id, customer);
}

function getAllCustomers(startsWith, assigned) {
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
        customerModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getCustomerById(id) {
    return new Promise((resolve,reject) => {
        customerModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getCustomerByCustomerName(customerName, tenant){
    return new Promise((resolve,reject) => {
        customerModel.searchOne({'name': customerName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllCustomersCount(query) {
    return new Promise((resolve, reject) => {
        customerModel.countDocuments(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getCustomersByPage(pageNo, pageSize, startsWith, assigned) {
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
        customerModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getCustomersByPageWithSort(pageNo, pageSize, sortBy, assigned) {
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
        customerModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        customerModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchCustomers(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        customerModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function textSearch(text, assigned, status) {
    return new Promise((resolve, reject) => {
        customerModel.getTextSearchResult(text).then((data) => {
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

function getAllCustomersOverview(){
    return new Promise((resolve, reject) => {
        var promises = [];
        promises.push(getAllCustomersCount({'status':'NEW'}));
        promises.push(getAllCustomersCount({'status':'ACTIVE'}));
        promises.push(getAllCustomersCount({'status':'INACTIVE'}));
        promises.push(getAllCustomersCount({'status':'ARCHIVE'}));

        
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
        customerModel.getAggregateCount(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getCustomerCountByTimestamp(key, year, status){
    return new Promise((resolve, reject) => {
        customerModel.groupByKeyAndCountDocumentsByMonth(key, year, status).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject(err);
        })
    });
}

module.exports = customerService;

