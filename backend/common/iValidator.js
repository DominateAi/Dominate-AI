
var errorCode = require('./error-code')
var errorMessage = require('./error-methods')
var Ajv = require('ajv');
var schemaValidator = Ajv({
  allErrors: true
});

module.exports = {
  json_schema: function (schema, data, model) {

    var testSchemaValidator = schemaValidator.compile(schema);
    var valid = testSchemaValidator(data);
    if (valid)
      return ({
        valid: true
      });
    else {
      return ({
        valid: false,
        errorMessage: errorMessage.validationError(422, testSchemaValidator.errors, model)
      })
    }

  }
}