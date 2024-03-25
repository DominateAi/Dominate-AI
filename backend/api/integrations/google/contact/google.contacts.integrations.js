var currentContext = require('../../../../common/currentContext');
var configResolve = require("../../../../common/configResolver");
var connectServices = require('../../../services/connect.service');
var config = configResolve.getConfig();
const {google} = require('googleapis');


var googleContactServices = {
    setGoogleContactAuth:setGoogleContactAuth,
    getUserGoogleContacts:getUserGoogleContacts,
    createNewContacts:createNewContacts,
    updateContacts:updateContacts,
    deleteContacts:deleteContacts
}

function setGoogleContactAuth( oauth2Client ){
    return new Promise( async ( resolve, reject ) => {
        try{
            const people = google.people({
                version: 'v1',
                auth: oauth2Client,
              });
              resolve( people );
        } catch ( err ){
            reject( err );
        }
    });
}

function getUserGoogleContacts( oAuth2Client, query ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let fields = {
                personFields: ['names', 'emailAddresses','organizations','photos','phoneNumbers'],
                resourceName: 'people/me',
                "pageSize": 10,
            }
            if( query.pageToken !== undefined && query.pageToken !== "undefined" ){
                fields.pageToken = query.pageToken;
            }
            let peopleClient = await setGoogleContactAuth( oAuth2Client );
            let res = await  peopleClient.people.connections.list(fields);
            resolve( res.data );
        } catch ( err ){
            reject( err );
        }
    });
}

function createNewContacts( oAuth2Client, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let peopleClient = await setGoogleContactAuth( oAuth2Client );
            let res = await peopleClient.people.createContact({
                requestBody:{
                    ...body
                }
            });
            resolve( res.data );
        } catch ( err ){
            reject( err );
        }
    })
}

function updateContacts( oAuth2Client, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let peopleClient = await setGoogleContactAuth( oAuth2Client );
            let res = await peopleClient.people.updateContact({
                "resourceName": body.resourceName,
                "requestBody":body,
                "updatePersonFields":['names', 'emailAddresses','organizations','phoneNumbers'],
              });
            resolve( res );
        } catch ( err ){
            reject( err );
        }
    });
}

function deleteContacts( oAuth2Client, body ){    
    return new Promise( async ( resolve, reject ) => {
        try{
            let peopleClient = await setGoogleContactAuth( oAuth2Client );
            let res = await peopleClient.people.deleteContact({
                "resourceName": body.resourceName
            });
            resolve( res );
        } catch ( err ){
            reject( err );
        }
    });
}
module.exports = googleContactServices;