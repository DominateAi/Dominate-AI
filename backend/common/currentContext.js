var httpContext = require('express-http-context');

var currentContextService = {
    getCurrentContext: getCurrentContext,
    setCurrentContext:setCurrentContext
}

function getCurrentContext(){
    var context = httpContext.get('user');
    return context;
}

function setCurrentContext(context){
    httpContext.set('user', context);
}

module.exports = currentContextService;