var currentContext = require('../../../../common/currentContext');
var configResolve = require("../../../../common/configResolver");
var connectServices = require('../../../services/connect.service');
var config = configResolve.getConfig();
const {google} = require('googleapis');
 
const redirect_url = config.oauth_redirect_url;
// const redirect_url  = "http://localhost/oauthcallback";
// const gmailScopes = [
//     'https://www.googleapis.com/auth/gmail.modify',
//     `https://www.googleapis.com/auth/calendar.events`,
//     `https://www.googleapis.com/auth/contacts`,
//     `https://www.googleapis.com/auth/userinfo.profile`,
//     `https://www.googleapis.com/auth/userinfo.email`

// ];

const gmailScopes = ['https://www.googleapis.com/auth/gmail.modify',
//'https://mail.google.com/',
//'https://www.googleapis.com/auth/gmail.compose',
'https://www.googleapis.com/auth/calendar.events',
'https://www.googleapis.com/auth/contacts',
'https://www.googleapis.com/auth/userinfo.email',
'https://www.googleapis.com/auth/userinfo.profile',
'https://www.googleapis.com/auth/calendar'
];
const access_type = config.google_access_type;
//'google' has been imported from google apis, it has auth and inside it has OAuth2 function
const oauth2Client = new google.auth.OAuth2(
    //the client and secret ids are mentioned in the dev.json file
    config.google_oauth_client_id,
    config.google_oauth_secret_id,
    redirect_url
);

// $client->setApprovalPrompt("consent");
// $client->setIncludeGrantedScopes(true); 

var googleAuthServices = {
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
            //basically provider is either google or microsoft
            let userData = { workspaceId:userInfo.workspaceId, email : userInfo.email, provider:"GOOGLE" };
            //oauth2client has generateauturl function
            const url = oauth2Client.generateAuthUrl({
                //access type is defined in config file - offline
                access_type:access_type,
                //scopes have been defined on top of this file
                scope:gmailScopes,
                //state basically has workspace, email and provider
                state:JSON.stringify(userData)
            });
            //returns the url created
            resolve( url );
        } catch( err ){
            reject( err );
        }
    });
}

/*************
 * @DESC - GENERATE ACCESS_TOKES AND REFREST TOKEN
 ************/
function generateAuthenticationTokens( body ){
    return new Promise( async( resolve, reject ) => {

        code = body.code
const {tokens} = await oauth2Client.getToken(code);
console.log(tokens);
oauth2Client.setCredentials(tokens);

// code = body.code
// oAuth2Client.getToken(code, (err, token) => {
//     if (err) return console.error('Error retrieving access token', err);
//     oAuth2Client.setCredentials(token);
//     // Store the token to disk for later program executions
//    console.log(token);
//     });

///ACTUAL CODE
//         try{
// //oauth client generates tokens using body sent from front end, and this value has been kept in tokens
//             const { tokens } = await oauth2Client.getToken(body.code);
//             console.log(tokens);
// //the tokens are passed to the setcredentials function in oauth2client            
//             oauth2Client.setCredentials(tokens);
// //we call the generate profile function present below and pass the entire oauth client function object there
             let profile = await generateProfileWithAccessTokens( oauth2Client );

            let data = {
                workspaceId:body.workspaceId,
                user_email:body.email,
                provider:body.provider,
// so tokens variable will have both access and refresh tokens
                access_token:tokens.access_token,
                refresh_token:tokens.refresh_token,
                tokens:tokens,
                integrated_email:profile.emailAddresses[0].value,
//this profile comes from generate profile function
                profile:profile
            }
// in our backend we are saving a connected account of this user
            let saveData = await connectServices.createConnectAccount( data );
            resolve( saveData );
//         } catch ( err ){
//             console.log( err );
//             reject( err );
//         }
    })
}

/*************
 * @DESC - GET THE PROFILE WITH ACCESTOKEN
 ************/
function generateProfileWithAccessTokens( oauth2Client ){
    return new Promise( async ( resolve, reject ) => {
        try{
//google has a people function (can read this in detail)
            const people = google.people({
                version: 'v1',
                auth: oauth2Client,
              });
//get the name and fields like address and photo in response
            const res = await people.people.get({
                resourceName: 'people/me',
                personFields: 'emailAddresses,names,photos'
              });
//basically takes the oauthclient with tokens and get the user profile data from google people function
              resolve( res.data);
        } catch ( err ){
            reject( err );
        }
    });
}

/*****
 * @DESC - IF TOKEN EXPIRES GENERATE NEW TOKENS
 ****/
function setCredentialsonOauth(){
    return new Promise( async ( resolve, reject ) => {
        try{
            let account = await connectServices.getActiveAccountForUser();
            oauth2Client.setCredentials(account[0].tokens);
            oauth2Client.on('tokens', (tokens) => {
               if (tokens.refresh_token) {
                   console.log("Refreshed Token");
               }
             });
            resolve( oauth2Client );
        } catch ( err ){
            console.log( err )
            reject( err );
        }
    });
}


module.exports = googleAuthServices;

