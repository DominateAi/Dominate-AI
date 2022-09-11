var userAuthCodeModel = require("../models/userAuthCode.model");
var currentContext = require('../../common/currentContext');

var userAuthCodeService = {
    getUserAuthCodeById:getUserAuthCodeById,
    addUserAuthCode: addUserAuthCode,
    deleteUserAuthCode:deleteUserAuthCode
}

//the userData being received in this service already has authcode, type and workspace id and we're
//just  adding createdBy and lastModeifiedBy
function addUserAuthCode(userData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        userData.createdBy = user.email;
        userData.lastModifiedBy = user.email;
        userAuthCodeModel.create(userData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}
 

function deleteUserAuthCode(id) {
    return new Promise((resolve,reject) => {
        userAuthCodeModel.deletebyId({'authCode':id}).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}


function getUserAuthCodeById(id) {
    return new Promise((resolve,reject) => {
        userAuthCodeModel.searchOne({"authCode":id}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


module.exports = userAuthCodeService;

