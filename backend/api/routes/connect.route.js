var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');
var fs = require('fs');

var googleOauthServices = require('../integrations/google/auth/google.auth.integration');
var microsoftOauthServices = require('../integrations/microsoft/auth/microsoft.auth.integration');

var googleDraftServices = require('../integrations/google/email/google.draft.integrations');
var microsoftDraftServices = require('../integrations/microsoft/email/microsoft.draft.integration');

var googleEmailServices = require('../integrations/google/email/google.email.integration');
var microsoftEmailServices = require('../integrations/microsoft/email/microsoft.email.integrations');

var googleContactServices = require('../integrations/google/contact/google.contacts.integrations');
var microsoftContactServices = require('../integrations/microsoft/contact/microsoft.contacts.integrations');

var googleEventsServices = require('../integrations/google/events/google.events.integrations');
var microsftEventsServices = require('../integrations/microsoft/events/micorsoft.events.integrations');

var connectServices = require('../services/connect.service');

function init( router ){
    router.route('/connect/authorise')
        .get( getAuthenticationURL )
        .post( generateAccessToken )   // everytime a new access token is generated for user while logging in
    router.route('/connect/accounts')
        .get( getAllAccountForLoggedInUser )  // fetch all gmail accounts associated with the user
    router.route('/connect/account/:id')
        .put( updateConnectAccountWithId );
    router.route('/connect/events/timezone')
        .get(getTimeZone);
    router.route('/connect/contacts')
            .get( getAllContacts )    //CRUD operations for contacts
            .post( createNewContact )
            .put( updateContact )
            .delete( deleteContact );
    router.route('/connect/events')
        .get( getAllEvents )       //CRUD operations for calendar events
        .post( createNewEvents )
        .put( updateEvents )
        .delete( deleteEvents );
    router.route('/connect/drafts')    //CRUD operations for email drafts
        .get( getAllDrafts )
        .post( createNewDraft )
        .put( updateDraft )
        .delete( deleteDraft );  
    router.route('/connect/threads')    //CRUD operations for email threads
        .get( getAllThreads )
        .post( sendNewEmail )
        .put( updateEmailThread )
        .delete( deleteEmailThread )  
}

/**
 * GET THE OUTH AUTHENTICATION URL
 * @route GET /connect/authorise
 **/

 //this function basically creates authentication url with google and microsoft
async function getAuthenticationURL( req, res, next ){
    try{
        let operator = req.query.id;
        if( operator === "GOOGLE" ){
            //calls the function in google services to create an auth url
            let response_uri = await googleOauthServices.generateAuthenticationUrl();
            return res.json({ uri:response_uri });
        } else if ( operator === "MICROSOFT" ){
            let response_uri = await microsoftOauthServices.generateAuthenticationUrl();
            return res.json({ uri:response_uri });
        } else {
            return next(errorMethods.sendBadRequest(errorCode.INVALID_EMAIL_OPERATOR))
        }
    } catch ( err ){
        next(errorMethods.sendServerError(err));
    }
}

/**
 * POST THE CODE FOR AUTHORISATION
 * @route POST /connect/authorise
 **/
async function generateAccessToken( req, res, next ){
    try{
        //operator and provider are same, google or microsoft
        let operator = req.query.id;
        body = req.body;
        if( operator === "GOOGLE" ){
            //if user has selected google, call auth token function in google services
            let response = await googleOauthServices.generateAuthenticationTokens( body );
            return res.json("OK");
        } else if ( operator === "MICROSOFT" ){
            let response = await microsoftOauthServices.generateAuthenticationTokens( body );
            return res.json("OK");
        } else {
            return next(errorMethods.sendBadRequest(errorCode.INVALID_EMAIL_OPERATOR))
        }
    } catch ( err ){
        next(errorMethods.sendServerError(err));
    }
}  

/**
 * POST THE CODE FOR AUTHORISATION
 * @route GET /connect/accounts
 **/

 //api gets all the accounts for the user by calling a function in connect services
async function getAllAccountForLoggedInUser( req, res, next ){
    try{
        //let query = req.query.status;
        let provider = req.query.provider;
        let returnData = await connectServices.getAllAccountForUser(provider);
        return res.json( returnData );
    } catch ( err ){
        next(errorMethods.sendServerError(err));   
    }
}


/**
 * UPDATE THE ACOOUNT
 * @route PUT /connect/account/:id
 **/
async function updateConnectAccountWithId( req, res, next ){
    try{
        let id = req.params.id;
        const body = req.body;
        let response = await connectServices.updateConnectAccount( id, body );
        return res.json( response );
    } catch ( err ){
        next(errorMethods.sendServerError(err));  
    }
}

/******************************
 * CONTACT PART STARTS
 ******************************/
/**
 * GET THE LIST OF CONTACTS
 * @route GET /connect/contacts
 **/
async function getAllContacts( req, res, next ){
    try{
        const query = req.query;
        let active_account = await connectServices.getActiveAccountForUser();
        if( active_account[0].provider === "GOOGLE" ){
            console.log("GOOGLE");
            let oAuth2Client = await googleOauthServices.setCredentialsonOauth();
            let all_contacts = await googleContactServices.getUserGoogleContacts( oAuth2Client, query );
            return res.json( all_contacts );
        } else if( active_account[0].provider === "MICROSOFT" ) {
            let accesstoken = await microsoftOauthServices.setCredentialsonOauth();
            let owaClient = await microsoftEmailServices.setMicroSoftAuthentication( accesstoken.token.access_token );
            let all_contacts = await microsoftContactServices.getAllContacts( owaClient, query );
            return res.json( all_contacts );
        } else {
            return next(errorMethods.sendBadRequest(errorCode.INVALID_EMAIL_OPERATOR))
        }
    } catch ( err ){
        next(errorMethods.sendServerError(err));
    }
}
/**
 * CREATE NEW CONTACTS
 * @route POST /connect/contacts
 **/
async function createNewContact( req, res, next ){
    try{
        const body = req.body;
        let active_account = await connectServices.getActiveAccountForUser();
        if( active_account[0].provider === "GOOGLE" ){
            let oAuth2Client = await googleOauthServices.setCredentialsonOauth();
            let create_contact = await googleContactServices.createNewContacts( oAuth2Client, body );
            return res.json(create_contact) ;
        } else if( active_account[0].provider === "MICROSOFT" ) {
            let accesstoken = await microsoftOauthServices.setCredentialsonOauth();
            let owaClient = await microsoftEmailServices.setMicroSoftAuthentication( accesstoken.token.access_token );
            let create_contact = await microsoftContactServices.createNewContacts( owaClient, body );
            return res.json( create_contact );
        } else {
            return next(errorMethods.sendBadRequest(errorCode.INVALID_EMAIL_OPERATOR))
        }
    } catch ( err ){
        next(errorMethods.sendServerError(err));
    } 
}

/**
 * UPDATE  CONTACTS
 * @route PUT /connect/contacts
 **/
async function updateContact( req, res, next ){
    try{
        let body = req.body;
        let active_account = await connectServices.getActiveAccountForUser();
        if( active_account[0].provider === "GOOGLE" ){
            let oAuth2Client = await googleOauthServices.setCredentialsonOauth();
            let update_contacts = await googleContactServices.updateContacts( oAuth2Client, body );
            return res.json( update_contacts );
        } else if( active_account[0].provider === "MICROSOFT" ) {
            let accesstoken = await microsoftOauthServices.setCredentialsonOauth();
            let owaClient = await microsoftEmailServices.setMicroSoftAuthentication( accesstoken.token.access_token );
            let updateContacts = await microsoftContactServices.updateContacts( owaClient, body );
            return res.json( updateContacts );
        } else {
            return next(errorMethods.sendBadRequest(errorCode.INVALID_EMAIL_OPERATOR))
        }
    } catch ( err ){
        next(errorMethods.sendServerError(err));
    }
}
 /**
 * DELETE  CONTACTS
 * @route DELETE /connect/contacts
 **/
async function deleteContact( req, res, next ){
    try{
        let body = req.query;
        //let id = req.query.id;
        let active_account = await connectServices.getActiveAccountForUser();
        if( active_account[0].provider === "GOOGLE" ){
            let oAuth2Client = await googleOauthServices.setCredentialsonOauth();
            let delete_contact = await googleContactServices.deleteContacts( oAuth2Client, body );
            return res.json("OK");
        } else if( active_account[0].provider === "MICROSOFT" ) {
            let accesstoken = await microsoftOauthServices.setCredentialsonOauth();
            let owaClient = await microsoftEmailServices.setMicroSoftAuthentication( accesstoken.token.access_token );
            let delete_contacts = await microsoftContactServices.deleteContacts( owaClient, id );
            return res.json("OK");
        } else {
            return next(errorMethods.sendBadRequest(errorCode.INVALID_EMAIL_OPERATOR))
        }
    } catch ( err ){
        next(errorMethods.sendServerError(err));
    }
} 

/******************************
 * CONTACT PART ENDS
 ******************************/

 /******************************
 * EVENTS PART STARTS
 ******************************/
 /**
 * GET ALL EVENTS
 * @route GET /connect/events
 **/
async function getAllEvents( req, res, next ){
    try{
        let query = req.query;
        let active_account = await connectServices.getActiveAccountForUser();
        if( active_account[0].provider === "GOOGLE" ){
            let oAuth2Client = await googleOauthServices.setCredentialsonOauth();
            let all_events = await googleEventsServices.getAllEvents( oAuth2Client, query );
            return res.json( all_events );
        } else if( active_account[0].provider === "MICROSOFT" ) {
            let accesstoken = await microsoftOauthServices.setCredentialsonOauth();
            let owaClient = await microsoftEmailServices.setMicroSoftAuthentication( accesstoken.token.access_token );
            let all_events = await microsftEventsServices.getAllEvents( owaClient, query );
            return res.json( all_events );
        } else {
            return next(errorMethods.sendBadRequest(errorCode.INVALID_EMAIL_OPERATOR))
        }
    } catch ( err ){
        next(errorMethods.sendServerError(err));
    }
}
/**
 * CREATE NEW EVENTS
 * @route POST /connect/events
 **/
async function createNewEvents( req, res, next ){
    try{
        let body = req.body;
        let active_account = await connectServices.getActiveAccountForUser();
        if( active_account[0].provider === "GOOGLE" ){
            let oAuth2Client = await googleOauthServices.setCredentialsonOauth();
            let new_events = await googleEventsServices.createNewEvents( oAuth2Client, body );
            return res.json( new_events );
        } else if( active_account[0].provider === "MICROSOFT" ) {
            let accesstoken = await microsoftOauthServices.setCredentialsonOauth();
            let owaClient = await microsoftEmailServices.setMicroSoftAuthentication( accesstoken.token.access_token );
            let new_events = await microsftEventsServices.createNewEvents( owaClient, body );
            return res.json( new_events );
        } else {
            return next(errorMethods.sendBadRequest(errorCode.INVALID_EMAIL_OPERATOR))
        }
    } catch ( err ){
        next(errorMethods.sendServerError(err));
    }
}
/**
 * UPDATE  EVENTS
 * @route PUT /connect/events
 **/
async function updateEvents( req, res, next ){
    try{
        let body = req.body;
        let active_account = await connectServices.getActiveAccountForUser();
        if( active_account[0].provider === "GOOGLE" ){
            let oAuth2Client = await googleOauthServices.setCredentialsonOauth();
            let update_event = await googleEventsServices.updateEvents( oAuth2Client, body );
            return res.json( update_event );
        } else if( active_account[0].provider === "MICROSOFT" ) {
            let accesstoken = await microsoftOauthServices.setCredentialsonOauth();
            let owaClient = await microsoftEmailServices.setMicroSoftAuthentication( accesstoken.token.access_token );
            let update_events = await microsftEventsServices.updateEvents( owaClient, body );
            return res.json( update_events );
        } else {
            return next(errorMethods.sendBadRequest(errorCode.INVALID_EMAIL_OPERATOR))
        }
    } catch ( err ){
        next(errorMethods.sendServerError(err));
    }
}

/**
 * DELETE  EVENTS
 * @route DELETE /connect/events
 **/
async function deleteEvents( req, res, next ){
    try{
        let id = req.query.id;
        let body = req.query;
        let active_account = await connectServices.getActiveAccountForUser();
        if( active_account[0].provider === "GOOGLE" ){
            let oAuth2Client = await googleOauthServices.setCredentialsonOauth();
            let delete_events = await googleEventsServices.deleteEvents( oAuth2Client, body );
            return res.json("OK");
        } else if( active_account[0].provider === "MICROSOFT" ) {
            let accesstoken = await microsoftOauthServices.setCredentialsonOauth();
            let owaClient = await microsoftEmailServices.setMicroSoftAuthentication( accesstoken.token.access_token );
            let delete_events = await microsftEventsServices.deleteEvents( owaClient, id );
            return res.json("OK");
        } else {
            return next(errorMethods.sendBadRequest(errorCode.INVALID_EMAIL_OPERATOR))
        }
    } catch ( err ){
        next(errorMethods.sendServerError(err));
    }
}


async function getTimeZone( req, res, next ){
    try{
        let query = req.query;
        let active_account = await connectServices.getActiveAccountForUser();
        if( active_account[0].provider === "GOOGLE" ){
            let oAuth2Client = await googleOauthServices.setCredentialsonOauth();
            let timeZone = await googleEventsServices.getTimeZone( oAuth2Client, query);
            return res.json( timeZone );
        } else if( active_account[0].provider === "MICROSOFT" ) {
            let accesstoken = await microsoftOauthServices.setCredentialsonOauth();
            let owaClient = await microsoftEmailServices.setMicroSoftAuthentication( accesstoken.token.access_token );
            let timeZone = await microsftEventsServices.getAllEvents( owaClient, query);
            return res.json( timeZone );
        } else {
            return next(errorMethods.sendBadRequest(errorCode.INVALID_EMAIL_OPERATOR))
        }
    } catch ( err ){
        next(errorMethods.sendServerError(err));
    }
}
 /******************************
 * EVENTS PART ENDS
 ******************************/

/******************************
 * DRAFT PART START
 ******************************/
/**
 * GET ALL DRAFTS
 * @route GET /connect/events
 **/
async function getAllDrafts( req, res, next ){
    try{
        let query = req.query;
        let active_account = await connectServices.getActiveAccountForUser();
        if( active_account[0].provider === "GOOGLE" ){
            let oAuth2Client = await googleOauthServices.setCredentialsonOauth();
            let all_drafts = await googleDraftServices.getAllDrafts( oAuth2Client, query );
            console.log(all_drafts);
            return res.json( all_drafts );
        } else if( active_account[0].provider === "MICROSOFT" ) {
            let accesstoken = await microsoftOauthServices.setCredentialsonOauth();
            let owaClient = await microsoftEmailServices.setMicroSoftAuthentication( accesstoken.token.access_token );
            let all_drafts = await microsoftDraftServices.getAllDrafts( owaClient, query );
            return res.json( all_drafts );
        } else {
            return next(errorMethods.sendBadRequest(errorCode.INVALID_EMAIL_OPERATOR))
        }
    } catch ( err ){
        next( errorMethods.sendServerError( err ));
    }
}

/**
 * CREATE A NEW DRAFT
 * @route POST /connect/events
 **/
async function createNewDraft( req, res, next ){
    try{
        let body = req.body;
        let active_account = await connectServices.getActiveAccountForUser();
        if( active_account[0].provider === "GOOGLE" ){
            let oAuth2Client = await googleOauthServices.setCredentialsonOauth();
            let new_draft = await googleDraftServices.createNewDraft( oAuth2Client, body );
            return res.json( new_draft );
        } else if( active_account[0].provider === "MICROSOFT" ) {
            let accesstoken = await microsoftOauthServices.setCredentialsonOauth();
            let owaClient = await microsoftEmailServices.setMicroSoftAuthentication( accesstoken.token.access_token );
            let create_draft = await microsoftDraftServices.createNewDraft( owaClient, body );
            return res.json( create_draft );
        } else {
            return next(errorMethods.sendBadRequest(errorCode.INVALID_EMAIL_OPERATOR))
        }
    } catch ( err ){
        next( errorMethods.sendServerError( err ));
    }
}

/**
 * UPDATE ALL DRAFTS
 * @route PUT /connect/events
 **/
async function updateDraft( req, res, next ){
    try{
        let body = req.body;
        let send = req.query.send;
        let active_account = await connectServices.getActiveAccountForUser();
        if( active_account[0].provider === "GOOGLE" ){
            let oAuth2Client = await googleOauthServices.setCredentialsonOauth();
            if( send == "true" ||send == true ){
                let send_draft = await googleDraftServices.sendDraft( oAuth2Client, body );
                return res.json( send_draft );
            } else {
                let update_draft = await googleDraftServices.updateDraft( oAuth2Client, body );
                return res.json( update_draft )
            }
        } else if( active_account[0].provider === "MICROSOFT" ) {
            let accesstoken = await microsoftOauthServices.setCredentialsonOauth();
            let owaClient = await microsoftEmailServices.setMicroSoftAuthentication( accesstoken.token.access_token );
            if( send == "true" ||send == true ){
                let send_draft = await microsoftDraftServices.sendDraft( owaClient, body );
                return res.json( send_draft );
            } else {
                let update_draft = await microsoftDraftServices.updateDraft( owaClient, body );
                return res.json( update_draft );
            }
        } else {
            return next(errorMethods.sendBadRequest(errorCode.INVALID_EMAIL_OPERATOR))
        }
    } catch ( err ){
        next( errorMethods.sendServerError( err ));
    }
}

 /**
 * DELETE  DRAFTS
 * @route DELETE /connect/events
 **/
async function deleteDraft( req, res, next ){
    try{
        let query = req.query;
        let active_account = await connectServices.getActiveAccountForUser();
        if( active_account[0].provider === "GOOGLE" ){
            let oAuth2Client = await googleOauthServices.setCredentialsonOauth();
            let delete_draft = await googleDraftServices.deleteDraft( oAuth2Client, query );
            return res.json("OK");
        } else if( active_account[0].provider === "MICROSOFT" ) {
            let accesstoken = await microsoftOauthServices.setCredentialsonOauth();
            let owaClient = await microsoftEmailServices.setMicroSoftAuthentication( accesstoken.token.access_token );
            let delete_draft = await microsoftDraftServices.deleteDraft( owaClient, query );
            return res.json("OK"); 
        } else {
            return next(errorMethods.sendBadRequest(errorCode.INVALID_EMAIL_OPERATOR))
        }
    } catch ( err ){
        next( errorMethods.sendServerError( err ));
    }
}
/******************************
 * DRAFT PART ENDS
 ******************************/

 /******************************
 * THREADS PART START
 ******************************/
 /**
 * GET ALL THREADS 
 * @route GET /connect/threads
 **/
async function getAllThreads( req, res, next ){
    try{
        let query = req.query;
        let active_account = await connectServices.getActiveAccountForUser();
        if( active_account[0].provider === "GOOGLE" ){
            let oAuth2Client = await googleOauthServices.setCredentialsonOauth();
            let get_threads = await googleEmailServices.getThreads( oAuth2Client, query );
            return res.json( get_threads ); 
        } else if( active_account[0].provider === "MICROSOFT" ) {
            let accesstoken = await microsoftOauthServices.setCredentialsonOauth();
            let owaClient = await microsoftEmailServices.setMicroSoftAuthentication( accesstoken.token.access_token );
            let get_threads = await microsoftEmailServices.getThreads( owaClient, query );
            return res.json( get_threads );
        } else {
            return next(errorMethods.sendBadRequest(errorCode.INVALID_EMAIL_OPERATOR))
        }
    } catch ( err ){
        next( errorMethods.sendServerError( err ));
    }
}

 /**
 * SEND NEW EMAIL
 * @route POST /connect/threads
 **/
async function sendNewEmail( req, res, next ){
    try{
        let body = req.body;
        let type = req.query.type;
        let active_account = await connectServices.getActiveAccountForUser();
        if( active_account[0].provider === "GOOGLE" ){
            let oAuth2Client = await googleOauthServices.setCredentialsonOauth();
            let new_email = await googleEmailServices.sendNewEmails( oAuth2Client, body );
            return res.json( new_email );
        } else if( active_account[0].provider === "MICROSOFT" ) {
            let accesstoken = await microsoftOauthServices.setCredentialsonOauth();
            let owaClient = await microsoftEmailServices.setMicroSoftAuthentication( accesstoken.token.access_token );
            if( type === "replyAll" ){
                let replyAll_email = await microsoftEmailServices.replyAllMessage( owaClient, body );
                return res.json( replyAll_email );
            } else if ( type === "forward" ){
                let forward_email = await microsoftEmailServices.forwardMessage( owaClient, body );
                return res.json( forward_email );
            } else if (type === "reply"){
                let reply_email = await microsoftEmailServices.replyMessage( owaClient, body );
                return res.json( reply_email );
            } else {
                let send_email = await microsoftEmailServices.sendNewEmails( owaClient, body );
                return res.json( send_email );
            }
        } else {
            return next(errorMethods.sendBadRequest(errorCode.INVALID_EMAIL_OPERATOR))
        }
    } catch ( err ){
        next( errorMethods.sendServerError( err ));
    }
}

 /**
 * UPDATE THREAD
 * @route PUT /connect/threads
 **/
async function updateEmailThread( req, res, next ){
    try{
        let body = req.body;
        let type = req.query.type;
        let active_account = await connectServices.getActiveAccountForUser();
        if( active_account[0].provider === "GOOGLE" ){
            let oAuth2Client = await googleOauthServices.setCredentialsonOauth();
            if( type === "thread" ){
                let update_client = await googleEmailServices.updateThread( oAuth2Client, body );
                return res.json( update_client );
            } else if( type === "message" ){
                let update_client = await googleEmailServices.updateMessageLabel( oAuth2Client, body );
                return res.json( update_client );
            } else {
                return res.json( "OK" );
            }
        } else if( active_account[0].provider === "MICROSOFT" ) {
            let accesstoken = await microsoftOauthServices.setCredentialsonOauth();
            let owaClient = await microsoftEmailServices.setMicroSoftAuthentication( accesstoken.token.access_token );
        } else {
            return next(errorMethods.sendBadRequest(errorCode.INVALID_EMAIL_OPERATOR))
        }
    } catch ( err ){
        next( errorMethods.sendServerError( err ));
    }
}

 /**
 * DELETE THREADS 
 * @route DELETE /connect/threads
 **/
async function deleteEmailThread( req, res, next ){
    try{
        let query = req.query;
        let active_account = await connectServices.getActiveAccountForUser();
        if( active_account[0].provider === "GOOGLE" ){
            let oAuth2Client = await googleOauthServices.setCredentialsonOauth();
            let delete_thread = await googleEmailServices.deleteThread( oAuth2Client, query );
            return res.json("OK");
        } else if( active_account[0].provider === "MICROSOFT" ) {
            let accesstoken = await microsoftOauthServices.setCredentialsonOauth();
            let owaClient = await microsoftEmailServices.setMicroSoftAuthentication( accesstoken.token.access_token );
            let delete_threads = await microsoftEmailServices.deleteThread( owaClient, query );
            return res.json("OK");
        } else {
            return next(errorMethods.sendBadRequest(errorCode.INVALID_EMAIL_OPERATOR))
        }
    } catch ( err ){
        next( errorMethods.sendServerError( err ));
    }
}


module.exports.init = init; 