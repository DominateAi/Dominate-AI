var accountModel = require("../models/account.model");
var dealModel = require("../models/deal.model");
var leadModel = require("../models/lead.model");
var revenueModel = require("../models/revenue.model");
var noteModel = require("../models/note.model");
var followupModel = require("../models/followup.model");
var emailModel = require("../models/email.model");
var currentContext = require('../../common/currentContext');
const revenueService = require("./revenue.service");
const dealService = require("./deal.service");

var accountService = {
    getAllAccounts: getAllAccounts,
    getAccountById: getAccountById,
    addAccount: addAccount,
    updateAccount: updateAccount,
    deleteAccount: deleteAccount,
    getAccountByAccountName: getAccountByAccountName,
    getAccountsByPage: getAccountsByPage,
    getAccountsByPageWithSort: getAccountsByPageWithSort,
    getAllAccountsCount: getAllAccountsCount,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchAccounts: searchAccounts,
    accWithDeals: accWithDeals,
    accRecurDeals: accRecurDeals,
    widget: widget,
    aldChart: aldChart,
    accDealCount: accDealCount,
    accRevChart: accRevChart
}

function addAccount(accountData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        accountData.createdBy = user.email;
        accountData.lastModifiedBy = user.email;

        accountModel.create(accountData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function updateAccount(id, accountData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        accountData.lastModifiedBy = user.email;

        accountModel.updateById(id, accountData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteAccount(id) {
    return new Promise((resolve, reject) => {
        accountModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllAccounts() {
    var accounts, leads, accountIds=[];
    return new Promise((resolve, reject) => {
        accountModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllAccountsCount() {
    return new Promise((resolve, reject) => {
        accountModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getAccountById(id) {
    return new Promise((resolve, reject) => {
        let leads,deals,users,account, response, usersInfo=[];
        async function getData(){
        account = await accountModel.getById(id);
            leads = await leadModel.leadsByAccountId(id);
                deals = await dealModel.search({"account":id});
                notes = await noteModel.search({"entityId":id});
                accNotes = notes.length;
                users = await leadModel.usersForAccount(id);
                for(j in users){
                    usersInfo.push(users[j]._id)
                }
                accumulatedRevenue = await accountAccumulatedRevenue(id)
                followUpData = await followupModel.followUpByAccount(id)
                overViewData = await createOverviewData(id)
                projRev = await revenueService.projectedRevForAcc(id)
                accountData = account._doc;
                leadsData = {leadsData:leads}
                dealsData = {dealsData:deals}
                usersData = {usersData:usersInfo}
                accountNotes = {accountNotes: accNotes}
                accumulatedRevenue = {accumulatedRevenue: accumulatedRevenue}
                followupData = {upcomingFollowups: followUpData}
                overviewData = {overViewData: overViewData}
                projRevenue = {projectedRevenue: projRev}
                response = {...accountData,
                            ...leadsData,
                            ...dealsData,
                            ...usersData,
                            ...followupData,
                            ...overviewData,
                            ...accountNotes, 
                            ...accumulatedRevenue,
                            ...projRevenue
                            }
        }
        getData().then(()=>{resolve(response);})
    });
}

function createOverviewData(accountId){
    return new Promise(async(resolve, reject) => {
        leadsCount = await leadModel.countDocuments({"account_id":accountId})
        opLeadsCount = await leadModel.countDocuments({ $and: [ { "account_id": accountId }, { status: "OPPORTUNITIES" } ] })
        clLeadsCount = await leadModel.countDocuments({ $and: [ { "account_id": accountId }, { status: "CONVERTED" } ] })
        dealsCount =  await dealModel.countDocuments({"account":accountId})
        clDealsCount = await dealModel.countDocuments({ $and: [ { "account": accountId }, { status: "CLOSED" } ] })
        followupsDone = await followupModel.previousFollowUpsInAccount(accountId)
        followupsDoneCount = followupsDone.length;
        usersInAccount = await leadModel.usersForAccount(accountId)
        usersCount = usersInAccount.length
        emailCount = await emailModel.emailCountByAcc(accountId)
        if(Array.isArray(emailCount) && emailCount.length){
        emailcount = emailCount[0].count
        }else{emailcount = 0;}
        overViewData = {
            leadsCount: leadsCount,
            opportunityLeads: opLeadsCount,
            convertedLeads: clLeadsCount,
            dealsCount: dealsCount,
            closedDealsCount: clDealsCount,
            followupsDoneCount: followupsDoneCount,
            usersCount: usersCount,
            emailsCount: emailcount
        }
       resolve(overViewData)
    }).catch((err) => {
        reject(err);
    });
}

function getAccountByAccountName(accountName, tenant) {
    return new Promise((resolve, reject) => {
        accountModel.searchOne({ 'accountname': accountName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAccountsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
            var accounts, deals,leads,complete, final=[], usersInfo=[], dealIds=[];
            async function getData(options){
            accounts = await accountModel.getPaginatedResult({}, options)
            for (i in accounts){
                var users = [], usersInfo = [];
                var account = accounts[i]._id
                accountData = accounts[i]._doc
                leads = await leadModel.leadsByAccountId(account)
                leadsCount = await leadModel.countDocuments({"account_id":account})
                var totalRevenue= await accountAccumulatedRevenue(account);
                deals = await dealModel.search({"account":account})
                clDealsCount = await dealModel.countDocuments({ $and: [ { "account": account }, { status: "CLOSED" } ] })
                opDealsCount = await dealModel.countDocuments({ $and: [ { "account": account }, { status: "OTHER" } ] })
                projRev = await revenueService.projectedRevForAcc(account)
                latFollowUp = await followupModel.latestFollowUp(account)
                if (Array.isArray(latFollowUp) && latFollowUp.length){
                    latestFollowUp = latFollowUp[0].followupAtTime
                }else{latestFollowUp = "no followups till now"}
                users = await leadModel.usersForAccount(account)
                for(j in users){
                    usersInfo.push(users[j]._id)
                }
                leadsData = {leadsData:leads}
                dealsData = {dealsData:deals}
                usersData = {usersData:usersInfo}
                complete = {...accountData,...leadsData,...dealsData,...usersData, 
                    "leadsCount": leadsCount, 
                    "closedDealsCount": clDealsCount,
                    "openDealsCount": opDealsCount,
                    "accumulatedRevenue": totalRevenue,
                    "projectedRevenue": projRev,
                    "lastFollowUp": latestFollowUp
                }
                final.push(complete);
            }
        }
        getData(options).then(()=>{resolve(final);})
    });
}

/**pass any account
 * and get the accumulated revenue by first getting all the deals
 */
function accountAccumulatedRevenue(accountId){
    return new Promise(async(resolve, reject) => {
    deals = await dealModel.search({"account":accountId})
    var totalRevenue=0;
    for(i in deals){
        revenue = await revenueModel.revByDeal(deals[i]._id)
        if (Array.isArray(revenue) && revenue.length){
            rev = revenue[0].total;       
                }else{
                        rev = 0;
                         }
        totalRevenue = totalRevenue + rev
                }
            resolve(totalRevenue);
                        }).catch((err) => {
                             reject(err);
                         })
        }

        // function getAccFollowUps(AccountId){

        // }

function getAccountsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        accountModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        accountModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchAccounts(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        var accounts, deals,leads,complete, final=[], usersInfo=[], dealIds=[];
        async function getData(options){
        accounts = await accountModel.getPaginatedResult(query, options)
        for (i in accounts){
            var users = [], usersInfo = [];
            var account = accounts[i]._id
            accountData = accounts[i]._doc
            leads = await leadModel.leadsByAccountId(account)
            leadsCount = await leadModel.countDocuments({"account_id":account})
            var totalRevenue= await accountAccumulatedRevenue(account);
            deals = await dealModel.search({"account":account})
            clDealsCount = await dealModel.countDocuments({ $and: [ { "account": account }, { status: "CLOSED" } ] })
            opDealsCount = await dealModel.countDocuments({ $and: [ { "account": account }, { status: "OTHER" } ] })
            projRev = await revenueService.projectedRevForAcc(account)
            latFollowUp = await followupModel.latestFollowUp(account)
            if (Array.isArray(latFollowUp) && latFollowUp.length){
                latestFollowUp = latFollowUp[0].followupAtTime
            }else{latestFollowUp = "no followups till now"}
            users = await leadModel.usersForAccount(account)
            for(j in users){
                usersInfo.push(users[j]._id)
            }
            leadsData = {leadsData:leads}
            dealsData = {dealsData:deals}
            usersData = {usersData:usersInfo}
            complete = {...accountData,...leadsData,...dealsData,...usersData, 
                "leadsCount": leadsCount, 
                "closedDealsCount": clDealsCount,
                "openDealsCount": opDealsCount,
                "accumulatedRevenue": totalRevenue,
                "projectedRevenue": projRev,
                "lastFollowUp": latestFollowUp
            }
            final.push(complete);
        }
    }
    getData(options).then(()=>{resolve(final);})
    });
}

function accWithDeals() {
    let accounts;
    return new Promise((resolve, reject) => {
      async function getData(){
          key = "account";
        accounts = await dealModel.groupByKeyAndCountDocuments("account");
      }
      getData().then(()=>{resolve(accounts.length);})
    });
}

function accRecurDeals() {
    let accounts;
    return new Promise((resolve, reject) => {
      async function getData(){
          key = "account";
        accounts = await dealModel.accRecurDeals();
      }
      getData().then(()=>{resolve(accounts.length);})
    });
}

function widget(startDate, endDate) {
    return new Promise((resolve, reject) => {
        let final ={
            totalAccounts: 0,
            accWithDeals: 0,
            accWithRecurDeals:0,
            revTillDate: 0,
            monRevRecurDeals: 0,
            dealHighRev: 0
        }
        async function getData(startDate, endDate){
            final.totalAccounts = await getAllAccountsCount();
            final.accWithDeals = await accWithDeals();
            final.accWithRecurDeals = await accRecurDeals();
            final.revTillDate = await revenueService.totalRev();
            final.monRevRecurDeals = await dealService.monthlyRecurDealsRev(startDate, endDate);
            final.dealHighRev = await dealService.dealWithHighestRev();
        }
        getData(startDate, endDate).then(()=>{resolve(final);})
    });
}

function aldChart() {
    return new Promise((resolve, reject) => {
        let acc = []
        let deals = [];
        let leads = [];
        let response = {
            "accounts":acc,
            "deals":deals,
            "leads":leads
        }
        async function getData(){
            accounts = await getAllAccounts();
            if(accounts!==undefined && accounts!==null){
                for (i in accounts){
                    acc.push(accounts[i].accountname);
                    data = await dealModel.countAcc(accounts[i]._id);
                    console.log(data);
                    if(Array.isArray(data) && data.length){
                        deals.push(data[0].count)
                    }
                    dataA = await leadModel.countAcc(accounts[i]._id);
                    console.log(dataA)
                    if(Array.isArray(dataA) && dataA.length){
                        leads.push(dataA[0].count)
                    }
                }
            }
        }
        getData().then(()=>{resolve(response);})
    });
}

function accDealCount() {
    return new Promise(async(resolve, reject) => {
        let accounts=[], deals=[], response = {};
        let data = await dealModel.accDealCount();
        if(Array.isArray(data) && data.length){
            for(i in data){
                accounts.push(data[i].accountname)
                deals.push(data[i].count)
            }
            response = {"accounts":accounts, "deals":deals}
        }
        else{response={};}
        resolve(response);
    }).catch((err) => {
        reject(err);
    });
}

function accRevChart() {
    return new Promise(async(resolve, reject) => {
        try{
        let accounts=[], accountsWithData=[], response = {}, tempObject={};
        accounts = await getAllAccounts();
        var length = accounts.length > 5 ? 5 : accounts.length
        //need to send on only 5 accounts in the chart
        for(i=0;i<length;i++){
            id = accounts[i]._id
            accName = accounts[i].accountname
            chartData = await revenueService.accMonRevChart(id)
            chartValues = chartData.values
            tempObject = {
                label:accName,
                data:chartValues
            }
           
            accountsWithData.push(tempObject);
        }
        var months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
        
        response = {
            MONTHS:months,
            accountsWithData: accountsWithData
        }
        resolve(response);
    }catch(err){reject(err)}
    }).catch((err) => {
        reject(err);
    });
}

module.exports = accountService;

