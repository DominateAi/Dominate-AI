var currentContext = require('../../common/currentContext');
var configResolve = require("../../common/configResolver");
const moment =  require('moment');
moment.locale('en');
const _ = require('lodash');
var rp = require('request-promise');
var leadSearchServiceURL = configResolve.getConfig().leadscrapperUrl;
var leadSearchServiceAPIKEY = configResolve.getConfig().leadscrapperKey;

var leadSearchService = {
    leadSearch: leadSearch
}


function leadSearch(query){
    return new Promise((resolve,reject) => {
        var requestBody = query;

        var options = {
            method: 'POST',
            uri: leadSearchServiceURL + "/api/search-service/employees/search",
            body: requestBody,
            headers:{
                'Authorization': 'Api-Key '+ leadSearchServiceAPIKEY
            },
            json: true
      
          };
      
          rp(options).then((body, httpResponse) => {
            //console.log(body);
            resolve(body);
          }, (err) => {
            console.log('error:', err);
            reject(err);
          });
    });
}


module.exports = leadSearchService;

