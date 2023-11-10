var leaveModel = require("../models/leave.model");
var currentContext = require('../../common/currentContext');
var LeaveStatus = require('../../common/constants/LeaveStatus');
const LeaveType = require('../../common/constants/LeaveType');;
const NotificationType = require('../../common/constants/NotificationType');
const notificationClient = require('../../common/notificationClient');
const moment = require('moment');

var leaveService = {
    getAllLeaves: getAllLeaves,
    getLeaveById: getLeaveById,
    addLeave: addLeave,
    updateLeave: updateLeave,
    deleteLeave: deleteLeave,
    getLeaveByLeaveName: getLeaveByLeaveName,
    getLeavesByPage: getLeavesByPage,
    getAllLeavesCount: getAllLeavesCount,
    getLeavesByPageWithSort: getLeavesByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    getAllLeavesWithinTimeframe: getAllLeavesWithinTimeframe,
    addHoliday: addHoliday,
    approveLeave: approveLeave,
    getAllApprovedLeavesByDate: getAllApprovedLeavesByDate,
    getAllHolodaysByDate: getAllHolodaysByDate,
    getAllApprovalPendingLeavesByDate: getAllApprovalPendingLeavesByDate,
    searchLeaves: searchLeaves,
    getCountOnLeave: getCountOnLeave,
    getAllOnLeaves: getAllOnLeaves,
    getCountApprovalPending: getCountApprovalPending,
    getAllApprovalPendingLeaves: getAllApprovalPendingLeaves,
    getCountUpcomingLeaves: getCountUpcomingLeaves,
    getUpcomingLeaves: getUpcomingLeaves,
    getAllUpcomingLeaves: getAllUpcomingLeaves,
    getAllLeavesTakenByDate: getAllLeavesTakenByDate,
    getAllHolidaysByDate: getAllHolidaysByDate,
    getTodayOnLeave:getTodayOnLeave,
    getDayHolidays: getDayHolidays

}

function addHoliday(leaveData) {
    return new Promise((resolve, reject) => {

        let leavePromise = [];
        leaveData.leaves.forEach((leave) => {
            leave.leaveStatus = LeaveStatus.APPROVED;
            leavePromise.push(addLeave(leave));
        });

        Promise.all(leavePromise).then((data) => {
            resolve({ "success": true })
        }).catch(err => {
            reject(err);
        })

    })

}

function addLeave(leaveData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        leaveData.createdBy = user.email;
        if (leaveData.leaveStatus == undefined) {
            leaveData.leaveStatus = LeaveStatus.PENDING;
        }
        leaveData.lastModifiedBy = user.email;
        leaveData.fromDate = new Date(leaveData.fromDate).toDateString();
        leaveData.toDate = new Date(leaveData.toDate).toDateString();
        leaveData.user = user.userId;

        leaveModel.create(leaveData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function updateLeave(id, leaveData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        leaveData.lastModifiedBy = user.email;
        leaveData.fromDate = new Date(leaveData.fromDate).toDateString();
        leaveData.toDate = new Date(leaveData.toDate).toDateString();
        leaveData.user = user.userId;

        leaveModel.updateById(id, leaveData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteLeave(id) {
    return new Promise((resolve, reject) => {
        leaveModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllLeaves() {
    return new Promise((resolve, reject) => {
        leaveModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getLeaveById(id) {
    return new Promise((resolve, reject) => {
        leaveModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getLeaveByLeaveName(leaveName, tenant) {
    return new Promise((resolve, reject) => {
        leaveModel.searchOne({ 'leaveName': leaveName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllLeavesCount() {
    return new Promise((resolve, reject) => {
        leaveModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getLeavesByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        leaveModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getLeavesByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        leaveModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        leaveModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllLeavesWithinTimeframe(startDate, endDate) {
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$gte": new Date(startDate)
                }
            }, {
                "toDate": {
                    "$lte": new Date(endDate)
                }
            }
        ]
    };


    return new Promise((resolve, reject) => {
        leaveModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function approveLeave(id, leaveData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        leaveData.lastModifiedBy = user.email;
        leaveData.leaveStatus = LeaveStatus.APPROVED;

        leaveModel.updateById(id, leaveData).then((data) => {
            notificationClient.notify(NotificationType.LEAVE_APPROVED, data, user.workspaceId, user.userId);
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllApprovedLeavesByDate(date) {
    var user = currentContext.getCurrentContext();
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$lte": new Date(date).toDateString()
                }
            }, {
                "toDate": {
                    "$gte": new Date(date).toDateString()
                }
            }, {
                "leaveStatus": {
                    "$eq": LeaveStatus.APPROVED
                }
            }, {
                "leaveType": {
                    "$ne": LeaveType.HOLIDAY
                }
            }, {
                "createdBy": {
                    "$eq": user.email
                }
            }
        ]
    };


    return new Promise((resolve, reject) => {
        leaveModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllLeavesTakenByDate(fromDate, toDate) {
    var user = currentContext.getCurrentContext();
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$gte": new Date(fromDate).toDateString()
                }
            }, {
                "toDate": {
                    "$lte": new Date(toDate).toDateString()
                }
            }, {
                "leaveStatus": {
                    "$eq": LeaveStatus.APPROVED
                }
            }, {
                "leaveType": {
                    "$ne": LeaveType.HOLIDAY
                }
            }, {
                "createdBy": {
                    "$eq": user.email
                }
            }
        ]
    };


    return new Promise((resolve, reject) => {
        leaveModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllHolodaysByDate(date) {
    var user = currentContext.getCurrentContext();
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$lte": new Date(date).toDateString()
                }
            }, {
                "toDate": {
                    "$gte": new Date(date).toDateString()
                }
            }, {
                "leaveType": {
                    "$eq": LeaveType.HOLIDAY
                }
            }
        ]
    };


    return new Promise((resolve, reject) => {
        leaveModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getDayHolidays(date) {
    var user = currentContext.getCurrentContext();

    var query = {
        "$and": [
            {
                "fromDate": {
                    "$eq": new Date(date).toDateString()
                }
            }, {
                "toDate": {
                    "$eq": new Date(date).toDateString()
                }
            },{
                "leaveType": {
                    "$eq": LeaveType.HOLIDAY
                }
            }
        ]
    };


    return new Promise((resolve, reject) => {
        leaveModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllHolidaysByDate(startDate, endDate) {
    var user = currentContext.getCurrentContext();
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$gte": new Date(startDate).toDateString()
                }
            }, {
                "toDate": {
                    "$lte": new Date(endDate).toDateString()
                }
            }, {
                "leaveType": {
                    "$eq": LeaveType.HOLIDAY
                }
            }
        ]
    };


    return new Promise((resolve, reject) => {
        leaveModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllApprovalPendingLeavesByDate(date) {
    var user = currentContext.getCurrentContext();
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$lte": new Date(date).toDateString()
                }
            }, {
                "toDate": {
                    "$gte": new Date(date).toDateString()
                }
            }, {
                "leaveStatus": {
                    "$eq": LeaveStatus.PENDING
                }
            }, {
                "leaveType": {
                    "$ne": LeaveType.HOLIDAY
                }
            }
        ]
    };


    return new Promise((resolve, reject) => {
        leaveModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function searchLeaves(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;

    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        leaveModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getCountOnLeave() {
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$eq": new Date().toDateString()
                }
            },
            {
                "leaveStatus": {
                    "$eq": LeaveStatus.APPROVED
                }
            }
        ]
    };

    return new Promise((resolve, reject) => {
        leaveModel.countDocuments(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllOnLeaves() {
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$eq": new Date().toDateString()
                }
            },
            {
                "leaveStatus": {
                    "$eq": LeaveStatus.APPROVED
                }
            }
        ]
    };

    return new Promise((resolve, reject) => {
        leaveModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getCountApprovalPending() {
    return new Promise((resolve, reject) => {
        leaveModel.countDocuments({ 'leaveStatus': 'PENDING' }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllApprovalPendingLeaves() {
    return new Promise((resolve, reject) => {
        leaveModel.search({ 'leaveStatus': 'PENDING' }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getCountUpcomingLeaves() {
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$gt": new Date().toDateString()
                }
            },
            {
                "leaveStatus": {
                    "$eq": LeaveStatus.APPROVED
                }
            }
        ]
    };
    return new Promise((resolve, reject) => {
        leaveModel.countDocuments(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllUpcomingLeaves() {
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$gt": new Date().toDateString()
                }
            },
            {
                "leaveStatus": {
                    "$eq": LeaveStatus.APPROVED
                }
            }
        ]
    };
    return new Promise((resolve, reject) => {
        leaveModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getUpcomingLeaves(startDate, endDate, type) {
    let user = currentContext.getCurrentContext();
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$gt": startDate
                }
            },
            {
                "toDate": {
                    "$lt": endDate
                }
            },
            {
                "leaveStatus": {
                    "$eq": LeaveStatus.APPROVED
                }
            },
            {
                "createdBy": {
                    "$eq": user.email
                }
            }
        ]
    };
    if (type != undefined) {
        query['$and'].push({
            "leaveType": type
        });
    } else {
        query['$and'].push({
            "leaveType": {
                "$ne": LeaveType.HOLIDAY
            }
            // "leaveType": LeaveType.HOLIDAY
        });
    }
    return new Promise((resolve, reject) => {
        leaveModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getTodayOnLeave(){
    var query = { 
        "$and" : [
            { "fromDate" : { $lte : moment().startOf('day').toISOString() } },
            {"toDate": { $gte : moment().startOf('day').toISOString() }},
            { "leaveType": { $ne : LeaveType.HOLIDAY } },
            { "leaveStatus": { $eq : LeaveStatus.APPROVED } }
        ]
    };
    return new Promise((resolve, reject) => {
        leaveModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports = leaveService;

