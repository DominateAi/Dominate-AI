var currentContext = require('../../../../common/currentContext');
var configResolve = require("../../../../common/configResolver");
var connectServices = require('../../../services/connect.service');
var config = configResolve.getConfig();
const {google} = require('googleapis');
let mailComposerServices = require('../../common/mailComposer');


var googleEmailServices = {
    setGmailAuthetication:setGmailAuthetication,
    sendNewEmails:sendNewEmails,
    getThreads:getThreads,
    updateThread:updateThread,
    updateMessageLabel:updateMessageLabel,
    deleteThread:deleteThread,
    getThreadMessages:getThreadMessages
}


function setGmailAuthetication( oauth2Client ){
    return new Promise( async ( resolve, reject ) => {
        try{
            const gmail = google.gmail({
                version: 'v1',
                auth: oauth2Client,
              });
              resolve( gmail );
        } catch ( err ){
            reject( err );
        }
    });
}

function sendNewEmails( oauth2Client, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let gmailClient = await setGmailAuthetication( oauth2Client );
            let mailBody = await mailComposerServices( body );
            let options = { raw:mailBody };
            if( body.threadId ){
                options.threadId = body.threadId
            }
            let res = await gmailClient.users.messages.send({
                userId:"me",
                requestBody: options
            });
            resolve( res );
        } catch ( err ){
            console.log( err );
            reject( err );
        }
    })
}

function getThreads( oauth2Client, query ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let options = {
                'userId': "me",
                maxResults:10,
            };
            console.log("here");
            if( query.labelIds !== undefined &&  query.labelIds !== "undefined"  ){
                options.labelIds = query.labelIds.split(",");
                console.log("here1");
            }
            if( query.q !== undefined &&  query.q !== "undefined"  ){
                options.q = query.q
                console.log("here2");
            }
            if( query.pageToken != undefined && query.pageToken !== "undefined" ){
                options.pageToken = query.pageToken
                console.log("here3");
            }
            let gmailClient = await setGmailAuthetication( oauth2Client );
            //this is the line with the problem (need to sort out)
            let res = await gmailClient.users.threads.list(options);
           
            console.log(res);
            if( res.data.threads === undefined ){
                console.log("here6");
                resolve([]);
            } else {
                console.log("here7");
                let all_threads = res.data.threads;
                let all_promise = [];
                console.log( all_threads.length );
                all_threads.forEach( data => {
                    all_promise.push( getThreadMessages( oauth2Client, data.id ) );
                })
                Promise.all( all_promise ).then( data => {
                    resolve({
                        messages:data,
                        threads:res.data
                    });
                }).catch( err => reject( err ) )
            }
        } catch ( err ){
            reject( err ); 
        }
    })
}


function updateThread( oauth2Client, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let gmailClient = await setGmailAuthetication( oauth2Client );
            let res = await gmailClient.users.threads.modify({
                'userId': "me",
                id:body.id,
                'addLabelIds': body.addLabelIds,
                'removeLabelIds': body.removeLabelIds
            });
            resolve( res.data );
        } catch ( err ){
            reject( err ); 
        }
    })
}

function updateMessageLabel( oauth2Client, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let gmailClient = await setGmailAuthetication( oauth2Client );
            let res = await gmailClient.users.messages.modify({
                'userId': "me",
                id:body.id,
                'addLabelIds': body.addLabelIds,
                'removeLabelIds': body.removeLabelIds
            });
            resolve( res.data );
        } catch ( err ){
            reject( err ); 
        }
    })
}


function deleteThread( oauth2Client, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let gmailClient = await setGmailAuthetication( oauth2Client );
            let res = await gmailClient.users.threads.trash({
                'userId': "me",
                id:body.id
            });
            resolve( res );
        } catch ( err ){
            reject( err ); 
        }
    })
}

function getThreadMessages( oauth2Client, id ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let gmailClient = await setGmailAuthetication( oauth2Client );
            let res = await gmailClient.users.threads.get({
                'userId': "me",
                id:id,
                format:"full"
            });
            resolve( res.data );
        } catch ( err ){
            reject( err ); 
        }
    })
}

module.exports = googleEmailServices;