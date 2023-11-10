var currentContext = require('../../common/currentContext');
var configResolve = require("../../common/configResolver");
var config = configResolve.getConfig();
validateMailURL = config.serverless_url_validate ;
campaignURL = config.serverless_url_campaign;
registerEmailURL = config.serverless_url_register;
emailServiceAPIKEY = config.emailServiceAPIKEY;
var rp = require('request-promise');

var serverlessService = {
    validateEmails: validateEmails,
    registerEmail: registerEmail,
    checkVerified: checkVerified,
    createCampaign: createCampaign,
    changeStatus: changeStatus
}

//validate emails

function validateEmails(emails) {
    return new Promise((resolve, reject) => {
        requestBody = {"emailToList":emails}
        var options = {
            method: 'POST',
            body: requestBody,
            uri: validateMailURL,
            headers:{
                'x-api-key':  emailServiceAPIKEY
            },
            json: true
          };
          rp(options).then((body, httpResponse) => {
            resolve(body);
          }, (err) => {
            console.log('error:', err);
            reject(err);
          });
    })
}

//register emails

function registerEmail(email) {
    return new Promise(async(resolve, reject) => {
        requestBody = {"emailId":email}
        var options = {
            method: 'POST',
            body: requestBody,
            uri: registerEmailURL,
            headers:{
              'x-api-key':  emailServiceAPIKEY
            },
            json: true
          };
          rp(options).then((body, httpResponse) => {
            resolve(body);
          }, (err) => {
            console.log('error:', err);
            reject(err);
          });
    })
}

function checkVerified(email) {
  return new Promise(async(resolve, reject) => {
      var options = {
          method: 'GET',
          uri: registerEmailURL + "/" + email +"/status",
          headers:{
            'x-api-key':  emailServiceAPIKEY
          },
          json: true
        };
        rp(options).then((body, httpResponse) => {
          resolve(body);
        }, (err) => {
          console.log('error:', err);
          reject(err);
        });
  })
}

//create campaign
//before sending data over to this function, front end will tell backend with an API that campaign is complete and also update campaign
//profile status to complete and front end will send id of the campaign to this confirmation function
//backend will then check if the campaign is actually marked as profile complete, if yes then it's time to start checking for all
//fields inside the data object. the data object should have to,from and schedules and each schedule should have email template,
// subject and scheduleat - we need to validate all these things before proceeding further.

function createCampaign(data) {
    return new Promise(async(resolve, reject) => {
        requestBody = data
        var options = {
            method: 'POST',
            body: data,
            uri: campaignURL,
            headers:{
              'x-api-key':  emailServiceAPIKEY
            },
            json: true
          };
          rp(options).then((body, httpResponse) => {
            resolve(body);
          }, (err) => {
            console.log('error:', err);
            reject(err);
          });
    })
}

function changeStatus(id, status) {
  return new Promise(async(resolve, reject) => {
      var options = {
          method: 'PUT',
          uri: campaignURL + "/" +id + "/" + status,
          headers:{
            'x-api-key':  emailServiceAPIKEY
          },
          json: true
        };
        rp(options).then((body, httpResponse) => {
          resolve(body);
        }, (err) => {
          console.log('error:', err);
          reject(err);
        });
  })
}

//get campaign by id


//update email list

//add schedule

//edit schedule

//delete schedule

//enable disable campaign

module.exports = serverlessService;