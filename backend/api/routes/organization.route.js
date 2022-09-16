const organizationService = require('../services/organization.service');
var schema = require('../schemas/organization.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');
var OrganizationTypes = require('../../common/constants/OrganizationTypes');
const SubscriptionTypes = require('../../common/constants/SubscriptionTypes');
var Status = require('../../common/constants/Status');
const switchRoleService = require('../services/switchRole.service');
var currentContext = require('../../common/currentContext');
var syncOrgService = require('../services/orgSync.service');
var paymentSchema = require('../schemas/payment.validation.schema.json')
const moment = require('moment');
var _ = require('lodash');

function init(router) { 
  router.route('/organizations')
    .get(getAllOrganizations)
    .post(addOrganization);
  router.route('/organization/:id/users')
    .get(getOrganizationUsers);
  router.route('/organization/:id/users/overview')
    .get(getOrganizationUsersOverview);
  router.route('/organizations/user/:id')
    .patch(patchOrganization);
  router.route('/organizations/manual/retry')
    .get(getAllOrganisationWithManualPaymentRequest)
    .post(addManualPaymentRequest)
    .put(updateManualPaymentRequestStatus);
  router.route('/organizations/manual/retry/count')
    .get(getAllOrganisationWithManualPaymentRequestCount)
  router.route('/organizations/count')
    .get(getAllOrganizationsCount);
  router.route('/organizations/overview')
    .get(getAllOrganisationsOverview);
  router.route('/organizations/approve/refund/:id')
    .post(approveRefundForOrganisation);
  router.route('/organizations/sync')
    .get(syncOrganizations);
  router.route('/organizations/cancelsync')
    .get( syncCancelOrganisations );
  router.route('/organizations/resume/:id')
    .post( resumeSubscriptionByOrganisationId );
  router.route('/organizations/:id')
    .get(getOrganizationByWorkspaceId)
    .delete(deleteOrganization)
    .put(updateOrganization);
  router.route('/organizations/search')
    .post(searchOrganizations);
}

/**
 * Get all a organizations api
 * @route GET /api/organizations
 * @group organizations - Operations about organizations
 * @returns {object} 200 - An object of organizations info
 * @returns {Error}  default - Unexpected error
 */
function getAllOrganizations(req, res, next) {
  //accessResolver.isAuthorized(req);
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }
  else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      organizationService.getOrganizationsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      organizationService.getOrganizationsByPage(pageNo, pageSize).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else {
    organizationService.getAllOrganizations().then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}


function getAllOrganizations(req, res, next) {
  organizationService.getAllOrganizations().then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}
/**
 * Get organizations count api
 * @route GET /api/organizations/count
 * @group organizations - Operations about organizations
 * @returns {object} 200 - An object of organizations info
 * @returns {Error}  default - Unexpected error
 */
function getAllOrganizationsCount(req, res, next) {
  //accessResolver.isAuthorized(req);

  organizationService.getAllOrganizationsCount().then((data) => {
    res.send({ 'count': data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function getOrganizationById(req, res, next) {

  let organizationId = req.params.id;
  var json_format = iValidator.json_schema(schema.getSchema, organizationId, "organization");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  organizationService.getOrganizationById(organizationId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.ORGANIZATION_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get organizations by id api
 * @route GET /api/organizations/:id
 * @group organizations - Operations about organizations
 * @returns {object} 200 - An object of organizations info
 * @returns {Error}  default - Unexpected error
 */
function getOrganizationByWorkspaceId(req, res, next) {

  let workspaceId = req.params.id;
  var json_format = iValidator.json_schema(schema.getSchema, workspaceId, "organization");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  organizationService.getOrganizationByWorkspaceId(workspaceId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.ORGANIZATION_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get organization users by id api
 * @route GET /api/organization/:id/users
 * @group organizations - Operations about organizations
 * @returns {object} 200 - An object of organizations info
 * @returns {Error}  default - Unexpected error
 */
function getOrganizationUsers(req, res, next) {

  var userStatus = req.query.userStatus;
  let id = req.params.id;
  if (id == undefined) {
    return res.status(422).send("OrganizationId Missing");
  }
  organizationService.getOrganizationUsers(id,userStatus).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.ORGANIZATION_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add organizations api
 * @route POST /api/organizations
 * @group organizations - Operations about organizations
 * @param {object} organizationData.body.required - organizations details
 * @returns {object} 200 - An object of organizations info
 * @returns {Error}  default - Unexpected error
 */
function addOrganization(req, res, next) {
  var organizationData = req.body;
  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, organizationData, "organization");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  organizationService.getAllOrganizations().then((data) => {
    if (data != undefined && data.length > 0) {
      return next(errorMethods.sendBadRequest(errorCode.ORGANIZATION_ALREADY_EXIST));
    } else {
      
      organizationService.simplyAddOrganization(organizationData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });

}

/**
 * update organizations by id api
 * @route PUT /api/organizations
 * @group organizations - Operations about organizations
 * @returns {object} 200 - An object of organizations info
 * @returns {Error}  default - Unexpected error
 */
//this function seems like it will be mostly used to convert free org to paid
function updateOrganization(req, res, next) {
  var updateId = req.params.id;
  if (!updateId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  var organizationData = req.body;
//finds the org to be updated from db using orgid sent by user
  organizationService.getOrganizationById(updateId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.ORGANIZATION_NOT_EXIST));
    } else {
//if org is internal, this operation is not supported
      if (data.organizationType === OrganizationTypes.INTERNAL) {
        return next(errorMethods.sendBadRequest(errorCode.OPERATION_NOT_SUPPORTED));
      }
//the lines below converts the org to a paid org if billingType of what we have in db and what 
//user sends are not matching
      if (data.billingType != organizationData.billingType) {
        organizationData.subscriptionType = SubscriptionTypes.PAID;
      }
      organizationService.updateOrganization(updateId, organizationData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}

/**
 * update organizations by id api
 * @route PUT /api/organizations/users/:id
 * @group organizations - Operations about organizations
 * @returns {object} 200 - An object of organizations info
 * @returns {Error}  default - Unexpected error
 */
//this function is just for changing organization data like logo and address
//this is basically an atomic operation
function patchOrganization(req, res, next) {
  var updateId = req.params.id;
  if (!updateId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID));
  }
  var organizationData = req.body;
  organizationService.getOrganizationById(updateId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.ORGANIZATION_NOT_EXIST));
    } else {
      if (data.organizationType === OrganizationTypes.INTERNAL) {
        return next(errorMethods.sendBadRequest(errorCode.OPERATION_NOT_SUPPORTED));
      }
      let patchedData = data;
      patchedData.logo = organizationData.logo;
      patchedData.address = organizationData.address;

      organizationService.updateOrganization(updateId, patchedData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}

/**
 * delete organizations by id api
 * @route DELETE /api/organizations/:id
 * @group organizations - Operations about organizations
 * @returns {object} 200 - An object of organizations info
 * @returns {Error}  default - Unexpected error
 */
function deleteOrganization(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  organizationService.getOrganizationById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.ORGANIZATION_NOT_EXIST));
    } else {
      organizationService.deleteOrganization(delId).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * get overview of all organziations
 * @route GET /api/organizations/overview
 * @group organizations - Operations about organizations
 * @returns {object} 200 - An object of organizations info
 * @returns {Error}  default - Unexpected error
 */

function getAllOrganisationsOverview(req, res, next) {

  organizationService.getAllOrganisationsOverview().then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * get overview of an organziations' users
 * @route GET /api/organizations/overview
 * @group organizations - Operations about organizations
 * @returns {object} 200 - An object of organizations info
 * @returns {Error}  default - Unexpected error
 */
function getOrganizationUsersOverview(req, res, next){

  let id = req.params.id;
  if (id == undefined) {
    return res.status(422).send("OrganizationId Missing");
  }
  
  organizationService.getOrganizationUsersOverview(id).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * search organizations
 * @route GET /api/organizations/search
 * @group organizations - Operations about organizations
 * @returns {object} 200 - An object of organizations info
 * @returns {Error}  default - Unexpected error
 */
function searchOrganizations(req, res, next) {
  let searchCriteria = req.body;
  organizationService.searchOrganizations(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


//DIFFICULT APIS START

/**
 * approve refund by id api
 * @route POST /organizations/approve/refund/:id
 * @group organizations - Operations about organizations
 * @returns {object} 200 - An object of organizations info
 * @returns {Error}  default - Unexpected error
 */
function approveRefundForOrganisation(req, res, next) {
  var updateId = req.params.id;
  if (!updateId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID));
  }
  organizationService.getOrganizationById(updateId).then((patchedData) => {
    if (patchedData == undefined || patchedData.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.ORGANIZATION_NOT_EXIST));
    } else {
      if (patchedData.organizationType === OrganizationTypes.INTERNAL) {
        return next(errorMethods.sendBadRequest(errorCode.OPERATION_NOT_SUPPORTED));
      }

      organizationService.approveRefund(updateId, patchedData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}

/**
 * upgrade organizations by id api
 * @route POST /api/organizations/upgrade/:id
 * @group organizations - Operations about organizations
 * @returns {object} 200 - An object of organizations info
 * @returns {Error}  default - Unexpected error
 */
//function used to upgrade the plan of an org
// function upgradeOrganisation(req, res, next) {
//   var updateId = req.params.id;
//   if (!updateId) {
//     return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
//   }
//   var organizationPayload = req.body;

//   //Validating the input entity
//   var json_format = iValidator.json_schema(paymentSchema.createSubscriptionSchema, organizationPayload, "payment");
//   if (json_format.valid == false) {
//       return res.status(422).send(json_format.errorMessage);
//   }

//   organizationService.getOrganizationById(updateId).then((data) => {
// //checks if the org exists
//     if (data == undefined || data.length == 0) {
//       return next(errorMethods.sendBadRequest(errorCode.ORGANIZATION_NOT_EXIST));
//     } else {
// //if org type is internal, then this operation is not supported
//       if (data.organizationType === OrganizationTypes.INTERNAL) {
//         return next(errorMethods.sendBadRequest(errorCode.OPERATION_NOT_SUPPORTED));
//       }
// //orgPayload is received in the body of this request, this has to be different from the existing plan
// //only then, the upgrade can actually work
//       if(data.billingType === organizationPayload.plan){
//         return next(errorMethods.sendBadRequest(errorCode.INVALID_INPUT));
//       }
//       let organizationData = JSON.parse(JSON.stringify(data));
//       //organizationData.billingType = organizationPayload.plan;
//       var context = currentContext.getCurrentContext();

//       organizationData.subscriptionType = SubscriptionTypes.PAID;
//       let startAt;
// //there is an object called nextsubs inside orgData and it has two values - nextplan and nextplandate
// //when an org changes plan we store this data here so that it can be applied from next billing cycle      
//       //monthly billing
// //here we are checking if nextsubs is defined + [but] nextplan (which is inside nextsubs) is undefined
// //or nextsubs is completely undefined.
// if((organizationData.nextSubscription != undefined && organizationData.nextSubscription.nextPlan == undefined) ||
//           organizationData.nextSubscription == undefined){
// //it takes the expirationdate for this org in currentdate variable
//             var currentDate = moment(organizationData.expirationDate);
// //it adds a month to currentdate and stores it in futuremonth variable
//             var futureMonth = moment(currentDate).add(1, 'M');
// //we are modifying the expiration date now with the future date,which is next month
//             organizationData.expirationDate = new Date(futureMonth.toDate());
// //makes the status of the organization data as active
//             organizationData.status = Status.ACTIVE;
// //takes the current expiration date stored in currentdate and gets the time and then stores in startAt
//             startAt = new Date(currentDate).getTime();
//       }else{
// //if nextsubs and nextplandate are already defined, then you simply set this
//         startAt = organizationData.nextSubscription.nextPlanDate;
//       }
// //we are now creating value for nextsubs object with the nextplan for this org being set to what has
// //come in as payload and nextplandate as startAt value
//       organizationData.nextSubscription = {
//         nextPlan: organizationPayload.plan,
//         nextPlanDate: startAt
//       };
// //since new value for nextsubs has been set, it is now time to update the data of the org
//       organizationService.updateOrganization(updateId, organizationData).then((data) => {
        
//         let plan;
// //first get all the plans from razorpayservice
//         razorPayService.getAllPlans().then((plans)=>{
// //in the plans returned by razorpay, find the plan sent in thepayload - basically the future/next plan
//           plan = _.find(plans.items, function(o) { return o.item.name == organizationPayload.plan; });
// //create an object for subscription with planId, where plan object exists at razorpay and each object has a planId
// //org id is in the context and startAt is same as we have configured above, subsId will be same as billingId of the org
//           let subscription = {
//             'planId': plan.id,
//             'orgnisationId': context.organizationId,
//             'start_at': startAt,
//             'subscriptionId': organizationData.billingId
//             };
// //with this new object, we update the subscription at razorpay using rp service
//             razorPayService.updateSubscription(subscription).then((razorPayData)=>{
//               console.log("RazorPay subscription updated");
//               res.json({ 'success': true, 'message': 'Organisation subscription updated' });
//             }).catch((err)=>{
//               console.log("Error while update subscription");
//               next(errorMethods.sendServerError(err));
//             });
//         }).catch((err)=>{
//             console.log("Error while fetching plans" +  err);
// //catches at a place where no plans match above with razorpay plans
//             next(errorMethods.sendBadRequest(errorCode.INVALID_PLAN));

//         });

//         }).catch((err) => {
//         next(errorMethods.sendServerError(err));
//       });
//     }
//   });

// }

/**
 * cancel subcription organizations by id api
 * @route POST /api/organizations/cancel/:id
 * @group organizations - Operations about organizations
 * @returns {object} 200 - An object of organizations info
 * @returns {Error}  default - Unexpected error
 */
//api called when we need to cancel subs of an org
// function cancelSubscriptionOfOrganisation(req, res, next) {
// //the id of the org to be updated will be received in props
//   var updateId = req.params.id;
//   if (!updateId) {
//     return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
//   }
// //complete data of the org will be received in body and taken into payload
//   var organizationPayload = req.body;
//   var workspaceOldName = currentContext.getCurrentContext().workspaceId;
  
//   //Validating the input entity
//   var json_format = iValidator.json_schema(paymentSchema.createSubscriptionSchema, organizationPayload, "payment");
//   if (json_format.valid == false) {
//       return res.status(422).send(json_format.errorMessage);
//   }
// //get the org by id
//   organizationService.getOrganizationById(updateId).then((data) => {
//     if (data == undefined || data.length == 0) {
// //if no data returned from db, means org with this id doesn't exist
//       return next(errorMethods.sendBadRequest(errorCode.ORGANIZATION_NOT_EXIST));
//     } else {
// //operation is not allowed on internal org
//       if (data.organizationType === OrganizationTypes.INTERNAL) {
//         return next(errorMethods.sendBadRequest(errorCode.OPERATION_NOT_SUPPORTED));
//       }
// //from d.b get all the billings for this orgId
//       billingService.getAllBillingsbyOrganizationId(data._id).then((billingData)=>{
// //keeps todays date in currentdate
//         let currentDate = moment();
// //every org has substarted variable, we can capture that in subsstartdate
//         let subscriptionStartedDate = moment(data.subscriptionStarted);
// //how many days it has been since subs has started
//         let diffAfterSubscriptionStarted = subscriptionStartedDate.diff(currentDate, 'days');
// //keeping org's data in orgdata variable
//         let orgData = JSON.parse(JSON.stringify(data));
//         console.log("condition--> ",billingData.length ,Math.abs(diffAfterSubscriptionStarted) );
// //****** possible issue- this is doing a general check for billing existing in db with this orgId
// //****** whereas we need to check if there's billing existing in db with current plan of this org
// //if no billing has happened for this org and days since subs started is less than 5, then refund can be applied        
//         if(billingData.length <= 1 && Math.abs(diffAfterSubscriptionStarted) <= 5){
//           //refund
//           console.log("Sent fir Refund")
// //the data will now be sent to the refund function in org service
//           organizationService.refundv2(orgData, workspaceOldName).then((refundResponse)=>{
//               console.log("refund request got successful");
//               res.json({ 'success': true, 'message': 'Organisation subscription refund request sent', refundResponse:refundResponse });
//           }).catch((err)=>{
//             console.log("Error while refund request");
//             next(errorMethods.sendServerError(err));
//           });
//         }else{
//           //cancel
// //ir orgdata.billinginfo exists, then it will set the value, else it will be empty
//           var billingInfo = orgData.billingInfo ? orgData.billingInfo : {}; 
// //billinginfo's cancel request flag is made true
//           billingInfo.cancellation_request = true;
// //orgdata's billing info gets updated here
//           orgData.billingInfo = billingInfo; 
// //then we update the organization with id and neworgdata
//           organizationService.updateOrganization( orgData._id, orgData ).then( data => {
//             return res.json( data );
//           })
//           .catch( err => { 
//               console.log("Error while cancel request");
//               next(errorMethods.sendServerError(err));
//            });
//           // organizationService.cancel(orgData).then((cancelResponse)=>{
//           //   const updateOrg = JSON.parse( JSON.stringify( orgData ) );
//           //   // console.log( updateOrg.billingInfo , "Asdasd");
//           //   organizationService.updateOrganization(updateOrg._id, updateOrg).then( data => {
//           //     // console.log("cancel request got successful", cancelResponse, data);
//           //     res.json({ 'success': true, 'message': 'Organisation subscription cancelled' });
//           //   })
//           //   .catch( err => {
//           //     console.log("Error while cancel request");
//           //     next(errorMethods.sendServerError(err));
//           //   });
//           // }).catch((err)=>{
//           //   console.log("Error while cancel request");
//           //   next(errorMethods.sendServerError(err));
//           // });

//         }
//       }).catch((err)=>{
//         next(errorMethods.sendServerError(err));
//       });
//     }
//   });

// }

/**
 * cancel update of subcription organizations by id api
 * @route POST /api/organizations/cancelUpdate/:id
 * @group organizations - Operations about organizations
 * @returns {object} 200 - An object of organizations info
 * @returns {Error}  default - Unexpected error
 */
//if an org has updated their subs plan but now want to cancel it, we call this api
// function cancelUpdateOfSubscriptionOfOrganisation(req, res, next) {
// //if received in params is stored in updateId variable
//   var updateId = req.params.id;
//   if (!updateId) {
//     return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
//   }
//   var organizationPayload = req.body;

//   //Validating the input entity
//   var json_format = iValidator.json_schema(paymentSchema.createSubscriptionSchema, organizationPayload, "payment");
//   if (json_format.valid == false) {
//       return res.status(422).send(json_format.errorMessage);
//   }
  
// //get the org by id with the update id
//   organizationService.getOrganizationById(updateId).then((data) => {
//     if (data == undefined || data.length == 0) {
// //if org not found, then will send an error code
//       return next(errorMethods.sendBadRequest(errorCode.ORGANIZATION_NOT_EXIST));
//     } else {
// //if org type is internal, this operation is not supported
//       if (data.organizationType === OrganizationTypes.INTERNAL) {
//         return next(errorMethods.sendBadRequest(errorCode.OPERATION_NOT_SUPPORTED));
//       }
// //if nextsubs is undefined or nextsubs is defined but nextplan variable inside it is undefined
//       if((data.nextSubscription != undefined && data.nextSubscription.nextPlan == undefined) || 
//           data.nextSubscription == undefined){
// //then we have to return invalid data error method
//             return next(errorMethods.sendBadRequest(errorCode.INVALID_DATA));
//       }

//       razorPayService.cancelUpdate(data.billingId).then((cancelUpdateData)=>{
//         let org = JSON.parse(JSON.stringify(data));
//         org.nextSubscription = {};
//         organizationService.updateOrganization(org._id, org).then((updateOrg)=>{
//           console.log("Next subscription request got cancelled successful");
//           res.json({ 'success': true, 'message': 'Organisation subscription cancel request sent' });
//         }).catch((err)=>{
//           next(errorMethods.sendServerError(err));
//         })
//       }).catch((err)=>{
//         console.log("Error while cancel update request");
//         next(errorMethods.sendServerError(err));
//       })
      
//     }
//   }).catch((err)=>{
//     next(errorMethods.sendServerError(err));
//   });

// }







//this api is called from the scheduler
function syncOrganizations(req, res, next) {
  if(!currentContext.getCurrentContext().isSystemToken){
    return next(errorMethods.sendBadRequest(errorCode.ACCESS_DENIED));
  }else{
//org sync is called from orgsyncservice
    syncOrgService.syncOrganizations().then((data) => {
//org cancel will also be synced
      syncOrgService.syncOrganisationCancellation().then( data => res.json( data ) )
      .catch( err  => next(errorMethods.sendServerError(err)))
      // res.json(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

function syncCancelOrganisations( req, res, next ){
    syncOrgService.syncOrganisationCancellation().then( data => res.json( data ) )
      .catch( err  => next(errorMethods.sendServerError(err)))
}

//api to resume subscrpition of an org
function resumeSubscriptionByOrganisationId( req, res, next ){
  var orgId = req.params.id;
  if (!orgId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  //get the org by id received in the function as params
  organizationService.getOrganizationById(orgId).then((data) => {
  //if the cancellation_request was true - as in user wanted to cancel, we will now make it false
      data.billingInfo = { cancellation_request : false };
  //simply updates the org data
      organizationService.updateOrganization( orgId, data ).then( updateData => {
        return res.json( updateData );
      })
      .catch( err  => next(errorMethods.sendServerError(err)))
  });
}

//function updates the billing info of an org and sets manual request generated to true
function addManualPaymentRequest( req, res, next ){
  var organisation_id = req.body.organisation_id;
  if( organisation_id ){
//calls the relevant function in org service
    organizationService.generateManualPaymentRetry( organisation_id )
      .then( data => {
        return res.json({ success : true, message : "You have successfully requested for manual retry" });
      })
      .catch( err  => next(errorMethods.sendServerError(err)))
  }else {
    return next(errorMethods.sendBadRequest(errorCode.INVALID_DATA));
  }
}

//gets the list of all orgs that have filed for manual payment request
function getAllOrganisationWithManualPaymentRequest( req, res, next ){
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  organizationService.getPaymentManualRetryRequestWithPagination( pageSize, pageNo )
    .then( data => { 
      return res.json(data);
     })
     .catch( err  => next(errorMethods.sendServerError(err)))
}

//gets the count for widget of the orgs that have filed for manual payment request
function getAllOrganisationWithManualPaymentRequestCount( req,res, next ){
    organizationService.getPaymentManualRetryRequestCount()
      .then( data => {
        return res.json({ "count" : data });
      })
      .catch( err  => next(errorMethods.sendServerError(err)))
}

//when a subscription payment of the user fails, he's told to retry using automatic method
//or he has to retry manually and based on whether the manual payment was success of failure, this
//function is called and this handles both and updates the status in backend
function updateManualPaymentRequestStatus( req, res, next ){
  var organisation_id = req.body.organisation_id;
  var status = req.body.status;
//if org id exists in the body received in the function and if status is either success or fail,
//it will execute the code below, func receives status and org ir in body
  if( organisation_id && ( status == "SUCCESS" || status == "FAIL" ) ){
    if( status == "FAIL" ){
  //if the status is fail, send org's id and status to service function to update
      organizationService.updateManualPaymentRetryStatus( organisation_id, status )
      .then( data => {
        return res.json({ success : true, message : "You have successfully requested for manual retry" });
      })
      .catch( err  => next(errorMethods.sendServerError(err)))
    } else {
  //if the manual payment by the user succeeds, we show him this.
      return res.json({ success : true, message : "Your status will be updated soon" });
    }
  }else {
    return next(errorMethods.sendBadRequest(errorCode.INVALID_DATA));
  }
}

//if a plan is cancelled within 5 days, we can cancel immediately and give refund
//this function is called for immediate cancellation and not for cancel from next cycle
// function immediatecancelSubscriptionOfOrganisation( req, res, next ){
//   var organisation_id = req.body.organisation_id;
//   if( organisation_id ){
//     organizationService.getOrganizationById( organisation_id )
//       .then( orgData => {
// //directly sets the odg status to expired
//         orgData.status = Status.EXPIRED;
//         orgData.billingInfo = {
// //since the cancellation request is now being heeded to, this can be reset to false, 
// //to not create confusion later on while syncs
//           cancellation_request :false,
//           isOrganisationAtPendingState:false,
//           isManualRequestGenerated:false,
//           isManualRequestFailed:false
//         };
//         organizationService.updateOrganization( orgData._id , orgData )
//           .then( async  updateOrgData =>{
//  //razorpay service has a function for cancelling subs that takes billingId   
//  //the other value, false which is being passed is for "canceAtCylceEnd" value in razorpay function
//  //which basically takes a value of false or true for cancelling subs at month's end         
//             await razorPayService.cancelSubscription(orgData.billingId, false).then( rdata => {
//               return res.json({ success : true, message : "Organisation subscription immediatly cancelled" })
//             })
//             .catch( err  => next(errorMethods.sendServerError(err)))
//           })
//           .catch( err  => next(errorMethods.sendServerError(err)))
//       })
//       .catch( err  => next(errorMethods.sendServerError(err)))
//   }else {
//     return next(errorMethods.sendBadRequest(errorCode.INVALID_DATA));
//   }
// }

function checkWorkspaceUser(req, res, next) {
workspaceId = req.body.workspaceId;
email = req.body.email;
  organizationService.checkWorkspaceUser(workspaceId, email).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;
