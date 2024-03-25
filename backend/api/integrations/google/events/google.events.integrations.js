var currentContext = require('../../../../common/currentContext');
var configResolve = require("../../../../common/configResolver");
var connectServices = require('../../../services/connect.service');
var config = configResolve.getConfig();
const {google} = require('googleapis');


var googleEventsServices = {
    setEventsAuth:setEventsAuth,
    getAllEvents:getAllEvents,
    createNewEvents:createNewEvents,
    updateEvents:updateEvents,
    deleteEvents:deleteEvents,
    getTimeZone: getTimeZone
}

function setEventsAuth( oauth2Client ){
    return new Promise( async ( resolve, reject ) => {
        try{
            const people = google.calendar({
                version: 'v3',
                auth: oauth2Client,
              });
              resolve( people );
        } catch ( err ){
            reject( err );
        }
    });
}

function getTimeZone(oauth2Client, query){
    return new Promise( async ( resolve, reject ) => {
        try{
            let fields = {
                calendarId: 'primary',
                maxResults: 10,
                singleEvents: true
            }
            if( query.pageToken !== undefined && query.pageToken !== "undefined" ){
                fields.pageToken = query.pageToken;
            }
            let calendar = await setEventsAuth( oauth2Client );
            let res = await  calendar.events.list(fields);
            resolve( res.data.timeZone );
        } catch ( err ){
            reject( err );
        }
    });
}

function getAllEvents( oauth2Client, query ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let fields = {
                calendarId: 'primary',
                maxResults: 10,
                singleEvents: true
            }
            if( query.pageToken !== undefined && query.pageToken !== "undefined" ){
                fields.pageToken = query.pageToken;
            }
            let calendar = await setEventsAuth( oauth2Client );
            let res = await  calendar.events.list(fields);
            resolve( res.data );
        } catch ( err ){
            reject( err );
        }
    });
}

function createNewEvents( oauth2Client, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let calendar = await setEventsAuth( oauth2Client );
            let res = await calendar.events.insert({
                calendarId:'primary',
                requestBody:{
                    ...body
                },
                sendNotifications:true,
            });
            resolve( res.data );
        } catch ( err ){
            reject( err );
        }
    })
}


function updateEvents( oAuth2Client, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let calendar = await setEventsAuth( oAuth2Client );
            let res = await calendar.events.update({
                calendarId:'primary',
                requestBody:{
                    ...body
                },
                eventId:body.id,
                sendNotifications:true,
            });
            resolve( res.data );
        } catch ( err ){
            reject( err );
        }
    });
}

function deleteEvents( oAuth2Client, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            console.log( body );
            let calendar = await setEventsAuth( oAuth2Client );
            let res = await calendar.events.delete({
                calendarId:'primary',
                eventId:body.id,
                sendNotifications:true
            })
            resolve( res );
        } catch ( err ){
            reject( err );
        }
    });
}

//need to write code for updating contacts 
//but why is this in events and not in contacts?
function updateContacts( oAuth2Client, body ){

}

//need to write code for deleting contacts
//but why is this in events and not in contacts?
function deleteContacts( oAuth2Client, body ){    

}

module.exports = googleEventsServices;