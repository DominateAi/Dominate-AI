var currentContext = require('../../../../common/currentContext');
var configResolve = require("../../../../common/configResolver");
var config = configResolve.getConfig();
var simpleOauth = require('simple-oauth2');
var connectServices = require('../../../services/connect.service');
require("isomorphic-fetch");
var  Client  = require("@microsoft/microsoft-graph-client").Client;


var microsoftEventServices = {
    getAllEvents:getAllEvents,
    createNewEvents:createNewEvents,
    updateEvents:updateEvents,
    deleteEvents:deleteEvents
}

function getAllEvents( owaClient, query ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let params = "?count=true&$top=10";
            if( query.skip ){
                params = params+`&skip=${ query.skip }`;
            }
            let all_events = await owaClient.api(`/me/events${params}`).get();
            resolve( all_events )
        } catch ( err ){
            reject( err );
        }
    })  
}

function createNewEvents( owaClient, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let new_events = await owaClient.api(`/me/events`).post(body);
            resolve( new_events )
        } catch ( err ){
            reject( err );
        }
    }) 
}

function updateEvents( owaClient, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let update_events = await owaClient.api(`/me/events/${ body.id }`).patch(body);
            resolve( update_events )
        } catch ( err ){
            reject( err );
        }
    }) 
}

function deleteEvents( owaClient, id ){
    return new Promise( async ( resolve, reject ) => {
        try{
            console.log( id );
            let delete_events = await owaClient.api(`/me/events/${ id }`).delete();
            resolve( delete_events )
        } catch ( err ){
            reject( err );
        }
    }) 
}

module.exports = microsoftEventServices;