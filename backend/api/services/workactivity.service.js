var wactModel = require("../models/workactivity.model");
var userModel = require("../models/user.model");
var leadModel = require("../models/lead.model");
var followupModel = require("../models/followup.model");
var currentContext = require('../../common/currentContext');
const { template } = require("lodash");

var wactService = {
    getAllWacts: getAllWacts,
    getWactById: getWactById,
    addWact: addWact,
    updateWact: updateWact,
    deleteWact: deleteWact,
    getWactByWactName: getWactByWactName,
    getWactsByPage: getWactsByPage,
    getWactsByPageWithSort: getWactsByPageWithSort,
    getAllWactsCount: getAllWactsCount,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchWacts: searchWacts
}

function addWact(payload, type, act, prevData, oldStatus, newStatus) {
    return new Promise(async(resolve, reject) => {
        try{
        var user = currentContext.getCurrentContext();
        var date = new Date();
        var userData = await userModel.search({"email":user.email})
        if(type == "LEAD" && act == "CREATE"){
            
            if(payload.status == "CONVERTED"){
                var description = "<p>" + "<span class='highlighted_text'>" + userData[0].firstName + "</span>"+ " " + "converted the lead" +"<span class='highlighted_text'>"  + payload.name +"</span>"+ "</p>"
            }else{
            var description = "<p>" + "<span class='highlighted_text'>" + userData[0].firstName + "</span>" + " " +"created a new lead" + " "+"<span class='highlighted_text'>" + payload.name +"</span>"+ "</p>"
            }
            var wactData = {
                "type":"LEAD",
                "user":userData[0]._id,
                "date":date,
                "description":description
            }
        }
        else if(type == "LEAD" && act == "UPDATE"){
        if(payload.status == "CONVERTED"){
            var description = "<p>" + "<span class='highlighted_text'>"  + userData[0].firstName +"</span>" + " " + "converted the lead" + "<span class='highlighted_text'>" + payload.name + "</span>"+"</p>"
            }else{
            var description = "<p>" + "<span class='highlighted_text'>" +userData[0].firstName + "</span>"+" " + "changed" + " " + "status of" +" "+"<span class='highlighted_text'>"  +payload.name +"</span>" +" " + "from" + " " + "<span class='highlighted_text'>" +prevData.status +"</span>" +" " + "to" + " " + "<span class='highlighted_text'>" +payload.status + "</span>"+"</p>"
            }
            var wactData = {
                "type":"LEAD",
                "user":userData[0]._id,
                "date":date,
                "description":description
            }
            
        }
        else if(type == "DEAL" && act == "CREATE"){
        //handle scenario of deal being converted separately here
        if(payload.status == "CLOSED"){
            var description = "<p>" + "<span class='highlighted_text'>" +userData[0].firstName + "</span>"+" " + "closed the deal" + " " + "<span class='highlighted_text'>" +payload.dealname + "</span>"+"</p>"
            }else{
            var description = "<p>" + userData[0].firstName + "</span>"+" " + "created a new deal" + " " + "<span class='highlighted_text'>" +payload.dealname +"</span>" +"</p>"
            }
            var wactData = {
                "type":"DEAL",
                "user":userData[0]._id,
                "date":date,
                "description":description
            }
        }
        else if(type == "DEAL" && act == "UPDATE"){
            if(newStatus == "CLOSED"){
                var description = "<p>" +"<span class='highlighted_text'>"  +userData[0].firstName + "</span>"+" " + "closed the deal" + " " +"<span class='highlighted_text'>"  +payload.name + "</span>" + "</p>"
                }else{
                var description = "<p>" + "<span class='highlighted_text'>" + userData[0].firstName + "</span>" +" " + "changed" + " " + "satus of" + " " + "<span class='highlighted_text'>" +payload.name + "</span>"+" " + "from" + " " + "<span class='highlighted_text'>" +oldStatus + "</span>"+" " + "to" + " " + "<span class='highlighted_text'>" + newStatus + "</span>" + "</p>"
                }
                var wactData = {
                    "type":"DEAL",
                    "user":userData[0]._id,
                    "date":date,
                    "description":description
                }

        }
        else if(type == "FOLLOWUP" && act == "UPDATE"){
            if(payload.status == "COMPLETED"){
                var lead = await leadModel.getById(payload.assigned)
                if(lead !== null){
                    console.log("REACHED HERE")
                var description = "<p>" +"<span class='highlighted_text'>"  +userData[0].firstName +"</span>" +" " + "followed up with" + " " + "<span class='highlighted_text'>" +lead.name + "</span>"+" " + "by" + " " + "<span class='highlighted_text'>" +payload.type + "</span>" + "</p>"
            }else{
                var description = "<p>" + "<span class='highlighted_text'>" +userData[0].firstName + "</span>"+" " + "completed a followup" + " " + "by" + " " + "<span class='highlighted_text'>" +payload.type + "</span>" + "</p>"
            }
            var wactData = {
                "type":"FOLLOWUP",
                "user":userData[0]._id,
                "date":date,
                "description":description
            }
            
        }
        
           
            //will create a special API to user to view followups related workactivity, which will also check today's all followups
            //if any of the followups were there scheduled for today and their status is still "NEW", then we will show in workspace
            //activity API that these followups have not been completed, realtime these descriptions will be created and shown rather than
            //first storing in workactivity model and then showing
        }
        else{
          var wactData = payload
        }
        wactData.createdBy = user.email;
        wactData.lastModifiedBy = user.email;
        data = await wactModel.create(wactData)
            resolve(data);
    }catch(err){reject(err)}
    })

}

function updateWact(id, wactData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        wactData.lastModifiedBy = user.email;

        wactModel.updateById(id, wactData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteWact(id) {
    return new Promise((resolve, reject) => {
        wactModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllWacts() {
    return new Promise((resolve, reject) => {
        wactModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllWactsCount() {
    return new Promise((resolve, reject) => {
        wactModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getWactById(id) {
    return new Promise((resolve, reject) => {
        wactModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWactByWactName(wactName, tenant) {
    return new Promise((resolve, reject) => {
        wactModel.searchOne({ 'name': wactName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWactsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        wactModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWactsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        wactModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        wactModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchWacts(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    var format ={},temp = [];
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise(async(resolve, reject) => {
        try{
        if(query.type == "FOLLOWUP"){
            var date = query.date
            var user = query.user
            var userData = await userModel.getById(user)
            console.log(userData);
            fdata = await followupModel.search({"status":"NEW", "followupAtDate":date, "organizer":user})
            console.log("followupdata",fdata)
            for(i in fdata){
                var leadData = await leadModel.getById(fdata[i].assigned)
                var d = new Date(fdata[i].followupAtDate)
                var newDate = d.toDateString()
                var description = "<p>"+ "<span class='highlighted_text'>" + userData.firstName +"</span>" + " " + "had a scheduled follow up with" + " "+ "<span class='highlighted_text'>" + leadData.name + "</span>" + " " + "by" + " " + fdata[i].type + " " + "on" + " "+ newDate + " " + "and it's still pending" + "</p>"
                format={
                    "type":"FOLLOWUP",
                    "user":userData.firstName,
                    "date":fdata[i].followupAtDate,
                    "descripton":description
                }
                temp.push(format)
            }
        }
        data = await wactModel.getPaginatedResult(query, options)
        console.log(data)
        var result = data.concat(temp)
            resolve(result);
            }catch(err){reject(err)}
    })
}


module.exports = wactService;

