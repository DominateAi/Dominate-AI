var currentContext = require('../../common/currentContext');
var configResolve = require("../../common/configResolver");
var config = configResolve.getConfig();
var organizationService = require('../services/organization.service');
// THIS ORGANISATION SERVICE IS ALWAYS AN EMPTY OBJECT
var switchRoleService = require('./switchRole.service');
var eventService = require('./event.service');
const Status = require('../../common/constants/Status');
var organisationModel = require('../models/organization.model');
var bilingModel = require('../models/billing.model');
var mailer = require('../../common/aws_mailer');
const uuidv4 = require('uuid/v4');


var paymentService = {
    handleActivation:handleActivation,
    handleSubscriptionCharged:handleSubscriptionCharged,
    handleSubscriptionPending:handleSubscriptionPending,
};


function handleActivation( eventBody ){

} 

//this function handles the event where subscription has been charged to company
//we have to do multiple things to 
function handleSubscriptionCharged( eventBody ){
    return new Promise( async ( resolve, reject ) => {
        try{
            var context = currentContext.getCurrentContext();
//if there's no context, set only workspace value in it of dominate_master d.b
            if( !context ){
                var context = { workspaceId : config.master_schema }
                currentContext.setCurrentContext( context );
            }
//calls the handleeventsave function below in this file
            let eventData = await handleEventSaveProcess( eventBody );
            if( eventData && eventBody.payload.subscription.entity.paid_count !== 1 ){
                console.log("Inside");
//the eventBody payload will have subs id
                const sub_id = eventBody.payload.subscription.entity.id;
//we have to find an org with that subs id
                let organisationData = await findOrganisationWithSubscriptionid( sub_id );
//if there is org with that subs id, then proceed
                if( organisationData ){
                    let copyOrganisationData = JSON.parse( JSON.stringify( organisationData ) );
//we have various variables like cancel_req, pendingstate, manual request gen and failed etc.
//that help us process different eventualities, these all have to be set to false for now as subs 
//has been charged, which means all this is false
                    organisationData.billingInfo = {
                        cancellation_request :false,
                        isOrganisationAtPendingState:false,
                        isManualRequestGenerated:false,
                        isManualRequestFailed:false
                    }
//setting the status as active org (sub payment has just been charged)
                    organisationData.status = Status.ACTIVE;
//takes current date as todays date
                    var currentDate = new Date();
//adds 30 days to todays date to set the expiration date of current plan
                    currentDate.setDate(currentDate.getDate() + 30);
//since subs just got charged, we have set expiration date to todays date, next month
                    organisationData.expirationDate = currentDate;
//with all the new info like exp date and billing info, we will update the org data in d.b
                    let updateOrganisation = await organisationModel.updateById( organisationData._id, organisationData );
//if the data was updated for the org, then carry out the steps inside braces
                    if( updateOrganisation ){
                        var context = {};
                        context.workspaceId = organisationData.workspaceId;
//you set the context with the workspace Id of the organization
                        currentContext.setCurrentContext(context);
//copyorg is the object in which we had copied data of org earlier, we're checking if it had expired(why?)
                        if( copyOrganisationData.status == Status.EXPIRED ){
//gets support user role from d.b
                            let userRoledata = await switchRoleService.getSupportUserRole();
                            console.log( userRoledata.supportRole, userRoledata.adminRole );
//switches role from admin to support role (why?)
                            let switchRoleData = await switchRoleService.performSwitchRole(userRoledata.supportUser, userRoledata.adminRole);
                            console.log( switchRoleData, "Roles changed" ); 
                        } 
//we create a billing after subscription was charged, this function is defined later in this file
                        await createabilling( organisationData, eventBody, sub_id );   
                    } else {
//if the org was not updated
                        console.log("Cannot update organisation");
                    }
                } else {
//if the org was not found with that subs id
                    console.log( "Organisation Not found" );
                }
            } else {
//if there's no event data or if paid count is equal to 1 (why?)
                console.log("False event")
            }
        } catch ( err ){
            reject( err );
        }
    });
}

function handleSubscriptionPending( eventBody ){
    return new Promise( async (resolve, reject) => {
        try{
//get the curernt context
            var context = currentContext.getCurrentContext();
//if no context exists, go inside the braces code
            if( !context ){
//set the context to workspace id of the dom master as that's where billings and orgs reside
                var context = { workspaceId : config.master_schema }
                currentContext.setCurrentContext( context );
            }
//save this event at d.b level at the master d.b level
            let eventData = await handleEventSaveProcess( eventBody );
            if( eventData ){
//if eventdata was saved, take subs id as the id received in the payload
                const sub_id = eventBody.payload.subscription.entity.id;
//find the org with the subs id received in payload
                let organisationData = await findOrganisationWithSubscriptionid( sub_id );
//if it exists, go inside the braces
                if( organisationData ){
//if org is in pending state and manual request for payment is generated
                    if( organisationData.billingInfo.isOrganisationAtPendingState && organisationData.billingInfo.isManualRequestGenerated ){
//save the org data in a variable called neworgdata
                        let newOrgData = JSON.parse( JSON.stringify( organisationData ) );
//set the manualreqfailed variable to true inside neworgdata's billing info
                        newOrgData.billingInfo.isManualRequestFailed  = true;
//update the org data by sending neworgdata
                        let orgUpdate = await organisationModel.updateById( newOrgData._id , newOrgData );
                        if( orgUpdate ){
//if it gets updated, then resolve true
                            resolve(true);
                        }
                    } else {
//calls the changeorgstatettopending func below in this file itself
//*****possible issue is that update will always happen, code will never reach here (when shud the code reach here anyway?) */
                        let expireOrganisation = await changeOrganisationStateToPending( organisationData );
                        let emailData = {
//there's a default user for each org that gets contacted everytime
                            'to': expireOrganisation.defaultUserEmailId,
//sending an email telling the user that subs has been paused due to payment failure
                            'subject': "Subscription Paused | Due to Payment Failure",
                            'body': "Hello user, Your Subscription of " + config.app_name + " has been paused because of the payment Failure at date" + new Date()
                        }
                        mailer.mail(emailData.to, emailData.subject, emailData.body, '');
                        resolve(expireOrganisation);
                    }
                }  else {
                    console.log( "Organisation Not found" );
                }
            } else {
                console.log("False event")
            }
        } catch ( err ){
            reject( err );
        }
    });
}


// NORMAL FUNCTIONS
function findOrganisationWithSubscriptionid( sub_id ){
   return new Promise( async ( resolve, reject ) => {
       try{
        let organisationData = await organisationModel.searchOne({ billingId : sub_id });  
        resolve( organisationData );
       } catch( err ){
           reject( err );
       }
   });
}

function handleEventSaveProcess( eventBody ){
    return new Promise( async ( resolve, reject ) => {
        try{
//first checks if this event exists in the d.b
        const eventExist = await eventService.exist(eventBody);
        if (!eventExist) {
//if event doesn't exist, creates a new event at d.b level at event service
            let eventData = await eventService.addEvent(eventBody);
            resolve( eventData );
        } else {
//if event exists, resolve false
            resolve( false );
        }
        } catch( err ){
            reject( err );
        }
    });
}

function changeOrganisationStateToPending( organisation ){
    return new Promise( async ( resolve, reject ) => {
        try{
//sets org status to expired
            organisation.status = Status.EXPIRED;
            var billingInfo = organisation.billingInfo;
            organisation.billingInfo = { 
                cancellation_request :billingInfo.cancellation_request,
//sets org to pending state
                isOrganisationAtPendingState:true,
                isManualRequestGenerated:false,
                isManualRequestFailed:false
            };
//updates the org
            let updateOrganisation = await organisationModel.updateById( organisation._id, organisation );
            if( updateOrganisation ){
                // SWITCH ROLES
                var context = {};
//sets context to org's workspace id
                context.workspaceId = organisation.workspaceId;
                currentContext.setCurrentContext(context);
//gets the admin user role (why does it say undefined in the bracket?)
                let userRoledata = await switchRoleService.getAdminUserRole(undefined);
                console.log( userRoledata );
//switches to admin from support role
                let switchRoleData = await switchRoleService.performSwitchRole(userRoledata.adminUser, userRoledata.supportRole);
                console.log( switchRoleData, "Data changes" );
                resolve( updateOrganisation );
            }              
        } catch ( err ){
            reject( err );
        }
    });
}

function createabilling( organisation, eventBody, sub_id ){
    return new Promise( async ( resolve, reject ) => {
        try{
//paydata has workspace id, orgid, plan is always spaceship, why?
//because when we are creating a trial org, we are keeping plan for all as spaceship, to avoid confusion as 
//to which plan's free trial the user is taking because during free trial they would like to add and remove a lot of people
//****but maybe this is not relevant here because this is creating an actual billing?             
let paymentData = {
                "workspaceId" : organisation.workspaceId,
                "organizationId" : organisation._id,
                "plan" : "SPACESHIP",
//success is true as we are creating a billing when payment is charged
                "success" : true,
                "subscriptionId" : sub_id,
                "paymentId" : eventBody.payload.payment.entity.id,
                "amount" : eventBody.payload.payment.entity.amount
            };
            var billingData = {
                'transactionId': uuidv4(),
                'status': 'SUCCESS',
//payment data object created above is used as data variable here 
                'data': paymentData,
                'organizationId': organisation._id,
                createdBy : organisation.defaultUserEmailId,
                lastModifiedBy : organisation.defaultUserEmailId
        
            };
            var context = currentContext.getCurrentContext();
//we're setting the context workspace to master_schema because billings and organizations exist there?
                context.workspaceId = config.master_schema;
//creates a new billing in d.b
                bilingModel.create( billingData ).then((bill)=>{
                    console.log({'success': true,'message': 'Billing has been subscription updated'});
                    resolve( bill );
                }).catch((err)=>{
                    console.log("err:" + err);   
                });
        } catch( err ){
            reject( err );
        }
    });
}


module.exports = paymentService;