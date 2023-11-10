const userService = require('../services/user.service');
var schema = require('../schemas/user.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var userAuthCodeService = require('../services/userAuthCode.service');
var userAuthCodeModel = require('../models/userAuthCode.model');
var emailTemplateService = require('../../common/emailTemplateService');
var uuid = require('node-uuid');
var configResolve = require("../../common/configResolver");
var mailer = require('../../common/aws_mailer');
var currentContext = require('../../common/currentContext');
const Status = require('../../common/constants/Status');
var plans = require('../../config/plans.json').plans;
var organizationService = require('../services/organization.service');
const roleService = require('../services/role.service');
const helper = require("../../common/helper");
const userDetailService = require('../services/userDetails.service');
const commonEmailTemplateService = require('../../common/emailTemplateService');


function init(router) {
  router.route('/users')
    .get(getAllUsers)
    .post(addUser);
  router.route('/users/status/:status')
    .get(getAllUsersByStatus);
  router.route('/users/count')
    .get(getAllUsersCount);
  router.route('/users/overview')
    .get(getAllUsersOverview);
  router.route('/users/invite')
    .post(inviteUsers);
  router.route('/users/inviteMail')
    .post(inviteMail);
  router.route('/users/inviteLinks')
    .get(inviteLinks);
  router.route('/users/userCountData')
    .get(userCountData);
  router.route('/users/comparePassword')
    .post(comparePassword);
  router.route('/users/changePassword')
    .post(changePassword);
  router.route('/users/changePassword')
    .post(changePassword);
  router.route('/users/logout/:id')
    .put(captureLogoutTime);
  router.route('/users/archive')
    .post(archiveUsers);
  router.route('/users/exist')
    .get(isExist);
  router.route('/users/userdetails/:id')
    .get(getUserDetailsById);
  router.route('/users/performance/:id')
    .get(getUserPerformanceById);
  router.route('/users/users-within-timeframe')
    .post(usersWithinTimeFrame)
  router.route('/users/:id')
    .get(getUserById)
    .delete(deleteUser)
    .put(updateUser);
  router.route('/users/search')
    .post(searchUsers);
  router.route('/users/search/text')
    .get(textSearch);
  router.route('/users/activity/:id')
    .get(getActivityByUserId);
  router.route('/users/role/category/:category')
    .get(getUsersByRoleCategory);
}

/**
 * Invite a user in workspace api
 * @route POST /api/users/invite
 * @group users - Operations about user
 * @param {object} userData.body.required - user details
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function inviteUsers(req, res, next) {
  logger.info("In inviteUsers route");
  var inviteUsers = req.body;
  var inviteUserPromises = [];

  let currentUser = currentContext.getCurrentContext();
  let workspaceId = currentUser.workspaceId;

  organizationService.getOrganizationByWorkspaceId(workspaceId)
    .then((organizationData) => {
      // var currentPlan;
      // //gets the exact plan that the user's worspace is on
      // plans.forEach(p => {
      //   if (p.label == organizationData.billingType) {
      //     currentPlan = p;
      //   }
      // });
      // userService.getAllUsersCount().then((userCount) => {
      //   let totalUser = userCount + inviteUsers.recipients.length;
      //   //only if total users (current + invited) are less than current plan max users,
      //   //it will invite, else it will throw error of limit exceeded
      //   if (totalUser <= currentPlan.maxUsers) {


//NEW LOGIC TO BE APPLIED - get this user's current plan from stripe, define in JSON as to how many people are allowed in each plan
//then compare and see if he is trying to invite more users than his plan allows, if so, throw error, else allow him to invite.

          processInviteUsers(inviteUsers, workspaceId, inviteUserPromises, res, next);
        // } else {
        //   next(errorMethods.sendBadRequest(errorCode.LIMIT_EXCEEDED));
        // }
      // });
    });


}

async function inviteMail(req, res, next) {
  try{
  var email = req.body.email
  logger.info("In invite emailing route");
  const workspaceURL = configResolve.getConfig().protocol + currentContext.getCurrentContext().workspaceId + "." + configResolve.getConfig().server_domain;
  var authCode = await userAuthCodeService.search({"email":email}) 
  var user = await userService.searchUsers({"email":email})
  if(user.status == "ACTIVE"){
    res.send("User has already activated their account, try using forgot password")
  }else{
  var inviteURL = workspaceURL + "/join/" + authCode[0].authCode;
  var messageBody = await emailTemplateService.getInviteUserTemplate(email, currentContext.getCurrentContext().workspaceId, inviteURL);
  var subject = "You are invited to join a "+ configResolve.getConfig().app_name +" workspace";
  let htmlTempalate = await commonEmailTemplateService.getInviteUserTemplate(currentContext.getCurrentContext().workspaceId, workspaceURL, inviteURL);
  mailer.mail(email, subject, messageBody, htmlTempalate);
  res.send("ok")
  }
}catch(err){next(errorMethods.sendServerError(err))}
}

async function inviteLinks(req, res, next) {
  try{
    var links =[];
    const workspaceURL = configResolve.getConfig().protocol + currentContext.getCurrentContext().workspaceId + "." + configResolve.getConfig().server_domain;
    var users = await userService.searchUsers({})
    for(user of users){
      if(user.status == "ACTIVE"){
        var inviteURL = "user is already ACTIVATED"
        var tempData = {"userId":user._id, "link":inviteURL}
        links.push(tempData)
      }else{
    var authCode = await userAuthCodeModel.search({"email":user.email})
    var code  = Array.isArray(authCode) && authCode.length ? authCode[0].authCode : 'user is already ACTIVATED'
    var inviteURL = workspaceURL + "/join/" + code;
    var tempData = {"userId":user._id, "link":inviteURL}
    links.push(tempData)
      }
    }
  res.send(links)
  }catch(err){next(errorMethods.sendServerError(err))}
  }


  function comparePassword(req, res, next) {
    newPass = req.body.password
    email = req.body.email
    workspace = req.body.workspace
    userService.comparePassword(newPass, email, workspace, next).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }

  async function userCountData(req, res, next) {
    try{
    var id = req.params.id;
    var rough = await userService.userCountData(id);
    res.send(rough);
    }catch{next (errorMethods.sendServerError(err))}
  }

  async function changePassword(req, res, next) {
    try{
    newPass = req.body.password
    email = req.body.email
    var userData = await userService.getUserByEmail(email)
    if (userData == undefined || userData.length == 0) {
    next(errorMethods.sendBadRequest(errorCode.USER_NOT_EXIST));
    }
    userData.password = newPass
    var updatedUser = await userService.updateUser(userData._id, userData)
      res.send(updatedUser);
    }catch(err){
      next(errorMethods.sendServerError(err));
    }
  }

// this is the process of inviting users, created as a separate function
//so as to not make the invite users api function too big
function processInviteUsers(inviteUsers, workspaceId, inviteUserPromises, res, next) {
  inviteUsers.recipients.forEach(user => {
    var promise = new Promise((resolve, reject) => {
      var userData = {
        "email": user.email,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "status": "INVITED",
        "password": "xgEjX5CLQgWFd4YV",
        "role": user.role,
        "phone": user.phone,
        "location": user.location,
        "timezone": user.timezone,
        "profileImage": user.profileImage,
        "dateOfJoining": user.dateOfJoining,
        "jobTitle": user.jobTitle,
        "targetedLeads": user.targetedLeads
      };
      //default image
      if (userData.profileImage == undefined) {
        userData.profileImage = configResolve.getConfig().defaultUserFileUrlPath;
      }
      userService.addUser(userData).then((data) => {
        var authCode = {};
        //adding fields to the autthCode object
        authCode.email = userData.email;
        authCode.type = 'invite';
        authCode.workspaceId = workspaceId;
        //creating a new authCode using uuid
        authCode.authCode = uuid.v1();
        //calling authCode service (it has model too) to create userAuthCode
        userAuthCodeService.addUserAuthCode(authCode).then((result) => {
          //need to add subdomain url.
          const workspaceURL = configResolve.getConfig().protocol + currentContext.getCurrentContext().workspaceId + "." + configResolve.getConfig().server_domain;
          var inviteURL = workspaceURL + "/join/" + authCode.authCode;
          //gets emailInvite template from emailTemplateservice by sending email, workspaceId and invitation URl
          var messageBody = emailTemplateService.getInviteUserTemplate(userData.email, currentContext.getCurrentContext().workspaceId, inviteURL);
          var subject = "You are invited to join a Dominate workspace";
          //join
          //commonEmailTemplate is same as emailTemplate but seems like it has been mentioned separately because
          //it does not accept user email, so it could be generic in nature
          let htmlTempalate = commonEmailTemplateService.getInviteUserTemplate(currentContext.getCurrentContext().workspaceId, workspaceURL, inviteURL);
          //this is the mailer service that actually sends emails
          mailer.mail(userData.email, subject, messageBody, htmlTempalate);
          resolve(true);
        });
      }).catch((err) => {
        console.error("Error: " + JSON.stringify(err));
        reject(err);
      });
    });
    //the complete promise is then pushed into the array
    inviteUserPromises.push(promise);
  });
  Promise.all(inviteUserPromises).then((response) => {
    res.json({ "success": response.success, "message": "Invitation sent!" });
  }).catch((err) => {
    if (err == errorCode.USER_ALREADY_EXIST) {
      next(errorMethods.sendBadRequest(err));
    }
    else {
      next(errorMethods.sendServerError(err));
    }
  });
}

/**
 * archiveUsers a user in workspace api
 * @route POST /api/users/archive
 * @group users - Operations about user
 * @param {object} userData.body.required - user details
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function archiveUsers(req, res, next) {
  logger.info("In archiveUsers route");
  var archiveUsers = req.body;
  userService.archiveUser(archiveUsers).then((data) => {
    res.json({ "success": true, "message": "User archived!" });
  }).catch((err) => {
    next(errorMethods.sendServerError(errorCode.INTERNAL_SERVER_ERROR));
  });
}

/**
 * Get all a user api
 * @route GET /api/users
 * @group users - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getAllUsers(req, res, next) {
  userService.getAllUser().then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get all a user api
 * @route GET /api/users/status/:status
 * @group users - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getAllUsersByStatus(req, res, next) {
  logger.info("In get all user route");
  //you have to pass status to this route and it will return 
  //employees with that status in database
  let status = req.params.status;
  let roleName = req.query.roleName;
  //it is just getting the role i.d of 'employee' from d.b
  // the others are not fetched
  getEmployeeRole(roleName).then((employeeRole) => {
    let query = {
      pageNo: 1,
      pageSize: 1000000,
      query: {
        '$and': [{
          'status': status
        }, {
          role: {
            '$eq': employeeRole._id
          }
        }
        ]
      }
    };
    console.log(query.query);
    userService.searchUsers(query).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

async function getEmployeeRole(roleName) {
  return await roleService.getRoleByRoleName(roleName);
}


/**
 * Get users by role category api
 * @route GET /api/users/role/category/:category
 * @group users - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getUsersByRoleCategory(req, res, next) {
  logger.info("In get all user by role category route");
  let category = req.params.category;
  userService.getUsersByRoleCategory(category).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get users count api
 * @route GET /api/users/count
 * @group users - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getAllUsersCount(req, res, next) {
  let key = req.query.key;
  let value = req.query.value;
  var query = {};
  if (key != undefined && value != undefined) {
    query[key] = value;
  }

  userService.getAllUsersCount(query).then((data) => {
    if (data == undefined) {
      return next(errorMethods.sendBadRequest(errorCode.TICKET_NOT_EXIST));
    }
    res.send({ 'count': data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * @typedef SearchCriteria
 * @property {string} pageSize.required
 * @property {string} pageNo.required 
 * @property {string} query.required 
 */
/**
 * Search users api
 * @route POST /api/users/search
 * @group users - Operations about user
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function searchUsers(req, res, next) {
  let searchCriteria = req.body;
  userService.searchUsers(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get users by id api
 * @route GET /api/users/:id
 * @group users - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getUserById(req, res, next) {

  let userId = req.params.id;

  var json_format = iValidator.json_schema(schema.getSchema, userId, "user");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  userService.getUserById(userId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.USER_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get users by id api
 * @route GET /api/users/userdetails/:id
 * @group users - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getUserDetailsById(req, res, next) {

  let userId = req.params.id;

  var json_format = iValidator.json_schema(schema.getSchema, userId, "user");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  userDetailService.getUserDetailsById(userId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.USER_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get users by id api
 * @route GET /api/users/performance/:id
 * @group users - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getUserPerformanceById(req, res, next) {

  let userId = req.params.id;

  var json_format = iValidator.json_schema(schema.getSchema, userId, "user");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  userDetailService.getUserPerformanceById(userId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.USER_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}




/**
 * Get actvity by usersid api
 * @route GET /api/users/:id
 * @group users - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getActivityByUserId(req, res, next) {

  let userId = req.params.id;

  var json_format = iValidator.json_schema(schema.getSchema, userId, "user");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  userService.getActivityByUserId(userId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.USER_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * add user api
 * @route POST /api/users
 * @group users - Operations about user
 * @param {object} userData.body.required - user details
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function addUser(req, res, next) {
  var userData = req.body;
  //added check for demo
  userData.demo = false;

  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, userData, "user");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  userService.addUser(userData).then((data) => {
    res.json(data);
  }).catch((err) => {
    if (err === errorCode.USER_ALREADY_EXIST) {
      return next(errorMethods.sendBadRequest(errorCode.USER_ALREADY_EXIST));
    } else {
      next(errorMethods.sendServerError(err));
    }
  });

}


/**
 * update users by id api
 * @route PUT /api/users
 * @group users - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function updateUser(req, res, next) {
  var userData = req.body;
  var id = req.params.id;
  userService.getUserById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.USER_NOT_EXIST));
    } else {
      userService.updateUser(id, userData).then((data) => {

        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}

/**
 * Delete users by id api
 * @route DELETE /api/users/:id
 * @group users - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function deleteUser(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  userService.getUserById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.USER_NOT_EXIST));
    } else {
      userService.deleteUser(delId, data).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}

/**
 * get overview of users api
 * @route GET /api/users/overview
 * @group users - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getAllUsersOverview(req, res, next) {

  userService.getAllUsersOverview().then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is user exist api
 * @route GET /api/users/exist
 * @group users - Operations about user
 * @param {string} username.query.required - user name
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next) {
  let email = req.query.email;
  var json_format = iValidator.json_schema(schema.existSchema, email, "email");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  userService.getEntityByEmail(email).then((data) => {
    if (data != undefined && data.length > 0) {
      res.json({ 'isExist': true });
    } else {
      res.json({ 'isExist': false });
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Search users api
 * @route GET /api/users/search/text
 * @group leads - Operations about users
 * @returns {object} 200 - An object of users info
 * @returns {Error}  default - Unexpected error
 */
function textSearch(req, res, next) {
  let text = req.query.text;
  let status = req.query.status;
  userService.textSearch(text, status).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

//we have a field at the user model level called logged off that allows us to capture when the 
//user logged out, so using this route, we are setting that variable at model level
function captureLogoutTime( req, res, next ){
  var user_id = req.params.id;
  userService.getUserById( user_id ).then( userData => {
    if( userData ){
      console.log( userData );
      let userUpdateData = JSON.parse(JSON.stringify( userData ) );
      userUpdateData.loggedOff = new Date();
      userService.updateUser( user_id, userUpdateData ).then( data => {
        return res.json("OK");
      })
      .catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      next(errorMethods.sendBadRequest(errorCode.USER_NOT_EXIST));
    }
  })
  .catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * API to get the users within a time frame
 * @route POST /api/users/users-within-timeframe
 * @group users - Operations about users
 * @returns {object} 200 - An object of users info
 * @returns {Error}  default - Unexpected error
 */
function usersWithinTimeFrame(req, res, next) {
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  userService.usersWithinTimeFrame(startDate, endDate).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;
