var organizationModel = require("../models/organization.model");
const uuidv1 = require('uuid/v1');
const roleService = require('../services/role.service');
var userService = require('../services/user.service');
var widgetService = require('../services/widget.service');
var pipelineService = require('../services/pipeline.service');
var currentContext = require('../../common/currentContext');
var Status = require('../../common/constants/Status');
var PlanStatus = require('../../common/constants/PlanStatus');
var OrganizationTypes = require('../../common/constants/OrganizationTypes');
const SubscriptionTypes = require('../../common/constants/SubscriptionTypes');
var usersModel = require("../models/user.model");
var leadsModel = require("../models/lead.model");
var customerModel = require("../models/customer.model");
var quotationModel = require("../models/quotation.model");
var configResolve = require("../../common/configResolver");
var organizationFreeTrialPeriod = configResolve.getConfig().organizationFreeTrialPeriod;
var defaultOrganizationFileUrlPath = configResolve.getConfig().defaultOrganizationFileUrlPath;
var server_domain = configResolve.getConfig().server_domain;
var trial_period = configResolve.getConfig().organizationFreeTrialPeriod;
var default_price_id = configResolve.getConfig().defaultPriceId;
var defaultPrices = require('../../config/defaultPrices.json');
var dealPipelines = require('../../config/defaultDealPipelines.json');
var leadPipeline = require('../../config/defaultLeadPipeline.json');
var leadPipelineService = require('../services/leadPipeline.service');
//test mode so test default prices, remove when going to production
//var defaultPrices = require('../../config/testdefaultPrices.json');
var mailer = require('../../common/aws_mailer');
var switchRoleService = require('../services/switchRole.service');
const helper = require("../../common/helper");
const uuidv4 = require('uuid/v4');
const commonEmailTemplateService = require('../../common/emailTemplateService');
const { pipeline } = require("stream");


var organizationService = {
    getAllOrganizations: getAllOrganizations,
    getOrganizationById: getOrganizationById,
    addOrganization: addOrganization,
    simplyAddOrganization: simplyAddOrganization,
    updateOrganization: updateOrganization,
    deleteOrganization: deleteOrganization,
    getOrganizationByWorkspaceId: getOrganizationByWorkspaceId,
    getOrganizationByWorkspaceId2: getOrganizationByWorkspaceId2,
    isOrganizationExist: isOrganizationExist,
    getOrganizationsByPage: getOrganizationsByPage,
    getAllOrganizationsCount: getAllOrganizationsCount,
    getOrganizationsByPageWithSort: getOrganizationsByPageWithSort,
    getAllOrganisationsOverview: getAllOrganisationsOverview,
    getPaidOrganizationsCount: getPaidOrganizationsCount,
    getFreeOrganizationsCount: getFreeOrganizationsCount,
    getActiveOrganizationsCount: getActiveOrganizationsCount,
    getExpiredOrganizationsCount: getExpiredOrganizationsCount,
    getPendingApprovalForRefundOrganisationCount:getPendingApprovalForRefundOrganisationCount,
    searchOrganizations: searchOrganizations,
    getOrganizationUsers: getOrganizationUsers,
    getOrganizationUsersOverview: getOrganizationUsersOverview,
    generateManualPaymentRetry:generateManualPaymentRetry,
    getPaymentManualRetryRequestWithPagination:getPaymentManualRetryRequestWithPagination,
    getPaymentManualRetryRequestCount:getPaymentManualRetryRequestCount,
    updateManualPaymentRetryStatus:updateManualPaymentRetryStatus,
    checkWorkspaceUser: checkWorkspaceUser
}
 
function addOrganization(organizationData) {
    return new Promise(async(resolve, reject) => {
//when you add an org, you do three things, you setOrgData and create the org, you create default widgets and you create a default user
        // organizationData = setOrganizationData(organizationData);
        // organizationModel.create(organizationData).then((data) => {
        //     createDefaultWidgets(organizationData, resolve, reject);
        //     createDefaultUser(organizationData, resolve, reject);
        // }).catch((err) => {
        //     reject(err);
        // const stripeCustomerData = setStripeCustomerCreateData(organizationData);
        // //have to call a function here that gets us the default price id for the currency and passes it in set subs data function
        // stripeServices.createCustomer(stripeCustomerData)
        // .then((customer)=>{
        // const freeSubscriptionData = setStripeSubscriptionData(customer.id)
        //     stripeServices.createSubscription(freeSubscriptionData).then((subscription)=>{
        //     organizationData = setOrganizationData(organizationData,customer,subscription);
        //     organizationModel.create(organizationData).then((data) => {
        //         createDefaultWidgets(organizationData, resolve, reject);
              
        //         createDefaultUser(organizationData, resolve, reject);
        //     }).catch((err) => {
        //         reject(err);
        //     });
        // }).catch((err) => {
        //     reject(err);
        // });
        //  })
        // .catch(err => reject(err));
        try{
        // const stripeCustomerData = setStripeCustomerCreateData(organizationData);
        // customer = await stripeServices.createCustomer(stripeCustomerData)
        // prices = defaultPrices.defaultPrices

        var testPipes = await pipelineService.getAllPipelines();
        if(Array.isArray(testPipes) && testPipes.length){

        }else{
            var dealPipes = await dealPipelines.defaultPipelines
            for(dealpipe of dealPipes){
                var pipelineData={
                    "name":dealpipe.name,
                    "createdBy":organizationData.defaultUserEmailId,
                    "lastModifiedBy":organizationData.defaultUserEmailId
                }
                await pipelineService.addPipeline2(pipelineData, organizationData.workspaceId)
            }
            await leadPipelineService.addLeadPipeline2(leadPipeline.defaultPipeline, organizationData);
        }

        
        // for(i in prices){
        //     if(prices[i].currency == organizationData.defaultUserCurrency){
        //         defaultPrice = prices[i].priceId
        //         break;
        //     }
        //     else{defaultPrice = default_price_id}
        // }
        
        // const freeSubscriptionData = setStripeSubscriptionData(customer.id, defaultPrice)
        // subscription = await stripeServices.createSubscription(freeSubscriptionData)
        // organizationData = setOrganizationData(organizationData);
        // data = await organizationModel.create(organizationData)
        // console.log("data is", data);
        //createDefaultWidgets(organizationData, resolve, reject);
        createDefaultUser(organizationData, resolve, reject);
        }catch(err){reject(err);}
    })
}

function simplyAddOrganization(organizationData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        console.log("reached here")
        organizationData.createdBy = user.email;
        organizationData.lastModifiedBy = user.email;
        organizationModel.create(organizationData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}


function updateOrganization(id, organizationData, callback) {
    return new Promise((resolve, reject) => {
        if(organizationData.logo != undefined){
            organizationData.logo = helper.getPathFromImage(organizationData.logo, organizationData.workspaceId);
        }
        organizationModel.updateById(id, organizationData).then((data) => {
            let result = data;
            if(result != undefined){
                result.logo = helper.resolveImagePath(data.logo, data.workspaceId);
            }
            stripeServices.getCustomerObject(data.customerId).then((customer) => {
                response = {...result._doc, currency: customer.currency}
                resolve(response);
            })
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteOrganization(id) {
    return new Promise((resolve, reject) => {
        organizationModel.deletebyId(id).then((data) => {

            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllOrganizations() {
    return new Promise((resolve, reject) => {
        organizationModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllOrganizationsCount() {
    return new Promise((resolve, reject) => {
        organizationModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getOrganizationsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        organizationModel.getPaginatedResult({}, options).then((data) => {
            let promises = [];
            let results = [];
            for(let org of data){
                promises.push(switchRoleService.runAsOrganization(org.workspaceId, userService.getAllUsersCount));
            }

            Promise.all(promises).then((result)=>{
                for(let i = 0; i < data.length; i++){
                    let organisation = JSON.parse(JSON.stringify(data[i]));
                    organisation.userCount = result[i];
                    results.push(organisation);
                }
                resolve(results);
            });
            
        }).catch((err) => {
            reject(err);
        })
    });
}

function getOrganizationsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        organizationModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getOrganizationById(id) {
    return new Promise((resolve, reject) => {
        organizationModel.getById(id).then((data) => {
            let result = data;
            if(result != undefined){
                result.logo = helper.resolveImagePath(data.logo, data.workspaceId);
            }
            resolve(result);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getOrganizationUsers(id, userStatus) {
    return new Promise((resolve, reject) => {
        organizationModel.getById(id).then((data) => {
            switchRoleService.runAsOrganization(data.workspaceId, userService.getAllUser)
            .then((userData)=>{
                if(userStatus != undefined){
                    userData = userData.filter(value=>{return value.status == userStatus});
                }
                resolve(userData);
            }).catch((err)=>{
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        })
    });
}

function checkWorkspaceUser(workspaceId, email){
    return new Promise(async(resolve, reject)=>{
        try{
        var userData = await switchRoleService.runAsOrganization2(workspaceId, userService.getUsersSimply)
        var flag = false
        if(Array.isArray(userData) && userData.length){
        for (i in userData){
        if(userData[i].email == email){
            flag = true
            }
        }
    }
    resolve(flag)
    }catch(err){reject(err)}
    })
}


function getOrganizationByWorkspaceId(workspaceId) {
    return new Promise((resolve, reject) => {
        organizationModel.searchOne({ 'workspaceId': workspaceId }).then((data) => {
            let result = data;
            if(result != undefined){
                result.logo = helper.resolveImagePath(data.logo, data.workspaceId);
            }
            // stripeServices.getCustomerObject(data.customerId).then((customer) => {
            //     response = {...result._doc, currency: customer.currency}
            //     resolve(response);

            // }).catch((err) => {
            //     reject(err);
            // })
            
        }).catch((err) => {
            reject(err);
        })
    });
}

function getOrganizationByWorkspaceId2(workspaceId) {
    return new Promise((resolve, reject) => {
        organizationModel.searchOne({ 'workspaceId': workspaceId }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function isOrganizationExist(workspaceId) {
    return new Promise((resolve, reject) => {
        getOrganizationByWorkspaceId2(workspaceId).then((data) => {
            if (data)
                resolve(true);
            else
                resolve(false);
        }).catch((err) => {
            reject(err);
        })
    });
}
function getOrganizationUsersOverview(id){
    return new Promise((resolve, reject) => {
        organizationModel.getById(id).then((data) => {
            switchRoleService.runAsOrganization(data.workspaceId, userService.getUserOverviewByStatus)
            .then((userData)=>{
                resolve(userData);
            }).catch((err)=>{
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPaidOrganizationsCount() {
    return new Promise((resolve, reject) => {
        organizationModel.countDocuments({ 'subscriptionType': 'PAID' }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFreeOrganizationsCount() {
    return new Promise((resolve, reject) => {
        organizationModel.countDocuments({ 'subscriptionType': 'FREE' }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getActiveOrganizationsCount() {
    return new Promise((resolve, reject) => {
        organizationModel.countDocuments({ 'status': 'ACTIVE' }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getExpiredOrganizationsCount() {
    return new Promise((resolve, reject) => {
        organizationModel.countDocuments({ 'status': 'EXPIRED' }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchOrganizations(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        organizationModel.getPaginatedResult(query, options).then((data) => {

            let promises = [];
            let results = [];
            for(let org of data){
                promises.push(switchRoleService.runAsOrganization(org.workspaceId, userService.getAllUsersCount));
            }

            Promise.all(promises).then((result)=>{
                for(let i = 0; i < data.length; i++){
                    let organisation = JSON.parse(JSON.stringify(data[i]));
                    organisation.userCount = result[i];
                    results.push(organisation);
                }
                resolve(results);
            });
        }).catch((err) => {
            reject(err);
        })
    });
}

//seems to be an api for the super admin so that he can view all total, paid, free, active, expired
//etc. all types of organizations in one go
function getAllOrganisationsOverview() {
    return new Promise(async (resolve, reject) => {
        try {
            const total = await organizationService.getAllOrganizationsCount();
            const paid = await organizationService.getPaidOrganizationsCount();
            const free = await organizationService.getFreeOrganizationsCount();
            const active = await organizationService.getActiveOrganizationsCount();
            const expired = await organizationService.getExpiredOrganizationsCount();
            const pending = await organizationService.getPendingApprovalForRefundOrganisationCount();
            var result = {
                'total': total,
                'paid': paid,
                'free': free,
                'active': active,
                'expired': expired,
                'pending':pending
            }
            resolve(result);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    }).catch((err) => {
        console.log(err);
        reject(err);
    });

}

/****difficult apis begin**/

function setStripeCustomerCreateData(organizationData){
    const stripeData = {
        "email":organizationData.defaultUserEmailId,
        "description":organizationData.organizationName,
        "name": organizationData.defaultUserFirstName
    }
    return stripeData;
}

function setStripeSubscriptionData(customerId, defaultPrice){
    const subsData = {
        "customer":customerId,
        "items": [
        {"price": defaultPrice}],
        // "trial_end": 1611907271
        //"trial_period_days":trial_period
    }
    return subsData;
}

//COMMENTED OUT FOR STRIPE
//this is part of the add organization flow itself
//function setOrganizationData(organizationData) {
//create a unique bllingId for the org
    //organizationData.billingId = uuidv1();
//create workspace url for the org
function setOrganizationData(organizationData, customer, subscription) {
    // Since, billing ID has role in creation for admin, So, billingId means subscriptionID
    // Intially, for free trails we are not creating any subscription just customers are to
    // be created without attaching the payment_method
    organizationData.billingId = "";
    organizationData.priceId = "";
    organizationData.productId = "";
    organizationData.planStatus = "";
    organizationData.status = "";
    organizationData.customerId = "";
    organizationData.subscriptionId = "";
    organizationData.workspaceUrl = "";
//storing who this org was created by and last modified by, as we receive default user email in data
    organizationData.createdBy = organizationData.defaultUserEmailId;
    organizationData.lastModifiedBy = organizationData.defaultUserEmailId;
//the org status will be active
    var currentDate = new Date();
//there is a free subscription type already existing that is applied if subscription type is 
//undefined in the data being received
//COMMENTED OUT FOR STRIPE
    //if(organizationData.subscriptionType == undefined){
//this will always be undfined when user is signing up and hence when 
//a new user signs up, subs type will always be free
       // organizationData.subscriptionType = SubscriptionTypes.FREE;
   // }
//mark today's date as the subscription started date
//BELOW COMMENTED OUT AS WE DON'T WANT TO SET AN EXPIRATION DATE AT ORG LEVEL    
//  organizationData.subscriptionStarted = new Date();
//     currentDate.setDate(currentDate.getDate() + organizationFreeTrialPeriod);
//if the org's expiration date is not set, set it to currentDate which will basically have today's
//date plus free trial period
//COMMENTED FOR STRIPE
    //if(organizationData.expirationDate == undefined){
//expiration date will be undefined when a user is signing up
        //organizationData.expirationDate = currentDate;
    //}
//there are two types of orgTypes, internal or customer. all external, paying users are customer type
organizationData.expirationDate = "";
    organizationData.organizationType = OrganizationTypes.CUSTOMER;
    organizationData.address = {
    //     "companyAddress": "",
    //     "state":"",
    //     "city":"",
    //     "pincode":"",
    //     "country":""
    // }
    // //placing the logo of default org on this
    // organizationData.logo = defaultOrganizationFileUrlPath;
    "companyAddress": "",
                "state":"",
                "city":"",
                "pincode":"",
                "country":""
            }
            //placing the logo of default org on this
            organizationData.logo = defaultOrganizationFileUrlPath;

    return organizationData;
}

//this function gets called each time a new org is created
async function createDefaultUser(organizationData, resolve, reject) {
    var userData = {
        'email': organizationData.defaultUserEmailId,
        'password': organizationData.defaultUserPassword,
        'workspaceId': "",
        'firstName': organizationData.defaultUserFirstName,
        'lastName': organizationData.defaultUserLastName,
        'role': organizationData.role
        // 'demo': true,
        // 'verified':false
    };
    var result = {
        'email': organizationData.defaultUserEmailId,
        // 'workspaceId': organizationData.workspaceId,
        // 'workspaceUrl': organizationData.workspaceUrl
    }
    var context = {};
    context.email = userData.email;

    // context.workspaceId = userData.workspaceId;
    currentContext.setCurrentContext(context);

    usersModel.createEmptyCollection();
    leadsModel.createEmptyCollection();
    customerModel.createEmptyCollection();
    quotationModel.createEmptyCollection();
    organizationModel.createEmptyCollection();

    var testRoles = await roleService.getAllRoles();
    if (Array.isArray(testRoles) && testRoles.length){
        var userResult = await userService.addUser(userData);
        let tData = JSON.parse(JSON.stringify(userResult));
        var final = {...result, ...tData}
        resolve(final);
    }else{
        roleService.addDefaultRoles(organizationData.features).then((data) => {
            var adminRole = data.find(function (element) {
                return element.internal == true;
            });
            
            console.info("Default Roles created for organisation:" + organizationData.workspaceId);
            userData.role = adminRole._id;
            //default image
            let config = configResolve.getConfig();
            userData.profileImage = config.defaultUserFileUrlPath;
            userService.addDefaultUser(userData).then((userResult) => {
                console.info("Default User created for organisation:" + organizationData.workspaceId);
    //the below lines just send email to the user and send him info and link of workspace
                var messageBody = "Your workspaceurl is : " + result.workspaceUrl;
                var subject = "Thank you for joining a Dominate workspace";
                let htmlTempalate = commonEmailTemplateService.getWelcomeEmail(organizationData.workspaceId, result.workspaceUrl);
                mailer.mail(userData.email, subject, messageBody, htmlTempalate);
                let tData = JSON.parse(JSON.stringify(userResult));
                var final = {...result, ...tData}
                console.log(final)           
                resolve(final)
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        });
    }

   
}

//this function is used to create default widgets in the database
//these can be the default widgets on the dashboard and can be changed later
function createDefaultWidgets(organizationData) {
    var userData = {
        'email': organizationData.defaultUserEmailId,
        'password': organizationData.defaultUserPassword,
        'workspaceId': organizationData.workspaceId
    };
    var result = {
        'email': organizationData.defaultUserEmailId,
        'workspaceId': organizationData.workspaceId,
        'workspaceUrl': organizationData.workspaceUrl
    }
    var context = {};
    context.email = userData.email;
    context.workspaceId = userData.workspaceId;
    currentContext.setCurrentContext(context);
    //default widget creation
    widgetService.createDefaultWidgets().then((data) => {
        return(result);
    }).catch((err) => {
        reject(err);
    })
}

// function refund(organizationData) {
//     return new Promise((resolve, reject) => {

//         organizationData.status = Status.EXPIRED;
//         organizationData.deactivatedOn = new Date();
//         organizationData.isRefundRequested = true;
//         updateOrganization(organizationData._id, organizationData).then((data)=>{
//             var email = currentContext.getCurrentContext().email;
//             console.log( email );
//             switchRoleService.getAdminUserRole(email).then((userRoledata) => {
//                 switchRoleService.performSwitchRole(userRoledata.adminUser, userRoledata.supportRole).then((data) => {
//                     razorPayService.cancelSubscription(organizationData.billingId, false).then((cancelSub)=>{
//                         resolve(data);
//                     }).catch((err)=>{
//                         reject(err);
//                     })
//                 });
//             }).catch((err)=>{
//                 reject(err);
//             })
//         }).catch((err)=>{
//             reject(err);
//         })
//     })
// }

// function refundv2(organizationData, tenant) {
//         return new Promise((resolve, reject) => {
// //sendresponse is the final response we will send, right now an empty object
// //tenant is the workspacename sent from route function
//             let sendresponseData = {};
// //org's status is marked expired, deactivated is given today's date and refund requests becomes true
//             organizationData.status = Status.EXPIRED;
//             organizationData.deactivatedOn = new Date();
//             organizationData.isRefundRequested = true;
// //we now update the org and send the id and org data object
//             updateOrganization(organizationData._id, organizationData).then((data)=>{
// //save orgdata and id in response object and update data will be the data returned from update org service
//                 sendresponseData.organizationData = organizationData;
//                 sendresponseData.organisationID = organizationData._id;
//                 sendresponseData.updateData = data;
//                 var context = currentContext.getCurrentContext();
// //we are setting the workspace id of the context as tenant (workspace name) that we've received in the function
// //****possible issue here is that we should use only setcontext funtion to set it */                
//                 context.workspaceId = tenant;
// //thenext few lines, get the adminuserrole and switch role of the user, but why?
//                 switchRoleService.getAdminUserRole(context.email).then((userRoledata) => {
//                     sendresponseData.userRoles = userRoledata;
//                     switchRoleService.performSwitchRole(userRoledata.adminUser, userRoledata.supportRole).then((rdata) => {
//                         sendresponseData.rdata = rdata;
// // a call is then made to rp service to cancel subs for the org
//                         razorPayService.cancelSubscription(organizationData.billingId, false).then((cancelSub)=>{
//                             resolve(sendresponseData);
//                         }).catch((err)=>{
//                             reject(err);
//                         })
//                     });
//                 }).catch((err)=>{
//                     reject(err);
//                 })
//             }).catch((err)=>{
//                 reject(err);
//             })
//         })
// }

// function cancel(organizationData) {
// //a subscription is created at razorpay with the same id as the org's billing Id, so we get that subs
// //then we cancel subs for that org by sending billingId 
//     return new Promise((resolve, reject) => {
//         //org update will be done on webhook event
//         razorPayService.getSubscriptionById( organizationData.billingId ).then( sub => console.log( sub ) );
//         razorPayService.cancelSubscription(organizationData.billingId, true).then((cancelSub)=>{
//             resolve(cancelSub);
//         }).catch((err)=>{
//             reject(err);
//         })
//     })
// }

//super admin manually approves refund for an org
// function approveRefund(orgId, organizationData) {
//     return new Promise((resolve, reject) => {
//         //org update will be done on webhook event
//         billingService.getAllBillingsbyOrganizationId(organizationData._id).then((billingData)=>{
// //if refund needs to happen, billing data needs to exist in d.b for payment having gone through
//             if(billingData.length == 1){
//                 let payment = billingData[0].data;
//                 //multuplying with 100
//                 let refundAmount = payment.amount *100;
//                 console.log("refund amount: "+refundAmount);
//                 razorPayService.refund(payment.paymentId, refundAmount).then((refund)=>{
// //after refund has happened, we get refund object which we use to create a new billing record at our d.b
//                     let  refundBilling = {
//                         "workspaceId" : organizationData.workspaceId,
//                         "organizationId" : organizationData._id,
//                         "plan" : organizationData.billingType,
//                         "success" : true,
//                         "subscriptionId" : organizationData.billingId,
//                         "paymentId" : refund.payment_id,
//                         "amount" : refundAmount,
//                         "refund": refund,
//                         "transactionId" : uuidv4(),
//                         "status": "SUCCESS"
//                     };
// //add a new billing detail in d.b with refund billing object
//                   billingService.addBilling(refundBilling).then((refundBillingData)=>{
//                         let org = JSON.parse(JSON.stringify(organizationData));
// //since refund is now done, we set the isrefundrequested variable of org to false again
//                         org.isRefundRequested = false;
// //update org's data
//                         updateOrganization(org._id, org).then((data)=>{
//                             resolve(organizationData);
//                         }).catch((err)=>{
//                             reject(err);
//                         })
                        
//                     }).catch((err)=>{
//                         reject(err);
//                     })
                    
//                 }).catch((err)=>{
//                     reject(err);
//                 })
//             }else{
//                 resolve({'success': false, 'reason':"Refund can not be initialed as there are multiple payment"});
//             }
//         }).catch((err)=>{
//             console.log("Error while getting billing data" + err);
//             reject(err);
//         });
        
//     })
// }

//this is the count of orgs  that have filed in for refund and super admin approval is pending
function getPendingApprovalForRefundOrganisationCount(){
    return new Promise((resolve, reject) => {
        organizationModel.countDocuments({ 'status': 'EXPIRED', 'isRefundRequested' : true }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

//in this api, you pass an orgId and you are able to set manual request to true
//basically means that we want this org to try payment manually as automatic hasn't happened
function generateManualPaymentRetry( organisation_id ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let organisationData = await organizationModel.searchOne({ _id : organisation_id });
            if( organisationData ){
//sets manualRequest to true in org's billing info object
                organisationData.billingInfo.isManualRequestGenerated = true;
//then simply updates the data in the org
                let updateOrganisation = await organizationModel.updateById( organisation_id, organisationData );
                resolve( updateOrganisation );
            } else {
                reject( "NOT FOUND" );
            }
        } catch ( err ){
            reject( err );
        }
    });
}

//this api gets all the orgs for which manual payment try request has been filed
function getPaymentManualRetryRequestWithPagination( pageSize, pageNo ){
    return new Promise(( resolve, reject ) => {
        const options = {};
        options.skip = pageSize * (pageNo - 1);
        options.limit = pageSize;
        let query = {
            "billingInfo.isOrganisationAtPendingState":true,
            "billingInfo.isManualRequestGenerated":true,
        }
        organizationModel.getPaginatedResult( query, options )
            .then( ( data ) => {
                resolve( data );
            })  
            .catch( err => reject( err ) );
    });
}

//how many organizations are for manual payment retry (payment wasn't processed from their card)
function getPaymentManualRetryRequestCount(){
    return new Promise(( resolve, reject ) => {
        let query = {
            "billingInfo.isOrganisationAtPendingState":true,
            "billingInfo.isManualRequestGenerated":true,
        }
        organizationModel.countDocuments( query )
            .then( ( data ) => {
                resolve( data );
            })  
            .catch( err => reject( err ) );
    });
}

//this api sets failure for manual request 
function updateManualPaymentRetryStatus( organisation_id ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let organisationData = await organizationModel.searchOne({ _id : organisation_id });
//finds the org using the id and updates the billing info object 
            if( organisationData ){
//manual request generated is set to false
                organisationData.billingInfo.isManualRequestGenerated = true;
//manual request failed is set to true
                organisationData.billingInfo.isManualRequestFailed = true;
//update the info in the d.b level
                let updateOrganisation = await organizationModel.updateById( organisation_id, organisationData );
                resolve( updateOrganisation );
            }
        } catch ( err ){
            reject( err );
        }
    });
}

// function getOrganisationWithSubscriptionId( sub_id ){
//     return new Promise( async (resolve, reject) => {
//         try{
//             let query = { billingId:"" };
//             if( sub_id ){
//                 query = { billingId : sub_id };
//             }
//             let organisation_data = await organizationModel.search( query );
//             resolve( organisation_data );
//         } catch ( err ){
//             reject( err );
//         }
//     });
// }


// function changeOrganisationToPendingState( sub_id ){
//     return new Promise( async ( resolve, reject ) => {
//         try{
//             let organizationData = await getOrganisationWithSubscriptionId( sub_id );
//             if( organizationData ){
//                 organizationData.status = Status.EXPIRED;
//                 organizationData.billingInfo = { 
//                     cancellation_request :false,
//                     isOrganisationAtPendingState : true,
//                     isManualRequestGenerated : false
//                 };
//                 let updateOrganisationData = await updateOrganization( organizationData._id,  organizationData );
//                 if( updateOrganisationData ){
//                     resolve( updateOrganisationData );
//                 }
//             }
//         } catch ( err ){
//             reject( err );
//         }
//     });
// }


// function chargePaymentManuallyByAdmin( organisation_id ){
//     return new Promise( async ( resolve, reject ) => {
//         try{
//             let organisationData = await getOrganizationById( organisation_id );
//             if( organisationData ){
//                 organisationData.billingInfo = {
//                     cancellation_request :false,
//                     isOrganisationAtPendingState : true,
//                     isManualRequestGenerated : true
//                 };
//                 let updateOrganisationData = await updateOrganization( organisation_id,  organisationData );
//                 if( updateOrganisationData ){
//                     resolve( updateOrganisationData );
//                 }
//             }
//         } catch ( err ){
//             reject( err );
//         }
//     });
// }

module.exports = organizationService;
