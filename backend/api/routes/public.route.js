//routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
var configResolve = require("../../common/configResolver");
var server_secert = configResolve.getConfig().server_secert;
var token_expiry = configResolve.getConfig().token_expiry;
var organizationFreeTrialPeriod = configResolve.getConfig().organizationFreeTrialPeriod;
const UserModel = require('../models/user.model');
var userService = require('../services/user.service');
var schema = require('../schemas/user.validation.schema.json');
var referralSchema = require('../schemas/referral.validation.schema.json');
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var organizationService = require('../services/organization.service');
var signUpSchema = require('../schemas/signUp.validation.schema.json')
const roleService = require('../services/role.service');
const paymentService = require('../services/payment.service');
var currentContext = require('../../common/currentContext');
var userAuthCodeService = require('../services/userAuthCode.service');
var uuid = require('node-uuid');
var emailTemplateService = require('../../common/emailTemplateService');
var mailer = require('../../common/aws_mailer');
const SubscriptionTypes = require('../../common/constants/SubscriptionTypes');
const Status = require('../../common/constants/Status');
const switchRoleService = require('../services/switchRole.service');
const ootbFeatures = require('../../config/ootbFeatures.json');
const callService = require('../services/call.service');
var bodyParser = require('body-parser');
const jwtTokenParser = require('../../common/tokenParserUtil');
var minioClient = require('../../config/minioClient').minioClient;
var environmentConfig = configResolve.getConfig();

var helper = require("../../common/helper");
const commonEmailTemplateService = require("../../common/emailTemplateService");
const emailExtractor = require('node-email-extractor').default;
var validator = require('validator');
var googleOauthServices = require('../integrations/google/auth/google.auth.integration');
var microsoftOauthServices = require('../integrations/microsoft/auth/microsoft.auth.integration');
var stripeTest = configResolve.getConfig().stripeTest;
var stripeLive = configResolve.getConfig().stripeLive;
var currentStripe = stripeLive;

var _ = require('lodash');

const referralService = require('../services/referral.service');
var iValidator = require('../../common/iValidator');


/**
 * @typedef LoginRequest
 * @property {string} email.required
 * @property {string} password.required 
 */
/**
 * Login api
 * @route POST /public/login
 * @group public - Operations about user
 * @param {LoginRequest.model} user.body.required - login details
 * @param {string} workspaceid.header.required - workspace
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
router.post('/login', function (req, res, next) {
//we set context with the workspaceid
    var context = {};
    context.workspaceId = req.headers.workspaceid;
//we are setting the current context with value of workspace i.d, this will be used in passport localstrategy function
    currentContext.setCurrentContext(context);

    switchRoleService.getAdminUserRole(req.body.email).then((userRoledata) => {
        if (userRoledata.currentUser != undefined) {
//we get the org by workspaceId
            organizationService.getOrganizationByWorkspaceId(context.workspaceId).then(async (organizationData) => {
                var currentDate = new Date();
                var tenantExpiryDate = organizationData.expirationDate;
                if (organizationData.status == Status.ACTIVE) {
//if todays date is beyond expiry date we perform the next few steps
                    if (currentDate.getTime() >= tenantExpiryDate) {
//we make the status as expired
                        organizationData.status = Status.EXPIRED;
                        organizationService.updateOrganization(organizationData._id, organizationData).then((updateData) => {
                            switchRoleService.performSwitchRole(userRoledata.adminUser, userRoledata.supportRole).then((data) => {
//if  current user is admin, then let him login
                                if (userRoledata.currentUser.role._id == userRoledata.adminRole._id) {
                                    performLogin(next, req, organizationData, res);
                                } else {
//if the user is not an admin, then just say your org is inactive
//if status was active but we were beyond expiry date, then we have to set org as expired and let admin login
                                    return next(errorMethods.sendBadRequest(errorCode.ORGANISATION_INACTIVE));
                                }
                            });
                        }).catch((err) => {
                            return next(errorMethods.sendBadRequest(errorCode.INTERNAL_SERVER_ERROR));
                        });
                    } else {
//if org has not expired, then obviously let the user perform the login
                        performLogin(next, req, organizationData, res);
                    }
                } else if (organizationData.status != Status.ACTIVE && userRoledata.supportRole != undefined && (userRoledata.currentUser.role._id == userRoledata.supportRole._id)) {
//if org is already set as expired and user role is same as support role, then let him login, but why?                    
console.log("user is",user)       
performLogin(next, req, organizationData, res);
                } else {
                    return next(errorMethods.sendBadRequest(errorCode.ORGANISATION_INACTIVE));
                }

            }).catch((err) => {
                console.log(err);
                next(errorMethods.sendServerError(err));
            });
        } else {
            return next(errorMethods.sendBadRequest(errorCode.LOGIN_FAILED));
        }

    });
});


/**
 * @typedef SignupRequest
 * @property {string} workspaceId.required
 * @property {string} organizationName.required 
 * @property {string} billingType.required
 * @property {string} defaultUserEmailId.required
 * @property {string} defaultUserPassword.required 
 */
/**
 * Signup api
 * @route POST /public/signup
 * @group public - Operations about user
 * @param {SignupRequest.model} user.body.required - signup details
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
//when the signup api is called, we add an org which in turn adds default user to d.b which in turn adds default roles to d.b
router.post('/signup', function (req, res, next) {
//get signupdata from the request's body
    var signUpData = req.body;

    //validate the signUp request
    var json_format = iValidator.json_schema(signUpSchema.postSchema, signUpData, "signUp");
    if (json_format.valid == false) {
//checks for the validation format and send error if not valid
        return res.status(422).send(json_format.errorMessage);
    }
//next task is to look for the org if it exists in d.b, if it exists, then you cannot signup as the admin
    organizationService.getOrganizationByWorkspaceId2(signUpData.workspaceId).then((data) => {
//sending an error that org already exists. other members of the org can be invited and just login, only admin signs up
        if (data != undefined) {
            return next(errorMethods.sendBadRequest(errorCode.ORGANIZATION_ALREADY_EXIST));
        } else {
//if org doesn't exist, then add the org, when creating org, you are also creating the user!
            organizationService.addOrganization(signUpData).then((data) => {
                res.json(data);
            }).catch((err) => {
                next(errorMethods.sendServerError(err));
            });
        }
    }).catch((err) => {
        next(errorMethods.sendServerError(err));
    });
});



/**
 * Workspace exist api
 * @route GET /public/workspace/exist
 * @group public - Operations about workspace
 * @param {string} workspaceId.query.required - workspace details
 * @returns {object} 200 - An object of workspace info
 * @returns {Error}  default - Unexpected error
 */
//api just checks if an org exists - in front end, for signup validation, this is being called
router.get('/workspace/exist', function (req, res, next) {

    var workspaceId = req.query.workspaceId;
    organizationService.isOrganizationExist(workspaceId).then((data) => {
        res.json({ "exist": data });
    }).catch((err) => {
        next(errorMethods.sendServerError(err));
    });
});

/**
 * Plan api
 * @route GET /public/plans
 * @group public - Operations about plan
 * @returns {object} 200 - An object of workspace info
 * @returns {Error}  default - Unexpected error
 */
//this is a public api because we were supposed to show plans to users when they were signingup itself
router.post('/plans', async function (req, res, next) {
    //COMMENTED FOR STRIPE
//     if (plans != undefined) {
//         var result = {
//             plans: []
//         };
//         plans.plans.forEach(p => {
// //don't send colony in the plans because users cannot select this plan on their own, 
// //only dominate super admin can onboard them
//             if (p.label != 'COLONY') {
//                 result.plans.push(p);
//             }
let currency = req.body.currency
let productData =[], temp={}
data = await stripeService.getAllPlans()
        
            products = data.data
            for(i in products){
                price = await stripeService.getPriceWithProductId(products[i].id, currency)
                if(Array.isArray(price.data) && (price.data).length){
                    for(value of price.data){
                        if (value.active == true)
                        { 
                        priceData = value
                        } 
                    }
                }
                temp = {...products[i], priceData:price}
                productData.push(temp)
            }
            res.json(productData)
        
        
    //     res.json(result);
    // } else {
    //     next(errorMethods.sendServerError(errorCode.INTERNAL_SERVER_ERROR));
    // }
});

router.post('/tierplans', async function (req, res, next) {
    try{
    let reqcurrency = req.body.currency
        
        var planData =  _.find(tierPrices.tierPrices, { currency:reqcurrency })
    console.log(planData)
                res.json(planData)
    }catch(err){reject(err)}
    });

/**
 * ForgotPassword api
 * @route GET /public/forgotPassword
 * @group public - Operations about user
 * @param {string} email.query.required - email details
 * @param {string} workspaceid.header.required - workspace
 * @returns {object} 200 - An object of workspace info
 * @returns {Error}  default - Unexpected error
 */
//authcodes exist for small period of time only till the time password is reset. basically when a user
//fogets their password, authcode is generated
router.get('/forgotPassword', function (req, res, next) {
    var email = req.query.email;
    if (email == undefined) {
//for forgot password, email is obviously required
        return res.status(422).send("EmailId is missing!");
    }
    var context = {};
//since password has been forgotten, we are setting context of user but workspaceId needs to be passed in headers
    context.workspaceId = req.headers.workspaceid;
    context.email = email;
    currentContext.setCurrentContext(context);
//we create the authcode object where type is resetPassword, it can be used for other purposes as well
    var authCode = {};
    authCode.email = email;
    authCode.type = 'resetPassword';
    authCode.authCode = uuid.v1();
    console.log(authCode.authCode);
    userAuthCodeService.addUserAuthCode(authCode).then((result) => {
//we form the workspace URL here by concatenating protocol (https etc.) and workspaceId that we'll get from context and the server_domain which is dominate.ai 
        const workspaceURL = configResolve.getConfig().protocol + currentContext.getCurrentContext().workspaceId + "." + configResolve.getConfig().server_domain;
//then we create the forgotUrl which will be the link behind the button sent in email        
        var forgotURL = workspaceURL + "/resetPassword/" + authCode.authCode;
//in Etemplateservice, we have a template for forgotpassword, we pass email i.d, workspace Id and the forgoturl we just created above and send
        var messageBody = emailTemplateService.getForgotPasswordTemplate(email, currentContext.getCurrentContext().workspaceId, forgotURL);
        var subject = "Forgot your Dominate Ai password?";
        //forget pass
        let htmlTempalate = commonEmailTemplateService.getForgotPasswordTemplate(currentContext.getCurrentContext().workspaceId, workspaceURL, forgotURL);
        res.json({ "success": true, "message": "Reset password link sent on your email!" });
//send email using mailer service and depending on that success or failure
        mailer.mail(email, subject, messageBody, htmlTempalate).then((emailResult) => {
           
            res.json({ "success": true, "message": "Reset password link sent on your email!" });
        }).catch((err) => {
            res.json({ "success": true });
        });
    });
});

/**
 * Verify Email API
 * @route GET /public/verifyEmail
 * @group public - Operations about user
 * @param {string} email.query.required - email details
 * @param {string} workspaceid.header.required - workspace
 * @returns {object} 200 - An object of workspace info
 * @returns {Error}  default - Unexpected error
 */

router.get('/verifyemail', function (req, res, next) {
    var email = req.query.email;
    if (email == undefined) {
        return res.status(422).send("EmailId is missing!");
    }
    var context = {};
    context.workspaceId = req.headers.workspaceid;
    context.email = email;
    currentContext.setCurrentContext(context);
    var authCode = {};
    authCode.email = email;
    authCode.type = 'verifyEmail';
    authCode.authCode = uuid.v1();
    console.log(authCode.authCode);
    userAuthCodeService.addUserAuthCode(authCode).then((result) => {
        const workspaceURL = configResolve.getConfig().protocol + currentContext.getCurrentContext().workspaceId + "." + configResolve.getConfig().server_domain;      
        var forgotURL = workspaceURL + "/verifyEmail/" + authCode.authCode;
        var messageBody = emailTemplateService.getVerifyEmailTemplate(email, currentContext.getCurrentContext().workspaceId, forgotURL);
        var subject = "Dominate Ai - Verify Your Email I.D";
        //forget pass
        let htmlTempalate = commonEmailTemplateService.getVerifyEmailTemplate(currentContext.getCurrentContext().workspaceId, workspaceURL, forgotURL);
        res.json({ "success": true, "message": "Email Verification Link Sent To Your Email!" });
//send email using mailer service and depending on that success or failure
        mailer.mail(email, subject, messageBody, htmlTempalate).then((emailResult) => {
           
            res.json({ "success": true, "message": "Email Verification Link Sent To Your Email!" });
        }).catch((err) => {
            res.json({ "success": true });
        });
    });
});

/**
 * Authcode verify api
 * @route GET /public/authCode/verify
 * @group public - Operations about user
 * @param {string} authCode.query.required - authcode details
 * @param {string} workspaceid.header.required - workspace
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
//authcode is created and sent to the user and also saved at the db level and then user uses this
//verify api to verify the authcode wherein we check from d.b if the i.d sent to this api is the same
//as the authcode's api and if data is defined and not null, we say it's a success
//basically checking if authcode entered by user is correct and exists in d.b and accordingly let the user
//set his new password. in front end, we won't show him popup to set new password if this verification fails
router.get('/authCode/verify', function (req, res, next) {
    var authCode = req.query.authCode;
    var context = {};
    context.workspaceId = req.headers.workspaceid;
    currentContext.setCurrentContext(context);
    console.log("authcode: " + authCode);
    userAuthCodeService.getUserAuthCodeById(authCode).then((result) => {
        console.log("Data: " + JSON.stringify(result));
        if (result == undefined || result == null) {
            res.json({ "success": false });
        } else {
            res.json({ "success": true, "workspaceId": result.workspaceId, "email": result.email });
        }

    }).catch((err) => {
        console.log(err);
        res.json({ "success": false });
    });
});


/**
 * Update new user (Password) in workspace api
 * @route PATCH /public/users
 * @group public - Operations about user
 * @param {object} userData.query.required - user details
 * @param {string} workspaceid.header.required - workspace
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
//PATCH keeps all details same but changes one particular detail like password of the user in this case is reset
//this api uses the authcode to set new password. once the work of authcode is done, it's delete from d.b
router.patch('/users', function (req, res, next) {
    var userData = req.body;
    var authCode = req.query.authCode;
    var context = {};
    context.workspaceId = req.headers.workspaceid;
    currentContext.setCurrentContext(context);
    userAuthCodeService.getUserAuthCodeById(authCode).then((result) => {
        if (result == undefined || result == null) {
            next(errorMethods.sendBadRequest(errorCode.NOT_FOUND));
        } else {
            context.email = result.email;
            currentContext.setCurrentContext(context);

            userService.getUserByEmail(result.email).then((data) => {
                if (data == undefined || data.length == 0) {
                    return next(errorMethods.sendBadRequest(errorCode.USER_NOT_EXIST));
                } else {
                    data.password = userData.password;
                    data.status = Status.ACTIVE;
                    userService.updateUser(data._id, data).then((result) => {
                        userAuthCodeService.deleteUserAuthCode(authCode).then((authCodeDeleted) => {
                            res.json({ "success": true, "message": "Password reset Successfully!" });
                        }).catch((err) => {
                            next(errorMethods.sendServerError(err));
                        });
                    }).catch((err) => {
                        next(errorMethods.sendServerError(err));
                    });
                }
            });
        }
    }).catch((err) => {
        console.log(err);
        res.json({ "success": false });
    });

});

/**
 * Update new user (Flag) in workspace api
 * @route PATCH /public/users/verifyEmail
 * @group public - Operations about user
 * @param {object} userData.query.required - user details
 * @param {string} workspaceid.header.required - workspace
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */

router.patch('/users/verifyemail', function (req, res, next) {
    var userData = req.body;
    var authCode = req.query.authCode;
    var context = {};
    context.workspaceId = req.headers.workspaceid;
    currentContext.setCurrentContext(context);
    userAuthCodeService.getUserAuthCodeById(authCode).then((result) => {
        if (result == undefined || result == null) {
            next(errorMethods.sendBadRequest(errorCode.NOT_FOUND));
        } else {
            context.email = result.email;
            currentContext.setCurrentContext(context);

            userService.getUserByEmail(result.email).then((data) => {
                if (data == undefined || data.length == 0) {
                    return next(errorMethods.sendBadRequest(errorCode.USER_NOT_EXIST));
                } else {
                    data.verified = true;
                    data.password = undefined;
                    data.status = Status.ACTIVE;
                    userService.updateUser(data._id, data).then((result) => {
                        userAuthCodeService.deleteUserAuthCode(authCode).then((authCodeDeleted) => {
                            res.json({ "success": true, "message": "User Email Has Been Verified!" });
                        }).catch((err) => {
                            next(errorMethods.sendServerError(err));
                        });
                    }).catch((err) => {
                        next(errorMethods.sendServerError(err));
                    });
                }
            });
        }
    }).catch((err) => {
        console.log(err);
        res.json({ "success": false });
    });

});

/**
 * update call record in workspace api
 * @route POST /public/statusCallback/:workspaceId/:authCode
 * @group public - Operations about user
 * @param {object} userData.query.required - user details
 * @param {string} workspaceid.header.required - workspace
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
//this is a public api for placing a call through dominate
router.post('/statusCallback/:workspaceId/:authCode', function (req, res, next) {
    let authCode = req.params.authCode;
    let workspaceId = req.params.workspaceId;
    let callData = req.body;

    var context = {};
    context.workspaceId = workspaceId;
    currentContext.setCurrentContext(context);
    userAuthCodeService.getUserAuthCodeById(authCode).then((result) => {
        if (result == undefined || result == null) {
            next(errorMethods.sendBadRequest(errorCode.NOT_FOUND));
        } else {
            context.email = result.email;
            currentContext.setCurrentContext(context);
            callService.getCallBySid(callData.CallSid).then((callResult) => {
                var call = callResult;
                call.status = callData.Status.replace("-", "_").toUpperCase();
                call.startTime = callData.StartTime;
                call.endTime = callData.EndTime;
                call.callDuration = callData.ConversationDuration;
                call.recordingUrl = callData.RecordingUrl;
                call.data = callData;

                callService.updateCall(call._id, call).then((data) => {
                    res.json({ "success": true });
                }).catch((err) => {
                    console.log(err);
                    res.json({ "success": false });
                })
            }).catch((err) => {
                console.log(err);
                res.json({ "success": false });
            });
        }
    }).catch((err) => {
        console.log(err);
        res.json({ "success": false });
    });

});

/**
 * Get refresh token
 * @route GET s
 * @group entityConstant - Operations about refresh token
 * @returns {object} 200 - An object of refresh token info
 * @returns {Error}  default - Unexpected error
 */
//front end calls this api to get the refresh token and then front end uses the refresh token in every subsequent api call. 
//this function is logging in the user by using the refresh token and this api is called every few minutes in the front end.
router.post('/token/refresh', function (req, res, next) {
    let tokenRequest = req.body;
//we need to pass body in the api, if the body is undefined or if refresh_token variable is undefined,
//it will say missing token
    if (tokenRequest != undefined && tokenRequest.refresh_token == undefined) {
        return res.status(422).send("Missing access token");
    }
//if it exists, then it will decode the token using jwt
    const decoded = jwtTokenParser.parseToken(tokenRequest.refresh_token);
//we will then get the org by workspace id by getting workspace id from the user variable in decoded token
    organizationService.getOrganizationByWorkspaceId(decoded.user.workspaceId).then((organizationData) => {
//taking todays date in currentDate variable and org's expiry date in tenantExpiry variable
        var currentDate = new Date();
        var tenantExpiryDate = organizationData.expirationDate;
//checking if status of org is active
        if (organizationData.status == Status.ACTIVE) {
//if today's date is more than the tenant expiry date
            if (currentDate.getTime() >= tenantExpiryDate) {
//if today's date is beyond expiry, set orrg status to expired
                organizationData.status = Status.EXPIRED;
//also update the org with expired status
                organizationService.updateOrganization(organizationData._id, organizationData).then((updateData) => {
                    return next(errorMethods.sendBadRequest(errorCode.ORGANISATION_INACTIVE));
                }).catch((err) => {
                    return next(errorMethods.sendBadRequest(errorCode.INTERNAL_SERVER_ERROR));
                });
            } else {
//if all is ok, then just simply send new refresh token by calling this function defined below
                return prepareRefreshToken(decoded.user, res);
            }
        } else {
            return next(errorMethods.sendBadRequest(errorCode.ORGANISATION_INACTIVE));
        }
    });


});
//this function is supposed to generate a new refresh token
function prepareRefreshToken(user, res) {
//we need to create a jwtClaims object
    const jwtClaims = {
//we get the user object in this function so get these details from there
        user: user,
        sub: user._id,
//the value of iss is dominate.ai
        iss: configResolve.getConfig().iss,
//value of aud is dominateadmin@dominate.ai        
        aud: configResolve.getConfig().aud
    };
//we create an object for refresh token
    const refresh_token_jwt_Claims = {
        type: "REFRESH",
        iss: configResolve.getConfig().iss,
        user: user
    };
//using the jwt.sign function you create token and refresh token
//token expiry and refresh token expiry should both be ideally set to 1 hour, server_secert has the value "dev" or "prod"
    const token = jwt.sign(jwtClaims, server_secert, { expiresIn: token_expiry });
    const refresh_token = jwt.sign(refresh_token_jwt_Claims, server_secert, { expiresIn: configResolve.getConfig().refresh_token_expiry });
//we are creating the response object that will have token, refresh_token and expiresOn value
    var rs = {};
    rs.token = token;
    rs.token_type = 'Bearer';
    rs.refresh_token = refresh_token;
    var expiresOn = new Date().getTime() + token_expiry * 1000;
    rs.tokenExpiresOn = expiresOn;
    return res.json(rs);
}

function performLogin(next, req, organizationData, res) {
    passport.authenticate('local', (err, user, info) => {
        if (err || !user) {
            //logger.error("Error:" + JSON.stringify(info));
            console.log(user);
            return next(errorMethods.sendBadRequest(errorCode.LOGIN_FAILED));
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
//we are creating this body object to be sent to jwtclaims
            const body = { _id: user._id, email: user.email, workspaceId: user.workspaceId };
//create the jwtclaims object and the refresh_token object
            const jwtClaims = {
                user: body,
                sub: "System_Token",
                iss: configResolve.getConfig().iss,
                aud: configResolve.getConfig().aud
            };
            const refresh_token_jwt_Claims = {
                type: "REFRESH",
                iss: configResolve.getConfig().iss,
                user: body

            }
//token and refresh_token can be got by calling the jwt.sign function
            const token = jwt.sign(jwtClaims, server_secert, { expiresIn: configResolve.getConfig().token_expiry });
            const refresh_token = jwt.sign(refresh_token_jwt_Claims, server_secert, { expiresIn: configResolve.getConfig().refresh_token_expiry });
//below we're creating the complete response object to send to the user
            var rs = {};
            rs.id = user._id;
            rs.email = user.email;
            rs.phone = user.phone;
            rs.location = user.location;
            rs.firstName = user.firstName;
            rs.lastName = user.lastName;
            rs.name = user.name;
            rs.userStatus = user.status;
            rs.status = organizationData.status;
            rs.timezone = user.timezone;
            rs.token = token;
            rs.role = user.role;
            rs.jobTitle = user.jobTitle;
            rs.profileImage = helper.resolveImagePath(user.profileImage, user.workspaceId);
            rs.workspaceId = user.workspaceId;
            rs.organizationId = organizationData._id;
            rs.token_type = 'Bearer';
            rs.refresh_token = refresh_token;
            // rs.billingType = organizationData.billingType;
            // rs.subscriptionType = organizationData.subscriptionType;
            rs.productId = organizationData.productId;
            rs.customerId = organizationData.customerId;
            rs.tokenExpiresInSec = token_expiry;
            rs.tenantExpiryDate = organizationData.expirationDate;
            rs.refreshTokenExpiresInSec = configResolve.getConfig().refresh_token_expiry;
            var expiresOn = new Date().getTime() + token_expiry * 1000;
            rs.tokenExpiresOn = expiresOn;
            rs.verified = user.verified;
            if (user.demo == undefined) {
                user.demo = false;
            }
            rs.demo = user.demo;
            //console.log(user);
            return res.json(rs);
        });
    })(req, res, next);
}


/**
 * features
 * @route GET /public/features
 * @group public - Operations about features
 * @returns {object} 200 - An object of workspace info
 * @returns {Error}  default - Unexpected error
 */
//api gets the list of features from ootb features json object
router.get('/features', function (req, res, next) {

    if (ootbFeatures != undefined) {
        ootbFeatures.features.forEach(feature => {
            delete feature.permissions;
        });
        res.json(ootbFeatures);
    } else {
        next(errorMethods.sendServerError(errorCode.INTERNAL_SERVER_ERROR));
    }
});

//Public API for creating a referral usage when a user is signing up.

router.post('/createReferral', async function (req, res, next) {
try{
    var referralData = req.body;
  var json_format = iValidator.json_schema(referralSchema.postSchema, referralData, "referral");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
    var checkData = await referralService.searchReferrals({"query":{"toID":referralData.toID}})
    if (checkData != undefined && checkData.length > 0) {
        return next(errorMethods.sendBadRequest(errorCode.REFERRAL_TO_ID_NEEDS_TO_BE_UNIQUE));
       } else {
    var data = await referralService.searchReferrals({"query":{"toEmail":referralData.toEmail}})
    
    if (data != undefined && data.length > 0) {
      return next(errorMethods.sendBadRequest(errorCode.REFERRAL_ALREADY_USED_BY_USER));
     } else {
         refData = await referralService.addReferral(referralData)
         res.json(refData)
     }
    } 
    }catch{ next(errorMethods.sendServerError(err));}
  })


  router.post('/publicReferralSearch', async function (req, res, next) {
try{
    var data = await referralService.searchReferrals(req.body);
    res.json(data)
}catch{next(errorMethods.sendServerError(errorCode.INTERNAL_SERVER_ERROR));}
});

/**
     * download api
     * @route GET /public/download
     * @group public - Operations about download
     * @returns {object} 200 - An object of download details info
     * @returns {Error}  default - Unexpected error
     */
//uses minio bucket and enables you to download files from minio basically
router.get("/download", function (request, response) {
    var token = request.query.token;
    try {
        var decoded = jwt.verify(token, server_secert);
        if (decoded != undefined) {
            minioClient.getObject(environmentConfig.fileServerRootBucket, request.query.filename, function (error, stream) {
                if (error) {
                    console.error("Error while fetching file: " + error);
                    return response.status(400).json({ 'message': 'Invalid file', 'success': false });
                }
                stream.pipe(response);
            });
        } else {
            console.error("Error while fetching file: ");
            return response.status(400).json({ 'message': 'Invalid file', 'success': false });
        }
    } catch (err) {
        console.error("Error while fetching file: " + err);
        return response.status(400).json({ 'message': 'Invalid file', 'success': false });
    }
});

//this is the webhooks razorpay api, it's in public because we're expecting razorpay to hit this
//to send us subscription and payment related info, after the event is received bby us, we call the
//even processing function in razorpayservice.
router.post('/webhooks/razorpay', async (req, res, next) => {
    const eventBody = req.body;
    const eventSignature = req.headers["x-razorpay-signature"];
    let valid;
    try{
        razorPayService.initiateEventProcessing( eventBody, eventSignature );
        return res.status(200).json("OK");
    } catch ( err ){
        return res.status(200).json("OK");
    }
});

//bodyParser.raw({type: '*/*'})
//bodyParser.raw({type: 'application/json'})
router.post('/stripe-webhooks', bodyParser.raw({type: 'application/json'}), (req, res) => {
    const eventSignature = req.headers['stripe-signature'];
    const eventBody = req.body;
    console.log(eventBody);
    let stripeEvent;
    try{
        stripeEvent = stripe.webhooks.constructEvent(eventBody, eventSignature, currentStripe.webhook_secret);
       
    }catch ( err ){
        console.log(err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
        stripeService.processEvent(stripeEvent, eventSignature)
        console.log(stripeEvent);
        return res.status(200).json("OK");
  
})

// //OLD CODE
// router.post('/webhooks/razorpay', async (req, res, next) => {
//     const eventBody = req.body;
//     const eventSignature = req.headers["x-razorpay-signature"];
//     let valid;
//     try {
//         valid = await razorPayWebhookManager.validateEvent(eventBody, eventSignature);
//     } catch (error) {
//         console.error("{ 'message': 'Validate API failed' }");
//         return res.status(500).json({ 'message': 'Validate API failed' });
//     }

//     if (!valid) {
//         console.error("{ 'message': 'Failed to validate event' }");
//         return res.status(401).json({ 'message': 'Failed to validate event' });
//     }
//     try {
//         await razorPayWebhookManager.save(eventBody);
//         razorPayWebhookManager.manage(eventBody);
//         console.log("{ 'message': 'Event Accepted' }");
//         return res.status(202).json({ 'message': 'Event Accepted' });
//     } catch (error) {
//         console.error({ 'message': 'Failed to save event' });
//         return res.status(500).json({ 'message': 'Failed to save event' });
//     }
// });

//this api to do with email app, so not relevant anymore
router.post('/email/mini/app', async ( req, res, next ) => {
    try{
        let url = req.body.url;
        console.log( url );
        if( url ){
            var data = await emailExtractor.url(url);
            let valid_email = data.emails.filter( email => ( validator.isEmail( email ) && ( email.split(".")[1] !== "png") ));
             data.emails =  valid_email;
            return res.json( data );
        } else {
            return res.json( 400 ).json({ message:"You need to provide a valid url"});
        }
    } catch ( err ){
        return res.status( 500 ).json({ message : "Failed to search", err : err });
    }
});

//api for google and microsoft - not required anymore
/**
 * POST THE CODE FOR AUTHORISATION
 * @route POST /connect/authorise
 **/
router.post(`/connect/authorise`, async ( req, res, next ) => {
    try{
        let operator = req.query.id;
        body = req.body;
        if( operator === "GOOGLE" ){
            let response = await googleOauthServices.generateAuthenticationTokens( body );
            return res.json("OK");
        } else if ( operator === "MICROSOFT" ){
            let response = await microsoftOauthServices.generateAuthenticationTokens( body );
            return res.json("OK");
        } else {
            return next(errorMethods.sendBadRequest(errorCode.INVALID_EMAIL_OPERATOR))
        }
    } catch ( err ){
        return res.status(500).json(err);
        // next(errorMethods.sendServerError(err));
    }
});

//CHECK WORKSPACE API

router.post(`/organizations/checkWorkspaceUser`, async ( req, res, next ) => {
    try{
        workspaceId = req.body.workspaceId;
        email = req.body.email;
        console.log('reached here')
          organizationService.checkWorkspaceUser(workspaceId, email).then((data) => {
            res.send(data);
          }).catch((err) => {
            next(errorMethods.sendServerError(err));
          });
    } catch ( err ){
        return res.status(500).json(err);
    }
});

module.exports = router;


///two ways to create a free plan -
//1. create just an internal plan that doesn't sync with razorpay, just like colony
//2. create a plan at razorpay and make it priced at 0 rupees - but that will keep sending invoices to user

//two ways for confirming email before allowing user
//1. first is to use a flag in the backend that will be false before and will then be true once user confirms his email
//2. more elegant way is to use the already existing concept of authcode and using a new type called "email verify" as we 
//already have a "resetPass" type for authcode and using this we can verify the authcode and also delete it from d.b when work is done
