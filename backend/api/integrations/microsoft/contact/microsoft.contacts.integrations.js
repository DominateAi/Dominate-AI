var currentContext = require('../../../../common/currentContext');
var configResolve = require("../../../../common/configResolver");
var config = configResolve.getConfig();
var simpleOauth = require('simple-oauth2');
var connectServices = require('../../../services/connect.service');
require("isomorphic-fetch");
var  Client  = require("@microsoft/microsoft-graph-client").Client;


var microsoftContactServices = {
    getAllContacts:getAllContacts,
    createNewContacts:createNewContacts,
    updateContacts:updateContacts,
    deleteContacts:deleteContacts
}

function getAllContacts( owaClient, query ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let params = "?count=true&$top=10";
            if( query.skip ){
                params = params+`&skip=${ query.skip }`;
            }
            let all_contacts = await owaClient.api(`/me/contacts${params}`).get();
            resolve( all_contacts );
        } catch ( err ){
            reject( err );
        }
    })
}

function createNewContacts( owaClient, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let new_contact = await owaClient.api(`/me/contacts`).post(body);
            resolve( new_contact );
        } catch ( err ){
            reject( err );
        }
    });
}

function updateContacts( owaClient, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let updateContacts = await owaClient.api(`/me/contacts/${body.id}`).patch(body);
            resolve( updateContacts );
        } catch ( err ){
            reject( err );
        }
    });
}

function deleteContacts( owaClient, id ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let deleteContacts = await owaClient.api(`/me/contacts/${id}`).delete();
            resolve( deleteContacts );
        } catch ( err ){
            reject( err );
        }
    });
}

module.exports = microsoftContactServices;