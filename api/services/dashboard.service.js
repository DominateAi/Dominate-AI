var dashboardModel = require("../models/dashboard.model");
var currentContext = require('../../common/currentContext');

var dashboardService = {
    getAllDashboards: getAllDashboards,
    getDashboardById:getDashboardById,
    addDashboard: addDashboard,
    updateDashboard:updateDashboard,
    deleteDashboard:deleteDashboard,
    getDashboardByDashboardName: getDashboardByDashboardName,
    getDashboardsByPage: getDashboardsByPage,
    getAllDashboardsCount: getAllDashboardsCount,
    getDashboardsByPageWithSort: getDashboardsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchDashboards: searchDashboards,
    getDashboardByName: getDashboardByName
}

function addDashboard(dashboardData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        dashboardData.createdBy = user.email;
        dashboardData.lastModifiedBy = user.email;
        
        dashboardModel.create(dashboardData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updateDashboard(id,dashboardData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        dashboardData.lastModifiedBy = user.email;
        
        dashboardModel.updateById(id,dashboardData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteDashboard(id) {
    return new Promise((resolve,reject) => {
        dashboardModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllDashboards(userId) {
    var query = {
        "$and": []
    };
    if(userId != undefined){
        query['$and'].push({
            'user' : userId
        }); 
    }
    if(userId == undefined){
        query = {}
    }

    return new Promise((resolve,reject) => {
        dashboardModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getDashboardById(id) {
    return new Promise((resolve,reject) => {
        dashboardModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getDashboardByDashboardName(dashboardName, tenant){
    return new Promise((resolve,reject) => {
        dashboardModel.searchOne({'dashboardName': dashboardName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllDashboardsCount() {
    return new Promise((resolve, reject) => {
        dashboardModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getDashboardsByPage(pageNo, pageSize, userId) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    var query = {
        "$and": []
    };
    if(userId != undefined){
        query['$and'].push({
            'user' : userId
        }); 
    }
    if(userId == undefined){
        query = {}
    }

    return new Promise((resolve, reject) => {
        dashboardModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getDashboardsByPageWithSort(pageNo, pageSize, sortBy, userId) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;
    var query = {
        "$and": []
    };
    if(userId != undefined){
        query['$and'].push({
            'user' : userId
        }); 
    }
    if(userId == undefined){
        query = {}
    }

    return new Promise((resolve, reject) => {
        dashboardModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        dashboardModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchDashboards(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        dashboardModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getDashboardByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve,reject) => {
        dashboardModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


module.exports = dashboardService;

