var odealtargetModel = require("../models/odealtarget.model");
var dealachieveModel = require("../models/achievement.model");
var currentContext = require('../../common/currentContext');
const itargetService = require("./itarget.service");

var odealtargetService = {
    getAllOdealtargets: getAllOdealtargets,
    getOdealtargetById: getOdealtargetById,
    addOdealtarget: addOdealtarget,
    updateOdealtarget: updateOdealtarget,
    deleteOdealtarget: deleteOdealtarget,
    getOdealtargetByOdealtargetName: getOdealtargetByOdealtargetName,
    getOdealtargetsByPage: getOdealtargetsByPage,
    getOdealtargetsByPageWithSort: getOdealtargetsByPageWithSort,
    getAllOdealtargetsCount: getAllOdealtargetsCount,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchOdealtargets: searchOdealtargets,
    orgMonLead: orgMonLead,
    orgMonDollar: orgMonDollar,
    orgRevGraph: orgRevGraph,
    orgCountGraph: orgCountGraph,
    orgEff: orgEff,
    monthlyTable: monthlyTable
}

function addOdealtarget(odealtargetData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        odealtargetData.createdBy = user.email;
        odealtargetData.lastModifiedBy = user.email;

        odealtargetModel.create(odealtargetData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function updateOdealtarget(id, odealtargetData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        odealtargetData.lastModifiedBy = user.email;

        odealtargetModel.updateById(id, odealtargetData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteOdealtarget(id) {
    return new Promise((resolve, reject) => {
        odealtargetModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllOdealtargets() {
    return new Promise((resolve, reject) => {
        odealtargetModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllOdealtargetsCount() {
    return new Promise((resolve, reject) => {
        odealtargetModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getOdealtargetById(id) {
    return new Promise((resolve, reject) => {
        odealtargetModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getOdealtargetByOdealtargetName(odealtargetId, tenant) {
    return new Promise((resolve, reject) => {
        odealtargetModel.searchOne({ '_id': odealtargetId }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getOdealtargetsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        odealtargetModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getOdealtargetsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        odealtargetModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        odealtargetModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchOdealtargets(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        odealtargetModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function orgMonLead(startDate, endDate) {
    return new Promise((resolve, reject) => {
        let data;
        let final = {
            "label":["New Leads", "Contacted Leads", "Closed Leads"],
            "expected":[0,0,0],
            "accomplished":[0,0,0]
        };
     async function getData(startDate, endDate){
        data = await itargetService.thisMonthOrgTarget(startDate, endDate);
        final.expected[0] = data.targetNewLeads;
        final.expected[1] = data.targetContactedLeads;
        final.expected[2] = data.targetConvertedLeads;
        final.accomplished[0] = data.achievementNewLeads;
        final.accomplished[1] = data.achievementContactedLeads;
        final.accomplished[2] = data.achievementConvertedLeads;
     }
     getData(startDate, endDate).then(()=>{resolve(final);})
    });
}

function orgMonDollar(startDate, endDate) {
    return new Promise((resolve, reject) => {
        let data;
        let final = {
            "label":["New Leads", "Contacted Leads", "Closed Leads"],
            "expected":[0,0,0],
            "accomplished":[0,0,0]
        };
     async function getData(startDate, endDate){
        data = await itargetService.thisMonthOrgTarget(startDate, endDate);
        final.expected[0] = data.targetNewLeadDollars;
        final.expected[1] = data.targetContactedLeadDollars;
        final.expected[2] = data.targetConvertedLeadDollars;
        final.accomplished[0] = data.achievementNewLeadsDollars;
        final.accomplished[1] = data.achievementContactedLeadsDollars;
        final.accomplished[2] = data.achievementConvertedLeadsDollars;
     }
     getData(startDate, endDate).then(()=>{resolve(final);})
    });
}

function orgRevGraph() {
    return new Promise((resolve, reject) => {
        let expectedData, acquiredData, final = {
            "months":['jan','feb','mar','apr','may','jun','jul','aug','sept','oct','nov','dec'],  
            "expected_revenue":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "acquired_revenue":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };
        async function getData(){
            expectedData = await odealtargetModel.orgExpected();
            acquiredData = await dealachieveModel.orgAcquired();
            for(i=0;i<12;i++){
                if(expectedData[i] !==undefined && expectedData[i]!==null){
                final.expected_revenue[expectedData[i]._id - 1] = expectedData[i].rev;
                }
                if(acquiredData[i] !==undefined && acquiredData[i]!==null){
                final.acquired_revenue[acquiredData[i]._id - 1] = acquiredData[i].rev;
                }
            }
        }
        getData().then(()=>{resolve(final);})
    });
}

function orgCountGraph(){
    return new Promise((resolve, reject) => {
        let expectedData, acquiredData, final = {
            "months":['jan','feb','mar','apr','may','jun','jul','aug','sept','oct','nov','dec'],  
            "expected_leads":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "acquired_leads":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };
        async function getData(){
            expectedData = await odealtargetModel.orgCountExp();
            acquiredData = await dealachieveModel.orgCountAcq();
            for(i=0;i<12;i++){
                if(expectedData[i] !==undefined && expectedData[i]!==null){
                final.expected_leads[expectedData[i]._id - 1] = expectedData[i].count;
                }
                if(acquiredData[i] !==undefined && acquiredData[i]!==null){
                final.acquired_leads[acquiredData[i]._id - 1] = acquiredData[i].count;
                }
            }
        }
        getData().then(()=>{resolve(final);})
    });
}

function orgEff() {
    return new Promise((resolve, reject) => {
        let final = {
            "months":['jan','feb','mar','apr','may','jun','jul','aug','sept','oct','nov','dec'],  
            "efficiency":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };
        async function getData(){
            countData = await orgCountGraph();
            if(countData !==null && countData !== undefined){
            for(i=0;i<12;i++){
                percent = (countData.expected_leads[i] / countData.acquired_leads[i]) * 100;
                final.efficiency[i] = percent;
                }
            }
        }
        getData().then(()=>{resolve(final);})
    });
}

function monthlyTable() {
    return new Promise((resolve, reject) => {
        let final = {
            "months":['jan','feb','mar','apr','may','jun','jul','aug','sept','oct','nov','dec'],  
            "data":[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
        };
        targetData = [];
        newData = [];
        contactData =[];
        convertData=[];
        async function getData(){
            targetData = await odealtargetModel.monthlyTargetsTable();
            newData = await dealachieveModel.orgMonNew();
            convertData = await dealachieveModel.orgMonConverted();
            for(i=1;i<13;i++){
                if(Array.isArray(targetData) && targetData.length){
                    for(j in targetData){
                        if(i == targetData[j]._id){
                            rough = {...final.data[i-1],...targetData[j]}
                            final.data[i-1] = rough;
                        }
                    }
                }
                if(Array.isArray(newData) && newData.length){
                    for (s in newData){
                        if(i == newData[s]._id){
                            rough = {
                                "achievedNewDeals": newData[s].count,
                                "achievedNewDealsDollars": newData[s].dollars
                            }
                            transit = {...final.data[i-1], ...rough}
                            final.data[i-1] = transit;
                        }
                    }
                }
                if(Array.isArray(convertData) && convertData.length){
                    for(z in convertData){
                        if(i == convertData[z]._id){
                            rough3 = {
                                "achievedClosedDeals":convertData[z].count,
                                "achievedClosedDollars":convertData[z].dollars
                            }
                            transit3 = {...final.data[i-1], ...rough3}
                            final.data[i-1] = transit3;
                        }
                    }
                }
            }
    }
        getData().then(()=>{resolve(final);})
    })
}

module.exports = odealtargetService;

