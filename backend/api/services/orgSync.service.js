const SubscriptionTypes = require('../../common/constants/SubscriptionTypes');
const moment = require('moment');
var Status = require('../../common/constants/Status');
var organizationService = require("../services/organization.service");
const switchRoleService = require('../services/switchRole.service');
var mailer = require('../../common/aws_mailer');
var config = require("../../common/configResolver").getConfig();
var currentContext = require('../../common/currentContext');
const notificationClient = require('../../common/notificationClient');
const OrganizationTypes = require('../../common/constants/OrganizationTypes');
const NotificationType = require('../../common/constants/NotificationType');

var orgSyncService = {
    syncOrganizations: syncOrganizations,
    syncOrganisationCancellation: syncOrganisationCancellation,
}

function syncOrganizations(){
    return new Promise((resolve, reject) => {
        organizationService.getAllOrganizations().then(async (data) => {
            for( const org of data){
                try{
                    console.log("Processing org:"+  org.workspaceId);    
                    executeRules(org);
                    console.log("Completed Processing of org:"+  org.workspaceId);
                }catch(err){
                    console.log("Sync org failed for Org:" + org.workspaceId + ", err:" + err);
                }
            }
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function executeRules(org){
    return new Promise(async(resolve, reject) => {
        console.log("Syncing org: " + org.workspaceId );
        var context = {};
        context.workspaceId = org.workspaceId;
        currentContext.setCurrentContext(context);

        remaining5daysForTrailPeriod(org).then((rule1Result)=>{
            afterTrailPeriodEnd(org).then((rule2Result)=>{
                after60daysOfDeactivation(org).then((rule3Result)=>{
                    resolve("Done");
                }).catch((err3)=>{
                    console.log("Error while processing rule3 for org:"+ org + " ,Error:" +  err3 );
                    reject("Error for org:" + org);
                });
            }).catch((err2)=>{
                console.log("Error while processing rule2 for org:"+ org  + " ,Error:" +  err2 );
                reject("Error for org:" + org);
            });
        }).catch((err1)=>{
            console.log("Error while processing rule1 for org:"+ org  + " ,Error:" +  err1 );
            reject("Error for rule1 org:" + org);
        });
        //await afterTrailPeriodEnd(org);
        //await markOrgAsExpired(org);
        //await after60daysOfDeactivation(org);
    });
}


async function remaining5daysForTrailPeriod(org){
    return new Promise(async(resolve, reject) => {
        console.log("Operation1:remaining5daysForTrailPeriod, Syncing org: " + org.workspaceId );
        let currentDate = moment();
        let orgExpirationDate = moment(org.expirationDate);
        let daysRemaining = orgExpirationDate.diff(currentDate, 'days');
        let is5dayPendingForTrialEnd = daysRemaining <= 5 && daysRemaining > 0 ? true: false; 
        if(org.organizationType == OrganizationTypes.CUSTOMER && org.status == Status.ACTIVE && org.subscriptionType == SubscriptionTypes.FREE && is5dayPendingForTrialEnd){
            let userRoledata = await switchRoleService.getAdminUserRole(undefined);
            let toUser = userRoledata.adminUser != null ? userRoledata.adminUser : userRoledata.supportUser;
            if(userRoledata != undefined && toUser != undefined){
                
                let emailData = {
                    'to': toUser.email,
                    'subject': config.app_name +  " | " + daysRemaining + " days are remaining for your trial period to expire, Please buy a subscription for your organisation (" + org.workspaceId + ")",
                    'body': config.app_name + " " + daysRemaining + " days are remaining for your trial period to expire, Please buy a subscription for your organisation" 
                }
                console.log("Sending email to :" + emailData.to);
                try{
                    await mailer.mail(emailData.to, emailData.subject, emailData.body);
                    console.log("Org: " + org.workspaceId +",Email send to: " + emailData.to);
                }catch(err){
                    console.log("Error while sending email to Org: " + org.workspaceId +",Email send to: " + emailData.to);
                    reject(err);
                }
                var activity = {
                    'entityType': "Organization",
                    'entityId' : org._id,
                    'workspaceId': org.workspaceId,
                    'data': org,
                    'activityType': NotificationType.ORGANIZATION_MAKE_PAYMENT
                }
                notificationClient.notify(activity.activityType, activity, org.workspaceId, toUser._id);
                resolve("true");

            }
        }else{
            resolve("true");
        }
        
 
    });
}


async function afterTrailPeriodEnd(org){
    return new Promise(async(resolve, reject) => {
        console.log("Operation2:afterTrailPeriodEnd, Syncing org: " + org.workspaceId );
        let currentDate = moment();
        let orgExpirationDate = moment(org.expirationDate);
        let isTrialEnd = orgExpirationDate.diff(currentDate, 'days') <= 0 ? true: false; 
        if(org.organizationType == OrganizationTypes.CUSTOMER && org.status == Status.ACTIVE && org.subscriptionType == SubscriptionTypes.FREE && isTrialEnd){
            //org.status = Status.EXPIRED;
            let userRoledata = await switchRoleService.getAdminUserRole(undefined);
            organizationService.updateOrganization(org._id, org).then((updateData)=>{
                let toUser = userRoledata.adminUser != null ? userRoledata.adminUser : userRoledata.supportUser;

                if(userRoledata != undefined && toUser != undefined && userRoledata.adminUser != undefined && userRoledata.supportRole != undefined ){
                    switchRoleService.performSwitchRole(userRoledata.adminUser, userRoledata.supportRole).then(async (data)=>{
                        console.log("Org:" + org.workspaceId + ", role switched to support of admin user");
                        
                        let emailData = {
                            'to': toUser.email,
                            'subject': config.app_name +  " | Deactivating your organisation (" + org.workspaceId + ") due to non-payment of funds",
                            'body':"Dear valued customer, We are sorry to inform you that the account for your organization on our platform,"+ config.app_name + "is being discontinued due to non-payment for funds, if you wish to continue your service, kindly log back in and make the payments. If you're having issues with the payment gateway, kindly drop us an email @akhil.sharma@myrl.tech so that we can connect with you " 
                        };

                        try{
                            await mailer.mail(emailData.to, emailData.subject, emailData.body);
                            console.log("Org: " + org.workspaceId +",Email send to: " + emailData.to);
                        }catch(err){
                            console.log("Error while sending email to Org: " + org.workspaceId +",Email send to: " + emailData.to);
                            reject(err);
                        }
                        var activity = {
                            'entityType': "Organization",
                            'entityId' : org._id,
                            'workspaceId': org.workspaceId,
                            'data': org,
                            'activityType': NotificationType.ORGANIZATION_DEACTIVATED
                        }
                        notificationClient.notify(activity.activityType, activity, org.workspaceId, toUser._id);
                        
                        resolve("true");
                    
                    
                    });
                }
                resolve("true");
            }).catch((err)=>{
                console.log("Error while updating org:" + org + ", err:" + err);
                reject("false");
            });
        }else{
            resolve("true");
        }
        
    });
}

async function markOrgAsExpired(org){
    return new Promise(async(resolve, reject) => {
        console.log("Operation3:afterTrailPeriodEnd, Syncing org: " + org.workspaceId );
        let currentDate = moment();
        let orgExpirationDate = moment(org.expirationDate);
        let isExpired = orgExpirationDate.diff(currentDate, 'days') <= 0 ? true: false; 
        if(org.organizationType == OrganizationTypes.CUSTOMER && org.status == Status.ACTIVE && isExpired){
            org.status = Status.EXPIRED;
            org.deactivatedOn = currentDate.toDate();
            let userRoledata = await switchRoleService.getAdminUserRole(undefined);
            organizationService.updateOrganization(org._id, org).then((updateData)=>{
                let toUser = userRoledata.adminUser != null ? userRoledata.adminUser : userRoledata.supportUser;

                if(userRoledata != undefined && toUser != undefined && userRoledata.adminUser != undefined && userRoledata.supportRole != undefined ){
                    switchRoleService.performSwitchRole(userRoledata.adminUser, userRoledata.supportRole).then((data)=>{
                        console.log("Org:" + org.workspaceId + ", role switched to support of admin user");
                        
                        let emailData = {
                            'to': toUser.email,
                            'subject': config.app_name +  " | Deactivating your organisation (" + org.workspaceId + ") data due payment not done",
                            'body': config.app_name + " is deactivating your organisation due to no payment received" 
                        }
                        mailer.mail(emailData.to, emailData.subject, emailData.body).then((result)=>{
                        console.log("Org: " + org.workspaceId +",Email send to: " + emailData.to);
                        }).catch((err)=>{
                            reject(err);
                        });
                        var activity = {
                            'entityType': "Organization",
                            'entityId' : org._id,
                            'workspaceId': org.workspaceId,
                            'data': org,
                            'activityType': NotificationType.ORGANIZATION_DEACTIVATED
                        }
                        notificationClient.notify(activity.activityType, activity, org.workspaceId, toUser._id);
                        
                        resolve("true");
                    
                    
                    });
                }
                resolve("true");
            }).catch((err)=>{
                console.log("Error while updating org:" + org + ", err:" + err);
                reject("false");
            });
        }else{
            resolve("true");
        }
        
    });
}

async function after60daysOfDeactivation(org){
    return new Promise(async(resolve, reject) => {
        console.log("Operation4:after60daysOfDeactivation, Syncing org: " + org.workspaceId );
        let currentDate = moment();
        let orgDeactivatedOn = moment(org.deactivatedOn);
        let isDeactivedPeriodMoreThan60days = currentDate.diff(orgDeactivatedOn, 'days') > 60 ? true: false; 
        if(org.organizationType == OrganizationTypes.CUSTOMER && org.status == Status.EXPIRED && isDeactivedPeriodMoreThan60days){
            org.status = Status.ARCHIVE;
            let userRoledata = await switchRoleService.getAdminUserRole(undefined);
            organizationService.updateOrganization(org._id, org).then(async (updateData)=>{
                console.log("Org:" + org.workspaceId + ", status changed to archive");

                let toUser = userRoledata.adminUser != null ? userRoledata.adminUser : userRoledata.supportUser;
                
                if(userRoledata != undefined && toUser != undefined ){
                    let emailData = {
                        'to': toUser.email,
                        'subject': config.app_name +  " | Wiping your organisation (" + org.workspaceId + ") data due inactivity for 60 days",
                        'body': config.app_name + " is wiping your organisation data due there was no action for 60 days" 
                    }
                    try{
                        await mailer.mail(emailData.to, emailData.subject, emailData.body);
                        console.log("Org: " + org.workspaceId +",Email send to: " + emailData.to);
                    }catch(err){
                        console.log("Error while sending email to Org: " + org.workspaceId +",Email send to: " + emailData.to);
                        reject(err);
                    }
                    var activity = {
                        'entityType': "Organization",
                        'entityId' : org._id,
                        'workspaceId': org.workspaceId,
                        'data': org,
                        'activityType': NotificationType.ORGANIZATION_ARCHIVE
                    }
                    notificationClient.notify(activity.activityType, activity, org.workspaceId, toUser._id);
                    resolve("true");
                }
            }).catch((err)=>{
                console.log("Error while updating org:" + org + ", err:" + err);
                reject("false");
            });
        }else{
            resolve("true");
        }
    });
}

function syncOrganisationCancellation(){
    return new Promise( async ( resolve, reject ) => {
        organizationService.getAllOrganizations().then(async (data) => {
            let i = 0;
            while( i < data.length ){
                const dataEach = data[i];
                var currentDate = new Date();
                var cancelRequest = dataEach.billingInfo ? dataEach.billingInfo.cancellation_request : false;
                if( currentDate.getTime() >= dataEach.expirationDate && dataEach.workspaceId !== "dominateadmin" && cancelRequest === true ){
                    // SET THE CONTEXT
                    var context = {};
                    context.workspaceId = dataEach.workspaceId;
                    currentContext.setCurrentContext(context);
                    // EXPIRE THE ORGANISATION
                    let userRoledata = await switchRoleService.getAdminUserRole(undefined);
                    let organisationUpdate = await expireOrganisation( dataEach );
                    if( organisationUpdate ){
                        let switchRoleData = await switchRoleService.performSwitchRole(userRoledata.adminUser, userRoledata.supportRole);
                        console.log( switchRoleData, "Data changes" );
                        await razorPayService.cancelSubscription(dataEach.billingId, false);
                    }
                    // SET USER'S TO SUPPORT ROLE.
                } else {
                    console.log("Not Expired");
                }
                i++;
                resolve( "OK" );
            }
        })
        .catch( err => reject( err ) )
    });
}

function expireOrganisation( organisation ){
    return new Promise( async ( resolve, reject ) => {
        try{
            organisation.status = Status.EXPIRED;
            let updateOrganisation = await organizationService.updateOrganization( organisation._id, organisation );
            resolve( updateOrganisation );
        } catch ( err ){
            console.log( err )
            reject( err );
        }
    });
}


module.exports = orgSyncService;