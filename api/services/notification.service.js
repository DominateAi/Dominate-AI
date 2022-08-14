var notificationModel = require("../models/notification.model");
var currentContext = require('../../common/currentContext');

var notificationService = {
    getAllNotifications: getAllNotifications,
    getNotificationById: getNotificationById,
    addNotification: addNotification,
    updateNotification: updateNotification,
    deleteNotification: deleteNotification,
    getNotificationByNotificationName: getNotificationByNotificationName,
    getNotificationsByPage: getNotificationsByPage,
    getAllNotificationsCount: getAllNotificationsCount,
    getNotificationsByPageWithSort: getNotificationsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchNotifications: searchNotifications,
    getNotificationByName: getNotificationByName
}

function addNotification(NotificationData, workspaceId) {
    return new Promise((resolve, reject) => {
        NotificationData.isRead = false;
        notificationModel.create(NotificationData, workspaceId).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function updateNotification(id, NotificationData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        NotificationData.lastModifiedBy = user.email;

        notificationModel.updateById(id, NotificationData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteNotification(id) {
    return new Promise((resolve, reject) => {
        notificationModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllNotifications() {
    return new Promise((resolve, reject) => {
        notificationModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getNotificationById(id) {
    return new Promise((resolve, reject) => {
        notificationModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getNotificationByNotificationName(NotificationName, tenant) {
    return new Promise((resolve, reject) => {
        notificationModel.searchOne({ 'NotificationName': NotificationName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllNotificationsCount() {
    return new Promise((resolve, reject) => {
        notificationModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getNotificationsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        notificationModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getNotificationsByPageWithSort(pageNo, pageSize, sortBy) {
    const user = currentContext.getCurrentContext();
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = -1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    const query = {
        "$and": [
            {
                "$or": [
                    { "to": user.userId },
                    { "to": "*" }
                ]
            },
            { "isRead": false }
        ]
    };

    return new Promise((resolve, reject) => {
        notificationModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        notificationModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchNotifications(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        notificationModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getNotificationByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve, reject) => {
        notificationModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


module.exports = notificationService;

