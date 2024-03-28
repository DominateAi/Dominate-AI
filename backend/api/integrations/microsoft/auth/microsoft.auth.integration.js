var currentContext = require('../../../../common/currentContext');
var configResolve = require("../../../../common/configResolver");
var config = configResolve.getConfig();
var simpleOauth = require('simple-oauth2');
var connectServices = require('../../../services/connect.service');
require("isomorphic-fetch");
var  Client  = require("@microsoft/microsoft-graph-client").Client;
const redirect_url = config.oauth_redirect_url;
const officeScopes = [
    `https://graph.microsoft.com/Calendars.ReadWrite`,
    `https://graph.microsoft.com/Contacts.ReadWrite`,
    `https://graph.microsoft.com/Mail.ReadWrite`,
    `https://graph.microsoft.com/Mail.Send`,
    `https://graph.microsoft.com/User.Read`,
    `https://graph.microsoft.com/User.ReadBasic.All`,
    `https://graph.microsoft.com/Group.Read.All`,
    `https://graph.microsoft.com/Group.ReadWrite.All`,
    `offline_access`
];

const credentials = {
    client:{
        id:config.microsoft_oauth_client_id,
        secret:config.microsoft_oauth_secret_id
    },
    auth:{
        tokenHost:config.microsoft_oauth_authority,
        authorizePath:config.microsoft_oauth_authorise_endpoint,
        tokenPath:config.microsoft_oauth_token_endpoint
    },
    options: {
        authorizationMethod: 'body',
    }
}
const oauth2 = simpleOauth.create(credentials);


var office365AuthServices = {
    generateAuthenticationUrl:generateAuthenticationUrl,
    generateAuthenticationTokens:generateAuthenticationTokens,
    generateProfileWithAccessTokens:generateProfileWithAccessTokens,
    setCredentialsonOauth:setCredentialsonOauth
}

/***********
 * CREATE URL FOR OAUTH VERIFICATION
 ***********/

function generateAuthenticationUrl(){
    return new Promise(async (resolve, reject) => {
        try{      
            var userInfo = currentContext.getCurrentContext();
            let userData = { workspaceId:userInfo.workspaceId, email : userInfo.email, provider:"MICROSOFT" };
            const authorizationUri = oauth2.authorizationCode.authorizeURL({
                redirect_uri: redirect_url,
                scope: officeScopes,
                state:JSON.stringify(userData)
            });   
            resolve( authorizationUri );
        } catch( err ){
            reject( err ); 
        }
    });
}

function generateAuthenticationTokens( body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            const tokenConfig = {
                code: body.code,
                redirect_uri: redirect_url,
                scope: officeScopes,
            };
            const result = await oauth2.authorizationCode.getToken(tokenConfig);
            const accessToken = oauth2.accessToken.create(result);
            let profile = await generateProfileWithAccessTokens( result.access_token );
            let data = {
                workspaceId:body.workspaceId,
                user_email:body.email,
                provider:body.provider,
                access_token:result.access_token,
                refresh_token:result.refresh_token,
                tokens:result,
                integrated_email:profile.userPrincipalName,
                profile:JSON.stringify( accessToken )
            }
            let saveData = await connectServices.createConnectAccount( data );
            resolve( saveData );
        } catch ( err ){
            console.log( err );
            reject( err );
        }
    });
}

function generateProfileWithAccessTokens( accessToken ){
    return new Promise( async ( resolve, reject ) => {
        try{
            const client = Client.init({
                defaultVersion: "v1.0",
                debugLogging: true,
                authProvider: (done) => {
                    done(null,accessToken );
                }
            });
            let userDetails = await client.api("/me").get();
            resolve( userDetails );
        } catch ( err ) {
            console.log( err );
            reject( err );
        }
    });
}

function setCredentialsonOauth(){
    return new Promise( async ( resolve, reject ) => {
        try{
            let account = await connectServices.getActiveAccountForUser();
              const params = {
                scope: officeScopes,
              };
              let accessToken = oauth2.accessToken.create(account[0].tokens);
              let NewaccessToken = await accessToken.refresh(params);
              resolve(NewaccessToken);
        } catch ( err ){
            console.log( err );
            reject( err );
        }
    });
}

module.exports = office365AuthServices;

