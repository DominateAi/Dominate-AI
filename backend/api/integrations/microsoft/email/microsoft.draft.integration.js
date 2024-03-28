var currentContext = require('../../../../common/currentContext');
var configResolve = require("../../../../common/configResolver");
var config = configResolve.getConfig();
var simpleOauth = require('simple-oauth2');
var connectServices = require('../../../services/connect.service');
require("isomorphic-fetch");
var  Client  = require("@microsoft/microsoft-graph-client").Client;
let mailComposerServices = require('../../common/mailComposer');

var microsoftDraftServices = {
    getAllDrafts:getAllDrafts,
    createNewDraft:createNewDraft,
    updateDraft:updateDraft,
    deleteDraft:deleteDraft,
    sendDraft:sendDraft,
}

function getAllDrafts( owaClient, query ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let params = "?count=true&$top=10";
            if( query.skip ){
                params = params+`&skip=${ query.skip }`;
            }
            let all_drafts = await owaClient.api(`/me/mailFolders/Drafts/messages${params}`).get();
            resolve( all_drafts );
        } catch ( err ){
            reject( err ); 
        }
    });
}

function createNewDraft( owaClient, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let create_draft = await owaClient.api(`/me/messages`).post(body);
            resolve( create_draft );
        } catch ( err ){
            reject( err );
        }
    })
}

function updateDraft( owaClient, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let update_draft = await owaClient.api(`me/messages/${body.id}`).patch(body);
            resolve( update_draft );
        } catch ( err ){
            console.log( err );
            reject( err );
        }
    } )
}

function deleteDraft( owaClient, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let delete_draft = await owaClient.api(`me/messages/${body.id}`).delete();
            resolve( delete_draft );
        } catch ( err ){
            reject( err );
        }
    })
}

function sendDraft( owaClient, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            console.log( body );
            let send_draft = await owaClient.api(`me/messages/${body.id}/send`).post(body);
            resolve( send_draft );
        } catch ( err ){
            reject( err );
        }
    })
}

module.exports = microsoftDraftServices;