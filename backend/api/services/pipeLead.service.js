var Queue = require('bull');
var uploadQueue = new Queue('uploading queue');
const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");
var pipeLeadModel = require("../models/pipeLead.model");
var userModel = require("../models/user.model");
var followupModel = require("../models/followup.model");
var meetingModel = require("../models/meeting.model");
var noteModel = require("../models/note.model");
var accountModel = require("../models/account.model");
var wactService = require("./workactivity.service");
var activityService = require('../services/activity.service');
var currentContext = require('../../common/currentContext');
const _ = require('lodash');
const LeadStatus = require('../../common/constants/LeadStatus'); 
const LeadDegree = require('../../common/constants/LeadDegree');
const followupService = require('./followup.service');
const meetingService = require('./meeting.service');
const userService = require('./user.service');
const emailService = require('./email.service');
const NotificationType = require('../../common/constants/NotificationType');
const moment = require('moment');

var pipeLeadService = {
    getAllPipeLeads: getAllPipeLeads,
    getPipeLeadById: getPipeLeadById,
    getById: getById,
    addPipeLead: addPipeLead,
    updatePipeLead: updatePipeLead,
    deletePipeLead: deletePipeLead,
    getPipeLeadByPipeLeadName: getPipeLeadByPipeLeadName,
    getPipeLeadsByPage: getPipeLeadsByPage,
    getAllPipeLeadsCount: getAllPipeLeadsCount,
    getPipeLeadsByPageWithSort: getPipeLeadsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchPipeLeads: searchPipeLeads,
    getAllPipeLeadsWithinTimeframe: getAllPipeLeadsWithinTimeframe,
    getPipeLeadClosureRate: getPipeLeadClosureRate,
    importPipeLeads: importPipeLeads,
    exportPipeLeads: exportPipeLeads,
    textSearch: textSearch,
    getAllPipeLeadsOverview: getAllPipeLeadsOverview,
    getAggregateCount: getAggregateCount,
    getPipeLeaderboard: getPipeLeaderboard,
    searchPipeLeadsByEntity: searchPipeLeadsByEntity,
    postSearchPipeLeadsByEntity: postSearchPipeLeadsByEntity,
    getAllFollowupsByUserId: getAllFollowupsByUserId,
    getAllMeetingsByUserId: getAllMeetingsByUserId,
    getAllDataForToday: getAllDataForToday,
    getPipeLeadCountByTimestamp: getPipeLeadCountByTimestamp,
    getAllPipeLeadsbyStatus: getAllPipeLeadsbyStatus,
    pipeLeadTimeline: pipeLeadTimeline,
    getPipeLeadsByUser: getPipeLeadsByUser,
    getPipeLeadsInPipeline:getPipeLeadsInPipeline,
    getPipeLeadsWithDegreeAndStatus:getPipeLeadsWithDegreeAndStatus,
    getAllTodayData:getAllTodayData,
    reasonForPipeLeadDrop:reasonForPipeLeadDrop,
    getPipeLeadBySourceRevenue:getPipeLeadBySourceRevenue,
    getPipeLeadCountBySocialMediaWithDateFilter:getPipeLeadCountBySocialMediaWithDateFilter,
    getTargetClosed:getTargetClosed,
    closedPercentage: closedPercentage,
    pipeLeadCP:pipeLeadCP,
    allPipeLeadsCP:allPipeLeadsCP,
    pipeLeadsByAccountId: pipeLeadsByAccountId,
    importPipeLeadsWithOptions:importPipeLeadsWithOptions,
    importest: importest,
    overwrite: overwrite,
    notoverwrite: notoverwrite,
    checkFields: checkFields,
    getAvgCP: getAvgCP,
    bulkAddPipeLead: bulkAddPipeLead,
    addPipeLeadImport: addPipeLeadImport,
    countOverview: countOverview
}

function addPipeLead(pipeLeadData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        pipeLeadData.createdBy = user.email;
        pipeLeadData.lastModifiedBy = user.email;
        if(pipeLeadData.status == undefined){
            pipeLeadData.status = 'NEW_LEAD';
        }

        if(pipeLeadData.degree == undefined){
            pipeLeadData.degree = 'COLD';
        }
        pipeLeadModel.create(pipeLeadData).then((data) => {
            var activity = {
                'entityType': 'ACCOUNT',
                'entityId': pipeLeadData.account_id,
                'data': pipeLeadData,
                'activityType': 'LEAD_CREATED'
            }
            activityService.addActivity(activity).then((adata) => {
                wactService.addWact(pipeLeadData, "LEAD", "CREATE").then((dataA)=>{resolve(data);}).catch((err) => {
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

function bulkAddPipeLead(pipeLeadData) {
    return new Promise((resolve, reject) => {
        // var user = currentContext.getCurrentContext();
        // pipeLeadData.createdBy = user.email;
        // pipeLeadData.lastModifiedBy = user.email;
        if(pipeLeadData.status == undefined){
            pipeLeadData.status = 'NEW_LEAD';
        }

        if(pipeLeadData.degree == undefined){
            pipeLeadData.degree = 'COLD';
        }
        pipeLeadModel.create(pipeLeadData).then((data) => {
        //     var activity = {
        //         'entityType': pipeLeadData.entityType,
        //         'entityId': pipeLeadData.entityId,
        //         'data': pipeLeadData,
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

function updatePipeLead(id, pipeLeadData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        pipeLeadData.lastModifiedBy = user.email;
        pipeLeadModel.getById(id).then((prevData)=>{
        pipeLeadModel.updateById(id, pipeLeadData).then((data) => {
            if(data.status == "CONVERTED"){
            var activity = {
                'entityType': 'ACCOUNT',
                'entityId': pipeLeadData.entityId,
                'data': pipeLeadData,
                'activityType': 'LEAD_CLOSED'
            }
            activityService.addActivity(activity).then((adata) => {
                wactService.addWact(pipeLeadData, "LEAD", "UPDATE", prevData).then((dataA)=>{resolve(data);}).catch((err) => {
                    reject(err);
                });    
            }).catch((err) => {
                reject(err);
            });
        }
        else{
            wactService.addWact(pipeLeadData, "LEAD", "UPDATE", prevData).then((dataA)=>{resolve(data);}).catch((err) => {
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

function deletePipeLead(id,pipeLeadData) {
    return new Promise((resolve, reject) => {
        pipeLeadModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllPipeLeads(assigned, isKanban, isHidden, isNotes, isFollowups) {
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
            // async function getPipeLeadsWithFN(query) {
            //   data =  await pipeLeadModel.getPaginatedResultWithNotesAndFollowups(query);
            //   data.forEach( ( element, index ) => { 
            //             data[ index ].notes = element.notes.length;
            //             data[ index ].followups = element.followups.length;
            //             });
            //             for(i in data){
            //                 CP = await pipeLeadCP(data[i]._id)
            //                     CPP = {closingProbability : CP}
            //                     transit = data[i]._doc;
            //                     final = {...transit,...CPP};
            //                     response.push(final);
            //             }
            // }
            pipeLeadModel.getPaginatedResultWithNotesAndFollowups(query).then((data) => {
                data.forEach( ( element, index ) => { 
                    data[ index ].notes = element.notes.length;
                    data[ index ].followups = element.followups.length;
                    });
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
            // getPipeLeadsWithFN(query).then(()=>{resolve(response);})
        });
    } else {
        return new Promise((resolve, reject) => {

            async function getPipeLeads(query){
                data = await pipeLeadModel.search(query)
                for(i in data){
                    CP = await pipeLeadCP(data[i]._id)
                        CPP = {closingProbability : CP}
                        transit = data[i]._doc;
                        final = {...transit,...CPP};
                        response.push(final);
                }
            }
            getPipeLeads(query).then(()=>{resolve(response);})
        });
    }
}

function getAllPipeLeadsWithinTimeframe(startDate, endDate, assigned, isKanban, isHidden, status) {
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
        pipeLeadModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPipeLeadById(id) {
    var final={},transit={}, dataA;
    return new Promise(async(resolve, reject) => {
        try{
            dataA = await pipeLeadModel.getById(id);
            var test = dataA.account_id;
            var data = await accountModel.getById(test)
            var dataB = data._doc;
            var CP = await pipeLeadCP(id);
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
        data = await pipeLeadModel.getById(id);
        resolve(data);
  })
}

function getPipeLeadsByUser(id){
    return new Promise((resolve, reject) => {
        pipeLeadModel.search({ 'assigned': id }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPipeLeadByPipeLeadName(pipeLeadName, tenant) {
    return new Promise((resolve, reject) => {
        pipeLeadModel.searchOne({ 'name': pipeLeadName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllPipeLeadsCount(query) {
    return new Promise((resolve, reject) => {
        pipeLeadModel.countDocuments(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPipeLeadsByPage(pageNo, pageSize, isKanban, isHidden, status) {
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
            pipeLeadModel.getPaginatedResultWithNotesAndFollowups(query, options).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        });
    } else {
        return new Promise((resolve, reject) => {
            pipeLeadModel.getPaginatedResult(query, options).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        });
    }
}

function getPipeLeadsByPageWithSort(pageNo, pageSize, sortBy, assigned, isKanban, isHidden, status) {
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
        pipeLeadModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        pipeLeadModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchPipeLeads(searchCriteria) {
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
            data = await pipeLeadModel.getPaginatedResult(query, options);
        //     for(i in data){
        //         CP = await pipeLeadCP(data[i]._id)
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
//                 pipeLeadCP(data[i]._id).then((data)=>{
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

    //     async function getPipeLeads(query){
    //         data = await pipeLeadModel.search(query)
    //         for(i in data){
    //             CP = await pipeLeadCP(data[i]._id)
    //                 CPP = {closingProbability : CP}
    //                 transit = data[i]._doc;
    //                 final = {...transit,...CPP};
    //                 response.push(final);
    //         }
    //     }
    //     getPipeLeads(query).then(()=>{resolve(response);})
    // });
    // }
    // }

function getPipeLeadClosureRate(userId, startDate, endDate) {
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
        getAllPipeLeadsWithinTimeframe(startDate, endDate, userId).then((data) => {
            let totalPipeLeads = data.length;
            let closedPipeLeads = 0;
            let convertedPipeLeads = 0;
            data.forEach(pipeLead => {
                if (pipeLead.status == 'Closed Deals') {
                    closedPipeLeads++;
                }
                if (pipeLead.status == 'Converted') {
                    convertedPipeLeads++;
                }
            });
            let closureRate = (closedPipeLeads / totalPipeLeads) * 100;
            let conversionRate = (convertedPipeLeads / totalPipeLeads) * 100;

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

function importPipeLeads(pipeLeads) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        pipeLeads.forEach(pipeLead => pipeLead['assigned'] = user.userId);
        pipeLeadModel.import(pipeLeads).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
}

function exportPipeLeads() {
    return new Promise((resolve, reject) => {

        async function getData(){
            let data, csvData;
           //uploadQueue.add({data: data})
           //uploadQueue.process(async (job) => {
                try{
                data = await pipeLeadModel.export();
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
        pipeLeadModel.getTextSearchResult(text).then((data) => {
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

function getAllPipeLeadsOverview(){
    return new Promise((resolve, reject) => {
        var promises = [];
        promises.push(getAllPipeLeadsCount({'degree':'SUPER_HOT'}));
        promises.push(getAllPipeLeadsCount({'degree':'HOT'}));
        promises.push(getAllPipeLeadsCount({'degree':'WARM'}));
        promises.push(getAllPipeLeadsCount({'degree':'COLD'}));

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

function getAllPipeLeadsbyStatus(){
    return new Promise((resolve, reject) => {
        var promises = [];
        promises.push(getAllPipeLeadsCount({'status':'NEW_LEAD'}));
        promises.push(getAllPipeLeadsCount({'status':'QUALIFIED_LEADS'}));
        promises.push(getAllPipeLeadsCount({'status':'CONTACTED_LEADS'}));
        promises.push(getAllPipeLeadsCount({'status':'ON_HOLD'}));
        promises.push(getAllPipeLeadsCount({'status':'OPPORTUNITIES'}));
        promises.push(getAllPipeLeadsCount({'status':'CONVERTED'}));
        

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
        pipeLeadModel.getAggregateCount(query).then((data) => {

            let result = {};
            if(key === "degree"){
                Object.keys(degree).forEach(degree => {
                    result[degree] = 0;
                });
            }
            if(key === "status"){
                Object.keys(stage).forEach(status => {
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

function getPipeLeaderboard(startDate, endDate){
    return new Promise((resolve, reject) => {
        var users, close, response=[];
        async function pipeLeaderboard(){
            users = await userModel.search({});
            for(let user of users){
                close = await pipeLeadModel.closedPercentage(user._id);
                if(Array.isArray(close) && close.length){
                var pipeLeader ={
                    'user': user,
                    'count':close[0].count
                }
            }else{
                var pipeLeader ={
                    'user': user,
                    'count':"0"
                }
            }
            response.push(pipeLeader);
            }
        }
        // getAllPipeLeadsWithinTimeframe(startDate, endDate, undefined, undefined, undefined, 'CONVERTED').then((data) => {
        //     userModel.search({}).then((users)=>{
        //         // let response = [];
        //         // for(let user of users){
        //         //    let pipeLeads =  _.filter(data, function(o) { return o.assigned != null && o.assigned._id == user._id; });
        //         //    var pipeLeader = {
        //         //        'user': user,
        //         //        'count' : pipeLeads.length
        //         //    }
        //         //    response.push(pipeLeader);
        //         // }
        //         // response = _.sortBy(response, [function(o) { return -o.count; }]);
        //         resolve(response);
        //     }).catch((err) => {
        //         reject(err);
        //     });
        // }).catch((err) => {
        //     reject(err);
        // })
        pipeLeaderboard().then(()=>{resolve(response)});
    });
}

function searchPipeLeadsByEntity(entity){
    return new Promise((resolve, reject) => {
        var pipeLeadsIds = new Set();    
        if(entity == 'meetings'){
            meetingService.getAllMeetings().then((meetings)=>{
                console.log
                meetings.forEach(e=>{
                    pipeLeadsIds.add(e.assigned);
                });
                getPipeLeadsByPipeLeadsIds(resolve, reject, pipeLeadsIds);
            })
        }else if(entity == 'followups'){
            followupService.getAllFollowups().then((followups)=>{
                followups.forEach(e=>{
                    pipeLeadsIds.add(e.assigned);
                });
                getPipeLeadsByPipeLeadsIds(resolve, reject, pipeLeadsIds);
            })
        }else{
            reject('unsupported action')
        }
    });
}

//build an API that takes a query and gets those pipeLeads and checks which of those pipeLeads have followups attached
// and sends only those pipeLeads
// the same API also gets pipeLeads by query, checks which ones have meetings attached and send those

function postSearchPipeLeadsByEntity(entity, query){
    return new Promise(async(resolve, reject) => {
        try{
        let followPipeLeads = [], meetingPipeLeads =[]
        pipeLeads = await pipeLeadModel.search(query)
            for(pipeLead of pipeLeads){
                followups = await followupModel.search({assigned: pipeLead._id})
                meetings = await meetingModel.search({assigned:pipeLead._id})
                Array.isArray(followups) && followups.length ? followPipeLeads.push(pipeLead) : 0
                Array.isArray(meetings) && meetings.length ? meetingPipeLeads.push(pipeLead) : 0
            }
        switch(entity){
            case 'MEETING' :
                resolve(meetingPipeLeads)
            case 'FOLLOWUP' :
                resolve(followPipeLeads)
            default :
                resolve([])
        }
    }catch(err){reject(err)}
    })

}

function getPipeLeadsByPipeLeadsIds(resolve, reject, pipeLeadsIds){
    
    pipeLeadModel.search({"_id":{'$in':Array.from(pipeLeadsIds)}}).then((data)=>{
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
        searchPipeLeads(searchCriteria).then((pipeLeads)=>{
            
            let pipeLeadIds = pipeLeads.map(l=>l._id);
            var followQuery = {
                'assigned': {
                    '$in': pipeLeadIds
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
        searchPipeLeads(searchCriteria).then((pipeLeads)=>{
            
            let pipeLeadIds = pipeLeads.map(l=>l._id);
            var followQuery = {
                'assigned': {
                    '$in': pipeLeadIds
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

function getPipeLeadCountByTimestamp(key, year, month, week, sumBy, assigned, statusNOTEqual){
    return new Promise((resolve, reject) => {

        if(year != undefined && month == undefined && week == undefined){
            pipeLeadModel.groupByKeyAndCountDocumentsByMonth_v2(key, year, sumBy, assigned, statusNOTEqual).then((data)=>{
                resolve(data);
            }).catch((err)=>{
                reject(err);
            })
        }else if(year != undefined && month != undefined && week == undefined){
            pipeLeadModel.groupByKeyAndCountDocumentsByWeek(key, year, month, sumBy, assigned).then((data)=>{
                resolve(data);
            }).catch((err)=>{
                reject(err);
            })
        }else if(year != undefined && month == undefined && week != undefined){

            pipeLeadModel.groupByKeyAndCountDocumentsByDay(key, year, month, week, sumBy, assigned).then((data)=>{
                resolve(data);
            }).catch((err)=>{
                reject(err);
            })
        }else{
            pipeLeadModel.groupByKeyAndCountDocumentsByYears(key, sumBy, assigned).then((data)=>{
                resolve(data);
            }).catch((err)=>{
                reject(err);
            })
        }
    });
}


function pipeLeadTimeline(pipeLeadId){
    return new Promise((resolve, reject) => {
        let searchQuery = {
            pageNo: 1,
            pageSize: 10000000,
            query:{
                assigned: pipeLeadId
            }
        }
        let emailSearchQuery = {
            pageNo: 1,
            pageSize: 10000000,
            query:{
                entityType: 'LEAD',
                entityId: pipeLeadId
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
function getPipeLeadsInPipeline( startDate, endDate, isOrganisation ){
    return new Promise(async (resolve, reject) => {
        var user = currentContext.getCurrentContext();
        let queries = { $and : [{ 'degree':"SUPER_HOT" },{ 'status':"OPPORTUNITIES" } ] };
        if( !isOrganisation || isOrganisation !== "true" ){
            queries = { $and : [{ 'degree':"SUPER_HOT" },{ 'status':"OPPORTUNITIES" },{ 'createdBy': user.email } ] };
        }
        var response = [], final={};
        try{
        data = await pipeLeadModel.search( queries )
            
                for(i in data){
                    CP = await pipeLeadCP(data[i]._id)
                    CPP = {closingProbability : CP}
                    transit = data[i]._doc;
                    final = {...transit,...CPP};
                    response.push(final);
                }
                resolve( response )
            }catch(err){reject(err);}
    });
 }

function getPipeLeadsWithDegreeAndStatus( startDate, endDate, isOrganisation ){
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
            promises.push( getAllPipeLeadsCount(queries[i]) );
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
                //getAllPipeLeadsCount({'degree':"SUPER_HOT" }).then((a)=>{console.log(a);})
                 
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

 function reasonForPipeLeadDrop ( startDate, endDate, isOrganisation ){
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
            promises.push( getAllPipeLeadsCount(queries[i]) );
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

 function getPipeLeadBySourceRevenue( startDate, endDate, isOrganisation ){
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
            promises.push( pipeLeadModel.search(queries[i]) );
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


 function getPipeLeadCountBySocialMediaWithDateFilter( startDate, endDate ){
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
            let returnData = await pipeLeadModel.search( query );
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
            let returnData = await pipeLeadModel.search( query );
            resolve( returnData );
        } catch ( err ){
            reject( err );
        } 
    })
}

function closedPercentage( member ){
    return new Promise( async( resolve, reject ) => {
        try{
            let returnData = await pipeLeadModel.closedPercentage( member );
            resolve( returnData );
        } catch ( err ){
            reject( err );
        } 
    })
}

function pipeLeadsByAccountId( account ){
    return new Promise( async( resolve, reject ) => {
        try{
            let returnData = await pipeLeadModel.pipeLeadsByAccountId( account );
            resolve( returnData );
        } catch ( err ){
            reject( err );
        } 
    })
}

function allPipeLeadsCP(){
    return new Promise( async( resolve, reject ) => {
        try{
            let final = []
            let pipeLeadData = await pipeLeadModel.search({});
            if(Array.isArray(pipeLeadData) && pipeLeadData.length){
            for (pipeLead of pipeLeadData){
                CP = await pipeLeadCP(pipeLead._id)
                data = {"Id": pipeLead._id,"CP":CP}
                await final.push(data) 
            }
        }
            resolve( final );
        } catch ( err ){
            reject( err );
        } 
    })
}

function pipeLeadCP(pipeLead){
    var response, data, degree, status, CP;
    return new Promise(async(resolve, reject) => {
        try{
            var degree = 0, status = 0, followups=0, calls=0, notes =0;
            followups = await followupModel.countDocuments({assigned:pipeLead});
            calls = await callModel.countDocuments({to:pipeLead});
            notes = await noteModel.countDocuments({entityId:pipeLead});
            pipeLeadData = await pipeLeadModel.getById(pipeLead);
            deg = pipeLeadData.degree; 
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
        data = await pipeLeadModel.search({});
        for (i in data){
            CP = await pipeLeadCP(data[i]._id)
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

function importPipeLeadsWithOptions( pipeLeadsArray, options ){
    return new Promise( async ( resolve, reject ) => {
        try{

// below line uses the uniqBy function of lodash libary to keep only unique emails from 
//the pipeLeads array as the array itself can contain duplicate values.

            let duplicate_free = _.uniqBy(pipeLeadsArray, 'email'); 
            let pipeLeads = duplicate_free;
            console.log( duplicate_free.length, pipeLeadsArray.length );
//now in the options, you pass one of three things - create, update or update and overwrite
// if none of these options are present, then you simply reject as saying invalid options
//CREATE NEW DATA
            if( options === "CREATE" ){
//takes a counter notAdded that is incremented each time we find a pipeLead that we wont be 
//updating in the backend
                let i = 0, notAdded = 0 ;
                let all_promise = [];
                while( i < pipeLeads.length ){
//takes one pipeLead at a time into pipeLead_data
                    let pipeLead_data = pipeLeads[i];
//finds pipeLead using the email of the pipeLeadData and storing that value in pipeLeadsearch
                    let pipeLeadsearch = await pipeLeadModel.searchOne({ email: pipeLead_data.email });
                    if( pipeLeadsearch ){
//if that pipeLead already exists, we simply increment noteAdded variable
                        notAdded++;
                    } else {
//if the pipeLead doesn't exist in our d.b, we need to add to our d.b
//addPipeLead here is the function in this file itself and we're calling and storing the promise
// in the allpromise array
                        all_promise.push( addPipeLeadImport( pipeLead_data ) );
                    }
                    i++;
                }
//we pass the all_promise array to promise.all function that solves all promises
//the benefit of this approach seems to be that for each pipeLead we can know failure and can even show
// which pipeLead failed rather than the entire process of adding data failing
            Promise.all( all_promise )
                .then( data => resolve({ success : data.length, failed : notAdded }))
                .catch( err => reject( err ) )
//if user selects the option of updating the pipeLeads in the database instead of simply creating new
//UPDATE BU DONT OVERWRITE
            } else if( options === "UPDATE" ){
                let i = 0, updated = 0;
                let all_promise = [];
//run loop till entire length of pipeLeads
                while( i < pipeLeads.length ){
//taking individual pipeLeads' data in pipeLead_data one at a time
                    let pipeLead_data = pipeLeads[i];
//try finding the pipeLead from d.b with this email i.d
                    let pipeLeadsearch = await pipeLeadModel.searchOne({ email: pipeLead_data.email });
//if there's a pipeLead like that, that exists, then do this
                    if( pipeLeadsearch ){
//these two functions help bring data coming from d.b into a format acceptable by lodash
                        let cloneDeep = JSON.parse( JSON.stringify( pipeLeadsearch ) );
//the difference function of lodash is supposed to return no values if both pipeLead_data and cloneDeep are same
//we are comparing singular value from pipeLeads array with singular value coming from database
// but it is important to note that we are comparing their object keys arrays - which is basically
//the array of only the first or the key values in the respective objects
                        let ids = _.difference( Object.keys( pipeLead_data ),Object.keys( cloneDeep )  );
//log all the values of keys that are not matching in both to the console
//[possible logical issue - the difference function is not direction aware, in the sense the unique
//values could be present in cloneDeep but it's also possible that the unique values was in pipeLead_data]
                        console.log( ids );  
                        let set = {};
//this loops through each key value that is unique between them
                        ids.forEach( id => {
//if there is a value that exists in pipeLead_data for that key, and id is not _id (which is there by default)
//then in the set object you put that new value
                            if( pipeLead_data[id]  && id !== "_id" ){
                                set[id] = pipeLead_data[id]
                            }
                        });
//this makes an array with all the keys of the set array and checks if the length is more than 0
                        if( Object.keys( set ).length > 0 ){
//here we are updating all the pipeLeads that have their ids in clonedeep and updating them with the data
//that is in set object
//[possible logical issue - the entire value of pipeLead is being replaced by set whereas set only
//has the unique values, maybe this is why there are errors]
                            all_promise.push( pipeLeadModel.updateById( cloneDeep._id , set ) );
//each time a pipeLead is updated, we increment the updated counter
//if does seem like a function that wouldn't overwrite, but it is actually overwriting
                            updated++;
                        }
                    } else {
//else add data into d.b if it doesn't exist in d.b already
                        all_promise.push( addPipeLeadImport( pipeLead_data ) );
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
                while( i < pipeLeads.length ){
                    let pipeLead_data = pipeLeads[i];
//find the pipeLead with the email i.d present in a particular pipeLead's data
                    let pipeLeadsearch = await pipeLeadModel.searchOne({ email: pipeLead_data.email });
//condition checks if pipeLead exists with this email
                    if( pipeLeadsearch ){
//the new data that will now reside in the d.b is placed in updateData variable
//it is important to remember that this is the data inputted by the user
                        let updateData = JSON.parse( JSON.stringify(  pipeLead_data ) );
//delete the email from this data so as to not cause any conflict
                        delete updateData.email;
//push this promise into an array for updating
                        all_promise.push( pipeLeadModel.updateById( pipeLeadsearch._id , updateData ) );
                        updated++;
                    } else {
//else push adding pipeLead into an array if pipeLead with this i.d doesn't exist in d.b
                        all_promise.push( addPipeLeadImport( pipeLead_data ) );
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
 

function importest(pipeLeads){
    return new Promise((resolve, reject) => {
        let existing=[], toBeAdded=[], data=[], result=[];
        let response = {
            "existing_pipeLeads": existing,
            "pipeLeads_added_to_db": result
        }
     
        async function getPipeLeads(pipeLeads){
            console.log(pipeLeads);
        let duplicate_free = _.uniqBy(pipeLeads, 'email'); 
        let pipeLeadsA = duplicate_free;
       for (i in pipeLeadsA){
        let pipeLeadsearch = await pipeLeadModel.searchOne({ email: pipeLeadsA[i].email });
        if(pipeLeadsearch){
            existing.push(pipeLeadsA[i]);
            }
        }
        toBeAdded = _.difference(pipeLeadsA, existing);
        var user = currentContext.getCurrentContext();
        toBeAdded.forEach(toBeAdded => {
            toBeAdded['assigned'] = user.userId
            toBeAdded['lastModifiedBy'] = user.email
            toBeAdded['createdBy'] = user.email
            toBeAdded['isKanban'] = 'false'
            toBeAdded['isHidden'] = 'false'
        });
        data = await pipeLeadModel.import(toBeAdded);
        for(i in data){
            result.push(data[i]);
        }
    }
        getPipeLeads(pipeLeads).then(()=>{resolve(response);})
    });
}

function overwrite(pipeLeads) {
    return new Promise((resolve, reject) => {
        console.log(pipeLeads);
       async function dojob(pipeLeads){

       let i = 0, updated = 0;
                let all_promise = [];
                while( i < pipeLeads.length ){
                    let pipeLead_data = pipeLeads[i];
                    let pipeLeadsearch = await pipeLeadModel.searchOne({ email: pipeLead_data.email });
                    if( pipeLeadsearch ){
                        let updateData = JSON.parse( JSON.stringify(  pipeLead_data ) );
                        all_promise.push( pipeLeadModel.updateById( pipeLeadsearch._id , updateData ) );
                        updated++;
                    } else {

                        all_promise.push( addPipeLeadImport( pipeLead_data ) );
                    }
                    i++;
                }
                Promise.all( all_promise )
                .then( data => resolve({ success : data.length, updated : updated }))
                .catch( err => reject( err ) )
            }
        dojob(pipeLeads);

    });
}

function notoverwrite(pipeLeads) {
    return new Promise((resolve, reject) => {
    async function dojob(pipeLeads){ 

    let i = 0, updated = 0;
                let all_promise = [];
                while( i < pipeLeads.length ){
                    let pipeLead_data = pipeLeads[i];
                    let pipeLeadsearch = await pipeLeadModel.searchOne({ email: pipeLead_data.email });
                    if( pipeLeadsearch ){
                        let cloneDeep = JSON.parse( JSON.stringify( pipeLeadsearch ) );
                        let ids = _.difference( Object.keys( pipeLead_data ),Object.keys( cloneDeep )  );
                        console.log( ids );  
                        let set = {};

                        ids.forEach( id => {

                            if( pipeLead_data[id]  && id !== "_id" ){
                                set[id] = pipeLead_data[id]
                            }
                        });
                        if( Object.keys( set ).length > 0 ){

                            all_promise.push( pipeLeadModel.updateById( cloneDeep._id , set ) );

                            updated++;
                        }
                    } else {

                        all_promise.push( addPipeLeadImport( pipeLead_data ) );
                    }
                    i++;
                }
                Promise.all( all_promise )
                .then( data => resolve({ success : data.length, updated : updated }))
                .catch( err => reject( err ) )
            }
            dojob(pipeLeads);
    });
}

function checkFields(pipeLeads){
    return new Promise( async( resolve, reject ) => {
        let answer=0, userData={};
       async function dojob(pipeLeads){
        ideal = ["_id","name","account_id", "email","phone","phoneCode","status","reason_for_drop","tags","isKanban","isHidden","assigned","degree","additionalInfo", "profileImage","emoji","about","createdBy","source","worth","closingDate","convertedDate","lastModifiedBy","media"]
        userData = Object.keys(pipeLeads[0]);
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
       dojob(pipeLeads);
    })
}

//this is the add pipeLead function that specifically gets called when importing pipeLeads as we cannot
//call the regular add pipeLead function as that creates activity and notifications for each pipeLead created
function addPipeLeadImport(pipeLeadData) {
    return new Promise((resolve, reject) => {
        console.log("IN NEW FUNC");
        var user = currentContext.getCurrentContext();
        pipeLeadData.createdBy = user.email;
        pipeLeadData.lastModifiedBy = user.email;
        if(pipeLeadData.status == undefined){
            pipeLeadData.status = 'NEW_LEAD';
        }

        if(pipeLeadData.degree == undefined){
            pipeLeadData.degree = 'COLD';
        }
        pipeLeadModel.create(pipeLeadData).then((data) => {
            // var activity = {
            //     'entityType': pipeLeadData.entityType,
            //     'entityId': pipeLeadData.entityId,
            //     'data': pipeLeadData,
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
            data = await Promise.all([pipeLeadModel.countDocuments(coldQuery), pipeLeadModel.countDocuments(warmQuery), pipeLeadModel.countDocuments(hotQuery), pipeLeadModel.countDocuments(superQuery)])
            pipeLeads = await pipeLeadModel.search(query)
            for(pipeLead of pipeLeads){
                followups = await followupModel.search({assigned: pipeLead._id})
                meetings = await meetingModel.search({assigned:pipeLead._id})
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

module.exports = pipeLeadService;

