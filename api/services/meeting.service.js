var meetingModel = require("../models/meeting.model");
var currentContext = require('../../common/currentContext');
const NotificationType = require('../../common/constants/NotificationType');

var meetingService = {
    getAllMeetings: getAllMeetings,
    getMeetingById: getMeetingById,
    addMeeting: addMeeting,
    updateMeeting: updateMeeting,
    deleteMeeting: deleteMeeting,
    getMeetingByMeetingName: getMeetingByMeetingName,
    getMeetingsByPage: getMeetingsByPage,
    getAllMeetingsCount: getAllMeetingsCount,
    getMeetingsByPageWithSort: getMeetingsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchMeetings: searchMeetings,
    getMeetingByName: getMeetingByName,
    getAllMeetingsByDate: getAllMeetingsByDate,
    getAllMeetingsByDateAndUser:getAllMeetingsByDateAndUser
}

function addMeeting(meetingData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        meetingData.createdBy = user.email;
        meetingData.lastModifiedBy = user.email;
        meetingData.organizer = user.userId;
        meetingData.meetingDate = new Date(meetingData.meetingDate).toDateString();

        meetingModel.create(meetingData).then((data) => {
            meetingModel.getById(data.id).then((meetingResult) => {
                resolve(meetingResult);
            }).catch((err) => {
                reject(err);
            })
        }).catch((err) => {
            reject(err);
        })
    })

}

function updateMeeting(id, meetingData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        meetingData.lastModifiedBy = user.email;
        meetingData.meetingDate = new Date(meetingData.meetingDate).toDateString();

        meetingModel.updateById(id, meetingData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteMeeting(id) {
    return new Promise((resolve, reject) => {
        meetingModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllMeetings() {
    return new Promise((resolve, reject) => {
        meetingModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getMeetingById(id) {
    return new Promise((resolve, reject) => {
        meetingModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getMeetingByMeetingName(meetingName, tenant) {
    return new Promise((resolve, reject) => {
        meetingModel.searchOne({ 'meetingName': meetingName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllMeetingsCount() {
    return new Promise((resolve, reject) => {
        meetingModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getMeetingsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        meetingModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getMeetingsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        meetingModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        meetingModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchMeetings(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        meetingModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getMeetingByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve, reject) => {
        meetingModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllMeetingsByDate(date) {
    console.log("meeting date", date)
    var user = currentContext.getCurrentContext();
    var query = {
        "$and": [
            {
                "meetingDate": {
                    "$eq": new Date(date).toDateString()
                }
            },
            {
                "organizer": {
                            "$eq": user.userId
                        }
                    }
        ]
    };


    return new Promise((resolve, reject) => {
        meetingModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getAllMeetingsByDateAndUser( date, isOrganisation ) {
    var user = currentContext.getCurrentContext();
    var query = { "$and": [
            { "meetingDate": { "$eq": new Date(date).toDateString() } },
            { "$or": [
                    { "assigned": { "$eq": user.userId } }, 
                    { "organizer": {"$eq": user.userId } }
                ]
            }
        ]};
    if( isOrganisation ){
        query = { "$and": [
            { "meetingDate": { "$eq": new Date(date).toDateString() } },
            { "$or": [
                    { "assigned": { "$eq": user.userId } }, 
                    { "organizer": {"$eq": user.userId } }
                ]
            }
        ]};
    }

    return new Promise((resolve, reject) => {
        meetingModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports = meetingService;

