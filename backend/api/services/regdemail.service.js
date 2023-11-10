var regdemailModel = require("../models/regdemail.model");
var currentContext = require('../../common/currentContext');
const notificationClient = require('../../common/notificationClient');
const NotificationType = require('../../common/constants/NotificationType');
var mailService = require("./serverlessemail.service");
const { mail } = require("../../common/aws_mailer");

var regdemailService = {
    getAllRegdemails: getAllRegdemails,
    getRegdemailById: getRegdemailById,
    addRegdemail: addRegdemail,
    updateRegdemail: updateRegdemail,
    deleteRegdemail: deleteRegdemail,
    getRegdemailByRegdemailName: getRegdemailByRegdemailName,
    getRegdemailsByPage: getRegdemailsByPage,
    getAllRegdemailsCount: getAllRegdemailsCount,
    getRegdemailsByPageWithSort: getRegdemailsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchRegdemails: searchRegdemails,
    getRegdemailByEmail: getRegdemailByEmail,
    getAllRegdemailsByDate: getAllRegdemailsByDate,
    getAllRegdemailsByDateAndUser: getAllRegdemailsByDateAndUser,
    sendVerifyLink: sendVerifyLink
}

function addRegdemail(regdemailData) {
    return new Promise(async(resolve, reject) => {
        try{
        var user = currentContext.getCurrentContext();
        regdemailData.createdBy = user.email;
        regdemailData.lastModifiedBy = user.email;
        regdemailData.verified = false;
        var data = await regdemailModel.create(regdemailData)
        var regdemailResult = await regdemailModel.getById(data.id)
        var registered = await mailService.registerEmail(regdemailData.email)
        console.log(registered)         
        resolve(regdemailResult);
        }catch(err){reject(err)}
       })

}

//editing regsitered emails wont be there
function updateRegdemail(id, regdemailData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        regdemailData.lastModifiedBy = user.email;

        regdemailModel.updateById(id, regdemailData).then((data) => {
            notificationClient.notify(NotificationType.MEETING_UPDATED, data, user.workspaceId, data.assigned);
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteRegdemail(id) {
    return new Promise((resolve, reject) => {
        regdemailModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllRegdemails() {
    return new Promise(async(resolve, reject) => {
        var verifiedMails =[], toVerify=[], response = [];
        var regdEmails = await regdemailModel.search({})
        for(value of regdEmails){
            if(value.verified == true){
                verifiedMails.push(value)}else{ toVerify.push(value)}
        }
        response = verifiedMails;
        for(value of toVerify){
           flag = await mailService.checkVerified(value.email)
           if (flag.data == true){ 
            value.verified = true
            var updated = await regdemailModel.updateById(value._id, value) 
            }
           response.push(value)
         }
        resolve(response)
    });
}

function getRegdemailById(id) {
    return new Promise((resolve, reject) => {
        regdemailModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getRegdemailByRegdemailName(regdemailName, tenant) {
    return new Promise((resolve, reject) => {
        regdemailModel.searchOne({ 'regdemailName': regdemailName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllRegdemailsCount() {
    return new Promise((resolve, reject) => {
        regdemailModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getRegdemailsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        regdemailModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getRegdemailsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        regdemailModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        regdemailModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchRegdemails(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        regdemailModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getRegdemailByEmail(email) {
    var query = {
        email: email
    }
    return new Promise((resolve, reject) => {
        regdemailModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllRegdemailsByDate(date) {
    console.log("regdemail date", date)
    var user = currentContext.getCurrentContext();
    var query = {
        "$and": [
            {
                "regdemailDate": {
                    "$eq": new Date(date).toDateString()
                }
            },
            {
                "$or": [
                    {
                        "assigned": {
                            "$eq": user.userId
                        }
                    }, {
                        "organizer": {
                            "$eq": user.userId
                        }
                    }

                ]
            }
        ]
    };


    return new Promise((resolve, reject) => {
        regdemailModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getAllRegdemailsByDateAndUser( date, isOrganisation ) {
    var user = currentContext.getCurrentContext();
    var query = { "$and": [
            { "regdemailDate": { "$eq": new Date(date).toDateString() } },
            { "$or": [
                    { "assigned": { "$eq": user.userId } }, 
                    { "organizer": {"$eq": user.userId } }
                ]
            }
        ]};
    if( isOrganisation ){
        query = { "$and": [
            { "regdemailDate": { "$eq": new Date(date).toDateString() } },
            { "$or": [
                    { "assigned": { "$eq": user.userId } }, 
                    { "organizer": {"$eq": user.userId } }
                ]
            }
        ]};
    }

    return new Promise((resolve, reject) => {
        regdemailModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function sendVerifyLink(id) {
    return new Promise(async(resolve, reject) => {
        try{
        var regdEmail = await regdemailModel.getById(id)
        var email = regdEmail.email
        var data = await mailService.registerEmail(email)
            resolve("mail sent");
        }catch(err){reject(err)}
    });
}

module.exports = regdemailService;

