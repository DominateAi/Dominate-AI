const roleModel = require("../models/role.model");
const currentContext = require('../../common/currentContext');
const ootbFeatures = require('../../config/ootbFeatures.json');
const ootbRoles = require('../../config/ootbRoles.json');
const _ = require('lodash');

const roleService = {
    getAllRoles: getAllRoles,
    getRoleById:getRoleById,
    addRole: addRole,
    updateRole:updateRole,
    deleteRole:deleteRole,
    getRoleByRoleName: getRoleByRoleName,
    addDefaultRoles: addDefaultRoles,
    getDefaultRole:getDefaultRole,
    searchRoles: searchRoles  
}

function addRole(roleData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        roleData.createdBy = user.email;
        roleData.lastModifiedBy = user.email;
        if(roleData.internal == undefined){
            roleData.internal = false;
        }
//roles have an array called permissions, where the list of all permissions reside, if this is empty or *, then invalid
        if(roleData.permissions != undefined && 
            roleData.permissions.length > 0 && roleData.permissions.includes('*')){
            reject("Invalid Permission");
        }
//simple function to create a new role
        roleModel.create(roleData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

//ootbroles can help us with roles and permissioning and ootfeatures will help us to  restrict fetaures
function addDefaultRoles(features) {
//this function recieves an array called 'features'
    return new Promise((resolve,reject) => {
        var promises = [];
        var featurePermissions = [];
//copies the roles defined in ootbroles file in roleCopy variable
        var ootbRolesCopy = _.cloneDeep(ootbRoles);
//take all features from ootb features file and runs loop (there is an array of objects called 
//features iniside the file, hence the .features)
        ootbFeatures.features.forEach(ootbFeature => {
// and then it goes over every value in the features array received into this function
            features.forEach(feature =>{
//it now checks for each value of the array whether the feature in the received 'features' array matches featureId in ootbfeatures
                if(feature === ootbFeature.featureId){
//if there's a match, concat it into a variable called featurePermissions
                    featurePermissions = featurePermissions.concat(ootbFeature.permissions);
                }
            })
        });
//the clone array we had created from ootbroles, we run a loop over it (this basically has admin, employee etc. and goes over each)
//for each of the users, it adds/concats the feature permissions that we have added in featurepermissions array just above
        ootbRolesCopy.roles.forEach(role => {
            role.permissions = role.permissions.concat(featurePermissions);
//using the pre-existing roles and adding new features and permissions to them, we now create new roles at the d.b level
//addRole function creates roles at db level for this particular workspace
            promises.push(addRole(role));
        });
        Promise.all(promises).then((result)=>{
            resolve(result);
        }).catch((err) => {
            reject(err);
        });
    });
}

//gets the default role of this workspace
function getDefaultRole() {
    return new Promise((resolve,reject) => {
        roleModel.searchOne({isdefault: true}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

// for any workspace if the user wants to edit any of the roles, this is function
//we give many roles preset. but user can create his own and edit the ones he created as well as presets
//this is taking place in the context of the workspace only
function updateRole(id,roleData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        roleData.lastModifiedBy = user.email;
//again checking for permissions array
        if(roleData.permissions != undefined && 
            roleData.permissions.length > 0 && roleData.permissions.includes('*')){
            reject("Invalid Permission");
        }
//pass the id of the role and the roleData to be updated
        roleModel.updateById(id,roleData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

//deleting a particular role for the workspace
function deleteRole(id) {
    return new Promise((resolve,reject) => {
        roleModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllRoles() {
    return new Promise((resolve,reject) => {
        roleModel.search({}).then((data)=>{
            console.log( data );
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getRoleById(id) {
    return new Promise((resolve,reject) => {
        roleModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getRoleByRoleName(roleName, tenant){
    return new Promise((resolve,reject) => {
        roleModel.searchOne({'name': roleName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchRoles(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        roleModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports = roleService;

