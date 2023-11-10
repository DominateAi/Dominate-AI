var fileModel = require("../models/file.model");
var currentContext = require('../../common/currentContext');

var fileService = {
    getAllFiles: getAllFiles,
    getFileById: getFileById,
    addFile: addFile,
    updateFile: updateFile,
    deleteFile: deleteFile,
    getFileByFileName: getFileByFileName,
    getFilesByPage: getFilesByPage,
    getAllFilesCount: getAllFilesCount,
    getFilesByPageWithSort: getFilesByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchFiles: searchFiles,
    textSearch: textSearch
}

function addFile(fileData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        fileData.createdBy = user.email;
        fileData.lastModifiedBy = user.email;
        fileData.entityId = user.userId;
        fileModel.create(fileData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}
function updateFile(id, fileData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        fileData.lastModifiedBy = user.email;

        fileModel.updateById(id, fileData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteFile(id) {
    return new Promise((resolve, reject) => {
        fileModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllFiles() {
    return new Promise((resolve, reject) => {
        fileModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFileById(id) {
    return new Promise((resolve, reject) => {
        fileModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFileByFileName(fileName, tenant) {
    return new Promise((resolve, reject) => {
        fileModel.searchOne({ 'fileName': fileName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllFilesCount(query) {
    return new Promise((resolve, reject) => {
        fileModel.countDocuments(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFilesByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        fileModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFilesByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        fileModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        fileModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchFiles(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        fileModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}



function textSearch(text) {
    return new Promise((resolve, reject) => {
        fileModel.getTextSearchResult(text).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}



module.exports = fileService;

