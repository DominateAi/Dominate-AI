var errorCode = require('./error-code');
const boom = require('boom');
module.exports = {
  get: function (error) {
    var name;
    if (error.code == "LOGIN_FAILED") {
      name = "Error"
    } else {
      name = "ValidationError"
    }
    return ({
      error: {
        name: name,
        message: error.message,
        code: error.code
      }
    })
  },

  sendBadRequest: function(errorCode){
    var err= {};
    if(errorCode.message == undefined){
      err = boom.badRequest(JSON.stringify(errorCode));
    }else{
      err = boom.badRequest(errorCode.message);
      err.output.payload.code = errorCode.code;
    }
    return err;
  },

  sendAccessDenied: function(errorCode){
    var err= {};
    if(errorCode.message == undefined){
      err = boom.forbidden(JSON.stringify(errorCode));
    }else{
      err = boom.forbidden(errorCode.message);
      err.output.payload.code = errorCode.code;
    }
    return err;
  },

  sendServerError: function(errorCode){
    var err= {};
    if(errorCode.message == undefined){
      err = boom.badImplementation(JSON.stringify(errorCode));
    }else{
      err = boom.badImplementation(errorCode.message);
      err.output.payload.code = errorCode.code;
    }
    return err;
  },


  validationError: function (statusCode, errors, model) {
    console.log(errors);
    var codes = [],
    messages = [],
    errorCode;
  errors.map((error, i) => {
    var errorConcat = "";
    error.dataPath = error.dataPath.slice(1);
    console.log("error.dataPath initial",error.dataPath);
    if (!error.dataPath) {
      error.dataPath = error.params.missingProperty;
    }

    // codes - array of codes
   
    var errorKeyword = error.dataPath.split(".");
    errorKeyword.map((values) => {
      errorConcat += values + "_"
    });

    switch (error.keyword) {
      case "required":
        errorCode = (errorConcat + error.keyword).toUpperCase();
        break;
      case "format":
        errorCode = errorConcat.toUpperCase() + "INVALID_FORMAT";
        break;
      case "type":
        errorCode = errorConcat.toUpperCase() + "INVALID_TYPE";
        break;
      case "minLength":
      case "maxLength":
      case "maximum":
      case "minimum":
        errorCode = errorConcat.toUpperCase() + "INVALID_LENGTH";
        break;          
      default:
        errorCode = error.keyword.toUpperCase();
    }
    codes.push(errorCode);
    let message = {};
    message[errorCode] = error.message
    messages.push(message);
  })

  return ({
    error: {
      statusCode: statusCode,
      name: "ValidationError",
      message: 'Unprocessable Entity',
      details: {
        context: model,
        codes: codes,
        messages: messages
      }
    }
  })
  },

  getErrorCode: function (statusCodeValue) {
    if (errorCode[statusCodeValue])
      return errorCode[statusCodeValue];
    else
      return errorCode.INVALID_DATA
  }
}
