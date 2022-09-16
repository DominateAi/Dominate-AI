var userModel = require("../models/user.model");
var currentContext = require('../../common/currentContext');
const helper = require("../../common/helper");
const leadService = require('../services/lead.service');
const leadStatus = require('../../common/constants/LeadStatus');
const taskService = require('../services/task.service');
const leaveType = require('../../common/constants/LeaveType');
const moment =  require('moment');
moment.locale('en');
const _ = require('lodash');
const leaveService = require('../services/leave.service');


var userDetailService = {
    getUserDetailsById: getUserDetailsById,
    getUserPerformanceById: getUserPerformanceById
}

//this function essentially gets information for the performance chart of the users
//not really required now
function getUserPerformanceById(id){
    return new Promise((resolve, reject) => {
        var context = currentContext.getCurrentContext();
        userModel.getById(id).then((data) => {
            let currentDate = new Date();

            let currentUserId = currentContext.getCurrentContext().userId;
            let response = {
                'x_axis':{
                    labels: []
                },
                'y_axis':{
                    closed:[],
                    open: []
                }
            };

            let months = moment.monthsShort();
            leadService.getLeadCountByTimestamp('convertedDate', currentDate.getFullYear(), undefined, undefined, undefined, currentUserId)
            .then((data)=>{
                console.log("****leaddataconverted:" +  JSON.stringify(data));
                months.forEach((val, index)=>{
                    response['x_axis']['labels'].push(val);
                    let leadCount = _.find(data, function(o) { return o._id == (index + 1)  ? o : undefined; });
                    if(leadCount){
                        response['y_axis']['closed'].push(leadCount.count);
                    }else{
                        response['y_axis']['closed'].push(0);   
                    }
                });
                leadService.getLeadCountByTimestamp('createdAt', currentDate.getFullYear(), undefined, undefined, undefined, currentUserId, leadStatus.CONVERTED)
                .then((openLeadsData)=>{
                    console.log("****leadopenlead:" +  JSON.stringify(openLeadsData));
                    months.forEach((val, index)=>{
                        let openLeadsCount = _.find(openLeadsData, function(o) { return o._id == (index + 1)  ? o : undefined; });
                        if(openLeadsCount){
                            response['y_axis']['open'].push(openLeadsCount.count);
                        }else{
                            response['y_axis']['open'].push(0);   
                        }
                    });
                    resolve(response);
                });
            });
        }).catch((err) => {
            reject(err);
        })
    });
}

//get all the details + conversion rate + leaves etc. of any user you send the id for
function getUserDetailsById(id) {
    return new Promise((resolve, reject) => {
        var context = currentContext.getCurrentContext();
        userModel.getById(id).then((data) => {
            let result = JSON.parse(JSON.stringify(data));
            if(result != undefined){
                result.profileImage = helper.resolveImagePath(data.profileImage, context.workspaceId);
            }
            leadService.getLeadsByUser(id).then((leads)=>{
                let totalLeadsAssigned = leads.length;
                result.leadsCount = totalLeadsAssigned;

                let convertedLeads = [];
                leads.forEach(l=>{
                    if(l.status == leadStatus.CONVERTED){
                        convertedLeads.push(l);
                    }
                });

                result.conversionRate = convertedLeads.length * 100 / totalLeadsAssigned;
                let searchCriteria = {
                    pageNo: 1,
                    pageSize: 10000000,
                    query:{
                        assignee: id
                    }
                }
                //assgined task
                taskService.searchTasks(searchCriteria).then((tasks)=>{
                    result.assignedTask = tasks;

                    let currentDate = new Date();
                    let endDate = new Date();
                    endDate.setFullYear(endDate.getFullYear()+1)
                    //upcoming leaves
                    leaveService.getUpcomingLeaves(currentDate, endDate, leaveType.PAID_LEAVE).then((leaves)=>{
                        result.upcomingLeaves = leaves;
                        let startDate = new Date();
                        startDate.setFullYear(startDate.getFullYear()-1);
                        //taken leaves
                        leaveService.getAllLeavesTakenByDate(startDate,currentDate).then((leavesTaken)=>{
                            result.leavesTaken = leavesTaken.length;
                            resolve(result);
                        });
                    });
                }).catch((err)=>{
                    reject(err);
                }); 


                
            });
        }).catch((err) => {
            reject(err);
        })
    });
}



module.exports = userDetailService;