var request = require('request-promise');
var configResolve = require("./configResolver");
var config = configResolve.getConfig();
var currentContext = require('./currentContext');
var parser = require('xml2json');
 
const baseUrl = 'https://'+ config.exotel.apiKey + ':' +
              config.exotel.apiToken+'@api.exotel.com/v1/Accounts/' 
              + config.exotel.sid;
        
const statusCallbackUrl =  config.server_url + config.exotel.statusCallbackUrl;

function dial(callData, authCode){
    return new Promise((resolve, reject)=>{
        request.post({
            url: baseUrl + '/Calls/connect',
            form: {
              From: callData.from,
              To: callData.to,
              CallerId: config.exotel.callerId,
              StatusCallback: (statusCallbackUrl + currentContext.getCurrentContext().workspaceId
              + "/" + authCode),
              StatusCallbackContentType: 'application/json',
              StatusCallbackEvents: ['terminal']
            }
          }).then((body, httpResponse)=>{
            var jsonBody = parser.toJson(body); 
            resolve(JSON.parse(jsonBody));
          }, (err)=>{
            console.log('error:', err);
            reject(err);
          });
    });
}

function callStatus(callSid){
  return new Promise((resolve, reject)=>{
      request.get({
          url: baseUrl + '/Calls/' + callSid + '?details=true',
        }).then((body, httpResponse)=>{
          var jsonBody = parser.toJson(body); 
          resolve(JSON.parse(jsonBody));
        }, (err)=>{
          console.log('error:', err);
          reject(err);
        });
  });
}




module.exports = {
    dial:dial,
    callStatus: callStatus
}