var connectModel = require('../models/connect.model');
var currentContext = require('../../common/currentContext');
var configResolve = require("../../common/configResolver");
var config = configResolve.getConfig();


var connectServices = {
    getAllAccountForUser:getAllAccountForUser,
    getActiveAccountForUser:getActiveAccountForUser,
    createConnectAccount:createConnectAccount,
    deactivateAccountsForUser:deactivateAccountsForUser,
    updateAccountsForUser:updateAccountsForUser,
    updateConnectAccount:updateConnectAccount,
    connectAccountExists:connectAccountExists,
    getActiveAccountInternal:getActiveAccountInternal

}

//gets all the accounts for this user
function getAllAccountForUser(provider ){
    return new Promise( async ( resolve, reject ) => {
        try{
            var userInfo = currentContext.getCurrentContext();
//here we are creating a query
            let query = {
                // workspaceId : userInfo.workspaceId,
               userId: userInfo.userId
            };
//if status is active or inactive and not undefined, we will put it in query
            // if( status !== undefined &&( status === "ACTIVE" || status === "NOTACTIVE" )){
            //     query.status = status;
            // }
// if provider is not undefined, put it in query
            if( provider !== undefined ){
                query.provider = provider;
            }
// these options are just projection and specify the fields that are to be returned from the query
            // let options = {
            //     "_id":1,
            //     "workspaceId":1,
            //     "user_email":1,
            //     "integrated_email":1,
            //     "provider":1,
            //     "status":1,
            //     "isConnectDefaultClient":1
            // }
// calls a model function to find accounts with the query that has workspace, 
//user_email, status and provider - all these are fields in connect model
// and uses projection options for returning fields
            let data = await connectModel.findAccounts( query );
            resolve( data );
        } catch( err ){
            reject( err );
        }
    });
}

// this function gets active account for user. if account is not active,
//we refresh token
function getActiveAccountForUser(){
    return new Promise( async ( resolve, reject ) => {
        try{
          
            let query = {
                // workspaceId : userInfo.workspaceId,
                // user_email: userInfo.email,
                //status:"ACTIVE"
            };
            let data = await connectModel.findAccounts( query );
            resolve( data );
        } catch ( err ){
            reject( err );
        }
    })
}

//creates a new connect account of user with our software
function createConnectAccount( data ){
    return new Promise( async ( resolve, reject ) => {
        var userInfo = currentContext.getCurrentContext();
        try{
            let newConnectData = {
                workspaceId:data.workspaceId,
                user_email:data.user_email,
                integrated_email:data.integrated_email,
                access_token:data.access_token,
                refresh_token:data.refresh_token,
                tokens :data.tokens,
                provider:data.provider,
                profile:data.profile,
                status:"ACTIVE",
                userId: userInfo.userId
            };
            
            let deactivateUsers = await deactivateAccountsForUser( data );
// here we are checking if this account already exists
            let checkAccount = await connectAccountExists( data.integrated_email );
// if account exists, then update the info, else create account for the user
console.log(checkAccount);
            if( checkAccount.length > 0 ){
                //UPDATE DATA
                console.log("in connect if service")
                let account = JSON.parse( JSON.stringify( checkAccount[0] ) );
                account.status= "ACTIVE";
                let updateData=await updateConnectAccount( account._id, account );
                resolve( updateData );
            } else {
                console.log("in connect else service")
                let createData = await connectModel.createAccounts( newConnectData );
                resolve( createData );
            }
        } catch ( err ){
            reject( err );
        }
    });
}

function deactivateAccountsForUser( data ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let query = {
                workspaceId: data.workspaceId,
                user_email:data.user_email,
                status:"ACTIVE"
            };
            let updateData = {
                "$set":{ "status":"NOTACTIVE" }
            }
            let res = await updateAccountsForUser( query, updateData );
            resolve( res );
        } catch ( err ){
            reject( err );
        }
    });
}

function updateAccountsForUser( query, updateData ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let updateDataRes = await connectModel.updateAccounts( query, updateData );
            resolve( updateDataRes );
        } catch ( err ){
            reject( err );
        }
    });
}

//function to update the value of the connected account for a user
function updateConnectAccount( id, body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            var userInfo = currentContext.getCurrentContext();
            let query = {
                workspaceId: userInfo.workspaceId,
                user_email:userInfo.email,
                _id : id
            };
            let updateData = {
                "$set": body
            };
            //let deactivateUsers = await deactivateAccountsForUser({ user_email:userInfo.email, workspaceId:userInfo.workspaceId   });
            let res = await updateAccountsForUser( query, updateData );
            resolve( res );
        } catch ( err ){
            console.log( err );
            reject( err );
        }
    })
}

function connectAccountExists( integrated_email ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let query = {
                integrated_email:integrated_email
            };
            let getEmail = await connectModel.findAccounts(query);
            if( getEmail.length > 0 ){
                resolve( getEmail )
            } else {
                resolve(getEmail);
            }
        } catch ( err ){
            reject( err );
        }
    });
}

function getActiveAccountInternal(){
    return new Promise( async ( resolve, reject ) => {
        try{
            let query = {
                status:"ACTIVE"
            };
            let options = {
                "_id":1,
                "workspaceId":1,
                "user_email":1,
                "integrated_email":1,
                "provider":1,
                "status":1,
                "profile":1,
                "isConnectDefaultClient":1
            }
            let data = await connectModel.findAccounts( query, options );
            resolve( data );
        } catch ( err ){
            reject( err );
        }
    })
}

module.exports = connectServices;