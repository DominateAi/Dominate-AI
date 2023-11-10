var currentContext = require('../../common/currentContext');
var contactModel = require("../models/contact.model");
var Queue = require('bull');
var uploadQueue = new Queue('uploading queue');
const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");
const _ = require('lodash');

var contactService = {
    getAllContacts: getAllContacts,
    getContactById: getContactById,
    addContact: addContact,
    updateContact: updateContact,
    deleteContact: deleteContact,
    getContactByContactEmail: getContactByContactEmail,
    getContactsByPage: getContactsByPage,
    getContactsByPageWithSort: getContactsByPageWithSort,
    getAllContactsCount: getAllContactsCount,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchContacts: searchContacts,
    exportContacts: exportContacts,
    importContacts: importContacts,
    bulkDelete: bulkDelete
}

function addContact(contactData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        contactData.createdBy = user.email;
        contactData.lastModifiedBy = user.email;
        contactData.validation_attempted = false;
        contactData.verified = false
        contactModel.create(contactData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
}

function updateContact(id, contactData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        contactData.lastModifiedBy = user.email;
        contactModel.updateById(id, contactData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteContact(id) {
    return new Promise((resolve, reject) => {
        contactModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllContacts() {
    return new Promise((resolve, reject) => {
        contactModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllContactsCount() {
    return new Promise((resolve, reject) => {
        contactModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getContactById(id) {
    return new Promise((resolve, reject) => {
        contactModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getContactByContactEmail(contactEmail, tenant) {
    return new Promise((resolve, reject) => {
        contactModel.searchOne({ 'email': contactEmail }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getContactsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        contactModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getContactsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        contactModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        contactModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchContacts(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        contactModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function exportContacts() {
    return new Promise((resolve, reject) => {

        async function getData(){
            data = await contactModel.export();
            // uploadQueue.add({data: data})

            // uploadQueue.process(async (job) => {
                const json2csvParser = new Json2csvParser({ header: true });
                const csvData = json2csvParser.parse(data);
                resolve (csvData);
                done();
            //   });
        }
        getData()
    })
}

function importContacts(contacts) {
    return new Promise((resolve, reject) => {
        let all_promise = [];
        let duplicateFree = _.uniqBy(contacts, 'email'); 
        let contactsA = duplicateFree;
        var user = currentContext.getCurrentContext();
       console.log(user);
        contactsA.forEach(contactA => {
            contactA['lastModifiedBy'] = user.email
            contactA['createdBy'] = user.email
        });
        for(i in contactsA){
            all_promise.push( importSingle( contactsA[i]) );
            }
            Promise.all( all_promise ).then((data)=>{resolve(data);})
        // contactModel.import(contactsA).then((data) => {
        //     resolve(data);
        // }).catch((err) => {
        //     reject(err);
        // })
    })
}

function importSingle(contactData) {
    return new Promise((resolve, reject) => {
       
        contactModel.create(contactData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function bulkDelete(contacts) {
    return new Promise((resolve, reject) => {
        console.log(contacts);
       async function task(contacts){
        for (i in contacts){
            deleteContact(contacts[i]);
        }
       }
       task(contacts).then(()=>{resolve("deleted")})
    })
}


module.exports = contactService;

