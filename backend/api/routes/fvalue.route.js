const fvalueService = require('../services/fvalue.service');
var schema = require('../schemas/fvalue.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/fvalues')
    .get(getAllFvalues)
    .post(addFvalue);
  router.route('/fvalues/count')
    .get(getAllFvaluesCount);
  router.route('/fvalues/status/:status')
    .get(getAllFvaluesByStatus);
  router.route('/fvalues/search')
    .post(searchFvalues);
  router.route('/fvalues/overview')
    .get(getAllFvaluesOverview);
  router.route('/fvalues/exist')
    .get(isExist);
  router.route('/fvalues/search/text')
    .get(textSearch);
  router.route('/fvalues/:id')
    .get(getFvalueById)
    .delete(deleteFvalue)
    .put(updateFvalue);
}

/**
 * Get all a fvalues api
 * @route GET /api/fvalues
 * @group fvalues - Operations about fvalues
 * @returns {object} 200 - An object of fvalues info
 * @returns {Error}  default - Unexpected error
 */
function getAllFvalues(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  var startsWith = req.query.startsWith;
  var assigned = req.query.assigned;
  if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      fvalueService.getFvaluesByPageWithSort(pageNo, pageSize, sortBy, startsWith, assigned).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      fvalueService.getFvaluesByPage(pageNo, pageSize,startsWith, assigned).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else {
    fvalueService.getAllFvalues(startsWith, assigned).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * Get fvalues by id api
 * @route GET /api/fvalues/:id
 * @group fvalues - Operations about fvalues
 * @returns {object} 200 - An object of fvalues info
 * @returns {Error}  default - Unexpected error
 */
function getFvalueById(req, res, next) {

  let fvalueId = req.params.id;

  var json_format = iValidator.json_schema(schema.getSchema, fvalueId, "fvalue");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  fvalueService.getFvalueById(fvalueId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.FVALUE_DOES_NOT_EXIST));
    }
    res.send({ "count": data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add fvalues api
 * @route POST /api/fvalues
 * @group fvalues - Operations about fvalues
 * @param {object} fvaluesData.body.required - fvalues details
 * @returns {object} 200 - An object of fvalues info
 * @returns {Error}  default - Unexpected error
 */
function addFvalue(req, res, next) {
  var fvalueData = req.body;


  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, fvalueData, "fvalue");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  // fvalueService.getFvalueByFvalueName(fvalueData.name).then((data) => {
  //   if (data != undefined) {
  //     return next(errorMethods.sendBadRequest(errorCode.FVALUE_ALREADY_EXISTS));
  //   } else {
      fvalueService.addFvalue(fvalueData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
  // }).catch((err) => {
  //   next(errorMethods.sendServerError(err));
  // });

}

/**
 * update fvalues by id api
 * @route PUT /api/fvalues
 * @group fvalues - Operations about fvalues
 * @returns {object} 200 - An object of fvalues info
 * @returns {Error}  default - Unexpected error
 */
function updateFvalue(req, res, next) {
  var fvalueData = req.body;
  var id = req.params.id;
  fvalueService.getFvalueById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.FVALUE_DOES_NOT_EXIST));
    } else {
      fvalueService.updateFvalue(id, fvalueData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * fvalues by id api
 * @route DELETE /api/fvalues/:id
 * @group fvalues - Operations about fvalues
 * @returns {object} 200 - An object of fvalues info
 * @returns {Error}  default - Unexpected error
 */
function deleteFvalue(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  fvalueService.getFvalueById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.FVALUE_DOES_NOT_EXIST));
    } else {
      fvalueService.deleteFvalue(delId, data).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get fvalues count api
 * @route GET /api/fvalues/count
 * @group fvalues - Operations about fvalues
 * @returns {object} 200 - An object of fvalues info
 * @returns {Error}  default - Unexpected error
 */
function getAllFvaluesCount(req, res, next) {
  let key = req.query.key;
  let value = req.query.value;
  var query = {};
  if(key != undefined && value != undefined){
    query[key] = value;
    
    getCountOfFvalue(query, next, res);
  } else if (key != undefined){
    leadService.getAggregateCount(key).then((data)=>{
      if (data == undefined) {
        return next(errorMethods.sendBadRequest(errorCode.FVALUE_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err)=>{
      next(errorMethods.sendServerError(err));
    });
  }else{
    getCountOfFvalue(query, next, res);
  }  
  /* let filter = req.query.filter;
  var query = {}

  fvalueService.getAllFvaluesCount(query).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.CUSTOMER_NOT_EXIST));
    }
    res.send({ "count": data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  }); */
}

function getCountOfFvalue(query, next, res) {
  fvalueService.getAllFvaluesCount(query).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.FVALUE_DOES_NOT_EXIST));
    }
    res.send({ "count": data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * get overview of fvalues api
 * @route GET /api/fvalues/overview
 * @group fvalues - Operations about fvalues
 * @returns {object} 200 - An object of fvalues info
 * @returns {Error}  default - Unexpected error
 */
function getAllFvaluesOverview(req, res, next) {
  
  fvalueService.getAllFvaluesOverview().then((data) => {
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
 * Search fvalues api
 * @route POST /api/fvalues/search
 * @group fvalues - Operations about fvalues
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of fvalues info
 * @returns {Error}  default - Unexpected error
 */
function searchFvalues(req, res, next) {
  let searchCriteria = req.body;
  fvalueService.searchFvalues(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is fvalues exist api
 * @route GET /api/fvalues/exist
 * @group fvalues - Operations about fvalues
 * @param {string} fvaluename.query.required - fvalues name
 * @returns {object} 200 - An object of fvalues info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  fvalueService.getFvalueByFvalueName(name).then((data) => {
    if (data != undefined) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Search fvalue api
 * @route GET /api/leads/fvalue/text
 * @group leads - Operations about fvalue
 * @returns {object} 200 - An object of fvalue info
 * @returns {Error}  default - Unexpected error
 */
function textSearch(req, res, next) {
  let text = req.query.text;
  let assigned = req.query.assigned;
  let status = req.query.status;
  fvalueService.textSearch(text, assigned, status).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get all a fvalues api
 * @route GET /api/fvalues/status/:status
 * @group fvalues - Operations about fvalues
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getAllFvaluesByStatus(req,res, next) {
  logger.info("In get all fvalues route");
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
  fvalueService.searchFvalues(query).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

module.exports.init = init;
