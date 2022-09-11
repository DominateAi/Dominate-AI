const moment = require('moment');
var userModel = require("../models/user.model");
var followupModel = require("../models/followup.model");
var meetingModel = require("../models/meeting.model");
var currentContext = require('../../common/currentContext');
var Status = require('../../common/constants/Status');
const roleService = require('../services/role.service');
const errorCode = require('../../common/error-code');
const _ = require('lodash');
const leaveService = require('../services/leave.service');
const leadService = require('../services/lead.service');
const leadModel = require("../models/lead.model");
const activityService = require('../services/activity.service');
const leaveType = require("../../common/constants/LeaveType");
const helper = require("../../common/helper");
const { getForgotPasswordTemplate } = require('../../common/emailTemplateService');
const { demandOption } = require('yargs');
var errorMethods = require('../../common/error-methods');

var userService = {
    getAllUser: getAllUser,
    getUserById: getUserById,
    addUser: addUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getUserByEmail: getUserByEmail,
    addDefaultUser: addDefaultUser,
    comparePassword: comparePassword,
    searchUsers: searchUsers,
    userCountData: userCountData,
    getAllUsersCount: getAllUsersCount,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    getUsersByRoleCategory: getUsersByRoleCategory,
    getEntityByEmail: getEntityByEmail,
    textSearch: textSearch,
    getUserByRole: getUserByRole,
    getAllUsersOverview: getAllUsersOverview,
    archiveUser: archiveUser,
    getActivityByUserId: getActivityByUserId,
    getUserOverviewByStatus: getUserOverviewByStatus.apply,
    usersWithinTimeFrame: usersWithinTimeFrame,
    getUsersSimply: getUsersSimply
    }

function addUser(userData) {
    return new Promise((resolve, reject) => {

        console.log("userData is", userData);
        userService.getUserByEmail(userData.email).then((data) => {
            if (data) {
                return reject(errorCode.USER_ALREADY_EXIST);
            } else {
                var user = currentContext.getCurrentContext();
                userData.createdBy = user.email;
                userData.lastModifiedBy = user.email;
                if (userData.name == undefined) {
                    userData.name = userData.firstName + " " + userData.lastName;
                }
                if(userData.profileImage != undefined){
                    userData.profileImage = helper.getPathFromImage(userData.profileImage, user.workspaceId);
                }
             userData.name = userData.firstName + " " + userData.lastName;
             userData.status = Status.ACTIVE;
             userData.dateOfJoining = new Date().toISOString();
                //add default role
                if (userData.role == undefined) {
                    roleService.getDefaultRole().then((result) => {
                        if (result == undefined || result == null) {
                            reject({ "message": "role was: " + null });
                        } else {
                            userData.role = result._id;
                            createRole(userData, resolve, reject);
                        }
                    });
                } else {
                    createRole(userData, resolve, reject);
                }
            }
        });
    })
}

//this looks like its creating a user, not a role
function createRole(userData, resolve, reject) {
    userModel.create(userData).then((data) => {
        resolve(data);
    }).catch((err) => {
        reject(err);
    });
}

function addDefaultUser(userData) {
    return new Promise((resolve, reject) => {

        if (userData.firstName == undefined) {
            userData.firstName = "Admin";
        }
        if (userData.lastName == undefined) {
            userData.lastName = "Admin";
        }
        addUser(userData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
}

function comparePassword(password, email, workspaceId, next) {
    return new Promise(async( resolve, reject ) => {
        try{
            var user = await userModel.searchOne({"email": email.toLowerCase()})
            if(user){
                var isMatch = await userModel.comparePassword(password, user.password, (err, isMatch) => {
                    if (err) { next(errorMethods.sendBadRequest(errorCode.INVALID_EMAIL_OR_PASSWORD)); }
                    if (!isMatch) {
                        next(errorMethods.sendBadRequest(errorCode.PASSWORD_DOES_NOT_MATCH))
                    }
                    resolve(isMatch)
                  });
            }else{
                next(errorMethods.sendBadRequest(errorCode.USER_WITH_EMAIL_DOES_NOT_EXIST))
            }
        } catch ( err ){
            reject( err );
        }
    })
}

function updateUser(id, userData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        userData.lastModifiedBy = user.email;
        userData.name = userData.firstName + " " + userData.lastName;
        if(userData.profileImage != undefined){
            userData.profileImage = helper.getPathFromImage(userData.profileImage, user.workspaceId);
        }
        userModel.updateById(id, userData).then((data) => {
            getUserById(id).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteUser(id, userData) {
    userData.status = Status.ARCHIVE;
    updateUser(id, userData);
}

function getAllUser() {
    return new Promise((resolve, reject) => {
        var context = currentContext.getCurrentContext();
        var data, close, submerged;
        var transit =[];
        async function getUsers(){
        data = await userModel.search({}); 

            for(i in data){
                if(data[i]!=undefined){
                data[i].profileImage = helper.resolveImagePath(data[i].profileImage, context.workspaceId);
                close = await leadService.closedPercentage(data[i]._id);
                followup = await followupModel.countDocuments({"organizer":data[i]._id});
                meeting = await meetingModel.countDocuments({"organizer":data[i]._id});
                console.log(followup);
                if(Array.isArray(close) && close.length){
                    obj1 = {"closedCount": close[0].count, "closedPercentage":close[0].percentage,"followupCount":followup, "meetingsCount":meeting};
                }
                else{
                    obj1 = {"closedCount": "0", "closedPercentage":"0","followupCount":followup,"meetingsCount":meeting};
                }
                obj2 = data[i]._doc;
                var cluster = {...obj2,...obj1}
                transit.push(cluster);
                }
            }
      }
     getUsers().then(()=>{
         resolve(transit);
     })

    });
}

function getUsersSimply(){
    return new Promise(async(resolve, reject) => {
        try{
        var data = await userModel.search({});
        resolve(data)
        }catch(err){reject(err)}
    })
}

function searchUsers(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    var data, close, submerged;
    var transit =[];
    return new Promise(async(resolve, reject) => {
        try{
        var context = currentContext.getCurrentContext(); 
        // async function getUsers(){
        //     let currentDate = new Date().toISOString();
        //     let lastDate = moment(currentDate).endOf("month").toISOString();
        //     var followup = 0, meeting = 0
            userData = await userModel.getPaginatedResult(query, options); 
    //added json stringify and parse to overcome _doc issue mongoose
        //     let JsonData = JSON.stringify(userData);
        //     let data = JSON.parse(JsonData)
        //         for(user of data){
        //             if(user!==undefined){
        //             user.profileImage = helper.resolveImagePath(user.profileImage, context.workspaceId);
        //             //added below check to stop production error
        //             if(user._id !==undefined){
        //             close = await leadService.closedPercentage(user._id);
        //             followup = await followupModel.countDocuments({"organizer":user._id});
        //             meeting = await meetingModel. countDocuments({"organizer":user._id});
        //             call = await callModel.countDocuments({"from":user._id});
        //             }
        //             upcomingLeaves = await leaveService.getUpcomingLeaves(currentDate, lastDate, leaveType.HOLIDAY)
        //             if(Array.isArray(close) && close.length){
        //                 obj1 = {"closedCount": close[0].count, "closedPercentage":close[0].percentage,"followupCount":followup, "meetingsCount":meeting,"callCount":call};
        //             }
        //             else{
        //                 obj1 = {"closedCount": "0", "closedPercentage":"0","followupCount":followup,"meetingsCount":meeting,"callCount":call};
        //             }
        //             obj2 = user
        //             obj3 = upcomingLeaves;
        //             var cluster = {...obj2,...obj1, "upcomingLeaves":obj3}
        //             transit.push(cluster);
        //             }
        //         }
        //   }
        //  getUsers().then(()=>{
             resolve(userData);
         //})
        }catch(err){reject(err)}
    });
}

function userCountData(){
    return new Promise(async (resolve, reject) => {
        try{
            let currentDate = new Date().toISOString();
            let lastDate = moment(currentDate).endOf("month").toISOString();
            var userData = await userModel.search({})
            var result = [];
            for (user of userData){
            var current = {}, closed =[], followup=0, meeting=0, upcomingLeaves =[], closedCount=0, closedPercentage=0;
            closed = await leadService.closedPercentage(user._id);
            followup = await followupModel.countDocuments({"organizer":user._id});
            meeting = await meetingModel.countDocuments({"organizer":user._id});
            upcomingLeaves = await leaveService.getUpcomingLeaves(currentDate, lastDate, leaveType.HOLIDAY)
            if(Array.isArray(closed) && closed.length){
            closedCount = closed[0].count, 
            closedPercentage = closed[0].percentage
            }
            current["id"] = user._id, current["closedCount"] = closedCount, current["closedPercentage"] = closedPercentage,
            current["followup"] = followup, current["upcomingLeaves"] = upcomingLeaves
            result.push(current);
           
         }
         resolve(result)
        //  var rough = JSON.stringify(result)
         
     
        }catch{reject(err)}
    })
}

// function getUserById(id) {
//     return new Promise((resolve, reject) => {
//         var context = currentContext.getCurrentContext();
//         userModel.getById(id).then((data) => {
//             let result = data;
//             if(result != undefined){
//                 result.profileImage = helper.resolveImagePath(data.profileImage, context.workspaceId);
//             }
//             resolve(result);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

function getUserById(id) {
    return new Promise(async (resolve, reject) => {
        let currentDate = new Date().toISOString();
        let lastDate = moment(currentDate).endOf("month").toISOString();
        var data, close, transit =[], cluster = {};
        var context = currentContext.getCurrentContext();
        var followup = 0, upcomingLeaves = 0, meeting = 0;
        var data = await userModel.getById(id);
            let result = data;
            if(result != undefined){
                result.profileImage = helper.resolveImagePath(data.profileImage, context.workspaceId);
                close = await leadService.closedPercentage(id);
                    followup = await followupModel.countDocuments({"organizer":id});
                    meeting = await meetingModel.countDocuments({"organizer":id});
                    upcomingLeaves = await leaveService.getUpcomingLeaves(currentDate, lastDate, leaveType.HOLIDAY)
            }
            if(Array.isArray(close) && close.length){
                obj1 = {"closedCount": close[0].count, "closedPercentage":close[0].percentage,"followupCount":followup, "meetingsCount":meeting};
            }
            else{
                obj1 = {"closedCount": "0", "closedPercentage":"0","followupCount":followup,"meetingsCount":meeting};
            }
            obj2 = data._doc;
            obj3 = upcomingLeaves;
            console.log(obj3);
            var cluster = {...obj2,...obj1, "upcomingLeaves":obj3}
            resolve(cluster);
    });
}


function getActivityByUserId(id){
    return new Promise((resolve, reject) => {
        userModel.getById(id).then((data) => {
            if(data == undefined || data.size == 0){
                return reject(errorCode.USER_NOT_EXIST);
            }else{
                let searchCriteria = {};
                searchCriteria.pageNo = 1;
                searchCriteria.pageSize = 100000000000;
                searchCriteria.query = {
                    createdBy: data.email
                };
                activityService.searchActivities(searchCriteria).then((activityData)=>{
                    resolve(activityData);
                }).catch((err)=>{
                    reject(err);
                })
            }
        }).catch((err) => {
            reject(err);
        })
    });
}

//gets user by email, it is the same as entity by email in this file
function getUserByEmail(email, tenant) {
    return new Promise((resolve, reject) => {
        var context = currentContext.getCurrentContext();
        userModel.searchOne({ 'email': email }).then((data) => {
            let result = data;
            if(result != undefined){
                result.profileImage = helper.resolveImagePath(data.profileImage, context.workspaceId);
            }
            resolve(result);
        }).catch((err) => {
            reject(err);
        })
    });
}

//enter a particular role and this will return the user having that role
function getUserByRole(role) {
    return new Promise((resolve, reject) => {
        var context = currentContext.getCurrentContext();
        userModel.searchOne({ 'role': role }).then((data) => {
            let result = data;
            if(result != undefined){
                result.profileImage = helper.resolveImagePath(data.profileImage, context.workspaceId);
            }
            resolve(result);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllUsersCount(query) {
    return new Promise((resolve, reject) => {
        userModel.countDocuments(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        userModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

//we have roles and then we have role categories as in the general category to which a particular
//role belongs, and this function gets users by that category
function getUsersByRoleCategory(category) {
    return new Promise((resolve, reject) => {
        var context = currentContext.getCurrentContext();
        const roleSearchCriteria = {
            pageSize: 100000,
            pageNo: 1,
            query: { 'category': category }
        }
        roleService.searchRoles(roleSearchCriteria).then((roleData) => {
            const roleIds = roleData.map(x => x._id);
            const userSearchCriteria = {
                pageSize: 100000,
                pageNo: 1,
                query: { 'role': roleIds }
            }
            searchUsers(userSearchCriteria).then((userData) => {
                userData.map(u=>{
                    if(u != undefined){
                        u.profileImage = helper.resolveImagePath(u.profileImage, context.workspaceId);
                    }
                });
                resolve(userData);
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        });
    });
}

//basically returns all data of the user matching this email i.d
function getEntityByEmail(email) {
    var query = {
        email: email
    }
    return new Promise((resolve, reject) => {
        var context = currentContext.getCurrentContext();
        userModel.search(query).then((data) => {
            data.map(u=>{
                if(u != undefined){
                    u.profileImage = helper.resolveImagePath(u.profileImage, context.workspaceId);
                }
            });
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function textSearch(text, status) {
    return new Promise((resolve, reject) => {
        var context = currentContext.getCurrentContext();
        userModel.getTextSearchResult(text).then((data) => {
            if (!_.isEmpty(status)) {
                data = _.filter(data, ['status', status]);
            }
            data.map(u=>{
                if(u != undefined){
                    u.profileImage = helper.resolveImagePath(u.profileImage, context.workspaceId);
                }
            });
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

//this get user overview based on onleave, approval pending, upcoming leaves etc.
function getAllUsersOverview() {
    return new Promise(async (resolve, reject) => {
        try {
            const allMembers = await getAllUsersCount();
            const onLeave = await leaveService.getCountOnLeave();
            const approvalPending = await leaveService.getCountApprovalPending();
            const upcomingLeaves = await leaveService.getCountUpcomingLeaves();
            var result = {
                'allMembers' : allMembers,
                'onLeave': onLeave,
                'approvalPending': approvalPending,
                'upcomingLeaves': upcomingLeaves
            }
            resolve(result);
        } catch(err){
            console.log(err);
            reject(err);
        }
    }).catch((err) => {
        console.log(err);
        reject(err);
    });

}

//this gets user overview by status of the user like active and inactive
function getUserOverviewByStatus(){
    return new Promise((resolve, reject) => {
        try {
            var promises = [];
            promises.push(getAllUsersCount({}));
            promises.push(getAllUsersCount({'status':'ACTIVE'}));
            promises.push(getAllUsersCount({'status':'INACTIVE'}));
            Promise.all(promises).then((data)=>{
                var result = {
                    'total': data[0],
                    'active': data[1],
                    'inactive': data[2]
                }
                resolve(result);
            });
            
        } catch(err){
            console.log(err);
            reject(err);
        }
    }).catch((err) => {
        console.log(err);
        reject(err);
    });
}


function archiveUser(usersInput) {
    return new Promise((resolve, reject) => {
        var archiveUsersPromises = [];
//this function is just creating a promise array and sending it to archive users function below
//one by one using promise.all
        usersInput.users.forEach(user => {
            console.log("userid", user)
            archiveUsersPromises.push(archiveUsers(user));
        });
        Promise.all(archiveUsersPromises).then((response) => {
            resolve(response);
        }).catch((err) => {
            reject(err);
        });
    });
}

function archiveUsers(user) {
    return new Promise((resolve, reject) => {
//the user with the email i.d but in this particular workspace will be archived
        userService.getUserByEmail(user).then((userData) => {
            console.log("userdata", userData)
            userData.status = Status.ARCHIVE;
//after changing his status to archive, user is then updated
            userService.updateUser(userData._id, userData).then((data) => {
                resolve(data);
            }).catch((err) => {
                //console.log("Email:" + user + ", err:" + err);
                reject(err);
            });
        }).catch((err) => {
            //console.log("Email:" + user + ", err:" + err);
            reject(err);
        });
    });
}


function usersWithinTimeFrame(startDate, endDate) {
    var query = {
        "$and": [
            {
                "createdAt": {
                    "$gte": new Date(startDate)
                }
            }, {
                "createdAt": {
                    "$lte": new Date(endDate)
                }
            }
        ]
    };

    return new Promise((resolve, reject) => {
        userModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports = userService;

