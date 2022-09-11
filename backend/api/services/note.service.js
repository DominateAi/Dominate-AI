var noteModel = require("../models/note.model");
var currentContext = require('../../common/currentContext');
var activityService = require('../services/activity.service');

var noteService = {
    getAllNotes: getAllNotes,
    getNoteById:getNoteById,
    addNote: addNote,
    updateNote:updateNote,
    deleteNote:deleteNote,
    getNoteByNoteName: getNoteByNoteName,
    getNotesByPage: getNotesByPage,
    getAllNotesCount: getAllNotesCount,
    getNotesByPageWithSort: getNotesByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchNotes: searchNotes

}

function addNote(noteData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        noteData.createdBy = user.email;
        noteData.lastModifiedBy = user.email;
        if(noteData.entityType == undefined){
            noteData.entityType = 'ACCOUNT'
        }
        noteModel.create(noteData).then((data)=>{
            var activity = {
                'entityType': 'ACCOUNT',
                'entityId' : noteData.entityId,
                'data': noteData,
                'activityType': 'NOTE_CREATED'
            }
            activityService.addActivity(activity).then((adata)=>{
                resolve(data);
            }).catch((err)=>{
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updateNote(id,noteData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        noteData.lastModifiedBy = user.email;
        
        noteModel.updateById(id,noteData).then((data)=>{
            var activity = {
                'entityType': noteData.entityType,
                'entityId' : noteData.entityId,
                'data': noteData,
                'activityType': 'NOTE_UPDATED'
            }
            activityService.addActivity(activity).then((adata)=>{
                resolve(data);
            }).catch((err)=>{
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteNote(id) {
    return new Promise((resolve,reject) => {
        noteModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllNotes(entityId, entityType) {
    return new Promise((resolve,reject) => {
        noteModel.search({
            'entityId': entityId,
            'entityType': entityType
        }).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getNoteById(id) {
    return new Promise((resolve,reject) => {
        noteModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getNoteByNoteName(noteName, tenant){
    return new Promise((resolve,reject) => {
        noteModel.searchOne({'noteName': noteName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllNotesCount() {
    return new Promise((resolve, reject) => {
        noteModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getNotesByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        noteModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getNotesByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        noteModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        noteModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchNotes(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        noteModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports = noteService;

