var widgetModel = require("../models/widget.model");
var currentContext = require('../../common/currentContext');
var ootbWidgets = require('../../config/ootbWidgets.json');

var widgetService = {
    getAllWidgets: getAllWidgets,
    getWidgetById:getWidgetById,
    addWidget: addWidget,
    updateWidget:updateWidget,
    deleteWidget:deleteWidget,
    getWidgetByWidgetName: getWidgetByWidgetName,
    getWidgetsByPage: getWidgetsByPage,
    getAllWidgetsCount: getAllWidgetsCount,
    getWidgetsByPageWithSort: getWidgetsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchWidgets: searchWidgets,
    getWidgetByName: getWidgetByName,
    createDefaultWidgets: createDefaultWidgets
}

function addWidget(widgetData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        widgetData.createdBy = user.email;
        widgetData.lastModifiedBy = user.email;
        
        widgetModel.create(widgetData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updateWidget(id,widgetData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        widgetData.lastModifiedBy = user.email;
        
        widgetModel.updateById(id,widgetData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteWidget(id) {
    return new Promise((resolve,reject) => {
        widgetModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllWidgets() {
    return new Promise((resolve,reject) => {
        widgetModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWidgetById(id) {
    return new Promise((resolve,reject) => {
        widgetModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWidgetByWidgetName(widgetName, tenant){
    return new Promise((resolve,reject) => {
        widgetModel.searchOne({'name': widgetName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllWidgetsCount() {
    return new Promise((resolve, reject) => {
        widgetModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWidgetsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        widgetModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWidgetsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        widgetModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        widgetModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchWidgets(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        widgetModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWidgetByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve,reject) => {
        widgetModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function createDefaultWidgets() {
    
    return new Promise((resolve,reject) => {
        var promiseArray = [];
        ootbWidgets.forEach(widget => {
            promiseArray.push(addWidget(widget));
        });
        Promise.all(promiseArray).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
}



module.exports = widgetService;

