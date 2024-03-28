var currentContext = require('../../../../common/currentContext');
var configResolve = require("../../../../common/configResolver");
var config = configResolve.getConfig();
var simpleOauth = require('simple-oauth2');
var connectServices = require('../../../services/connect.service');
require("isomorphic-fetch");
var  Client  = require("@microsoft/microsoft-graph-client").Client;


var microsoftEmailServices = {
    setMicroSoftAuthentication:setMicroSoftAuthentication,
    sendNewEmails:sendNewEmails,
    getThreads:getThreads,
    deleteThread:deleteThread,
    replyMessage:replyMessage,
    replyAllMessage:replyAllMessage,
    forwardMessage:forwardMessage
}

function setMicroSoftAuthentication( accessToken ){
    return new Promise( async ( resolve, reject ) => {
        try{
            const client = Client.init({
                defaultVersion: "v1.0",
                debugLogging: true,
                authProvider: (done) => {
                    done(null,accessToken );
                }
            });
            resolve( client );
        } catch ( err ){
            reject( err );
        }
    });
}

function sendNewEmails( owaClient, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let send_email = await owaClient.api(`/me/sendMail`).post(body);
            resolve( send_email );
        } catch ( err ){
            reject( err );
        }
    })
}

function getThreads( owaClient, query ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let params = "?count=true&$top=10";
            let mailFolder = "Inbox";
            if( query.skip ){
                params = params+`&skip=${ query.skip }`;
            }
            if( query.labelIds !== undefined && query.labelIds !== "undefined" ){
                mailFolder = query.labelIds;
                if(query.labelIds === "Outbox"  ){
                    mailFolder="SentItems";
                }
            }
            let get_threads = await owaClient.api(`/me/mailFolders/${mailFolder}/messages${params}`).get();
            resolve( get_threads );
        } catch ( err ){
            reject( err );
        }
    })
}

function deleteThread( owaClient, body ){
    return new Promise(async ( resolve, reject ) => {
        try{
            let delete_email =  await owaClient.api(`/me/messages/${body.id}`).delete();
            resolve( delete_email );
        } catch ( err ){
            reject( err );
        }
    }) 
}

function replyMessage( owaClient, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let reply_message =  await owaClient.api(`/me/messages/${body.id}/reply`).post( body );
            resolve( reply_message );
        } catch ( err ){
            reject( err );
        }
    })
}

function replyAllMessage( owaClient, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let replyall_message =  await owaClient.api(`/me/messages/${body.id}/replyAll`).post( body );
            resolve( replyall_message );
        } catch ( err ){
            reject( err );
        }
    })
}

function forwardMessage( owaClient, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let forward_message =  await owaClient.api(`/me/messages/${body.id}/forward`).post( body );
            resolve( forward_message );
        } catch ( err ){
            reject( err );
        }
    })
}


module.exports = microsoftEmailServices;