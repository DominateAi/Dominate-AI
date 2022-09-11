var currentContext = require('../../common/currentContext');
var emailService = require('./email.service');
const moment =  require('moment');
moment.locale('en');
const _ = require('lodash');
const leadService = require('./lead.service');
const customerService = require('./customer.service');
const ViewType = require('../../common/constants/ViewType'); 
const CustomerStatus = require('../../common/constants/CustomerStatus');
const taskService = require('./task.service');
const userService = require('./user.service');


var graphService = {
    getEmailCountByTimestamp: getEmailCountByTimestamp,
    getLeadCountByTimeStamp: getLeadCountByTimeStamp,
    getLeadCountByMedia: getLeadCountByMedia,
    getCustomerCountByStatus: getCustomerCountByStatus,
    getLeadsPrediction: getLeadsPrediction,
    getLeadsByStatus: getLeadsByStatus
}


function getEmailCountByTimestamp(startDate, endDate){
    return new Promise((resolve,reject) => {
        emailService.groupByKeyAndCountDocumentsWithTimeframe('createdAt', startDate.toISOString(), endDate.toISOString()).then((data)=>{
            let ms = startDate;
            let me = endDate;
            let ss = moment([ms.year(), ms.month(), ms.date()]);
            let ee = moment([me.year(), me.month(), me.date()]);

            let totalDays = ee.diff(ss, 'days') + 1;

            console.log("diff:" +  totalDays);
            var response = {
                'x_axis':{
                    label:[]
                },
                'y_axis':{
                    label: "Email Sent",
                    data: []
                }
            };
            let currentDate = ms;
            for(let i = 0 ; i < totalDays; i++){
                let emailCount = _.find(data, function(o) { return new Date(o._id).getDay() == currentDate.format('D') ? o : undefined; });
                response['x_axis']['label'].push(currentDate.format('ddd'));
                if(emailCount){
                    response['y_axis']['data'].push(emailCount.count);
                }else{
                    response['y_axis']['data'].push(0);
                }
                currentDate.add(1, 'days');
            }
            resolve(response);
        }).catch((err)=>{
            reject(err);
        });
    });
}

function getLeadCountByTimeStamp(view, year, month, week, sumBy){
    return new Promise((resolve,reject) => {
        if(view == ViewType.YEARLY){
            handleYearlyLeads(sumBy).then((data)=>{
                resolve(data);
            }).catch((err)=>{
                reject(err);
            });
        }else if(view == ViewType.MONTHLY){
            handleMonthlyLeads(year, sumBy).then((data)=>{
                resolve(data);
            }).catch((err)=>{
                reject(err);
            });
        }else if(view == ViewType.WEEKLY){
            handleWeeklyLeads(year, month, sumBy).then((data)=>{
                resolve(data);
            }).catch((err)=>{
                reject(err);
            });
        }else if(view == ViewType.DAILY){
            handleDailyLeads(year, week, sumBy).then((data)=>{
                resolve(data);
            }).catch((err)=>{
                reject(err);
            });
        }
    });
}

function handleYearlyLeads(sumBy){
    return new Promise((resolve,reject) => {
        var currentYear = new Date().getFullYear();
        let response = {
            'x_axis':{
                labels: []
            },
            'y_axis':{
                data:[]
            }
        };
        leadService.getLeadCountByTimestamp('convertedDate', undefined, undefined, undefined, sumBy)
        .then((data)=>{
            for(let i = currentYear ; i > currentYear - 5; i--){
                response['x_axis']['labels'].push(i);
                let leadCount = _.find(data, function(o) { return o._id == i ? o : undefined; });
                if(leadCount){
                    response['y_axis']['data'].push(leadCount.count);
                }else{
                    response['y_axis']['data'].push(0);   
                }
            }
            resolve(response);
        }).catch((err)=>{
            reject(err);
        });
    });
}

function handleMonthlyLeads(year, sumBy){
    return new Promise((resolve,reject) => {
        
        let response = {
            'x_axis':{
                labels: []
            },
            'y_axis':{
                data:[]
            }
        };
        leadService.getLeadCountByTimestamp('convertedDate', year, undefined, undefined, sumBy)
        .then((data)=>{
            console.log("****data:" +  JSON.stringify(data));
            let months = moment.monthsShort();
            months.forEach((val, index)=>{
                response['x_axis']['labels'].push(val);
                let leadCount = _.find(data, function(o) { return o._id == (index + 1)  ? o : undefined; });
                if(leadCount){
                    response['y_axis']['data'].push(leadCount.count);
                }else{
                    response['y_axis']['data'].push(0);   
                }
            })
            resolve(response);
        }).catch((err)=>{
            reject(err);
        });
    });
}

function handleWeeklyLeads(year, month, sumBy){
    return new Promise((resolve,reject) => {
        
        let response = {
            'x_axis':{
                labels: []
            },
            'y_axis':{
                data:[]
            }
        };
        leadService.getLeadCountByTimestamp('convertedDate', year, month, undefined, sumBy)
        .then((data)=>{
            console.log("****data:" +  JSON.stringify(data));
            let currentMonth = moment(year + "-" + month + '-01');
            let firstWeekOfMonth = currentMonth.startOf('month').week();
            let lastWeekOfMonth = currentMonth.endOf('month').week();
            for(let i = firstWeekOfMonth; i <= lastWeekOfMonth; i++){
                response['x_axis']['labels'].push(i);
                let leadCount = _.find(data, function(o) { return o._id == i   ? o : undefined; });
                if(leadCount){
                    response['y_axis']['data'].push(leadCount.count);
                }else{
                    response['y_axis']['data'].push(0);   
                }
            }
            resolve(response);
        }).catch((err)=>{
            reject(err);
        });
    });
}


function handleDailyLeads(year, week, sumBy){
    return new Promise((resolve,reject) => {
        
        let response = {
            'x_axis':{
                labels: []
            },
            'y_axis':{
                data:[]
            }
        };
        leadService.getLeadCountByTimestamp('convertedDate', year, undefined, week-1, sumBy)
        .then((data)=>{
            console.log("****data:" +  JSON.stringify(data));
            var currentDate = moment().day("Monday").week(week);
            for(let i = 0 ; i < 7; i++){
                let leadCount = _.find(data, function(o) { return new Date(o._id).getDay() == currentDate.format('D') ? o : undefined; });
                response['x_axis']['labels'].push(currentDate.format('dddd'));
                if(leadCount){
                    response['y_axis']['data'].push(leadCount.count);
                }else{
                    response['y_axis']['data'].push(0);
                }
                currentDate.add(1, 'days');
            }
            resolve(response);
        }).catch((err)=>{
            reject(err);
        });
    });
}

function getLeadCountByMedia( startDate, endDate ){
    return new Promise((resolve,reject) => {

        let response = {
            'x_axis':{
                labels: []
            },
            'y_axis':{
                data:[]
            }
        };
        let source = ['Instagram', 'Facebook', 'LinkedIn', 'Others'];
        response['x_axis']['labels'] = source;
        response['y_axis']['data'] = [0,0,0,0];
        leadService.groupByKeyAndCountDocuments('source').then((data)=>{
            data.forEach(e=>{
                console.log( e );
               let index = source.indexOf(e._id);
               if(index == -1){
                response['y_axis']['data'][3] += e.count; 
               }else{
                response['y_axis']['data'][index] += e.count;
               }
            });
            resolve(response);
        }).catch((err)=>{
            reject(err);
        });
    });
}

function getCustomerCountByStatus(year){
    return new Promise((resolve,reject) => {
        
        let response = {
            'x_axis':{
                labels: []
            },
            'y_axis':{
                activeData:[],
                inActiveData:[]
            }
        };
        let months = moment.monthsShort();
        customerService.getCustomerCountByTimestamp('createdAt', year, CustomerStatus.ACTIVE)
        .then((data)=>{
            console.log("****active data:" +  JSON.stringify(data));
            months.forEach((val, index)=>{
                response['x_axis']['labels'].push(val);
                let leadCount = _.find(data, function(o) { return o._id == (index + 1)  ? o : undefined; });
                if(leadCount){
                    response['y_axis']['activeData'].push(leadCount.count);
                }else{
                    response['y_axis']['activeData'].push(0);   
                }
            })
            customerService.getCustomerCountByTimestamp('createdAt', year, CustomerStatus.INACTIVE)
            .then((data)=>{
                console.log("****inactive data:" +  JSON.stringify(data));
                months.forEach((val, index)=>{
                    let leadCount = _.find(data, function(o) { return o._id == (index + 1)  ? o : undefined; });
                    if(leadCount){
                        response['y_axis']['inActiveData'].push(leadCount.count);
                    }else{
                        response['y_axis']['inActiveData'].push(0);   
                    }
                })
                resolve(response);
            }).catch((err)=>{
                reject(err);
            });
        }).catch((err)=>{
            reject(err);
        });
    }); 
}

function getLeadsPrediction(sumBy){
    return new Promise((resolve,reject) => {
        let currentDate = new Date();

        
        let response = {
            'x_axis':{
                labels: []
            },
            'y_axis':{
                predicted:[],
                actual: []
            }
        };
        let months = moment.monthsShort();
        let currentUserId = currentContext.getCurrentContext().userId;
        leadService.getLeadCountByTimestamp('convertedDate', currentDate.getFullYear(), undefined, undefined, sumBy, currentUserId)
        .then((data)=>{
            console.log("****data:" +  JSON.stringify(data));
            months.forEach((val, index)=>{
                response['x_axis']['labels'].push(val);
                let leadCount = _.find(data, function(o) { return o._id == (index + 1)  ? o : undefined; });
                if(leadCount){
                    response['y_axis']['actual'].push(leadCount.count);
                }else{
                    response['y_axis']['actual'].push(0);   
                }
            });
            leadService.getLeadCountByTimestamp('createdAt', currentDate.getFullYear(), undefined, undefined, sumBy, currentUserId)
            .then((allLeads)=>{
                console.log("****data:" +  JSON.stringify(allLeads));
                months.forEach((val, index)=>{
                    let lead1Count = _.find(allLeads, function(o) { return o._id == (index + 1)  ? o : undefined; });
                    if(lead1Count){
                        response['y_axis']['predicted'].push(lead1Count.count);
                    }else{
                        response['y_axis']['predicted'].push(0);   
                    }
                })
                resolve(response);
            }).catch((err)=>{
                reject(err);
            });
        }).catch((err)=>{
            reject(err);
        });
    });
}

// function getUsersTarget(){
//     return new Promise((resolve,reject) => {
    
//         let currentDate = new Date();

//         let currentUserId = currentContext.getCurrentContext().userId;
//         let response = {
//             'x_axis':{
//                 labels: []
//             },
//             'y_axis':{
//                 leads:[],
//                 tasks: []
//             }
//         };
        
//         let months = moment.monthsShort();
//         leadService.getLeadCountByTimestamp('convertedDate', currentDate.getFullYear(), undefined, undefined, undefined, currentUserId)
//             .then((data)=>{
//                 console.log("****leaddata:" +  JSON.stringify(data));
//                 months.forEach((val, index)=>{
//                     response['x_axis']['labels'].push(val);
//                     let leadCount = _.find(data, function(o) { return o._id == (index + 1)  ? o : undefined; });
//                     if(leadCount){
//                         response['y_axis']['leads'].push(leadCount.count);
//                     }else{
//                         response['y_axis']['leads'].push(0);   
//                     }
//                 });
//                 taskService.getTaskCountByTimestamp('completedDate', currentDate.getFullYear(), currentUserId).then((taskData)=>{
//                     console.log("****taskdata:" +  JSON.stringify(taskData));
//                     months.forEach((val, index)=>{
//                         let taskCount = _.find(taskData, function(o) { return o._id == (index + 1)  ? o : undefined; });
//                         if(taskCount){
//                             response['y_axis']['tasks'].push(taskCount.count);
//                         }else{
//                             response['y_axis']['tasks'].push(0);   
//                         }
//                     });
//                     startDate = moment().startOf('month')._d;
//                     endDate = moment().endOf('month')._d;

//                     console.log(currentUserId);
//                 // GET THE TARGET BY ID. FOR THE USERS.
//                 itargetService.thisMonthTarget(currentUserId, startDate, endDate ).then( data => {
//                     console.log( data );
//                     let currentMonth = currentDate.getMonth();
//                     let finalResponse = {
//                         graph: response,
//                         convertedLeads: {
//                             targetedLeadForUser : data ? data.targetConvertedLeads : 0,
//                             convertedLead:  response['y_axis']['leads'][currentMonth]
//                         },
//                         taskCompleted: response['y_axis']['tasks'][currentMonth]
//                     };
//                     resolve(finalResponse);
//                 });

//                     userService.getUserById(currentUserId).then((userData)=>{
//               }).catch((err)=>{
//                         reject(err);
//                     });
//                 })
//             }).catch((err)=>{
//                 reject(err);
//             });
//     });
// }


function getLeadsByStatus(){
    return new Promise((resolve,reject) => {
    
        let response = {
            'x_axis':{
                labels: []
            },
            'y_axis':{
                data:[]
            }
        };
        
        leadService.getAllLeadsbyStatus()
            .then((data)=>{
                console.log("****leaddata:" +  JSON.stringify(data));
                response['x_axis']['labels'] = ["New", "Qualified", "Contacted", "On hold", "Opportunity", "Converted"];
                response['y_axis']['data'].push(data['NEW_LEAD']);
                response['y_axis']['data'].push(data['QUALIFIED_LEADS']);
                response['y_axis']['data'].push(data['CONTACTED_LEADS']);
                response['y_axis']['data'].push(data['ON_HOLD']);
                response['y_axis']['data'].push(data['OPPORTUNITIES']);
                response['y_axis']['data'].push(data['CONVERTED']);
                resolve(response);
            }).catch((err)=>{
                reject(err);
            });

    });
}

module.exports = graphService;

