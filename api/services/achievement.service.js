var achievementModel = require("../models/achievement.model");
var currentContext = require('../../common/currentContext');

var achievementService = {
    getAllAchievements: getAllAchievements,
    getAchievementById: getAchievementById,
    addAchievement: addAchievement,
    updateAchievement: updateAchievement,
    deleteAchievement: deleteAchievement,
    getAchievementByAchievementName: getAchievementByAchievementName,
    getAchievementsByPage: getAchievementsByPage,
    getAchievementsByPageWithSort: getAchievementsByPageWithSort,
    getAllAchievementsCount: getAllAchievementsCount,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchAchievements: searchAchievements,
    match: match
}

function addAchievement(achievementData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        achievementData.createdBy = user.email;
        achievementData.lastModifiedBy = user.email;

        achievementModel.create(achievementData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function updateAchievement(id, achievementData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        achievementData.lastModifiedBy = user.email;

        achievementModel.updateById(id, achievementData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteAchievement(id) {
    return new Promise((resolve, reject) => {
        achievementModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllAchievements() {
    return new Promise((resolve, reject) => {
        achievementModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllAchievementsCount() {
    return new Promise((resolve, reject) => {
        achievementModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getAchievementById(id) {
    return new Promise((resolve, reject) => {
        achievementModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAchievementByAchievementName(Id, tenant) {
    return new Promise((resolve, reject) => {
        achievementModel.searchOne({ '_id': Id }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAchievementsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        achievementModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAchievementsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        achievementModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        achievementModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchAchievements(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        achievementModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function match(lead, type) {
    return new Promise((resolve, reject) => {
        achievementModel.match(lead, type).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports = achievementService;

