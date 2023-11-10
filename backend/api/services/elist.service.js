var elistModel = require("../models/elist.model");
var contactModel = require("../models/contact.model");
var verifiedEmailModel = require("../models/verifiedemail.model");
var verifiedEmailService = require("./verifiedemail.service");
var currentContext = require('../../common/currentContext');
const notificationClient = require('../../common/notificationClient');
const NotificationType = require('../../common/constants/NotificationType');
var mailService = require("./serverlessemail.service");
const { contactsToLeads } = require("./lead.service");
var _ = require('lodash');
const { TelemetryHandlerOptions } = require("@microsoft/microsoft-graph-client");

var elistService = {
    getAllElists: getAllElists,
    getElistById: getElistById,
    addElist: addElist,
    updateElist: updateElist,
    deleteElist: deleteElist,
    getElistByElistName: getElistByElistName,
    getElistsByPage: getElistsByPage,
    getAllElistsCount: getAllElistsCount,
    getElistsByPageWithSort: getElistsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchElists: searchElists,
    getElistByName: getElistByName,
    getAllElistsByDate: getAllElistsByDate,
    getAllElistsByDateAndUser:getAllElistsByDateAndUser,
    verifyElist: verifyElist,
    contactsByElist: contactsByElist,
    keepValidated: keepValidated,
    isInvalid: isInvalid
}

function addElist(elistData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        elistData.createdBy = user.email;
        elistData.lastModifiedBy = user.email;
        elistData.organizer = user.userId;
        elistData.elistDate = new Date(elistData.elistDate).toDateString();

        elistModel.create(elistData).then((data) => {
            elistModel.getById(data.id).then((elistResult) => {
                notificationClient.notify(NotificationType.MEETING_CREATED, elistResult, user.workspaceId, user.userId);
                resolve(elistResult);
            }).catch((err) => {
                reject(err);
            })
        }).catch((err) => {
            reject(err);
        })
    })

}

function updateElist(id, elistData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        elistData.lastModifiedBy = user.email;
        elistData.elistDate = new Date(elistData.elistDate).toDateString();

        elistModel.updateById(id, elistData).then((data) => {
            notificationClient.notify(NotificationType.MEETING_UPDATED, data, user.workspaceId, data.assigned);
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteElist(id) {
    return new Promise((resolve, reject) => {
        elistModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllElists() {
    return new Promise((resolve, reject) => {
        elistModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getElistById(id) {
    return new Promise((resolve, reject) => {
        elistModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getElistByElistName(elistName, tenant) {
    return new Promise((resolve, reject) => {
        elistModel.searchOne({ 'elistName': elistName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllElistsCount() {
    return new Promise((resolve, reject) => {
        elistModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getElistsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        elistModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getElistsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        elistModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        elistModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchElists(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise(async(resolve, reject) => {
        try{
        var response = []
        var data = await elistModel.getPaginatedResult(query, options)
        if (Array.isArray(data) && data.length){
            for(elist of data){
            var attempted = [], to_attempt = [];
            var contacts = await contactsByElist(elist._id)
            if (Array.isArray(contacts) && contacts.length){
                for(contact of contacts){
                contact ? (contact.validation_attempted ? attempted.push(contact) : to_attempt.push(contact)) : 0
                }
            }
           var flag = await isInvalid(elist._id)
           var totalParticipants = contacts ? contacts.length : 0
           var unverified = to_attempt ? to_attempt.length : 0
           var verified = attempted ? attempted.length : 0
           var result = {elist, totalParticipants, unverified, verified, flag} 
           response.push(result)
            }
        }
        resolve(response)
        }catch(err){reject(err)}
    });
}

function getElistByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve, reject) => {
        elistModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllElistsByDate(date) {
    console.log("elist date", date)
    var user = currentContext.getCurrentContext();
    var query = {
        "$and": [
            {
                "elistDate": {
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
        elistModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getAllElistsByDateAndUser( date, isOrganisation ) {
    var user = currentContext.getCurrentContext();
    var query = { "$and": [
            { "elistDate": { "$eq": new Date(date).toDateString() } },
            { "$or": [
                    { "assigned": { "$eq": user.userId } }, 
                    { "organizer": {"$eq": user.userId } }
                ]
            }
        ]};
    if( isOrganisation ){
        query = { "$and": [
            { "elistDate": { "$eq": new Date(date).toDateString() } },
            { "$or": [
                    { "assigned": { "$eq": user.userId } }, 
                    { "organizer": {"$eq": user.userId } }
                ]
            }
        ]};
    }

    return new Promise((resolve, reject) => {
        elistModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function verifyElist(id) {
    return new Promise(async(resolve, reject) => {
        var attempted = [], to_attempt = [], emails =[], validCounter=0;
        try{
        var elist = await elistModel.getById(id)
        if(elist){
        for(cid of elist.contacts){
//get contact by id, check if attempted, if yes, push data in attempted, if no, push in to_attempt
// if no, also push emails in emails array that we need to send ahead
        var contactData = await contactModel.getById(cid)
        contactData.validation_attempted ? attempted.push(contactData) : to_attempt.push(contactData), emails.push(contactData.email)
        }
        var validatedData = await mailService.validateEmails(emails)
        console.log(validatedData)
        for(contact of to_attempt){
            contact.validation_attempted = true
            updated1 = await contactModel.updateById(contact._id, contact)
        }
//go through all data, if the status is valid, then find this email in contact and for that contact, 
//set verified=true and update the contact
        for(data of validatedData.data){
        if (data.status == 'valid') 
        {
        validCounter++;
        verifiedContact = _.find(to_attempt, { email:data.emailId })
        if(verifiedContact !==undefined){
        verifiedContact.verified = true;
        updated2 = await contactModel.updateById(verifiedContact._id, verifiedContact)
            }
        }
    }
    var counter = verifiedEmailService.addVerifiedemail({"emailsAttempted":to_attempt.length, "emailsVerified":validCounter, "attemptedOn":new Date()})
 }
     resolve("ok");
    }catch(err){reject(err)}
    });
}

function contactsByElist(id) {
    return new Promise(async(resolve, reject) => {
        try{
       var contacts = [];
       eList = await elistModel.getById(id)
       for(cid of eList.contacts){
        contact = await contactModel.getById(cid)
        contacts.push(contact)
       }
            resolve(contacts);
        }catch(err){reject(err)}
    });
}

function keepValidated(id) {
    return new Promise(async(resolve, reject) => {
        try{
       var verContacts = [], unverContacts=[];
       eList = await elistModel.getById(id)
       for(cid of eList.contacts){
        contact = await contactModel.getById(cid)
        contact.verified == true ? verContacts.push(contact) : unverContacts.push(contact)
       }
       eList.contacts=verContacts
       updated = await elistModel.updateById(id, eList)
            resolve(updated);
        }catch(err){reject(err)}
    });
}

function isInvalid(id) {
    return new Promise(async(resolve, reject) => {
        try{
        var notVerified=0;
        eList = await elistModel.getById(id)
        for(cid of eList.contacts){
            contact = await contactModel.getById(cid)
            contact.verified == false ? notVerified++ : 0
        }
        if(notVerified>0){
            resolve("NOT VALID")
        }else{resolve("VALID")}
        }catch(err){reject(err)}
    });
}

module.exports = elistService;

