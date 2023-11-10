var vaultModel = require("../models/vault.model");
var currentContext = require('../../common/currentContext');

var vaultService = {
    getAllVaults: getAllVaults,
    getVaultById:getVaultById,
    addVault: addVault,
    updateVault:updateVault,
    deleteVault:deleteVault,
    getVaultByVaultName: getVaultByVaultName,
    getVaultsByPage: getVaultsByPage,
    getAllVaultsCount: getAllVaultsCount,
    getVaultsByPageWithSort: getVaultsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    getVaultFolderByName: getVaultFolderByName,
    search: search
}

function addVault(vaultData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        vaultData.createdBy = user.email;
        vaultData.lastModifiedBy = user.email;
        
        vaultModel.create(vaultData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updateVault(id,vaultData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        vaultData.lastModifiedBy = user.email;
        
        vaultModel.updateById(id,vaultData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteVault(id) {
    return new Promise((resolve,reject) => {
        vaultModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllVaults(entityId, entityType) {
    return new Promise((resolve,reject) => {
        vaultModel.search({
            'entityId': entityId,
            'entityType': entityType
        }).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getVaultById(id) {
    return new Promise((resolve,reject) => {
        vaultModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getVaultByVaultName(vaultName, tenant){
    return new Promise((resolve,reject) => {
        vaultModel.searchOne({'vaultName': vaultName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllVaultsCount() {
    return new Promise((resolve, reject) => {
        vaultModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getVaultsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        vaultModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getVaultsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        vaultModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        vaultModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getVaultFolderByName(name) {
    var query = {
        name: name,
        isFile: false
    }
    return new Promise((resolve,reject) => {
        vaultModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function search(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        vaultModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports = vaultService;

