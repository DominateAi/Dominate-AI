var Queue = require('bull');
var uploadQueue = new Queue('uploading queue');
const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");
var leadModel = require("../models/lead.model");
var userModel = require("../models/user.model");
var followupModel = require("../models/followup.model");
var meetingModel = require("../models/meeting.model");
var noteModel = require("../models/note.model");
var accountModel = require("../models/account.model");
var wactService = require("./workactivity.service");
var activityService = require('../services/activity.service');
var currentContext = require('../../common/currentContext');
const _ = require('lodash');
const leadStatus = require('../../common/constants/LeadStatus'); 
const leadDegree = require('../../common/constants/LeadDegree');
const followupService = require('./followup.service');
const meetingService = require('./meeting.service');
const userService = require('./user.service');
const emailService = require('./email.service');
const NotificationType = require('../../common/constants/NotificationType');
const moment = require('moment');

var leadService = {
    getAllLeads: getAllLeads,
    getLeadById: getLeadById,
    getById: getById,
    addLead: addLead,
    updateLead: updateLead,
    deleteLead: deleteLead,
    getLeadByLeadName: getLeadByLeadName,
    getLeadsByPage: getLeadsByPage,
    getAllLeadsCount: getAllLeadsCount,
    getLeadsByPageWithSort: getLeadsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchLeads: searchLeads,
    getAllLeadsWithinTimeframe: getAllLeadsWithinTimeframe,
    getLeadClosureRate: getLeadClosureRate,
    importLeads: importLeads,
    exportLeads: exportLeads,
    textSearch: textSearch,
    getAllLeadsOverview: getAllLeadsOverview,
    getAggregateCount: getAggregateCount,
    getLeaderboard: getLeaderboard,
    searchLeadsByEntity: searchLeadsByEntity,
    postSearchLeadsByEntity: postSearchLeadsByEntity,
    getAllFollowupsByUserId: getAllFollowupsByUserId,
    getAllMeetingsByUserId: getAllMeetingsByUserId,
    getAllDataForToday: getAllDataForToday,
    getLeadCountByTimestamp: getLeadCountByTimestamp,
    getAllLeadsbyStatus: getAllLeadsbyStatus,
    leadTimeline: leadTimeline,
    getLeadsByUser: getLeadsByUser,
    getLeadsInPipeline:getLeadsInPipeline,
    getLeadsWithDegreeAndStatus:getLeadsWithDegreeAndStatus,
    getAllTodayData:getAllTodayData,
    reasonForLeadDrop:reasonForLeadDrop,
    getLeadBySourceRevenue:getLeadBySourceRevenue,
    getLeadCountBySocialMediaWithDateFilter:getLeadCountBySocialMediaWithDateFilter,
    getTargetClosed:getTargetClosed,
    closedPercentage: closedPercentage,
    leadCP:leadCP,
    allLeadsCP:allLeadsCP,
    leadsByAccountId: leadsByAccountId,
    importLeadsWithOptions:importLeadsWithOptions,
    importest: importest,
    overwrite: overwrite,
    notoverwrite: notoverwrite,
    checkFields: checkFields,
    getAvgCP: getAvgCP,
    bulkAddLead: bulkAddLead,
    addLeadImport: addLeadImport,
    countOverview: countOverview
}

function addLead(leadData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        leadData.createdBy = user.email;
        leadData.lastModifiedBy = user.email;
        if(leadData.status == undefined){
            leadData.status = 'NEW_LEAD';
        }

        if(leadData.degree == undefined){
            leadData.degree = 'COLD';
        }
        leadModel.create(leadData).then((data) => {
            var activity = {
                'entityType': 'ACCOUNT',
                'entityId': leadData.account_id,
                'data': leadData,
                'activityType': 'LEAD_CREATED'
            }
            activityService.addActivity(activity).then((adata) => {
                wactService.addWact(leadData, "LEAD", "CREATE").then((dataA)=>{resolve(data);}).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        })
    })
}

function bulkAddLead(leadData) {
    return new Promise((resolve, reject) => {
        // var user = currentContext.getCurrentContext();
        // leadData.createdBy = user.email;
        // leadData.lastModifiedBy = user.email;
        if(leadData.status == undefined){
            leadData.status = 'NEW_LEAD';
        }

        if(leadData.degree == undefined){
            leadData.degree = 'COLD';
        }
        leadModel.create(leadData).then((data) => {
        //     var activity = {
        //         'entityType': leadData.entityType,
        //         'entityId': leadData.entityId,
        //         'data': leadData,
        //         'activityType': 'LEAD_CREATED'
        //     }
        //     notificationClient.notify(NotificationType.LEAD_CREATED, data, user.workspaceId, user.userId);
        //     activityService.addActivity(activity).then((adata) => {
        //         resolve(data);
        //     }).catch((err) => {
        //         reject(err);
        //     });
        // }).catch((err) => {
        //     reject(err);
        resolve(data);
         })
        
    })
}

function updateLead(id, leadData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        leadData.lastModifiedBy = user.email;
        leadModel.getById(id).then((prevData)=>{
        leadModel.updateById(id, leadData).then((data) => {
            if(data.status == "CONVERTED"){
            var activity = {
                'entityType': 'ACCOUNT',
                'entityId': leadData.entityId,
                'data': leadData,
                'activityType': 'LEAD_CLOSED'
            }
            activityService.addActivity(activity).then((adata) => {
                wactService.addWact(leadData, "LEAD", "UPDATE", prevData).then((dataA)=>{resolve(data);}).catch((err) => {
                    reject(err);
                });    
            }).catch((err) => {
                reject(err);
            });
        }
        else{
            wactService.addWact(leadData, "LEAD", "UPDATE", prevData).then((dataA)=>{resolve(data);}).catch((err) => {
                reject(err);
            });    
        }
        }).catch((err) => {
            reject(err);
        })
        }).catch((err) => {
        reject(err);
      })
    })

}

function deleteLead(id,leadData) {
    leadData.status = leadStatus.ARCHIVE;
    return updateLead(id, leadData);
}

function getAllLeads(assigned, isKanban, isHidden, isNotes, isFollowups) {
    var response=[], final={}, transit={};
    var query = {
        "$and": []
    };
    if (assigned != undefined) {
        query['$and'].push({
            'assigned': assigned
        });
    }
    if (isKanban != undefined) {
        query['$and'].push({
            'isKanban': isKanban
        });
    }
    if (isHidden != undefined) {
        query['$and'].push({
            'isHidden': isHidden
        });
    }
    if (assigned == undefined && isKanban == undefined && isHidden == undefined) {
        query = {}
    }

    if( isKanban !== undefined && isNotes !== undefined  && isFollowups !== undefined ){
        return new Promise((resolve, reject) => {
            // async function getLeadsWithFN(query) {
            //   data =  await leadModel.getPaginatedResultWithNotesAndFollowups(query);
            //   data.forEach( ( element, index ) => { 
            //             data[ index ].notes = element.notes.length;
            //             data[ index ].followups = element.followups.length;
            //             });
            //             for(i in data){
            //                 CP = await leadCP(data[i]._id)
            //                     CPP = {closingProbability : CP}
            //                     transit = data[i]._doc;
            //                     final = {...transit,...CPP};
            //                     response.push(final);
            //             }
            // }
            leadModel.getPaginatedResultWithNotesAndFollowups(query).then((data) => {
                data.forEach( ( element, index ) => { 
                    data[ index ].notes = element.notes.length;
                    data[ index ].followups = element.followups.length;
                    });
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
            // getLeadsWithFN(query).then(()=>{resolve(response);})
        });
    } else {
        return new Promise((resolve, reject) => {

            async function getLeads(query){
                data = await leadModel.search(query)
                for(i in data){
                    CP = await leadCP(data[i]._id)
                        CPP = {closingProbability : CP}
                        transit = data[i]._doc;
                        final = {...transit,...CPP};
                        response.push(final);
                }
            }
            getLeads(query).then(()=>{resolve(response);})
        });
    }
}

function getAllLeadsWithinTimeframe(startDate, endDate, assigned, isKanban, isHidden, status) {
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
    if (assigned != undefined) {
        query['$and'].push({
            'assigned': assigned
        });
    }
    if (isKanban != undefined) {
        query['$and'].push({
            'isKanban': isKanban
        });
    }
    if (isHidden != undefined) {
        query['$and'].push({
            'isHidden': isHidden
        });
    }
    if (status != undefined) {
        query['$and'].push({
            'status': status
        });
    }
    if (assigned == undefined && isKanban == undefined && isHidden == undefined && status == undefined) {
        query = {}
    }

    return new Promise((resolve, reject) => {
        leadModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getLeadById(id) {
    var final={},transit={}, dataA;
    return new Promise(async(resolve, reject) => {
        try{
            dataA = await leadModel.getById(id);
            var test = dataA.account_id;
            var data = await accountModel.getById(test)
            var dataB = data._doc;
            var CP = await leadCP(id);
            var CPP = {closingProbability : CP}
            var temp = {accountData: dataB};
            transit = dataA._doc;
            final = {...transit,...CPP, ...temp};
            resolve(final)
        }catch(err){reject(err);}
    });
}

function getById(id){
    return new Promise(async(resolve, reject) => {
        data = await leadModel.getById(id);
        resolve(data);
  })
}

function getLeadsByUser(id){
    return new Promise((resolve, reject) => {
        leadModel.search({ 'assigned': id }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getLeadByLeadName(leadName, tenant) {
    return new Promise((resolve, reject) => {
        leadModel.searchOne({ 'name': leadName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllLeadsCount(query) {
    return new Promise((resolve, reject) => {
        leadModel.countDocuments(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getLeadsByPage(pageNo, pageSize, isKanban, isHidden, status) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    var query = {
        "$and": []
    };
    if (assigned != undefined) {
        query['$and'].push({
            'assigned': assigned
        });
    }
    if (isKanban != undefined) {
        query['$and'].push({
            'isKanban': isKanban
        });
    }
    if (isHidden != undefined) {
        query['$and'].push({
            'isHidden': isHidden
        });
    }
    if (status != undefined) {
        query['$and'].push({
            'status': status
        });
    }

    if (assigned == undefined && isKanban == undefined && isHidden == undefined && status == undefined) {
        query = {}
    }

    if( isKanban !== undefined && isNotes !== undefined  && isFollowups !== undefined ){
        return new Promise((resolve, reject) => {
            leadModel.getPaginatedResultWithNotesAndFollowups(query, options).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        });
    } else {
        return new Promise((resolve, reject) => {
            leadModel.getPaginatedResult(query, options).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        });
    }
}

function getLeadsByPageWithSort(pageNo, pageSize, sortBy, assigned, isKanban, isHidden, status) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;
    var query = {
        "$and": []
    };
    if (assigned != undefined) {
        query['$and'].push({
            'assigned': assigned
        });
    }
    if (isKanban != undefined) {
        query['$and'].push({
            'isKanban': isKanban
        });
    }
    if (isHidden != undefined) {
        query['$and'].push({
            'isHidden': isHidden
        });
    }
    if (status != undefined) {
        query['$and'].push({
            'status': status
        });
    }
    if (assigned == undefined && isKanban == undefined && isHidden == undefined && status == undefined) {
        query = {}
    }

    return new Promise((resolve, reject) => {
        leadModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        leadModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchLeads(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;

    var query = {
        "$and": [{
            'isHidden' : false
        }]
    };
    if(searchCriteria.query.hasOwnProperty('isHidden')){
        _.remove(query['$and'], {'isHidden': false})
    }
    query['$and'].push(searchCriteria.query);

    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise(async(resolve, reject) => {
        try{
            // async function processTasks(query, options){
            let final ={}, response=[];
            data = await leadModel.getPaginatedResult(query, options);
        //     for(i in data){
        //         CP = await leadCP(data[i]._id)
        //         CPP = {closingProbability : CP}
        //         let transit = JSON.parse(JSON.stringify(data[i]));
        //         final = {...transit,...CPP};
        //     response.push(final);
        //     }
        //     return response
        // }
        //     let response = await processTasks(query, options)
            resolve(data);
        }catch(err){reject(err)}
     
    })
            }
//         getPaginatedResult(query, options).then((data) => {
//             for(i in data){
//                 leadCP(data[i]._id).then((data)=>{
//                 CPP = {closingProbability : CP}
//                 transit = data[i]._doc;
//                 final = {...transit,...CPP};
//                 response.push(final);
//             }).then(()=>{resolve(response);})
//                         }
            
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }
//return new Promise((resolve, reject) => {

    //     async function getLeads(query){
    //         data = await leadModel.search(query)
    //         for(i in data){
    //             CP = await leadCP(data[i]._id)
    //                 CPP = {closingProbability : CP}
    //                 transit = data[i]._doc;
    //                 final = {...transit,...CPP};
    //                 response.push(final);
    //         }
    //     }
    //     getLeads(query).then(()=>{resolve(response);})
    // });
    // }
    // }

function getLeadClosureRate(userId, startDate, endDate) {
    let currentDate = new Date();
    if (endDate == undefined) {
        endDate = currentDate.toISOString();
    }
    if (startDate == undefined) {
        var daysPrior = 28;
        currentDate.setDate(currentDate.getDate() - daysPrior);
        startDate = currentDate.toISOString();
    }

    return new Promise((resolve, reject) => {
        getAllLeadsWithinTimeframe(startDate, endDate, userId).then((data) => {
            let totalLeads = data.length;
            let closedLeads = 0;
            let convertedLeads = 0;
            data.forEach(lead => {
                if (lead.status == 'Closed Deals') {
                    closedLeads++;
                }
                if (lead.status == 'Converted') {
                    convertedLeads++;
                }
            });
            let closureRate = (closedLeads / totalLeads) * 100;
            let conversionRate = (convertedLeads / totalLeads) * 100;

            var result = {
                'closureRate': closureRate,
                'conversionRate': conversionRate
            };

            resolve(result);
        }).catch((err) => {
            reject(err);
        })
    });
}

function importLeads(leads) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        leads.forEach(lead => lead['assigned'] = user.userId);
        leadModel.import(leads).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
}

function exportLeads() {
    return new Promise((resolve, reject) => {

        async function getData(){
            let data, csvData;
           //uploadQueue.add({data: data})
           //uploadQueue.process(async (job) => {
                try{
                data = await leadModel.export();
                if(Array.isArray(data) && data.length){
                    const json2csvParser = new Json2csvParser({ header: true });
                    csvData = json2csvParser.parse(data);
                }else{
                csvData = [];
                }
                resolve(csvData);
                //done();
              //});
                }
                catch(err){reject(err)}
        }
        getData()
    })
}

function textSearch(text, assigned, ishidden) {
    return new Promise((resolve, reject) => {
        leadModel.getTextSearchResult(text).then((data) => {
            if(!_.isEmpty(ishidden)){
                data = _.filter(data, ['isHidden', (ishidden === 'true')]);
            }
            if(!_.isEmpty(assigned)){
                data = _.filter(data, ['assigned._id' , assigned]);
            }
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllLeadsOverview(){
    return new Promise((resolve, reject) => {
        var promises = [];
        promises.push(getAllLeadsCount({'degree':'SUPER_HOT'}));
        promises.push(getAllLeadsCount({'degree':'HOT'}));
        promises.push(getAllLeadsCount({'degree':'WARM'}));
        promises.push(getAllLeadsCount({'degree':'COLD'}));

        Promise.all(promises).then((data)=>{
            followupService.getAllFollowupsCount().then((followupcount)=>{
                meetingService.getAllMeetingsCount().then((meetingcount)=>{
                    var result = {
                        'superHot': data[0],
                        'hot': data[1],
                        'warm': data[2],
                        'cold':data[3],
                        'followups': followupcount,
                        'meetings' : meetingcount
                    }
                    resolve(result);
                });
            }).catch((err)=>{
                console.err("Error while getting followup count");
            });
        })
    }).catch((err)=>{
        console.log(err);
        reject(err);
    });
}

function getAllLeadsbyStatus(){
    return new Promise((resolve, reject) => {
        var promises = [];
        promises.push(getAllLeadsCount({'status':'NEW_LEAD'}));
        promises.push(getAllLeadsCount({'status':'QUALIFIED_LEADS'}));
        promises.push(getAllLeadsCount({'status':'CONTACTED_LEADS'}));
        promises.push(getAllLeadsCount({'status':'ON_HOLD'}));
        promises.push(getAllLeadsCount({'status':'OPPORTUNITIES'}));
        promises.push(getAllLeadsCount({'status':'CONVERTED'}));
        

        Promise.all(promises).then((data)=>{
            var result = {
                'NEW_LEAD': data[0],
                'QUALIFIED_LEADS': data[1],
                'CONTACTED_LEADS': data[2],
                'ON_HOLD':data[3],
                'OPPORTUNITIES': data[4],
                'CONVERTED' : data[5]
            }
            resolve(result);
            
        })
    }).catch((err)=>{
        console.log(err);
        reject(err);
    });
}

function getAggregateCount(key) {
    const query = [
        { "$group": { _id: "$" + key, count: { $sum: 1 } } }
    ];
    return new Promise((resolve, reject) => {
        leadModel.getAggregateCount(query).then((data) => {

            let result = {};
            if(key === "degree"){
                Object.keys(leadDegree).forEach(degree => {
                    result[degree] = 0;
                });
            }
            if(key === "status"){
                Object.keys(leadStatus).forEach(status => {
                    result[status] = 0;
                });
            }

            data.forEach(entry=>{
                result[entry._id] = entry.count;
            });

            resolve(result);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getLeaderboard(startDate, endDate){
    return new Promise((resolve, reject) => {
        var users, close, response=[];
        async function leaderboard(){
            users = await userModel.search({});
            for(let user of users){
                close = await leadModel.closedPercentage(user._id);
                if(Array.isArray(close) && close.length){
                var leader ={
                    'user': user,
                    'count':close[0].count
                }
            }else{
                var leader ={
                    'user': user,
                    'count':"0"
                }
            }
            response.push(leader);
            }
        }
        // getAllLeadsWithinTimeframe(startDate, endDate, undefined, undefined, undefined, 'CONVERTED').then((data) => {
        //     userModel.search({}).then((users)=>{
        //         // let response = [];
        //         // for(let user of users){
        //         //    let leads =  _.filter(data, function(o) { return o.assigned != null && o.assigned._id == user._id; });
        //         //    var leader = {
        //         //        'user': user,
        //         //        'count' : leads.length
        //         //    }
        //         //    response.push(leader);
        //         // }
        //         // response = _.sortBy(response, [function(o) { return -o.count; }]);
        //         resolve(response);
        //     }).catch((err) => {
        //         reject(err);
        //     });
        // }).catch((err) => {
        //     reject(err);
        // })
        leaderboard().then(()=>{resolve(response)});
    });
}

function searchLeadsByEntity(entity){
    return new Promise((resolve, reject) => {
        var leadsIds = new Set();    
        if(entity == 'meetings'){
            meetingService.getAllMeetings().then((meetings)=>{
                console.log
                meetings.forEach(e=>{
                    leadsIds.add(e.assigned);
                });
                getLeadsByLeadsIds(resolve, reject, leadsIds);
            })
        }else if(entity == 'followups'){
            followupService.getAllFollowups().then((followups)=>{
                followups.forEach(e=>{
                    leadsIds.add(e.assigned);
                });
                getLeadsByLeadsIds(resolve, reject, leadsIds);
            })
        }else{
            reject('unsupported action')
        }
    });
}

//build an API that takes a query and gets those leads and checks which of those leads have followups attached
// and sends only those leads
// the same API also gets leads by query, checks which ones have meetings attached and send those

function postSearchLeadsByEntity(entity, query){
    return new Promise(async(resolve, reject) => {
        try{
        let followLeads = [], meetingLeads =[]
        leads = await leadModel.search(query)
            for(lead of leads){
                followups = await followupModel.search({assigned: lead._id})
                meetings = await meetingModel.search({assigned:lead._id})
                Array.isArray(followups) && followups.length ? followLeads.push(lead) : 0
                Array.isArray(meetings) && meetings.length ? meetingLeads.push(lead) : 0
            }
        switch(entity){
            case 'MEETING' :
                resolve(meetingLeads)
            case 'FOLLOWUP' :
                resolve(followLeads)
            default :
                resolve([])
        }
    }catch(err){reject(err)}
    })

}

function getLeadsByLeadsIds(resolve, reject, leadsIds){
    
    leadModel.search({"_id":{'$in':Array.from(leadsIds)}}).then((data)=>{
        console.log("**** got data")
        resolve(data);
    }).catch((err)=>{
        reject(err);
    })
}


function getAllFollowupsByUserId(userId){
    
    return new Promise((resolve,reject) => {
        let searchCriteria = {
            pageSize: 100000000,
            pageNo: 1,
            query: {
                'assigned': userId
            }
        };
        searchLeads(searchCriteria).then((leads)=>{
            
            let leadIds = leads.map(l=>l._id);
            var followQuery = {
                'assigned': {
                    '$in': leadIds
                }
            }
            followupService.searchFollowups({
                pageSize: 100000000,
                pageNo: 1,
                query: followQuery
            }).then((followups)=>{
                resolve(followups);
            }).catch((err)=>{
                reject(err);    
            })
        }).catch((err)=>{
            reject(err);
        })
    });
}

function getAllMeetingsByUserId(userId){
    
    return new Promise((resolve,reject) => {
        let searchCriteria = {
            pageSize: 100000000,
            pageNo: 1,
            query: {
                'assigned': userId
            }
        };
        searchLeads(searchCriteria).then((leads)=>{
            
            let leadIds = leads.map(l=>l._id);
            var followQuery = {
                'assigned': {
                    '$in': leadIds
                }
            }
            meetingService.searchMeetings({
                pageSize: 100000000,
                pageNo: 1,
                query: followQuery
            }).then((followups)=>{
                resolve(followups);
            }).catch((err)=>{
                reject(err);    
            })
        }).catch((err)=>{
            reject(err);
        })
    });
}

function getAllDataForToday(type){
    return new Promise((resolve, reject) => {
        if(type == 'followup'){
            getTodaysFollowup().then((data)=>{
                resolve(data);
            }).catch((err)=>{
                reject(err);
            });
        }else{
            getTodaysMeeting().then((data)=>{
                resolve(data);
            }).catch((err)=>{
                reject(err);
            });
        }

    });
}

function getTodaysFollowup(){
    return new Promise((resolve, reject) => {
        var today = new Date().toISOString();
        followupService.getAllFollowUpsByDate(today).then((followups)=>{
            var result = {
                'followup': followups
            }
            resolve(result);
        }).catch((err)=>{
            reject(err);
        })
    });
}

function getTodaysMeeting(){
    return new Promise((resolve, reject) => {
        var today = new Date().toISOString();
        meetingService.getAllMeetingsByDate(today).then((meetings)=>{
            var result = {
                'meeting': meetings
            }
            resolve(result);
        }).catch((err)=>{
            reject(err);
        })
    });
}

function getLeadCountByTimestamp(key, year, month, week, sumBy, assigned, statusNOTEqual){
    return new Promise((resolve, reject) => {

        if(year != undefined && month == undefined && week == undefined){
            leadModel.groupByKeyAndCountDocumentsByMonth_v2(key, year, sumBy, assigned, statusNOTEqual).then((data)=>{
                resolve(data);
            }).catch((err)=>{
                reject(err);
            })
        }else if(year != undefined && month != undefined && week == undefined){
            leadModel.groupByKeyAndCountDocumentsByWeek(key, year, month, sumBy, assigned).then((data)=>{
                resolve(data);
            }).catch((err)=>{
                reject(err);
            })
        }else if(year != undefined && month == undefined && week != undefined){

            leadModel.groupByKeyAndCountDocumentsByDay(key, year, month, week, sumBy, assigned).then((data)=>{
                resolve(data);
            }).catch((err)=>{
                reject(err);
            })
        }else{
            leadModel.groupByKeyAndCountDocumentsByYears(key, sumBy, assigned).then((data)=>{
                resolve(data);
            }).catch((err)=>{
                reject(err);
            })
        }
    });
}


function leadTimeline(leadId){
    return new Promise((resolve, reject) => {
        let searchQuery = {
            pageNo: 1,
            pageSize: 10000000,
            query:{
                assigned: leadId
            }
        }
        let emailSearchQuery = {
            pageNo: 1,
            pageSize: 10000000,
            query:{
                entityType: 'LEAD',
                entityId: leadId
            }
        }
        let promises = [];
        promises.push(meetingService.searchMeetings(searchQuery));
        promises.push(followupService.searchFollowups(searchQuery));
        promises.push(emailService.searchEmails(emailSearchQuery));

        Promise.all(promises).then((data)=>{
            let allItem = [];
            data[0].forEach(i=>{
                let meeting = JSON.parse(JSON.stringify(i));
                meeting['type'] = 'MEETING';
                allItem.push(meeting);
            });
            data[1].forEach(j=>{
                let followup = JSON.parse(JSON.stringify(j));
                followup['type'] = 'FOLLOWUP';
                allItem.push(followup);
            });

            data[2].forEach(k=>{
                let email = JSON.parse(JSON.stringify(k));
                email['type'] = 'EMAIL';
                allItem.push(email);
            });

            allItem = _.sortBy(allItem, ['createdAt']);
            resolve(allItem.reverse());
        }).catch((err)=>{
            reject(err);
        })
    });
}

/**********************************************************************
 * @DESC - TO GET THE LIST OF LEADS IN PIPELINE STATE
 * @DESC - LEADS --> DEGREE = SUPER HOT && STATUS = OPPURTUNITY_LEADS
 *********************************************************************/
function getLeadsInPipeline( startDate, endDate, isOrganisation ){
    return new Promise(async (resolve, reject) => {
        var user = currentContext.getCurrentContext();
        let queries = { $and : [{ 'degree':"SUPER_HOT" },{ 'status':"OPPORTUNITIES" } ] };
        if( !isOrganisation || isOrganisation !== "true" ){
            queries = { $and : [{ 'degree':"SUPER_HOT" },{ 'status':"OPPORTUNITIES" },{ 'createdBy': user.email } ] };
        }
        var response = [], final={};
        try{
        data = await leadModel.search( queries )
            
                for(i in data){
                    CP = await leadCP(data[i]._id)
                    CPP = {closingProbability : CP}
                    transit = data[i]._doc;
                    final = {...transit,...CPP};
                    response.push(final);
                }
                resolve( response )
            }catch(err){reject(err);}
    });
 }

function getLeadsWithDegreeAndStatus( startDate, endDate, isOrganisation ){
    return new Promise(async (resolve, reject) => {
        var user = currentContext.getCurrentContext();
        var promises = [];
        let rough=[
            {'degree':"SUPERHOT"},
            {'degree':"HOT"},
            {'degree':"WARM"},
            {'degree':"COLD"},
            { 'status':"NEW_LEAD" },
            { 'status':"QUALIFIED_LEADS" },
            { 'status':"ON_HOLD" },
            { 'status':"DROPPED_LEAD" },
            { 'status':"CONTACTED_LEADS" },
            { 'status':"CONVERTED" }
        ]
        let queries = [
            {$and:[{degree:"SUPERHOT"},{status:{$ne:"CONVERTED"}}]},
            {$and:[{degree:"HOT"},{status:{$ne:"CONVERTED"}}]},
            {$and:[{degree:"WARM"},{status:{$ne:"CONVERTED"}}]},
            {$and:[{degree:"COLD"},{status:{$ne:"CONVERTED"}}]},
            { 'status':"NEW_LEAD" },
            { 'status':"QUALIFIED_LEADS" },
            { 'status':"ON_HOLD" },
            { 'status':"DROPPED_LEAD" },
            { 'status':"CONTACTED_LEADS" },
            { 'status':"CONVERTED" }
        ];
        if( !isOrganisation || isOrganisation !== "true" ){
            queries.forEach( data => { data.createdBy = user.email } )
        }
        let i = 0;
        while( i < queries.length ){
            promises.push( getAllLeadsCount(queries[i]) );
            i++;
        }
        Promise.all( promises )
            .then( data => {
                let returnData = {};
                let obj1={};
                let obj2={};
                var cash = [];
                //logic for return data / normal data
                rough.forEach( (element, index) => { 
                    console.log(Object.values(element)[0]);
                    returnData[Object.values(element)[0]] = data[index];
                 });
                 
                // //label logic
                 let allLabels = Object.keys( returnData ).map( elem => { 
                     elem = elem.toLowerCase();
                     elem = elem.charAt(0).toUpperCase() + elem.slice(1);
                     if( elem.includes("_") ){
                        elem = elem.split("_");
                        let finalelem = "";
                        elem.forEach( e => {
                            finalelem = finalelem+ " " + e;
                        } );
                        elem = finalelem.trim();
                     }
                     return elem;
                  });
                 returnData = { normalData : returnData, grapghData : { "labels" : allLabels, "values" : Object.values( returnData ) } }
                 resolve( returnData );
                //getAllLeadsCount({'degree':"SUPER_HOT" }).then((a)=>{console.log(a);})
                 
            })
            .catch( err => { reject( err ) } )
    });
 }


 function getAllTodayData( type, isOrganisation ){
     return new Promise( async ( resolve, reject ) => {
        var today = new Date().toISOString();
        if(type == 'followup'){
            let followups = await followupService.getAllFollowUpsByDateAndUser( today, isOrganisation );
            var result = {
                'followup': followups
            }
            resolve( result );
        }else{
            let meetings = await followupService.getAllMeetingsByDateAndUser( today, isOrganisation );
            var result = {
                'meeting': meetings
            }
            resolve( result );
        }
     });
 }

 function reasonForLeadDrop ( startDate, endDate, isOrganisation ){
    return new Promise(async (resolve, reject) => {
        var user = currentContext.getCurrentContext();
        var promises = [];
        let queries = [
            { 'reason_for_drop':"WENT_TO_COMPETITOR", "status":"DROPPED_LEAD" },
            { 'reason_for_drop':"OUT_OF_BUDGET", "status":"DROPPED_LEAD"  },
            { 'reason_for_drop':"LOW_FOLLOWUPS", "status":"DROPPED_LEAD"  },
            { 'reason_for_drop':"NOT_INTERESTED", "status":"DROPPED_LEAD"  },
            { 'reason_for_drop':"DEAL_CANCELLED", "status":"DROPPED_LEAD"  },
            { 'reason_for_drop':"OTHERS", "status":"DROPPED_LEAD"  },
        ];
        if( !isOrganisation || isOrganisation !== "true" ){
            queries.forEach( data => { data.createdBy = user.email } )
        }
        let i = 0;
        while( i < queries.length ){
            promises.push( getAllLeadsCount(queries[i]) );
            i++;
        }
        Promise.all( promises )
            .then( data => {
                let returnData = {};
                queries.forEach( (element, index) => { 
                    returnData[Object.values(element)[0]] = data[index];
                 });
                 let allLabels = Object.keys( returnData ).map( elem => { 
                    elem = elem.toLowerCase();
                    elem = elem.charAt(0).toUpperCase() + elem.slice(1);
                    console.log( elem );
                    if( elem.includes("_") ){
                       elem = elem.split("_");
                       let finalelem = "";
                       elem.forEach( e => {
                           finalelem = finalelem+ " " + e;
                       } );
                       elem = finalelem.trim();
                    }
                    return elem;
                 });
                 returnData = { "labels" : allLabels, "values" : Object.values( returnData ) }
                 resolve( returnData );
            })
            .catch( err => { reject( err ) } )
    });
 }

 function getLeadBySourceRevenue( startDate, endDate, isOrganisation ){
    return new Promise(async (resolve, reject) => {
        var user = currentContext.getCurrentContext();
        var promises = [];
        let queries = [
            { 'source':"Instagram"},
            { 'source':"Facebook" },
            { 'source':"LinkedIn" },
            { 'source':"Others" },
        ];
        if( !isOrganisation || isOrganisation !== "true" ){
            queries.forEach( data => { data.createdBy = user.email } )
        }
        let i = 0;
        while( i < queries.length ){
            promises.push( leadModel.search(queries[i]) );
            i++;
        }
        Promise.all( promises )
            .then( data => {
                let returnData = {};
                queries.forEach( (element, index) => { 
                    returnData[Object.values(element)[0]] = data[index];
                 });
                 let allValues = Object.values( returnData );

                 allValues = allValues.map( element => {
                     let sum = 0;
                     element.forEach( data => {
                         console.log(data.worth)
                         sum = sum + (parseInt(data.worth) ? parseInt(data.worth) : 0);
                     });
                     return sum;
                 });
                 returnData = { "labels" : Object.keys( returnData ), "values" : allValues }
                 resolve( returnData );
            })
            .catch( err => { reject( err ) } )
    });
 }


 function getLeadCountBySocialMediaWithDateFilter( startDate, endDate ){
     return new Promise( async ( resolve, reject ) => {
         try{
             startDate  = startDate ? startDate : moment().startOf('month').toISOString();
             endDate = endDate ? endDate : moment().endOf('month').toISOString();
            var query = { 
                $and : [
                    { createdAt : { $gte : startDate } },
                    { createdAt : { $lte : endDate } }
                ]
            };
            let returnData = await leadModel.search( query );
            console.log( returnData );
            let data = {
                "x_axis":{ "labels" : ["Instagram", "Facebook","LinkedIn","Others"] },
                "y_axis":{ "data":[
                    returnData.filter( data => data.source === "Instagram" ).length,
                    returnData.filter( data => data.source === "Facebook" ).length,
                    returnData.filter( data => data.source === "LinkedIn" ).length,
                    returnData.filter( data => data.source === "Others" ).length
                ] }
            }
            resolve( data );
         } catch ( err ){
             reject( err );
         }
     })
 }

function getTargetClosed( query ){
    return new Promise( async( resolve, reject ) => {
        try{
            let returnData = await leadModel.search( query );
            resolve( returnData );
        } catch ( err ){
            reject( err );
        } 
    })
}

function closedPercentage( member ){
    return new Promise( async( resolve, reject ) => {
        try{
            let returnData = await leadModel.closedPercentage( member );
            resolve( returnData );
        } catch ( err ){
            reject( err );
        } 
    })
}

function leadsByAccountId( account ){
    return new Promise( async( resolve, reject ) => {
        try{
            let returnData = await leadModel.leadsByAccountId( account );
            resolve( returnData );
        } catch ( err ){
            reject( err );
        } 
    })
}

function allLeadsCP(){
    return new Promise( async( resolve, reject ) => {
        try{
            let final = []
            let leadData = await leadModel.search({});
            if(Array.isArray(leadData) && leadData.length){
            for (lead of leadData){
                CP = await leadCP(lead._id)
                data = {"Id": lead._id,"CP":CP}
                await final.push(data) 
            }
        }
            resolve( final );
        } catch ( err ){
            reject( err );
        } 
    })
}

function leadCP(lead){
    var response, data, degree, status, CP;
    return new Promise(async(resolve, reject) => {
        try{
            var degree = 0, status = 0, followups=0, calls=0, notes =0;
            followups = await followupModel.countDocuments({assigned:lead});
            calls = await callModel.countDocuments({to:lead});
            notes = await noteModel.countDocuments({entityId:lead});
            leadData = await leadModel.getById(lead);
            deg = leadData.degree; 
            switch(deg){
                case('COLD'):degree = 1;
                break;
                case('COOL'):degree = 2;
                break;
                case('WARM'):degree = 3;
                break;
                case('HOT'):degree = 4;
                break;
                case('SUPER_HOT'):degree = 5; 
            }
        data=14;
            CP = parseInt(data+followups+calls+notes+degree);
            resolve(CP)
        }catch(err){reject(err)}
    })
}

function getAvgCP(){
    return new Promise(async(resolve, reject) => {
        let total = 0, count, avgCP;
        try{
        data = await leadModel.search({});
        for (i in data){
            CP = await leadCP(data[i]._id)
            console.log(CP);
            total = total + CP
        }
        count = data.length;
        avgCP = total/count
        resolve(avgCP);
    }
        catch(err){reject(err)}
  })
}

function importLeadsWithOptions( leadsArray, options ){
    return new Promise( async ( resolve, reject ) => {
        try{

// below line uses the uniqBy function of lodash libary to keep only unique emails from 
//the leads array as the array itself can contain duplicate values.

            let duplicate_free = _.uniqBy(leadsArray, 'email'); 
            let leads = duplicate_free;
            console.log( duplicate_free.length, leadsArray.length );
//now in the options, you pass one of three things - create, update or update and overwrite
// if none of these options are present, then you simply reject as saying invalid options
//CREATE NEW DATA
            if( options === "CREATE" ){
//takes a counter notAdded that is incremented each time we find a lead that we wont be 
//updating in the backend
                let i = 0, notAdded = 0 ;
                let all_promise = [];
                while( i < leads.length ){
//takes one lead at a time into lead_data
                    let lead_data = leads[i];
//finds lead using the email of the leadData and storing that value in leadsearch
                    let leadsearch = await leadModel.searchOne({ email: lead_data.email });
                    if( leadsearch ){
//if that lead already exists, we simply increment noteAdded variable
                        notAdded++;
                    } else {
//if the lead doesn't exist in our d.b, we need to add to our d.b
//addLead here is the function in this file itself and we're calling and storing the promise
// in the allpromise array
                        all_promise.push( addLeadImport( lead_data ) );
                    }
                    i++;
                }
//we pass the all_promise array to promise.all function that solves all promises
//the benefit of this approach seems to be that for each lead we can know failure and can even show
// which lead failed rather than the entire process of adding data failing
            Promise.all( all_promise )
                .then( data => resolve({ success : data.length, failed : notAdded }))
                .catch( err => reject( err ) )
//if user selects the option of updating the leads in the database instead of simply creating new
//UPDATE BU DONT OVERWRITE
            } else if( options === "UPDATE" ){
                let i = 0, updated = 0;
                let all_promise = [];
//run loop till entire length of leads
                while( i < leads.length ){
//taking individual leads' data in lead_data one at a time
                    let lead_data = leads[i];
//try finding the lead from d.b with this email i.d
                    let leadsearch = await leadModel.searchOne({ email: lead_data.email });
//if there's a lead like that, that exists, then do this
                    if( leadsearch ){
//these two functions help bring data coming from d.b into a format acceptable by lodash
                        let cloneDeep = JSON.parse( JSON.stringify( leadsearch ) );
//the difference function of lodash is supposed to return no values if both lead_data and cloneDeep are same
//we are comparing singular value from leads array with singular value coming from database
// but it is important to note that we are comparing their object keys arrays - which is basically
//the array of only the first or the key values in the respective objects
                        let ids = _.difference( Object.keys( lead_data ),Object.keys( cloneDeep )  );
//log all the values of keys that are not matching in both to the console
//[possible logical issue - the difference function is not direction aware, in the sense the unique
//values could be present in cloneDeep but it's also possible that the unique values was in lead_data]
                        console.log( ids );  
                        let set = {};
//this loops through each key value that is unique between them
                        ids.forEach( id => {
//if there is a value that exists in lead_data for that key, and id is not _id (which is there by default)
//then in the set object you put that new value
                            if( lead_data[id]  && id !== "_id" ){
                                set[id] = lead_data[id]
                            }
                        });
//this makes an array with all the keys of the set array and checks if the length is more than 0
                        if( Object.keys( set ).length > 0 ){
//here we are updating all the leads that have their ids in clonedeep and updating them with the data
//that is in set object
//[possible logical issue - the entire value of lead is being replaced by set whereas set only
//has the unique values, maybe this is why there are errors]
                            all_promise.push( leadModel.updateById( cloneDeep._id , set ) );
//each time a lead is updated, we increment the updated counter
//if does seem like a function that wouldn't overwrite, but it is actually overwriting
                            updated++;
                        }
                    } else {
//else add data into d.b if it doesn't exist in d.b already
                        all_promise.push( addLeadImport( lead_data ) );
                    }
                    i++;
                }
                Promise.all( all_promise )
                .then( data => resolve({ success : data.length, updated : updated }))
                .catch( err => reject( err ) )
//UPDATE AND ALSO OVERWRITE
            } else if( options === "UPDATE_AND_OVERWRITE" ){
                let i = 0, updated = 0;;
                let all_promise = [];
                while( i < leads.length ){
                    let lead_data = leads[i];
//find the lead with the email i.d present in a particular lead's data
                    let leadsearch = await leadModel.searchOne({ email: lead_data.email });
//condition checks if lead exists with this email
                    if( leadsearch ){
//the new data that will now reside in the d.b is placed in updateData variable
//it is important to remember that this is the data inputted by the user
                        let updateData = JSON.parse( JSON.stringify(  lead_data ) );
//delete the email from this data so as to not cause any conflict
                        delete updateData.email;
//push this promise into an array for updating
                        all_promise.push( leadModel.updateById( leadsearch._id , updateData ) );
                        updated++;
                    } else {
//else push adding lead into an array if lead with this i.d doesn't exist in d.b
                        all_promise.push( addLeadImport( lead_data ) );
                    }
                    i++;
                }
                Promise.all( all_promise )
                .then( data => resolve({ success : data.length, update : updated }))
                .catch( err => reject( err ) )
            } else {
                reject("Invalid options");
            }
        } catch ( err ){
            reject( err );
        }
    })
}
 

function importest(leads){
    return new Promise((resolve, reject) => {
        let existing=[], toBeAdded=[], data=[], result=[];
        let response = {
            "existing_leads": existing,
            "leads_added_to_db": result
        }
     
        async function getLeads(leads){
            console.log(leads);
        let duplicate_free = _.uniqBy(leads, 'email'); 
        let leadsA = duplicate_free;
       for (i in leadsA){
        let leadsearch = await leadModel.searchOne({ email: leadsA[i].email });
        if(leadsearch){
            existing.push(leadsA[i]);
            }
        }
        toBeAdded = _.difference(leadsA, existing);
        var user = currentContext.getCurrentContext();
        toBeAdded.forEach(toBeAdded => {
            toBeAdded['assigned'] = user.userId
            toBeAdded['lastModifiedBy'] = user.email
            toBeAdded['createdBy'] = user.email
            toBeAdded['isKanban'] = 'false'
            toBeAdded['isHidden'] = 'false'
        });
        data = await leadModel.import(toBeAdded);
        for(i in data){
            result.push(data[i]);
        }
    }
        getLeads(leads).then(()=>{resolve(response);})
    });
}

function overwrite(leads) {
    return new Promise((resolve, reject) => {
        console.log(leads);
       async function dojob(leads){

       let i = 0, updated = 0;
                let all_promise = [];
                while( i < leads.length ){
                    let lead_data = leads[i];
                    let leadsearch = await leadModel.searchOne({ email: lead_data.email });
                    if( leadsearch ){
                        let updateData = JSON.parse( JSON.stringify(  lead_data ) );
                        all_promise.push( leadModel.updateById( leadsearch._id , updateData ) );
                        updated++;
                    } else {

                        all_promise.push( addLeadImport( lead_data ) );
                    }
                    i++;
                }
                Promise.all( all_promise )
                .then( data => resolve({ success : data.length, updated : updated }))
                .catch( err => reject( err ) )
            }
        dojob(leads);

    });
}

function notoverwrite(leads) {
    return new Promise((resolve, reject) => {
    async function dojob(leads){ 

    let i = 0, updated = 0;
                let all_promise = [];
                while( i < leads.length ){
                    let lead_data = leads[i];
                    let leadsearch = await leadModel.searchOne({ email: lead_data.email });
                    if( leadsearch ){
                        let cloneDeep = JSON.parse( JSON.stringify( leadsearch ) );
                        let ids = _.difference( Object.keys( lead_data ),Object.keys( cloneDeep )  );
                        console.log( ids );  
                        let set = {};

                        ids.forEach( id => {

                            if( lead_data[id]  && id !== "_id" ){
                                set[id] = lead_data[id]
                            }
                        });
                        if( Object.keys( set ).length > 0 ){

                            all_promise.push( leadModel.updateById( cloneDeep._id , set ) );

                            updated++;
                        }
                    } else {

                        all_promise.push( addLeadImport( lead_data ) );
                    }
                    i++;
                }
                Promise.all( all_promise )
                .then( data => resolve({ success : data.length, updated : updated }))
                .catch( err => reject( err ) )
            }
            dojob(leads);
    });
}

function checkFields(leads){
    return new Promise( async( resolve, reject ) => {
        let answer=0, userData={};
       async function dojob(leads){
        ideal = ["_id","name","account_id", "email","phone","phoneCode","status","reason_for_drop","tags","isKanban","isHidden","assigned","degree","additionalInfo", "profileImage","emoji","about","createdBy","source","worth","closingDate","convertedDate","lastModifiedBy","media"]
        userData = Object.keys(leads[0]);
        check =_.difference(userData, ideal);
        if(check.length>0){
            answer = "yes"
        }
        else{
            answer = "no"
        }
        response = {
            "answer": answer,
            "userFields": userData,
            "standardFields": ideal
        }
        resolve(response);
       }
       dojob(leads);
    })
}

//this is the add lead function that specifically gets called when importing leads as we cannot
//call the regular add lead function as that creates activity and notifications for each lead created
function addLeadImport(leadData) {
    return new Promise((resolve, reject) => {
        console.log("IN NEW FUNC");
        var user = currentContext.getCurrentContext();
        leadData.createdBy = user.email;
        leadData.lastModifiedBy = user.email;
        if(leadData.status == undefined){
            leadData.status = 'NEW_LEAD';
        }

        if(leadData.degree == undefined){
            leadData.degree = 'COLD';
        }
        leadModel.create(leadData).then((data) => {
            // var activity = {
            //     'entityType': leadData.entityType,
            //     'entityId': leadData.entityId,
            //     'data': leadData,
            //     'activityType': 'LEAD_CREATED'
            // }
            // notificationClient.notify(NotificationType.LEAD_CREATED, data, user.workspaceId, user.userId);
            // activityService.addActivity(activity).then((adata) => {
            //     resolve(data);
            // }).catch((err) => {
            //     reject(err);
            // });
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
}

function countOverview( query ){
    return new Promise( async( resolve, reject ) => {
        try{
            let fcounter =0, mcounter =0;
            // query = {"assigned":"54c77be0-982a-11eb-a553-f3717988f18e", "status":{$ne:"ARCHIVE"}}
            coldQ = {"degree":"COLD"}, warmQ = {"degree":"WARM"}, hotQ = {"degree":"HOT"}, superQ = {"degree":"SUPER_HOT"}
            coldQuery = {...query, ...coldQ}, warmQuery = {...query, ...warmQ}, hotQuery ={...query, ...hotQ}, superQuery = {...query, ...superQ}
            data = await Promise.all([leadModel.countDocuments(coldQuery), leadModel.countDocuments(warmQuery), leadModel.countDocuments(hotQuery), leadModel.countDocuments(superQuery)])
            leads = await leadModel.search(query)
            for(lead of leads){
                followups = await followupModel.search({assigned: lead._id})
                meetings = await meetingModel.search({assigned:lead._id})
                Array.isArray(followups) && followups.length ? fcounter += 1 : 0
                Array.isArray(meetings) && meetings.length ? mcounter += 1 : 0
            }
            response = {"cold":data[0], "warm":data[1], "hot":data[2], "superhot":data[3], "followups":fcounter, "meetings":mcounter}
            resolve(response);
        } catch ( err ){
            reject( err );
        } 
    })
}

//RUN THE QUERY AND GET THE LEADS from search fuction, using revere populate in search function, 
//get their followups along, filter out the ones that don't have followups attached to them and then just count and send

module.exports = leadService;

