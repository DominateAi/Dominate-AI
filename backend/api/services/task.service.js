var taskModel = require("../models/task.model");
var currentContext = require('../../common/currentContext');
const NotificationType = require('../../common/constants/NotificationType');
const moment = require('moment');

var taskService = {
    getAllTasks: getAllTasks,
    getTaskById: getTaskById,
    addTask: addTask,
    updateTask: updateTask,
    deleteTask: deleteTask,
    getTaskByTaskName: getTaskByTaskName,
    getTasksByPage: getTasksByPage,
    getAllTasksCount: getAllTasksCount,
    getTasksByPageWithSort: getTasksByPageWithSort,
    getTaskByProject: getTaskByProject,
    searchTasks: searchTasks,
    getCompletedTasksCount: getCompletedTasksCount,
    getTaskCountByTimestamp: getTaskCountByTimestamp,
    getTodaysOpenTask:getTodaysOpenTask
}

function addTask(taskData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        taskData.createdBy = user.email;
        taskData.lastModifiedBy = user.email;

        /* taskModel.create(taskData).then((data)=>{
            milestoneService.getMilestoneById(taskData.milestone).then((milestoneData)=>{
                milestoneData.tasks.push(data._id)
                milestoneService.updateMilestone(milestoneData._id, milestoneData).then((milestomeUpdateData)=>{
                    resolve(data);
                }).catch((err)=>{
                    reject(err);
                })
            }).catch((err)=>{
                reject(err);
            })
        }).catch((err) => {
            reject(err);
        }) */

        taskModel.create(taskData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })

    })

}

function updateTask(id, taskData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        taskData.lastModifiedBy = user.email;

        taskModel.updateById(id, taskData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteTask(id) {
    return new Promise((resolve, reject) => {
        taskModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllTasks() {
    return new Promise((resolve, reject) => {
        taskModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTaskById(id) {
    return new Promise((resolve, reject) => {
        taskModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTaskByTaskName(taskName) {
    return new Promise((resolve, reject) => {
        taskModel.searchOne({ 'name': taskName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllTasksCount(filter) {
    return new Promise((resolve, reject) => {
        if (filter != undefined) {
            var query = [{ $group: { _id: "$" + filter, count: { $sum: 1 } } }];
            taskModel.aggregatedDocuments(query).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        } else {
            taskModel.countDocuments({}).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        }
    });
}

function getCompletedTasksCount(filter) {

    let query = {
        'status': 'COMPLETED'
    };
    return new Promise((resolve, reject) => {
        taskModel.countDocuments(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTasksByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        taskModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTasksByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        taskModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTaskByProject(projectId, milestoneId, task) {
    var query = {
        name: task,
        project: projectId,
        milestone: milestoneId
    }
    return new Promise((resolve, reject) => {
        taskModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchTasks(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        taskModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTaskCountByTimestamp(key, year, assigned) {
    return new Promise((resolve, reject) => {
        taskModel.groupByKeyAndCountDocumentsByMonth_v2(key, year, assigned).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

/************************************
 * @DESC - GET TODAY'S TASK OPEN ONE
 ***********************************/
function getTodaysOpenTask( isOrganisation ){
    return new Promise(async ( resolve, reject ) => {
        var user = currentContext.getCurrentContext();
        let query = {
            fromDate: { $lte : moment().format('YYYY-MM-DD')+'T00:00:00.000Z' },
            toDate : { $gte : moment().format('YYYY-MM-DD')+'T00:00:00.000Z' },
            status:{ $ne : 'COMPLETED' } 
        }
        if( !isOrganisation ){
            query.createdBy = user.email;
        }
        taskModel.search( query )
        .then( data => resolve(data) )
        .catch( err => reject( data ) )
    })
}



module.exports = taskService;

