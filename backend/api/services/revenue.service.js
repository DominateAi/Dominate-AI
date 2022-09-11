var revenueModel = require("../models/revenue.model");
var dealModel = require("../models/deal.model");
var currentContext = require('../../common/currentContext');
const moment = require('moment');
const { ACCOUNT_DOES_NOT_EXIST } = require("../../common/error-code");
const { ISO_8601 } = require("moment");
const { template, result } = require("lodash");
const { response } = require("express");

var revenueService = {
    getAllRevenues: getAllRevenues,
    getRevenueById: getRevenueById,
    addRevenue: addRevenue,
    updateRevenue: updateRevenue,
    deleteRevenue: deleteRevenue,
    getRevenueByRevenueName: getRevenueByRevenueName,
    getRevenuesByPage: getRevenuesByPage,
    getRevenuesByPageWithSort: getRevenuesByPageWithSort,
    getAllRevenuesCount: getAllRevenuesCount,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchRevenues: searchRevenues,
    accrev: accrev,
    monAccRev: monAccRev,
    accRecurRev: accRecurRev,
    highRevDeal: highRevDeal,
    totalRev: totalRev,
    widget: widget,
    revForecast: revForecast,
    maxRevChart: maxRevChart,
    accMonRevChart: accMonRevChart,
    monRevChart: monRevChart,
    recurDealChart: recurDealChart,
    bigDealChart: bigDealChart,
    revPredictChart: revPredictChart,
    projectionChart: projectionChart,
    projectedRevForAcc: projectedRevForAcc,
    memberWise: memberWise,
    memberChart: memberChart
}

function addRevenue(revenueData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        revenueData.createdBy = user.email;
        revenueData.lastModifiedBy = user.email;

        revenueModel.create(revenueData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function updateRevenue(id, revenueData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        revenueData.lastModifiedBy = user.email;

        revenueModel.updateById(id, revenueData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteRevenue(id) {
    return new Promise((resolve, reject) => {
        revenueModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllRevenues() {
    return new Promise((resolve, reject) => {
        revenueModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllRevenuesCount() {
    return new Promise((resolve, reject) => {
        revenueModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getRevenueById(id) {
    return new Promise((resolve, reject) => {
        revenueModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getRevenueByRevenueName(revenueName, tenant) {
    return new Promise((resolve, reject) => {
        revenueModel.searchOne({ 'deal': revenueName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getRevenuesByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        revenueModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getRevenuesByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        revenueModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        revenueModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchRevenues(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        revenueModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function accrev(accountId) {
    let response=0;
    return new Promise((resolve, reject) => {
        revenueModel.accrev(accountId).then((data) => {
            if(Array.isArray(data) && data.length){
                response = data[0].totalrevenue;
            }
            resolve(response);
        }).catch((err) => {
            reject(err);
        })
    });
}

function monAccRev(accountId, startDate, endDate) {
    let response = 0;
    return new Promise((resolve, reject) => {
        revenueModel.accrev(accountId, startDate, endDate).then((data) => {
            if(Array.isArray(data) && data.length){
                response = data[0].totalrevenue;
            }
            resolve(response);
        }).catch((err) => {
            reject(err);
        })
    });
}

function accRecurRev(accountId) {
    let response = 0;
    return new Promise((resolve, reject) => {
        revenueModel.accRecurRev(accountId).then((data) => {
            if(Array.isArray(data) && data.length){
                response = data[0].totalrevenue;
            }
            resolve(response);
        }).catch((err) => {
            reject(err);
        })
    });
}

function highRevDeal(accountId) {
    return new Promise((resolve, reject) => {
        revenueModel.highRevDeal(accountId).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function totalRev() {
    return new Promise((resolve, reject) => {
        revenueModel.totalRev().then((data) => {
            if(Array.isArray(data) && data.length){
            resolve(data[0].total);
            }
            else{
                resolve(0)
            }
        }).catch((err) => {
            reject(err);
        })
    });
}

function widget(accountId, startDate, endDate) {
    return new Promise((resolve, reject) => {
        final = {
            revTillDate:0,
            revThisMonth:0,
            revRecur:0,
            dealsSort:{}
        }
        async function getData(accountId, startDate, endDate){
            final.revTillDate = await accrev(accountId);
            final.revThisMonth = await monAccRev(accountId, startDate, endDate);
            final.revRecur = await accRecurRev(accountId);
            final.dealsSort = await highRevDeal(accountId);
        }
        getData(accountId, startDate, endDate).then(()=>{resolve(final);})
    });
}

function maxRevChart() {
    return new Promise((resolve, reject) => {
        let accounts =[], revenues=[];
        let response = {
            "accounts":accounts,
            "revenues":revenues
        };
        revenueModel.maxRevChart().then((data) => {
            if(Array.isArray(data) && data.length)
            {
                for(i in data)
                {
                    accounts.push(data[i].account);
                    revenues.push(data[i].revenue);
                }
                resolve(response);
            }
            else{
                resolve([]);
            }
        }).catch((err) => {
            reject(err);
        })
    });
}

function accMonRevChart(accountId) {
    return new Promise((resolve, reject) => {
        let months = [1,2,3,4,5,6,7,8,9,10,11,12];
        let values = [0,0,0,0,0,0,0,0,0,0,0,0];
        let response = {
            "months":months,
            "values":values
        }
        revenueModel.accMonRevChart(accountId).then((data) => {
            if(Array.isArray(data) && data.length){
                for(i in data){
                    for(j in months){
                    if(data[i]._id == months[j]){
                        values[j] = data[i].revenue
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

function monRevChart() {
    return new Promise((resolve, reject) => {
        let months = [1,2,3,4,5,6,7,8,9,10,11,12];
        let recur = [0,0,0,0,0,0,0,0,0,0,0,0];
        let rev = [0,0,0,0,0,0,0,0,0,0,0,0];
        let response = {
            "months":months,
            "revenueFromRecurringDeals":recur,
            "totalRevenue":rev
        }
        async function getData(){
            data = await revenueModel.monRev();
            if(Array.isArray(data) && data.length){
                for(i in data){
                    for(j in months){
                    if(data[i]._id == months[j]){
                        rev[j] = data[i].revenue
                    }
                }
            }
            }
            dataA = await revenueModel.monRecurRev();
            if(Array.isArray(dataA) && dataA.length){
                for(i in dataA){
                    for(j in months){
                    if(dataA[i]._id == months[j]){
                        recur[j] = dataA[i].revenue
                    }
                }
            }
            }
        }
        getData().then(()=>{resolve(response);})
    });
}

function recurDealChart(startDate, endDate) {
    let deals =[], revenues=[];
    let response = {
        "deals":deals,
        "revenues":revenues
    };
    return new Promise((resolve, reject) => {
        revenueModel.recurDealChart(startDate, endDate).then((data) => {
            if(Array.isArray(data) && data.length)
            {
                for(i in data)
                {
                    deals.push(data[i].deal);
                    revenues.push(data[i].revenue);
                }
                resolve(response);
            }
            else{
                resolve([]);
            }
        }).catch((err) => {
            reject(err);
        })
    });
}

function bigDealChart(startDate, endDate) {
    let deals =[], revenues=[];
    let response = {
        "deals":deals,
        "revenues":revenues
    };
    return new Promise((resolve, reject) => {
        revenueModel.bigDealChart(startDate, endDate).then((data) => {
            if(Array.isArray(data) && data.length)
            {
                for(i in data)
                {
                    deals.push(data[i].deal);
                    revenues.push(data[i].revenue);
                }
                resolve(response);
            }
            else{
                resolve([]);
            }
        }).catch((err) => {
            reject(err);
        })
    });
}


//FINDS REVENUE FORECAST FOR THIS PARTICULAR ACCOUNT
function revForecast(accountId) {
    return new Promise((resolve, reject) => {
        let data =[];
        let futureValues = [];
        const MONTHS_IN_YEAR    = 12;
        let currentMonth = moment().month()+1;
        let startDate = moment().startOf('year');
        let endDate = moment()._d;
        let pastData = [];
        async function getData(accountId){
            transit = await revenueModel.monthwiseRevenueFromAccount(accountId, startDate, endDate);
            if(Array.isArray(transit) && transit.length){
            for(i in transit){
                pastData.push(transit[i].revenue);
                }
            }
            console.log(transit);
        let predictPercForPositive = (rate)=>{
            let predict_rate = 0;
            if(rate > 0 && rate < 20 ) predict_rate = rate;
            else if(rate >=20 && rate < 50) predict_rate = 20;
            else if(rate >=50 && rate < 100) predict_rate = 25;
            else if(rate >=100) predict_rate = 100;
            return predict_rate;
        }
        let predictPercForNegative = (rate)=>{
            let predict_rate = 0;
            if(rate > -10 && rate < 0 ) predict_rate = 8;
            else if(rate <=-10 && rate > -30) predict_rate = 4;
            else if(rate <=-30 && rate > -70) predict_rate = 1;
            else if(rate <=-70) predict_rate = -5;
            return predict_rate;
        }
        let predictValues = (data, pred_perc, first_month) =>{
            let prev_val = data[data.length-1] || 0;
            if(first_month){
                prev_val = data[data.length-2] || 0;
            }
            return prev_val + pred_perc;
        };
        let getChangeRate = (data)=>{
            let prev_val = parseInt(data[data.length-2] || 0);
            let sec_prev_val = parseInt(data[data.length-3] || 0);
            let rate = parseInt(((prev_val - sec_prev_val)/sec_prev_val) * 100);
            let pred_perc = 0;
            if(rate > 0) pred_perc = predictPercForPositive(rate);
            else if(rate <0) pred_perc = predictPercForNegative(rate);
            return rate;
        };
        let getAverageChangeRate = (data)=>{
            let prev_perc = [];
           for(let j = 3; j<=data.length;j++){
                let prevData = [data[j-3],data[j-2],data[j-1]];
                let prevPerc = getChangeRate(prevData);
                prev_perc.push(prevPerc);
            };
            return prev_perc.reduce((acc, c) => acc + c, 0)/prev_perc.length;
        }
        let init = (pastData)=>{
            if(pastData.length < 3){
                resolve("Atlest 3 months data is required for our algoritms to predict your sales forecast");
                return;
            }
            let change_rate = 0;
            if(pastData.length > 3) change_rate = getAverageChangeRate(pastData);
            else change_rate = getChangeRate(pastData);
            for(let i = currentMonth+1; i <= MONTHS_IN_YEAR; i++){
                let first_month = false;
                if(i === currentMonth+1) first_month = true;
                let futurValue = predictValues(pastData, change_rate,first_month);
                pastData.push(futurValue);
                futureValues.push({
                        'futureMonth':i,
                        'futureMonthName':moment().set('month', i-1).endOf("month").format('MMMM'),
                        'futurePredictPercentage':change_rate,
                        futurValue});
            };
            return futureValues;
        };
        init(pastData);
        }
        getData(accountId).then(()=>{
            let months = [1,2,3,4,5,6,7,8,9,10,11,12];
            let values = [0,0,0,0,0,0,0,0,0,0,0,0];
            let response = {
                "months":months,
                "values":values
            }
            for (i in futureValues){
                for(j in months){
                    if(futureValues[i].futureMonth == months[j]){
                        values[j] = futureValues[i].futurValue
                    }
                }
            }
            resolve(response);})
       });
}

//REVENUE PREDICTION CHART

function revPredictChart() {
    return new Promise((resolve, reject) => {
        let data =[];
        let futureValues = [];
        const MONTHS_IN_YEAR    = 12;
        let currentMonth = moment().month()+1;
        let startDate = moment().startOf('year');
        let endDate = moment()._d;
        let pastData = [];
        async function getData(){
            transit = await revenueModel.monthwiseRevenue(startDate, endDate);
            if(Array.isArray(transit) && transit.length){
            for(i in transit){
                pastData.push(transit[i].revenue);
                }
            }
            console.log(transit);
        let predictPercForPositive = (rate)=>{
            let predict_rate = 0;
            if(rate > 0 && rate < 20 ) predict_rate = rate;
            else if(rate >=20 && rate < 50) predict_rate = 20;
            else if(rate >=50 && rate < 100) predict_rate = 25;
            else if(rate >=100) predict_rate = 100;
            return predict_rate;
        }
        let predictPercForNegative = (rate)=>{
            let predict_rate = 0;
            if(rate > -10 && rate < 0 ) predict_rate = 8;
            else if(rate <=-10 && rate > -30) predict_rate = 4;
            else if(rate <=-30 && rate > -70) predict_rate = 1;
            else if(rate <=-70) predict_rate = -5;
            return predict_rate;
        }
        let predictValues = (data, pred_perc, first_month) =>{
            let prev_val = data[data.length-1] || 0;
            if(first_month){
                prev_val = data[data.length-2] || 0;
            }
            return prev_val + pred_perc;
        };
        let getChangeRate = (data)=>{
            let prev_val = parseInt(data[data.length-2] || 0);
            let sec_prev_val = parseInt(data[data.length-3] || 0);
            let rate = parseInt(((prev_val - sec_prev_val)/sec_prev_val) * 100);
            let pred_perc = 0;
            if(rate > 0) pred_perc = predictPercForPositive(rate);
            else if(rate <0) pred_perc = predictPercForNegative(rate);
            return rate;
        };
        let getAverageChangeRate = (data)=>{
            let prev_perc = [];
           for(let j = 3; j<=data.length;j++){
                let prevData = [data[j-3],data[j-2],data[j-1]];
                let prevPerc = getChangeRate(prevData);
                prev_perc.push(prevPerc);
            };
            return prev_perc.reduce((acc, c) => acc + c, 0)/prev_perc.length;
        }
        let init = (pastData)=>{
            if(pastData.length < 3){
                console.log("no future values can be calculated, not enough data");
                return;
            }
            let change_rate = 0;
            if(pastData.length > 3) change_rate = getAverageChangeRate(pastData);
            else change_rate = getChangeRate(pastData);
            for(let i = currentMonth+1; i <= MONTHS_IN_YEAR; i++){
                let first_month = false;
                if(i === currentMonth+1) first_month = true;
                let futurValue = predictValues(pastData, change_rate,first_month);
                pastData.push(futurValue);
                futureValues.push({
                        'futureMonth':i,
                        'futureMonthName':moment().set('month', i-1).endOf("month").format('MMMM'),
                        'futurePredictPercentage':change_rate,
                        futurValue});
            };
            return futureValues;
        };
        init(pastData);
        }
        getData().then(()=>{ let months = [1,2,3,4,5,6,7,8,9,10,11,12];
            let values = [0,0,0,0,0,0,0,0,0,0,0,0];
            let response = {
                "months":months,
                "values":values
            }
            for (i in futureValues){
                for(j in months){
                    if(futureValues[i].futureMonth == months[j]){
                        values[j] = futureValues[i].futurValue
                    }
                }
            }
            resolve(response);})
       });
}

function projectionChart() {
    return new Promise((resolve, reject) => {
        let months = [1,2,3,4,5,6,7,8,9,10,11,12];
        let values = [0,0,0,0,0,0,0,0,0,0,0,0];
        let response = {
            "months":months,
            "values":values
        }
        let currentMonth = moment().month();
        dealModel.recurValue().then((data) => {
            if(Array.isArray(data) && data.length){
           for(i=currentMonth;i<12;i++){
               values[i] = data[0].value;
           }
            }
            resolve(response);
        }).catch((err) => {
            reject(err);
        })
    });
}

function projectedRevForAcc(accountId){
    return new Promise(async(resolve, reject) => {
        try{
        from = moment().startOf('month'); to = moment().endOf('month')
        oneTime = await revenueModel.revOnetime(accountId, from, to)
        if(Array.isArray(oneTime) && oneTime.length){
            e = oneTime[0].revenue
            }else{e=0}
        monFrequency = await revenueModel.revByFrequency(accountId, "MONTHLY", "RECURRING");
        if(Array.isArray(monFrequency) && monFrequency.length){
            a = monFrequency[0].revenue
            }else{a=0}
        
        quarFrequency = await revenueModel.revByFrequency(accountId, "QUARTERLY", "RECURRING");
        if(Array.isArray(quarFrequency) && quarFrequency.length){
            b = quarFrequency[0].revenue
            }else{b=0}
       
        biannualFrequency = await revenueModel.revByFrequency(accountId, "BIANNUAL", "RECURRING");
        if(Array.isArray(biannualFrequency) && biannualFrequency.length){
            c= biannualFrequency[0].revenue
            }else{c=0}
        annualFrequency =  await revenueModel.revByFrequency(accountId, "ANNUAL", "RECURRING");
        if(Array.isArray(annualFrequency) && annualFrequency.length){
        d = annualFrequency[0].revenue
        }else{d=0}
        var response = a + (b/3) + (c/6) + (d/12) + e
        resolve(response);
    }catch(err){reject(err)}
    }).catch((err) => {
        reject(err);
    })
}

function memberWise(user, startDate, endDate) {
    return new Promise(async(resolve, reject) => {
        try{
        var result = [];
        var data = await revenueModel.memberWise(user, startDate, endDate)
        if(Array.isArray(data) && data.length){
            result = data
        }else{result = []}
        resolve(result)
        }catch(err){reject(err)}
    });
}

function memberChart(user, startDate, endDate){
    return new Promise(async(resolve, reject) => {
        try{
        var total = 0;
        var response = [];
        var data = await memberWise(user, startDate, endDate)
        if(Array.isArray(data) && data.length){
        for(i in data){
                total = data[i].revenue + total
            }
        for(j in data){
                var deal = data[j].dealname
                var percentage = (data[j].revenue/total)*100
                format = {"name":deal, "percent":percentage}
                response.push(format)
            }
           
        }else{response = []}
        resolve(response)
        }catch(err){reject(err)}
    });
}

module.exports = revenueService;

