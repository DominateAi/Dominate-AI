//takes the entire permissions.json object into permissions variable
var permissions = require("../config/permissions.json");
var UrlPattern = require('url-pattern');

//checks if a particular user is authorized for any particular api
function isAuthorized(req, user){
//we received two values - req and user in this function
//req.path contains the actual api that was hit
    var requestPath = req.path;
//req.method contains the method used such as GET, POST etc.
    var requestMethod = req.method;
//every user has permissions object inside role, we keep these values inside userrolepermi variable
    var userRolePermission = user.role.permissions;
    var isAllowed = false;
//matchedendpoint will get a boolean value based on the outcome of the function
    var matchedEndpoint = permissions.apis.find(function(element) {
//you take the endpoint value in pattern variable
        var pattern = new UrlPattern(element.endpoint);
//elementMethod is basically GET, POST and so is requestMethod, you are able to match the api and 
//method that was used with the ones existing in permissions.json entire object, if it doesn't match
//then obviously, it will be access denied
        return pattern.match(requestPath) && element.method == requestMethod;
    });

    if(userRolePermission.includes('*')){
//if user has * acccess, he gets access to everything
        isAllowed = true;
//else if matchedpoint is a truthy value
    }else if(matchedEndpoint){
        var matchedEndpointPermission = new Set(matchedEndpoint.permissions);
//this just checks if the user's permissions match that of the api that was hit, both in terms of api
//as well as the method
        for(var i=0; i< userRolePermission.length ; i++){
            if(matchedEndpointPermission.has(userRolePermission[i])){
                isAllowed = true;
                break;
            }
        }
    }  

    return isAllowed;
}

module.exports = {
    isAuthorized:isAuthorized
}
