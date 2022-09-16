const wactService = require('../services/workactivity.service');
var schema = require('../schemas/workactivity.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');

function init(router) {
  router.route('/wacts')
    .get(getAllWacts)
    .post(addWact);
  router.route('/wacts/search')
    .post(searchWacts);
  router.route('/wacts/count')
    .get(getAllWactsCount);
  router.route('/wacts/overview')
    .get(getAllWactsOverview);
  router.route('/wacts/exist')
    .get(isExist);
  router.route('/wacts/:id')
    .get(getWactById)
    .delete(deleteWact)
    .put(updateWact);
}

/**
 * Get all a wacts api
 * @route GET /api/wacts
 * @group wacts - Operations about wacts
 * @returns {object} 200 - An object of wacts info
 * @returns {Error}  default - Unexpected error
 */
function getAllWacts(req, res, next) {
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
      wactService.getWactsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      wactService.getWactsByPage(pageNo, pageSize).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else {
    wactService.getAllWacts().then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * Get wacts count api
 * @route GET /api/wacts/count
 * @group wacts - Operations about wacts
 * @returns {object} 200 - An object of wacts info
 * @returns {Error}  default - Unexpected error
 */
function getAllWactsCount(req, res, next) {
  wactService.getAllWactsCount().then((data) => {
    res.send({ 'count': data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get wacts by id api
 * @route GET /api/wacts/:id
 * @group wacts - Operations about wacts
 * @returns {object} 200 - An object of wacts info
 * @returns {Error}  default - Unexpected error
 */
function getWactById(req, res, next) {

  let wactId = req.params.id;

  console.log("id" + wactId);
  var json_format = iValidator.json_schema(schema.getSchema, wactId, "wact");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  wactService.getWactById(wactId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.PIPELINE_DOES_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add wacts api
 * @route POST /api/wacts
 * @group wacts - Operations about wacts
 * @param {object} wactData.body.required - wacts details
 * @returns {object} 200 - An object of wacts info
 * @returns {Error}  default - Unexpected error
 */
function addWact(req, res, next) {
  var wactData = req.body;
  var type = req.body.type
  var act = req.body.act
  var oldStatus = req.body.oldStatus;
  var newStatus = req.body.newStatus;
  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, wactData, "wact");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  wactService.getWactByWactName(wactData.name).then((data) => {
    if (data != undefined && data.length > 0) {
      return next(errorMethods.sendBadRequest(errorCode.PIPELINE_ALREADY_EXISTS));
    } else {
      wactService.addWact(wactData, type, act, undefined, oldStatus, newStatus).then((data) => {
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
 * update wacts by id api
 * @route PUT /api/wacts
 * @group wacts - Operations about wacts
 * @returns {object} 200 - An object of wacts info
 * @returns {Error}  default - Unexpected error
 */
function updateWact(req, res, next) {
  var wactData = req.body;
  var id = req.params.id;
  wactService.getWactById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.PIPELINE_DOES_NOT_EXIST));
    } else {
      wactService.updateWact(id, wactData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}


function deleteWact(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  wactService.getWactById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.PIPELINE_DOES_NOT_EXIST));
    } else {
      wactService.deleteWact(delId).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * get overview of wacts api
 * @route GET /api/wacts/overview
 * @group wacts - Operations about wacts
 * @returns {object} 200 - An object of wacts info
 * @returns {Error}  default - Unexpected error
 */
function getAllWactsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  wactService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
 * Search wacts api
 * @route POST /api/wacts/search
 * @group wacts - Operations about wacts
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of wacts info
 * @returns {Error}  default - Unexpected error
 */
function searchWacts(req, res, next) {
  let searchCriteria = req.body;
  wactService.searchWacts(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Is wacts exist api
 * @route GET /api/wacts/exist
 * @group wacts - Operations about wacts
 * @param {string} wactname.query.required - wacts name
 * @returns {object} 200 - An object of wacts info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  console.log("name" + name);
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  wactService.getWactByWactName(name).then((data) => {
    if (data != undefined) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}



module.exports.init = init;
