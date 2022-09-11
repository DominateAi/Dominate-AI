var userService = require("../services/user.service");
const roleService = require('../services/role.service');
var currentContext = require('../../common/currentContext');

var switchRoleService = {
    performSwitchRole: performSwitchRole,
    getAdminUserRole: getAdminUserRole,
    getSupportUserRole: getSupportUserRole,
    runAsOrganization: runAsOrganization,
    runAsOrganization2: runAsOrganization2
}

function performSwitchRole(user, role) {
    return new Promise((resolve,reject) => {
//role is the variable you receive in the function, it has an _id, you set your user with this role
        user.role = role._id;
//you set the user's password to undefined, why?
        user.password = undefined;
//now we update the user by sending the user id and the user's object
        userService.updateUser(user._id, user).then((data)=>{
//basically after this, the role of the user changes
            resolve(data);
        }).catch((err)=>{
            reject(err);
        });
    })
   
}
 
async function getAdminUserRole(email) {
//we receieve an email as variable into the func.
    console.log( email );
//gets the role object for admin along with its role id
    var adminRole = await roleService.getRoleByRoleName('Administrator');
//gets the role object for support role along with its role id
    var supportRole = await roleService.getRoleByRoleName('Support');
    var currentUser = {};
    if(email != undefined){
//if we received a value for email, then get the user by that email i.d
        currentUser = await userService.getUserByEmail(email);
    }
    var adminUser = {};
    if(adminRole != undefined){
//we got admin role from the role service, and admin user is taken as empty
//with the below function, we get admin user by sending admin role's id and getting user by role
        adminUser = await userService.getUserByRole(adminRole._id);
    }
    var supportUser = {};
    if(supportUser != undefined && supportRole != undefined){
//we got support role earlier by getting role by rolename function, and we have an empty support user object
//we will now get te support user by sending support role's id in get user by role function
        supportUser = await userService.getUserByRole(supportRole._id);
    }
//we create a result object with currentuser, support user, admin user, admin role, support role
    var result = {
        currentUser: currentUser,
        adminRole: adminRole,
        supportRole: supportRole,
        adminUser: adminUser,
        supportUser: supportUser
    };
    return result;
}

async function getSupportUserRole(req) {
//get the admin role
    var adminRole = await roleService.getRoleByRoleName('Administrator');
//get the support role
    var supportRole = await roleService.getRoleByRoleName('Support');
//get the support user by sending the id of the support role
    var supportUser = await userService.getUserByRole(supportRole._id);
    var result = {
        supportRole: supportRole,
        supportUser: supportUser,
        adminRole: adminRole
    };
    return result;
}

//function allows you to become another organization?
function runAsOrganization(workspaceId, func, param){
    return new Promise((resolve,reject) => {
//take the current context and store it in before context variable
        let beforeContext = JSON.parse(JSON.stringify(currentContext.getCurrentContext()));

        var context = {};
        context.workspaceId = workspaceId;
//setting the context
        currentContext.setCurrentContext(context);
        console.log("hello")
        try{
            //run function
            func(param).then((data)=>{
                resolve(data);
            }).catch((err)=>{
                reject(err);
            });   
            
        }catch(err){
            reject(err);
        }finally{
//after operation is done, you set the context as the beforecontext
            currentContext.setCurrentContext(beforeContext);
        }
    });
}

function runAsOrganization2(workspaceId, func, param){
    return new Promise((resolve,reject) => {
        var context = {};
        context.workspaceId = workspaceId;
        currentContext.setCurrentContext(context);
        try{
            func(param).then((data)=>{
                resolve(data);
            }).catch((err)=>{
                reject(err);
            });   
            
        }catch(err){
            reject(err);
        }
    });
}

module.exports = switchRoleService;

