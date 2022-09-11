const dealachieveService = require('../services/dealachieve.service');
var schema = require('../schemas/dealachieve.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/dealachieves')
    .get(getAllDealachieves)
    .post(addDealachieve);
  router.route('/dealachieves/search')
    .post(searchDealachieves);
  router.route('/dealachieves/count')
    .get(getAllDealachievesCount);
  router.route('/dealachieves/overview')
    .get(getAllDealachievesOverview);
  router.route('/dealachieves/exist')
    .get(isExist);
  router.route('/dealachieves/match')
    .get(match);
  router.route('/dealachieves/:id')
    .get(getDealachieveById)
    .delete(deleteDealachieve)
    .put(updateDealachieve);
}

/**
 * Get all a dealachieves api
 * @route GET /api/dealachieves
 * @group dealachieves - Operations about dealachieves
 * @returns {object} 200 - An object of dealachieves info
 * @returns {Error}  default - Unexpected error
 */
function getAllDealachieves(req, res, next) {
  //accessResolver.isAuthorized(req);
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }
  else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      dealachieveService.getDealachievesByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      dealachieveService.getDealachievesByPage(pageNo, pageSize).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else {
    dealachieveService.getAllDealachieves().then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * Get dealachieves count api
 * @route GET /api/dealachieves/count
 * @group dealachieves - Operations about dealachieves
 * @returns {object} 200 - An object of dealachieves info
 * @returns {Error}  default - Unexpected error
 */
function getAllDealachievesCount(req, res, next) {
  //accessResolver.isAuthorized(req);

  dealachieveService.getAllDealachievesCount().then((data) => {
    res.send({ 'count': data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get dealachieves by id api
 * @route GET /api/dealachieves/:id
 * @group dealachieves - Operations about dealachieves
 * @returns {object} 200 - An object of dealachieves info
 * @returns {Error}  default - Unexpected error
 */
function getDealachieveById(req, res, next) {

  let dealachieveId = req.params.id;

  console.log("id" + dealachieveId);
  var json_format = iValidator.json_schema(schema.getSchema, dealachieveId, "dealachieve");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  dealachieveService.getDealachieveById(dealachieveId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.DEALACHIEVE_DOES_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add dealachieves api
 * @route POST /api/dealachieves
 * @group dealachieves - Operations about dealachieves
 * @param {object} dealachieveData.body.required - dealachieves details
 * @returns {object} 200 - An object of dealachieves info
 * @returns {Error}  default - Unexpected error
 */
function addDealachieve(req, res, next) {
  var dealachieveData = req.body;


  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, dealachieveData, "dealachieve");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  dealachieveService.getDealachieveByDealachieveName(dealachieveData.name).then((data) => {
    if (data != undefined && data.length > 0) {
      return next(errorMethods.sendBadRequest(errorCode.DEALACHIEVE_ALREADY_EXISTS));
    } else {
      dealachieveService.addDealachieve(dealachieveData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });

}

/**
 * update dealachieves by id api
 * @route PUT /api/dealachieves
 * @group dealachieves - Operations about dealachieves
 * @returns {object} 200 - An object of dealachieves info
 * @returns {Error}  default - Unexpected error
 */
function updateDealachieve(req, res, next) {
  var dealachieveData = req.body;
  var id = req.params.id;
  dealachieveService.getDealachieveById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.DEALACHIEVE_DOES_NOT_EXIST));
    } else {
      dealachieveService.updateDealachieve(id, dealachieveData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}


function deleteDealachieve(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  dealachieveService.getDealachieveById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.DEALACHIEVE_DOES_NOT_EXIST));
    } else {
      dealachieveService.deleteDealachieve(delId).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * get overview of dealachieves api
 * @route GET /api/dealachieves/overview
 * @group dealachieves - Operations about dealachieves
 * @returns {object} 200 - An object of dealachieves info
 * @returns {Error}  default - Unexpected error
 */
function getAllDealachievesOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  dealachieveService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
 * Search dealachieves api
 * @route POST /api/dealachieves/search
 * @group dealachieves - Operations about dealachieves
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of dealachieves info
 * @returns {Error}  default - Unexpected error
 */
function searchDealachieves(req, res, next) {
  let searchCriteria = req.body;
  dealachieveService.searchDealachieves(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Is dealachieves exist api
 * @route GET /api/dealachieves/exist
 * @group dealachieves - Operations about dealachieves
 * @param {string} dealachievename.query.required - dealachieves name
 * @returns {object} 200 - An object of dealachieves info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let Id = req.query.id;
  
//   var json_format = iValidator.json_schema(schema.existSchema, name, "name");
//   if (json_format.valid == false) {
//     return res.status(422).send(json_format.errorMessage);
//   }
  dealachieveService.getDealachieveByDealachieveName(Id).then((data) => {
    if (data != undefined) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function match(req, res, next){
  let lead = req.query.lead;
  let type = req.query.type;
  
  dealachieveService.match(lead, type).then((data) => {
    console.log(data);
    if (Array.isArray(data) && data.length) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


module.exports.init = init;
