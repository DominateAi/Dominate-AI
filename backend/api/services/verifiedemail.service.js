var verifiedemailModel = require("../models/verifiedemail.model");
var currentContext = require('../../common/currentContext');
const notificationClient = require('../../common/notificationClient');
const NotificationType = require('../../common/constants/NotificationType');

var verifiedemailService = {
    getAllVerifiedemails: getAllVerifiedemails,
    getVerifiedemailById: getVerifiedemailById,
    addVerifiedemail: addVerifiedemail,
    updateVerifiedemail: updateVerifiedemail,
    deleteVerifiedemail: deleteVerifiedemail,
    getVerifiedemailByVerifiedemailName: getVerifiedemailByVerifiedemailName,
    getVerifiedemailsByPage: getVerifiedemailsByPage,
    getAllVerifiedemailsCount: getAllVerifiedemailsCount,
    getVerifiedemailsByPageWithSort: getVerifiedemailsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchVerifiedemails: searchVerifiedemails,
    getVerifiedemailByName: getVerifiedemailByName,
    getAllVerifiedemailsByDate: getAllVerifiedemailsByDate,
    getAllVerifiedemailsByDateAndUser:getAllVerifiedemailsByDateAndUser
}

function addVerifiedemail(verifiedemailData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        verifiedemailData.createdBy = user.email;
        verifiedemailData.lastModifiedBy = user.email;
        verifiedemailData.attemptedOn = new Date().toDateString();

        verifiedemailModel.create(verifiedemailData).then((data) => {
            verifiedemailModel.getById(data.id).then((verifiedemailResult) => {
                resolve(verifiedemailResult);
            }).catch((err) => {
                reject(err);
            })
        }).catch((err) => {
            reject(err);
        })
    })

}

function updateVerifiedemail(id, verifiedemailData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        verifiedemailData.lastModifiedBy = user.email;
        verifiedemailData.verifiedemailDate = new Date(verifiedemailData.verifiedemailDate).toDateString();

        verifiedemailModel.updateById(id, verifiedemailData).then((data) => {
            notificationClient.notify(NotificationType.MEETING_UPDATED, data, user.workspaceId, data.assigned);
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteVerifiedemail(id) {
    return new Promise((resolve, reject) => {
        verifiedemailModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllVerifiedemails() {
    return new Promise((resolve, reject) => {
        verifiedemailModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getVerifiedemailById(id) {
    return new Promise((resolve, reject) => {
        verifiedemailModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getVerifiedemailByVerifiedemailName(verifiedemailName, tenant) {
    return new Promise((resolve, reject) => {
        verifiedemailModel.searchOne({ 'verifiedemailName': verifiedemailName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllVerifiedemailsCount() {
    return new Promise((resolve, reject) => {
        verifiedemailModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getVerifiedemailsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        verifiedemailModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getVerifiedemailsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        verifiedemailModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        verifiedemailModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchVerifiedemails(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        verifiedemailModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getVerifiedemailByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve, reject) => {
        verifiedemailModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllVerifiedemailsByDate(date) {
    console.log("verifiedemail date", date)
    var user = currentContext.getCurrentContext();
    var query = {
        "$and": [
            {
                "verifiedemailDate": {
                    "$eq": new Date(date).toDateString()
                }
            },
            {
                "$or": [
                    {
                        "assigned": {
                            "$eq": user.userId
                        }
                    }, {
                        "organizer": {
                            "$eq": user.userId
                        }
                    }

                ]
            }
        ]
    };


    return new Promise((resolve, reject) => {
        verifiedemailModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getAllVerifiedemailsByDateAndUser( date, isOrganisation ) {
    var user = currentContext.getCurrentContext();
    var query = { "$and": [
            { "verifiedemailDate": { "$eq": new Date(date).toDateString() } },
            { "$or": [
                    { "assigned": { "$eq": user.userId } }, 
                    { "organizer": {"$eq": user.userId } }
                ]
            }
        ]};
    if( isOrganisation ){
        query = { "$and": [
            { "verifiedemailDate": { "$eq": new Date(date).toDateString() } },
            { "$or": [
                    { "assigned": { "$eq": user.userId } }, 
                    { "organizer": {"$eq": user.userId } }
                ]
            }
        ]};
    }

    return new Promise((resolve, reject) => {
        verifiedemailModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports = verifiedemailService;

