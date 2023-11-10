var itargetModel = require("../models/itarget.model");
var achievementModel = require("../models/achievement.model");
var otargetModel = require("../models/otarget.model");
var currentContext = require('../../common/currentContext');
var userServices = require('../services/user.service');
const moment = require('moment');

var itargetService = {
    getAllItargets: getAllItargets,
    getItargetById: getItargetById,
    addItarget: addItarget,
    updateItarget: updateItarget,
    deleteItarget: deleteItarget,
    getItargetByItargetName: getItargetByItargetName,
    getItargetsByPage: getItargetsByPage,
    getItargetsByPageWithSort: getItargetsByPageWithSort,
    getAllItargetsCount: getAllItargetsCount,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchItargets: searchItargets,
    getTargetByUser: getTargetByUser,
    thisMonthTarget: thisMonthTarget,
    thisMonthOrgTarget: thisMonthOrgTarget,
    indMonLead: indMonLead,
    indMonDollar: indMonDollar,
    ownerWiseGraph: ownerWiseGraph,
    indRevGraph: indRevGraph,
    indCountGraph: indCountGraph,
    quarterData: quarterData,
    orgQuarterData: orgQuarterData,
    indEff: indEff,
    monthlyTable: monthlyTable
}

function addItarget(itargetData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        itargetData.createdBy = user.email;
        itargetData.lastModifiedBy = user.email;

        itargetModel.create(itargetData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function updateItarget(id, itargetData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        itargetData.lastModifiedBy = user.email;

        itargetModel.updateById(id, itargetData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteItarget(id) {
    return new Promise((resolve, reject) => {
        itargetModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllItargets() {
    return new Promise((resolve, reject) => {
        itargetModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllItargetsCount() {
    return new Promise((resolve, reject) => {
        itargetModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getItargetById(id) {
    return new Promise((resolve, reject) => {
        itargetModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getItargetByItargetName(assigned, tenant) {
    return new Promise((resolve, reject) => {
        itargetModel.searchOne({ 'assigned': assigned }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getItargetsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        itargetModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getItargetsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        itargetModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        itargetModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchItargets(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        itargetModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTargetByUser(user) {
    return new Promise((resolve, reject) => {
        itargetModel.getTargetByUser( user ).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function thisMonthTarget(user, startDate, endDate) {
    return new Promise((resolve, reject) => {
        let final ={};
        async function getData(user, startDate, endDate){
            targets = await itargetModel.monthTarget(user, startDate, endDate);
            achievements = await achievementModel.monthAchievement(user,startDate,endDate);
            transit = {
                "achievementNewLeads":0,
                "achievementContactedLeads":0,
                "achievementConvertedLeads":0,
                "achievementNewLeadsDollars":0,
                "achievementContactedLeadsDollars":0,
                "achievementConvertedLeadsDollars":0
            }
            for(i in achievements){
                if(achievements[i]._id=="CONTACTED_LEADS")
                {
                    transit.achievementContactedLeads = achievements[i].count;
                    transit.achievementContactedLeadsDollars = achievements[i].dollars;
                }
                if(achievements[i]._id=="CONVERTED")
                {
                    transit.achievementConvertedLeads = achievements[i].count;
                    transit.achievementConvertedLeadsDollars = achievements[i].dollars;
                }
                if(achievements[i]._id=="NEW_LEAD")
                {
                    transit.achievementNewLeads = achievements[i].count;
                    transit.achievementNewLeadsDollars = achievements[i].dollars;
                }
            }
            if (Array.isArray(targets) && targets.length){
                targetData = targets[0];
            }
            else{
                var yearStart = moment().startOf('year');
                targets2 = await itargetModel.monthTarget(user, yearStart, startDate);

                if(Array.isArray(targets2) && targets2.length){
                    targetData = {"message":"please add data for this month"}
                }
                 else{
                   targetData = []
                    }
            }
            
            final = {...targetData,...transit}
        }
        getData(user, startDate, endDate).then(()=>{resolve (final);})
    });
}

function thisMonthOrgTarget(startDate, endDate) {
    return new Promise((resolve, reject) => {
        let final ={};
        async function getData(startDate, endDate){
            targets = await otargetModel.monthOrgTarget(startDate, endDate);
            console.log(targets);
            achievements = await achievementModel.monthOrgAchievement(startDate,endDate);
            transit = {
                "achievementNewLeads":0,
                "achievementContactedLeads":0,
                "achievementConvertedLeads":0,
                "achievementNewLeadsDollars":0,
                "achievementContactedLeadsDollars":0,
                "achievementConvertedLeadsDollars":0
            }
            for(i in achievements){
                if(achievements[i]._id=="CONTACTED_LEADS")
                {
                    transit.achievementContactedLeads = achievements[i].count;
                    transit.achievementContactedLeadsDollars = achievements[i].dollars;
                }
                if(achievements[i]._id=="CONVERTED")
                {
                    transit.achievementConvertedLeads = achievements[i].count;
                    transit.achievementConvertedLeadsDollars = achievements[i].dollars;
                }
                if(achievements[i]._id=="NEW_LEAD")
                {
                    transit.achievementNewLeads = achievements[i].count;
                    transit.achievementNewLeadsDollars = achievements[i].dollars;
                }
            }
            if (Array.isArray(targets) && targets.length){
                targetData = targets[0];
            }
            else{
                var yearStart = moment().startOf('year');
                targets2 = await otargetModel.monthOrgTarget(yearStart, startDate);

                if(Array.isArray(targets2) && targets2.length){
                    targetData = {"message":"please add data for this month"}
                }
                 else{
                   targetData = []
                    }
            }
            final = {...targetData,...transit}
        }
        getData(startDate, endDate).then(()=>{resolve (final);})
    });
}

function indMonLead(user, startDate, endDate) {
    return new Promise((resolve, reject) => {
        let data;
        let final = {
            "label":["New Leads", "Contacted Leads", "Closed Leads"],
            "expected":[0,0,0],
            "accomplished":[0,0,0]
        };
       async function getData(user, startDate, endDate){
        data = await thisMonthTarget(user, startDate, endDate);
        final.expected[0] = data.targetNewLeads;
        final.expected[1] = data.targetContactedLeads;
        final.expected[2] = data.targetConvertedLeads;
        final.accomplished[0] = data.achievementNewLeads;
        final.accomplished[1] = data.achievementContactedLeads;
        final.accomplished[2] = data.achievementConvertedLeads;
       }
       getData(user, startDate, endDate).then(()=>{resolve(final);})
    })
}

function indMonDollar(user, startDate, endDate) {
    return new Promise((resolve, reject) => {
        let data;
        let final = {
            "label":["New Leads", "Contacted Leads", "Closed Leads"],
            "expected":[0,0,0],
            "accomplished":[0,0,0]
        };
       async function getData(user, startDate, endDate){
        data = await thisMonthTarget(user, startDate, endDate);
        final.expected[0] = data.targetNewLeadDollars;
        final.expected[1] = data.targetContactedLeadDollars;
        final.expected[2] = data.targetConvertedLeadDollars;
        final.accomplished[0] = data.achievementNewLeadsDollars;
        final.accomplished[1] = data.achievementContactedLeadsDollars;
        final.accomplished[2] = data.achievementConvertedLeadsDollars;
       }
       getData(user, startDate, endDate).then(()=>{resolve(final);})
    })
}

function ownerWiseGraph(startDate, endDate){
    return new Promise((resolve, reject) => {
        let users, leadData, dollarData, final=[];
        async function getData(){
            users = await userServices.getAllUser();
            for (i in users){
                id = users[i]._id
                fName = users[i].firstName
                lName = users[i].lastName
                pic = users[i].profileImage
                leadData = await indMonLead(id,startDate,endDate)
                dollarData = await indMonDollar(id, startDate, endDate)
                userData = fName + lName;
                expectedLeads = leadData.expected;
                accomplishedLeads = leadData.accomplished;
                expectedDollars = dollarData.expected;
                accomplishedDollars = dollarData.accomplished;
                rough = {userData: userData, profilepic: pic, expectedLeads: expectedLeads,accomplishedLeads: accomplishedLeads, expectedDollars: expectedDollars, accomplishedDollars:accomplishedDollars }
                final.push(rough);
            }
        }
        getData().then(()=>{resolve(final);})
    })
}

function indRevGraph(user) {
    return new Promise((resolve, reject) => {
        let expectedData, acquiredData, final = {
            "months":['jan','feb','mar','apr','may','jun','jul','aug','sept','oct','nov','dec'],  
            "expected_revenue":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "acquired_revenue":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };
        async function getData(user){
            expectedData = await itargetModel.indExpected(user);
            acquiredData = await achievementModel.indAcquired(user);
            for(i=0;i<12;i++){
                if(expectedData[i] !==undefined && expectedData[i]!==null){
                final.expected_revenue[expectedData[i]._id - 1] = expectedData[i].rev;
                }
                if(acquiredData[i] !==undefined && acquiredData[i]!==null){
                final.acquired_revenue[acquiredData[i]._id - 1] = acquiredData[i].rev;
                }
            }
        }
        getData(user).then(()=>{resolve(final);})
    });
}

function indCountGraph(user) {
    return new Promise((resolve, reject) => {
        let expectedData, acquiredData, final = {
            "months":['jan','feb','mar','apr','may','jun','jul','aug','sept','oct','nov','dec'],  
            "expected_leads":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "acquired_leads":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };
        async function getData(user){
            expectedData = await itargetModel.indCountExp(user);
            acquiredData = await achievementModel.indCountAcq(user);
            for(i=0;i<12;i++){
                if(expectedData[i] !==undefined && expectedData[i]!==null){
                final.expected_leads[expectedData[i]._id - 1] = expectedData[i].count;
                }
                if(acquiredData[i] !==undefined && acquiredData[i]!==null){
                final.acquired_leads[acquiredData[i]._id - 1] = acquiredData[i].count;
                }
            }
        }
        getData(user).then(()=>{resolve(final);})
    });
}

function indEff(user) {
    return new Promise((resolve, reject) => {
        let final = {
            "months":['jan','feb','mar','apr','may','jun','jul','aug','sept','oct','nov','dec'],  
            "efficiency":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };
        async function getData(user){
            countData = await indCountGraph(user);
            if(countData !==null && countData !==undefined){
            for(i=0;i<12;i++){
                percent = (countData.expected_leads[i] / countData.acquired_leads[i]) * 100;
                final.efficiency[i] = percent;
                 }
            }
        }
        getData(user).then(()=>{resolve(final);})
    });
}

function quarterData(user, quarterStart, quarterEnd, monthStart, monthEnd, prevMonStart, prevMonEnd) {
    let final = {
    "monthly_revenue":{ 
        "monthExpectedDollars":0,
        "monthClosedPercent":0, 
        "quarterExpectedDollars":0,
        "quarterClosedPercent":0 
    },
    "quarterly_revenue":{ 
        "expected":0, 
        "closed":0, 
        "leads_closed":0 
    },
    "pending_leads":0,
    "leads_closed":0
    }
    return new Promise((resolve, reject) => {
      async function getData(user, quarterStart, quarterEnd, monthStart, monthEnd, prevMonStart, prevMonEnd){

        monthsData = await thisMonthTarget(user, monthStart, monthEnd);
        quartersData = await thisMonthTarget(user, quarterStart, quarterEnd);
        prevMonthsData = await thisMonthTarget(user, prevMonStart, prevMonEnd);
        final.monthly_revenue.monthExpectedDollars = monthsData.targetConvertedLeadDollars;
        final.monthly_revenue.quarterExpectedDollars = monthsData.targetConvertedLeadDollars;
        final.quarterly_revenue.expected = quartersData.targetConvertedLeadDollars;
        final.quarterly_revenue.closed = quartersData.achievementConvertedLeadsDollars;
        final.quarterly_revenue.leads_closed = quartersData.achievementConvertedLeads;
        final.monthly_revenue.monthClosedPercent = (monthsData.achievementConvertedLeadsDollars/monthsData.targetConvertedLeadDollars)*100
        final.monthly_revenue.quarterClosedPercent = (quartersData.achievementConvertedLeadsDollars/quartersData.targetConvertedLeadDollars)*100
        final.leads_closed = monthsData.achievementConvertedLeads;
        final.pending_leads = prevMonthsData.targetConvertedLeads - prevMonthsData.achievementConvertedLeads;
      }
      getData(user, quarterStart, quarterEnd, monthStart, monthEnd, prevMonStart, prevMonEnd).then(()=>{
          resolve(final);
        })
    });
}

function orgQuarterData(quarterStart, quarterEnd, monthStart, monthEnd, prevMonStart, prevMonEnd) {
    let final = {
    "monthly_revenue":{ 
        "monthExpectedDollars":0,
        "monthClosedPercent":0, 
        "quarterExpectedDollars":0,
        "quarterClosedPercent":0 
    },
    "quarterly_revenue":{ 
        "expected":0, 
        "closed":0, 
        "leads_closed":0 
    },
    "pending_leads":0,
    "leads_closed":0
    }
    return new Promise((resolve, reject) => {
      async function getData(quarterStart, quarterEnd, monthStart, monthEnd, prevMonStart, prevMonEnd){

        monthsData = await thisMonthOrgTarget(monthStart, monthEnd);
        quartersData = await thisMonthOrgTarget(quarterStart, quarterEnd);
        prevMonthsData = await thisMonthOrgTarget(prevMonStart, prevMonEnd);
        final.monthly_revenue.monthExpectedDollars = monthsData.targetConvertedLeadDollars;
        final.monthly_revenue.quarterExpectedDollars = monthsData.targetConvertedLeadDollars;
        final.quarterly_revenue.expected = quartersData.targetConvertedLeadDollars;
        final.quarterly_revenue.closed = quartersData.achievementConvertedLeadsDollars;
        final.quarterly_revenue.leads_closed = quartersData.achievementConvertedLeads;
        final.monthly_revenue.monthClosedPercent = (monthsData.achievementConvertedLeadsDollars/monthsData.targetConvertedLeadDollars)*100
        final.monthly_revenue.quarterClosedPercent = (quartersData.achievementConvertedLeadsDollars/quartersData.targetConvertedLeadDollars)*100
        final.leads_closed = monthsData.achievementConvertedLeads;
        final.pending_leads = prevMonthsData.targetConvertedLeads - prevMonthsData.achievementConvertedLeads;
      }
      getData(quarterStart, quarterEnd, monthStart, monthEnd, prevMonStart, prevMonEnd).then(()=>{
          resolve(final);
        })
    });
}

function monthlyTable(user) {
    return new Promise((resolve, reject) => {
        let final = {
            "months":['jan','feb','mar','apr','may','jun','jul','aug','sept','oct','nov','dec'],  
            "data":[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
        };
        targetData = [];
        newData = [];
        contactData =[];
        convertData=[];
        async function getData(user){
            targetData = await itargetModel.monthlyTargetsTable(user);
            newData = await achievementModel.indMonNew(user);
            contactData = await achievementModel.indMonContacted(user);
            convertData = await achievementModel.indMonConverted(user);
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
        getData(user).then(()=>{resolve(final);})
    })
}

module.exports = itargetService;

