var otargetModel = require("../models/otarget.model");
var achievementModel = require("../models/achievement.model");
var currentContext = require('../../common/currentContext');
const itargetService = require("./itarget.service");

var otargetService = {
    getAllOtargets: getAllOtargets,
    getOtargetById: getOtargetById,
    addOtarget: addOtarget,
    updateOtarget: updateOtarget,
    deleteOtarget: deleteOtarget,
    getOtargetByOtargetName: getOtargetByOtargetName,
    getOtargetsByPage: getOtargetsByPage,
    getOtargetsByPageWithSort: getOtargetsByPageWithSort,
    getAllOtargetsCount: getAllOtargetsCount,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchOtargets: searchOtargets,
    orgMonLead: orgMonLead,
    orgMonDollar: orgMonDollar,
    orgRevGraph: orgRevGraph,
    orgCountGraph: orgCountGraph,
    orgEff: orgEff,
    monthlyTable: monthlyTable
}

function addOtarget(otargetData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        otargetData.createdBy = user.email;
        otargetData.lastModifiedBy = user.email;

        otargetModel.create(otargetData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function updateOtarget(id, otargetData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        otargetData.lastModifiedBy = user.email;

        otargetModel.updateById(id, otargetData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteOtarget(id) {
    return new Promise((resolve, reject) => {
        otargetModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllOtargets() {
    return new Promise((resolve, reject) => {
        otargetModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllOtargetsCount() {
    return new Promise((resolve, reject) => {
        otargetModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getOtargetById(id) {
    return new Promise((resolve, reject) => {
        otargetModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getOtargetByOtargetName(otargetId, tenant) {
    return new Promise((resolve, reject) => {
        otargetModel.searchOne({ '_id': otargetId }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getOtargetsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        otargetModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getOtargetsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        otargetModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        otargetModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchOtargets(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        otargetModel.getPaginatedResult(query, options).then((data) => {
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
            expectedData = await otargetModel.orgExpected();
            acquiredData = await achievementModel.orgAcquired();
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
            expectedData = await otargetModel.orgCountExp();
            acquiredData = await achievementModel.orgCountAcq();
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
            targetData = await otargetModel.monthlyTargetsTable();
            newData = await achievementModel.orgMonNew();
            contactData = await achievementModel.orgMonContacted();
            convertData = await achievementModel.orgMonConverted();
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
                                "achievedNewLeads": newData[s].count,
                                "achievedNewLeadsDollars": newData[s].dollars
                            }
                            transit = {...final.data[i-1], ...rough}
                            final.data[i-1] = transit;
                        }
                    }
                }
                if(Array.isArray(contactData) && contactData.length){
                    for(k in contactData){
                        if(i == contactData[k]._id){
                            rough2 = {
                                "achievedContactedLeads":contactData[k].count,
                                "achievedContactedDollars":contactData[k].dollars
                            }
                            transit2 = {...final.data[i-1], ...rough2}
                            final.data[i-1] = transit2;
                        }
                    }
                }
                if(Array.isArray(convertData) && convertData.length){
                    for(z in convertData){
                        if(i == convertData[z]._id){
                            rough3 = {
                                "achievedConvertedLeads":convertData[z].count,
                                "achievedConvertedDollars":convertData[z].dollars
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

module.exports = otargetService;

