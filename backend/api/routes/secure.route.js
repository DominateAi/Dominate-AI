var constants = require('require-all')(__basedir + '/common/constants');
const leadService = require('../services/lead.service');
const customerService = require('../services/customer.service');
const userService = require('../services/user.service');
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
const organizationService = require('../services/organization.service');
const SubscriptionTypes = require('../../common/constants/SubscriptionTypes');
const Status = require('../../common/constants/Status');
const uuidv4 = require('uuid/v4');
var currentContext = require('../../common/currentContext');
var configResolve = require("../../common/configResolver");
var config = configResolve.getConfig();
const moment = require('moment');
const graphService = require('../services/graph.service');
const ViewType = require('../../common/constants/ViewType'); 
var graphSchema = require('../schemas/graph.validation.schema.json');
var iValidator = require('../../common/iValidator');
var _ = require('lodash');
var schema = require('../schemas/payment.validation.schema.json')
var iValidator = require('../../common/iValidator');
const emailService = require('../services/email.service');

var Multer = require("multer");
var environmentConfig = configResolve.getConfig();
const switchRoleService = require('../services/switchRole.service');


var limits = {
    files: 10, // allow only 1 file per request
    fileSize: config.max_file_upload_limit * 1024 * 1024, // 1 MB (max file size)
};


function init(router) {
    router.route('/entityConstant/:entityId')
        .get(getEntity);
    router.route('/global/search')
        .get(globalSearch);
    router.route('/pay/existing')
        .post(payUsingExistingCard);
    

    /**
     * upload api
     * @route GET /api/upload
     * @group public - Operations about upload
     * @returns {object} 200 - An object of upload details info
     * @returns {Error}  default - Unexpected error
     */
    // router.post("/upload", Multer({storage: Multer.memoryStorage(), limits: limits}).single("file"), function(request, response) {
    //     var originalname = request.file.originalname;
    //     var fileExstension = originalname.split('.')[1];
    //     var systemFileName = 'file-' + new Date().toISOString() + "." + fileExstension;
    //     minioClient.putObject(environmentConfig.fileServerRootBucket, systemFileName, request.file.buffer, function(error, etag) {
    //         if(error) {
    //             return console.log(error);
    //         }
    //         var fileUploadResponse = {};
    //         fileUploadResponse.originalname = originalname;
    //         fileUploadResponse.systemFileName = systemFileName;
    //         fileUploadResponse.fileUrl = environmentConfig.server_url + "/public/download?filename=" + systemFileName;
    //         fileUploadResponse.fileUrlPath = "/public/download?filename=" + systemFileName;
    //         response.send(fileUploadResponse);
    //     });
    // });

    /**
     * upload api
     * @route GET /api/uploadfile
     * @group public - Operations about upload
     * @returns {object} 200 - An object of upload details info
     * @returns {Error}  default - Unexpected error
     */
    // router.post("/uploadfile", Multer({dest: "./uploads/"}).single("file"), function(request, response) {
    //     minioClient.fPutObject(environmentConfig.fileServerRootBucket, request.file.originalname, request.file.path, "application/octet-stream", function(error, etag) {
    //         if(error) {
    //             return console.log(error);
    //         }
    //         response.send(request.file);
    //     });
    // });

    /**
     * download api
     * @route GET /api/download
     * @group public - Operations about download
     * @returns {object} 200 - An object of download details info
     * @returns {Error}  default - Unexpected error
     */
    // router.get("/download", function(request, response) {
    //     minioClient.getObject(environmentConfig.fileServerRootBucket, request.query.filename, function(error, stream) {
    //         if(error) {
    //             return response.status(500).send(error);
    //         }
    //         stream.pipe(response);
    //     });
    // });

    //router.get('/presignedUrl', (req, res) => {
    //     minioClient.presignedPutObject(environmentConfig.fileServerRootBucket, req.query.filename, (err, url) => {
    //         if (err) throw err
    //         res.end(url)
    //     })
    // })
}

/**
 * Get entityConstant by id api
 * @route GET /api/entityConstant/:entityId
 * @group entityConstant - Operations about entityConstant
 * @returns {object} 200 - An object of entityConstant info
 * @returns {Error}  default - Unexpected error
 */
function getEntity(req, res, next) {
    let entityId = req.params.entityId;
    var entities = constants[entityId]
    if (entities == undefined) {
        res.json({});
    } else {
        var result = [];
        for (const [key, value] of Object.entries(entities)) {
            var entity = {};
            entity.label = key;
            entity.value = value;
            result.push(entity);
        }
        res.json(result);
    }
}

/**
 * Get Global Search api
 * @route GET /api/global/search
 * @group globalSearch - Operations about globalsearch
 * @returns {object} 200 - An object of globalsearch info
 * @returns {Error}  default - Unexpected error
 */
function globalSearch(req, res, next) {
    let query = req.query.query;
    if (query == undefined) {
        res.json({});
    } else {
        //lead, customer, user, chat, notification, task
        var leads = leadService.textSearch(query);
        var customers = customerService.textSearch(query);
        var users = userService.textSearch(query);

        Promise.all([leads, customers, users]).then((promiseResult)=>{
            var result = {
                'leads': promiseResult[0],
                'customers': promiseResult[1],
                'user': promiseResult[2]
            };
            res.json(result);
        }).catch((err)=>{
            next(errorMethods.sendServerError(err));
        });
    }
}

/**
 * Payment api
 * @route POST /api/pay
 * @group public - Operations about payment
 * @returns {object} 200 - An object of payment details info
 * @returns {Error}  default - Unexpected error
 */
//api is called to place an order at the razorpay api for creating a subscription basically
// function placeOrder(req, res, next) {
//     var paymentData=req.body;

//     //Validating the input entity
//     var json_format = iValidator.json_schema(schema.createSubscriptionSchema, paymentData, "payment");
//     if (json_format.valid == false) {
//         return res.status(422).send(json_format.errorMessage);
//     }

//     var context = currentContext.getCurrentContext();
//     let plan;
// //from razorpay service, get all the plans
//     razorPayService.getAllPlans().then((plans)=>{
// //from the razorpay plans, identify the one that's been sent in our paymentdata's plan
//        plan = _.find(plans.items, function(o) { return o.item.name == paymentData.plan; });
// //creates a subs object with planId and orgId
//        let subscription = {
//         'planId': plan.id,
//         'orgnisationId': context.organizationId
//         };
// //creates a subscription at razorpay directly
//         razorPayService.createSubscription(subscription).then((data)=>{
//             console.log("Razor pay data: " +  JSON.stringify(data));
//             res.json(data);
//         }).catch((err)=>{
//             res.json({"success":false, "err": JSON.stringify(err)})
//         })
//     }).catch((err)=>{
//         console.log("Error while fetching plans");
//         next(errorMethods.sendBadRequest(errorCode.INVALID_PLAN));

//     });
    
// };

/**
 * Payment api
 * @route POST /api/pay/success
 * @group public - Operations about payment
 * @returns {object} 200 - An object of payment details info
 * @returns {Error}  default - Unexpected error
 */
//when payment is successful, this api is called to update org data and create a billingg
// function paymentDone(req, res, next) {
//     var paymentData=req.body;
    
//     //Validating the input entity
//     var json_format = iValidator.json_schema(schema.paymentSuccessSchema, paymentData, "payment");
//     if (json_format.valid == false) {
//         return res.status(422).send(json_format.errorMessage);
//     }
    
//     var context = currentContext.getCurrentContext();

//     console.log(context);
// //get the orgId by using workspaceId
//     organizationService.getOrganizationByWorkspaceId(context.workspaceId).then((orgId)=>{
// //use that orgId to get org data
//     organizationService.getOrganizationById(orgId).then((org1)=>{
// //create a copy of org data in a variable called org
//         let org = JSON.parse(JSON.stringify(org1));
// //since this api is being called when payment is successful, so we set substype as paid
//         org.subscriptionType = SubscriptionTypes.PAID;
// //today's date becomes the subs started date
//         org.subscriptionStarted = new Date();
// //creates a billingId for our d.b where we take subsId from what comes from razorpay
//         org.billingId = paymentData.subscriptionId;
// //in the org object, set the billingType (basically plans like astronaut, colony etc.)
//         org.billingType = paymentData.plan;
// //gets the currentPlan by comparing from plansjson and what we received in paymentData object
//         let currentPlan = _.find(plansjson.plans, function(o) { return o.name == paymentData.plan; });
// //creates a new value called amount inside the paymentData object which will be equal to the 
// //current plan's (value just got above) amount     
//         paymentData.amount = currentPlan.amount; 
//         var currentDate = new Date();
// //adding 30 days to currentdate
//         currentDate.setDate(currentDate.getDate() + 30);
// //setting the exp date of the subs to 30 days in future
//         org.expirationDate = currentDate;
// //the billinginfo object has various values and we set its cancellatio_request to false, as payment
// //has just been successful so it's important to set this to false, in case it's true from before
//         org.billingInfo = { cancellation_request : false }
// //checks if the org is active, then goes inside the braces
//         if(org.status == Status.ACTIVE){
            
//             //monthly billing
// //since we already checked for this org status as active before entering the braces, doesn't make sense
// //to again set it to active?
//             org.status = Status.ACTIVE;
// //billing type in our d.b is same as a razorpay plan
//             org.billingType = paymentData.plan;
// //uupdating the data of the org by sending the org i.d and the org data
//             organizationService.updateOrganization(org._id, org).then((data) => {
// //billingData object will have transaction Id, status, paymentdata and orgId
//                 var billingData = {
//                     'transactionId': uuidv4(),
//                     'status': 'SUCCESS',
//                     'data': paymentData,
//                     'organizationId': org._id
//                 }
// //since billings exist at the dominate master d.b level, we switch context to that                
//                 context.workspaceId = config.master_schema;
// //with the billing data object just created, we call the add billing service
//                 billingService.addBilling(billingData).then((bill)=>{
//                     res.json({'success': true,'message': 'Organisation subscription updated'});
//                 }).catch((err)=>{
//                     console.log("err:" + err);
//                     next(errorMethods.sendServerError(err));    
//                 });
//             });
//         }else{
// //if org status is not active, even then we set it to active            
//             //monthly billing
//             org.status = Status.ACTIVE;
//             org.billingType = paymentData.plan;
// //get the support user's roole from switch role service
//             switchRoleService.getSupportUserRole().then((userRoledata)=>{
// //update the org by sending orgid and org's data
//                 organizationService.updateOrganization(org._id, org).then((data) => {
// //switch the role to support user from admin user, but why?
//                 switchRoleService.performSwitchRole(userRoledata.supportUser, userRoledata.adminRole).then((switchRoleData)=>{
// //create a billing data object
//                     var billingData = {
//                         'transactionId': uuidv4(),
//                         'status': 'SUCCESS',
//                         'data': paymentData,
//                         'organizationId': org._id
//                     };
        
        
//                     var context = currentContext.getCurrentContext();
// //set context to master d.b
//                     context.workspaceId = config.master_schema;
// //add billing data        
//                     billingService.addBilling(billingData).then((bill)=>{
//                         res.json({'success': true,'message': 'Organisation subscription updated'});
//                     }).catch((err)=>{
//                         console.log("err:" + err);
//                         next(errorMethods.sendServerError(err));    
//                     });
//                 }).catch((err)=>{
//                     next(errorMethods.sendServerError(err));
//                 });
//                 }).catch((err) => {
//                 next(errorMethods.sendServerError(err));
//                 });
        
//             });
//             }
        
//     }).catch((err)=>{
//         console.log(err);
//         next(errorMethods.sendBadRequest(errorCode.ORGANIZATION_DOES_NOT_EXIST));
//     })
//     });

// };

/**
 * Payment api
 * @route GET /api/pay
 * @group public - Operations about payment
 * @returns {object} 200 - An object of payment details info
 * @returns {Error}  default - Unexpected error
 */
//get all past pyments from razorpay service
// function getOrder(req, res, next) {
//     razorPayService.fetchPayments().then((data)=>{
//         console.log("Razor pay data: " +  JSON.stringify(data));
//         res.json(data);
//     }).catch((err)=>{
//         res.json({"success":false})
//     })
// };

/**
 * Payment using existing card , send email to admin api
 * @route POST /api/pay/existing
 * @group public - Operations about payment
 * @returns {object} 200 - An object of payment details info
 * @returns {Error}  default - Unexpected error
 */
//this api is just sending an email to the dominate admin to tell him that payment for this workspace
//needs to be done, maybe admin will try manually from his side?
function payUsingExistingCard(req, res, next) {
    var context = currentContext.getCurrentContext();
    organizationService.getOrganizationById(context.organizationId).then((org)=>{
        if(org.status == Status.EXPIRED){
//enters this code if org is expired, we're basically only sending an email here to the dominate admin
            let emailData = {
                'entityType':'LEAD',
                'entityId':'123',
                'to': config.dominateAdminEmail,
                'status': 'NEW',
                'subject':'Attempt the payment for workspace: ' +  context.workspaceId,
                'body': 'WorkspaceId: ' + context.workspaceId + ', SubscriptionId: ' +  org.billingId 
                + ', Please attempt the subscription payment capture.'
            }
            emailService.addEmail(emailData).then((data)=>{
                res.json(data);
            }).catch((err)=>{
                console.log("Error while sending email:" + err);
                next(errorMethods.sendBadRequest(errorCode.INVALID_INPUT));
            })
        }else{
            next(errorMethods.sendBadRequest(errorCode.INVALID_INPUT));
        }
    }).catch((err)=>{
        next(errorMethods.sendBadRequest(errorCode.ORGANIZATION_DOES_NOT_EXIST));
    });
    

};

module.exports.init = init;