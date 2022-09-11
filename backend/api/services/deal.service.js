const moment = require('moment');
var dealModel = require("../models/deal.model");
var revenueModel = require("../models/revenue.model");
const NotificationType = require('../../common/constants/NotificationType');
var activityService = require('../services/activity.service');
var wactService = require("./workactivity.service");
var currentContext = require('../../common/currentContext');
const { response } = require("express");

var dealService = {
    getAllDeals: getAllDeals,
    getDealById: getDealById,
    addDeal: addDeal,
    updateDeal: updateDeal,
    deleteDeal: deleteDeal,
    getDealByDealName: getDealByDealName,
    getDealsByPage: getDealsByPage,
    getDealsByPageWithSort: getDealsByPageWithSort,
    getAllDealsCount: getAllDealsCount,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchDeals: searchDeals,
    matchAndAdd: matchAndAdd,
    monthlyRecurDealsRev: monthlyRecurDealsRev,
    dealWithHighestRev: dealWithHighestRev,
    dealsByAcc:dealsByAcc,
    widget: widget,
    monDealsChart: monDealsChart
}

function addDeal(dealData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        dealData.createdBy = user.email;
        dealData.lastModifiedBy = user.email;

        dealModel.create(dealData).then((data) => {
            var activity = {
                'entityType': 'ACCCOUNT',
                'entityId': dealData.account,
                'data': dealData,
                'activityType': 'DEAL_CREATED'
            }
            activityService.addActivity(activity).then((adata) => {
                wactService.addWact(dealData, "DEAL", "CREATE").then((dataA)=>{resolve(data);}).catch((err) => {
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

function updateDeal(id, dealData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        dealData.lastModifiedBy = user.email;

        dealModel.updateById(id, dealData).then((data) => {
            if(data.status == "CLOSED"){
                var activity = {
                    'entityType': dealData.entityType,
                    'entityId': dealData.entityId,
                    'data': dealData,
                    'activityType': 'DEAL_CLOSED'
                }
                activityService.addActivity(activity).then((adata) => {
                    resolve(data);
                }).catch((err) => {
                    reject(err);
                });
            }
            else{
                resolve(data);
            }
            }).catch((err) => {
                reject(err);
            })
        })
    }


function deleteDeal(id) {
    return new Promise((resolve, reject) => {
        dealModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllDeals() {
    return new Promise((resolve, reject) => {
        dealModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllDealsCount() {
    return new Promise((resolve, reject) => {
        dealModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getDealById(id) {
    return new Promise((resolve, reject) => {
        dealModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getDealByDealName(dealName, tenant) {
    return new Promise((resolve, reject) => {
        dealModel.searchOne({ 'dealName': dealName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getDealsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        dealModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getDealsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        dealModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        dealModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchDeals(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        dealModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function matchAndAdd(match, add) {
    return new Promise((resolve, reject) => {
        dealModel.matchAndAdd(match, add).then((data) => {
            if(Array.isArray(data) && data.length)
        {
            resolve(data[0].total);
        }
        else{
            resolve([]);
        }
        }).catch((err) => {
            reject(err);
        })
    });
}

function monthlyRecurDealsRev(startDate, endDate) {
    return new Promise((resolve, reject) => {
        revenueModel.monthlyRecurDealsRev(startDate, endDate).then((data) => {
            if(Array.isArray(data) && data.length)
            {
                resolve(data[0].total);
            }
            else{
                resolve(0);
            }
        }).catch((err) => {
            reject(err);
        })
    });
}

function dealWithHighestRev() {
    return new Promise((resolve, reject) => {
        revenueModel.dealWithHighestRev().then((data) => {
            if(Array.isArray(data) && data.length)
            {
                resolve(data[0].dealName);
            }
            else{
                resolve(0);
            }
        }).catch((err) => {
            reject(err);
        })
    });
}

function dealsByAcc(account) {
    let deals, revenueData=[], revenue, final, response=[];
    return new Promise((resolve, reject) => {
        async function getData(account){
            
            deals = await dealModel.dealsByAcc(account)
            for(i in deals){
                if(deals[i].status == "CLOSED" && deals[i].type == "RECURRING")
                {
                    var currentDate = deals[i].closingDate;
                    var futureMonth = moment(currentDate).add(1, 'M');
                    nextPayment={nextPayment:futureMonth._d}
                }
                else{nextPayment={nextPayment:"N/A"}}
            revenueData = await revenueModel.revByDeal(deals[i]._id);
            if(Array.isArray(revenueData) && revenueData.length)
            {
            revenue = revenueData[0].total
            }
            else{revenue=0;}
            revenueAmt = {revenue:revenue}
            dealsData = deals[i]
            final={...dealsData,...revenueAmt,...nextPayment}
            response.push(final);}
        }
        getData(account).then(()=>{resolve(response);})
    });
}

function widget() {
    return new Promise((resolve, reject) => {
        let final = {
            dealsCount: 0,
            closedDeals: 0,
            recurringDeals: 0,
            upcomingRevenue: 0
        };
        async function getData(){
            final.dealsCount = await getAllDealsCount();
            statusCount = await groupByKeyAndCountDocuments("status");
            if(Array.isArray(statusCount) && statusCount.length){
            for (i in statusCount){
                if (statusCount[i]._id == "CLOSED")
                {
                    final.closedDeals = statusCount[i].count
                }
            }
        }
            typeCount = await groupByKeyAndCountDocuments("type");
            if(Array.isArray(typeCount) && typeCount.length){
                for (i in typeCount){
                    if (typeCount[i]._id == "RECURRING")
                    {
                        final.recurringDeals = typeCount[i].count
                    }
                }
            }
            final.upcomingRevenue = await matchAndAdd("OTHER", "value");
        }
        getData().then(()=>{resolve(final);})
    });
}

function monDealsChart() {
    return new Promise((resolve, reject) => {
        let months = [1,2,3,4,5,6,7,8,9,10,11,12];
        let values = [0,0,0,0,0,0,0,0,0,0,0,0];
        let response = {
            "months":months,
            "closedDeals":values
        }
        dealModel.monDealsChart().then((data) => {
            if(Array.isArray(data) && data.length){
                for(i in data){
                    for(j in months){
                    if(data[i]._id == months[j]){
                        values[j] = data[i].count
                    }
                }
            }
                resolve(response);
            }else{
                resolve([]);
            }
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports = dealService;

