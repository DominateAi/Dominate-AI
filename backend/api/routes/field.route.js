const fieldService = require('../services/field.service');
var schema = require('../schemas/field.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/fields')
    .get(getAllFields)
    .post(addField);
  router.route('/fields/count')
    .get(getAllFieldsCount);
  router.route('/fields/status/:status')
    .get(getAllFieldsByStatus);
  router.route('/fields/search')
    .post(searchFields);
  router.route('/fields/overview')
    .get(getAllFieldsOverview);
  router.route('/fields/exist')
    .get(isExist);
  router.route('/fields/search/text')
    .get(textSearch);
  router.route('/fields/:id')
    .get(getFieldById)
    .delete(deleteField)
    .put(updateField);
}

/**
 * Get all a fields api
 * @route GET /api/fields
 * @group fields - Operations about fields
 * @returns {object} 200 - An object of fields info
 * @returns {Error}  default - Unexpected error
 */
function getAllFields(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  var startsWith = req.query.startsWith;
  var assigned = req.query.assigned;
  if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      fieldService.getFieldsByPageWithSort(pageNo, pageSize, sortBy, startsWith, assigned).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      fieldService.getFieldsByPage(pageNo, pageSize,startsWith, assigned).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else {
    fieldService.getAllFields(startsWith, assigned).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * Get fields by id api
 * @route GET /api/fields/:id
 * @group fields - Operations about fields
 * @returns {object} 200 - An object of fields info
 * @returns {Error}  default - Unexpected error
 */
function getFieldById(req, res, next) {

  let fieldId = req.params.id;

  var json_format = iValidator.json_schema(schema.getSchema, fieldId, "field");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  fieldService.getFieldById(fieldId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.FIELD_DOES_NOT_EXIST));
    }
    res.send({ "count": data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add fields api
 * @route POST /api/fields
 * @group fields - Operations about fields
 * @param {object} fieldsData.body.required - fields details
 * @returns {object} 200 - An object of fields info
 * @returns {Error}  default - Unexpected error
 */
function addField(req, res, next) {
  var fieldData = req.body;
console.log("hello");
  // Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, fieldData, "field");
  console.log("hello");
  if (json_format.valid == false) {
    console.log("hello");
    return res.status(422).send(json_format.errorMessage);
  }
  // fieldService.getFieldByFieldName(fieldData.name).then((data) => {
  //   if (data != undefined) {
  //     return next(errorMethods.sendBadRequest(errorCode.FIELD_ALREADY_EXISTS));
  //   } else {
      fieldService.addField(fieldData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    //}
  // }).catch((err) => {
  //   console.log("hello 1");
  //   next(errorMethods.sendServerError(err));
  // });

}

/**
 * update fields by id api
 * @route PUT /api/fields
 * @group fields - Operations about fields
 * @returns {object} 200 - An object of fields info
 * @returns {Error}  default - Unexpected error
 */
function updateField(req, res, next) {
  var fieldData = req.body;
  var id = req.params.id;
  fieldService.getFieldById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.FIELD_DOES_NOT_EXIST));
    } else {
      fieldService.updateField(id, fieldData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * fields by id api
 * @route DELETE /api/fields/:id
 * @group fields - Operations about fields
 * @returns {object} 200 - An object of fields info
 * @returns {Error}  default - Unexpected error
 */
function deleteField(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  fieldService.getFieldById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.FIELD_DOES_NOT_EXIST));
    } else {
      fieldService.deleteField(delId, data).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get fields count api
 * @route GET /api/fields/count
 * @group fields - Operations about fields
 * @returns {object} 200 - An object of fields info
 * @returns {Error}  default - Unexpected error
 */
function getAllFieldsCount(req, res, next) {
  let key = req.query.key;
  let value = req.query.value;
  var query = {};
  if(key != undefined && value != undefined){
    query[key] = value;
    
    getCountOfField(query, next, res);
  } else if (key != undefined){
    leadService.getAggregateCount(key).then((data)=>{
      if (data == undefined) {
        return next(errorMethods.sendBadRequest(errorCode.FIELD_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err)=>{
      next(errorMethods.sendServerError(err));
    });
  }else{
    getCountOfField(query, next, res);
  }  
  /* let filter = req.query.filter;
  var query = {}

  fieldService.getAllFieldsCount(query).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.CUSTOMER_NOT_EXIST));
    }
    res.send({ "count": data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  }); */
}

function getCountOfField(query, next, res) {
  fieldService.getAllFieldsCount(query).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.FIELD_DOES_NOT_EXIST));
    }
    res.send({ "count": data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * get overview of fields api
 * @route GET /api/fields/overview
 * @group fields - Operations about fields
 * @returns {object} 200 - An object of fields info
 * @returns {Error}  default - Unexpected error
 */
function getAllFieldsOverview(req, res, next) {
  
  fieldService.getAllFieldsOverview().then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * @typedef SearchCriteria
 * @property {string} pageSize.required
 * @property {string} pageNo.required 
 * @property {string} query.required 
 */
/**
 * Search fields api
 * @route POST /api/fields/search
 * @group fields - Operations about fields
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of fields info
 * @returns {Error}  default - Unexpected error
 */
function searchFields(req, res, next) {
  let searchCriteria = req.body;
  fieldService.searchFields(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is fields exist api
 * @route GET /api/fields/exist
 * @group fields - Operations about fields
 * @param {string} fieldname.query.required - fields name
 * @returns {object} 200 - An object of fields info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let searchCriteria = req.query;
  // var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  // if (json_format.valid == false) {
  //   return res.status(422).send(json_format.errorMessage);
  // }
  console.log(searchCriteria);
  let name = searchCriteria.name;
  let entity = searchCriteria.entity;
  let queryA = {$and:[{"name":name},{"entity":entity}]}

  fieldService.searchFields(queryA).then((data) => {
    if(Array.isArray(data) && data.length)
    {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Search field api
 * @route GET /api/leads/field/text
 * @group leads - Operations about field
 * @returns {object} 200 - An object of field info
 * @returns {Error}  default - Unexpected error
 */
function textSearch(req, res, next) {
  let text = req.query.text;
  let assigned = req.query.assigned;
  let status = req.query.status;
  fieldService.textSearch(text, assigned, status).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get all a fields api
 * @route GET /api/fields/status/:status
 * @group fields - Operations about fields
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getAllFieldsByStatus(req,res, next) {
  logger.info("In get all fields route");
  let status = req.params.status;
  let query = {
    pageNo: 1,
    pageSize: 1000000,
    query: {
      '$and':[{
        'status' : status
      }
    ]
    }
  };
  fieldService.searchFields(query).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

module.exports.init = init;
