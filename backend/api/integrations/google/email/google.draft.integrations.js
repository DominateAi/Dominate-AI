var currentContext = require('../../../../common/currentContext');
var configResolve = require("../../../../common/configResolver");
var connectServices = require('../../../services/connect.service');
var config = configResolve.getConfig();
const {google} = require('googleapis');
let mailComposerServices = require('../../common/mailComposer');
let mailComposer = require('nodemailer/lib/mail-composer');


var googleDraftServices = {
    setGmailAuthentication:setGmailAuthentication,
    getAllDrafts:getAllDrafts,
    getMessagesById:getMessagesById,
    createNewDraft:createNewDraft,
    updateDraft:updateDraft,
    deleteDraft:deleteDraft,
    sendDraft:sendDraft,

}

function setGmailAuthentication( oauth2Client ){
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

function getAllDrafts( oauth2Client, options ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let gmailClient = await setGmailAuthentication( oauth2Client );
            let res = await gmailClient.users.drafts.list({
                'userId': "me",
                maxResults:10
              });
              let all_drafs = res.data.drafts;
              if( all_drafs ){
                let All_promise = [];
                all_drafs.forEach( data => {
                  All_promise.push( getMessagesById( oauth2Client, data.message.id ) );
                })
                Promise.all( All_promise ).then( data =>{
                  resolve({
                      messages:data,
                      threads:res.data
                  })
                })
                .catch( err =>  {
                    console.log( err );
                })
              } else {
                resolve({
                    messages:[],
                    threads:res.data
                }) 
              }
        } catch ( err ){
            reject( err );
        }
    });
}

function getMessagesById( oauth2Client, id, options){
    return new Promise( async ( resolve, reject ) => {
        try{
            let gmailClient = await setGmailAuthentication( oauth2Client );
            let res = await gmailClient.users.messages.get({
                userId:"me",
                id:id,
            })
            resolve( res.data );
        } catch ( err ){
            reject(err )
        }
    })
}

function createNewDraft( oauth2Client, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let gmailClient = await setGmailAuthentication( oauth2Client );
            let mailBody = await mailComposerServices( body );
            // console.log( mailBody );
            let res = await gmailClient.users.drafts.create({
                userId:"me",
                requestBody: {
                    message:{
                        raw:mailBody
                    }  
                }
            });
            resolve( res );
        } catch ( err ){
            console.log( err );
            reject( err );
        }
    });
}

function updateDraft( oauth2Client, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let gmailClient = await setGmailAuthentication( oauth2Client );
            let mailBody = await mailComposerServices( body );
            // let messages = await getMessagesById( oauth2Client, body.id )
            // let rough = messages.payload.headers;
            // for(i in rough){
            //     if (rough[i].name == 'Message-Id'){
            //        sambar =  rough[i].value
            //     }
            // }
            
            let res = await gmailClient.users.drafts.update({
                userId: "me",
                //id:"174fe1dacb1cff77",
                id: body.id,
                resource:{
                    id: body.id,
                    //id:"174fe1dacb1cff77",
                    message:{
                        raw:mailBody
                    }
                },
                send:false
            });
            resolve( res );
        } catch ( err ){
           // console.log( err );
            reject( err );
        }
    });
}

function deleteDraft( oauth2Client, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            console.log( body );
            let gmailClient = await setGmailAuthentication( oauth2Client );
            let res = await gmailClient.users.drafts.delete({
                userId: "me",
                id:body.id
            });
            resolve( res );
        } catch ( err ){
            reject(err);
        }  
    })
}

function sendDraft( oauth2Client, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let gmailClient = await setGmailAuthentication( oauth2Client );
            let mailBody = await mailComposerServices( body );
            let res = await gmailClient.users.drafts.send({
                userId: "me",
                id: body.id,
                resource:{
                    id: body.id,
                    message:{
                        raw:mailBody
                    }
                },
                send:true
            });
            resolve( res );
        } catch ( err ){
            console.log( err );
            reject( err );
        }
    });
}

// function createNewDraft( oauth2Client, body ){
//     return new Promise( async ( resolve, reject ) => {
//         try{
//             let gmailClient = await setGmailAuthentication( oauth2Client );
//             let mail = new mailComposer(
//                 {
//                   to: "FAKE_EMAIL@gmail.com",
//                   text: "I hope this works",
//                   html: " <strong> I hope this works </strong>",
//                   subject: "Test email gmail-nodemailer-composer",
//                   textEncoding: "base64",
//                   attachments: [
//                     {   // encoded string as an attachment
//                       filename: 'text1.txt',
//                       content: 'aGVsbG8gd29ybGQh',
//                       encoding: 'base64'
//                     },
//                     {   // encoded string as an attachment
//                       filename: 'text2.txt',
//                       content: 'aGVsbG8gd29ybGQh',
//                       encoding: 'base64'
//                     },
//                   ]
//                 });
            
//               mail.compile().build( (error, msg) => {
//                 if (error) return console.log('Error compiling email ' + error);
            
//                 const encodedMessage = Buffer.from(msg)
//                   .toString('base64')
//                   .replace(/\+/g, '-')
//                   .replace(/\//g, '_')
//                   .replace(/=+$/, '');
            
//                   gmailClient.users.drafts.create({
//                     userId:"me",
//                     requestBody: {
//                         message:{
//                             raw:encodedMessage
//                         }  
//                     }
//                 }, (err, result) => {
//                   if (err) return console.log('NODEMAILER - The API returned an error: ' + err);
            
//                   console.log("NODEMAILER - Sending email reply from server:", result.data);
//                   resolve( result.data );
//                 });
            
//               })
//         } catch ( err ){
//             console.log( err );
//             reject( err );
//         }
//     });
// }
module.exports = googleDraftServices;