const refCodeService = require('../services/refCode.service');
var schema = require('../schemas/refCode.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');

function init(router) {
  router.route('/refCodes')
    .get(getAllRefCodes)
    .post(addRefCode);
  router.route('/refCodes/search')
    .post(searchRefCodes);
  router.route('/refCodes/count')
    .get(getAllRefCodesCount);
  router.route('/refCodes/overview')
    .get(getAllRefCodesOverview);
  router.route('/refCodes/exist')
    .get(isExist);
  router.route('/refCodes/:id')
    .get(getRefCodeById)
    .delete(deleteRefCode)
    .put(updateRefCode);
}

/**
 * Get all a refCodes api
 * @route GET /api/refCodes
 * @group refCodes - Operations about refCodes
 * @returns {object} 200 - An object of refCodes info
 * @returns {Error}  default - Unexpected error
 */
function getAllRefCodes(req, res, next) {
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
      refCodeService.getRefCodesByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      refCodeService.getRefCodesByPage(pageNo, pageSize).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else {
    refCodeService.getAllRefCodes().then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * Get refCodes count api
 * @route GET /api/refCodes/count
 * @group refCodes - Operations about refCodes
 * @returns {object} 200 - An object of refCodes info
 * @returns {Error}  default - Unexpected error
 */
function getAllRefCodesCount(req, res, next) {
  refCodeService.getAllRefCodesCount().then((data) => {
    res.send({ 'count': data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get refCodes by id api
 * @route GET /api/refCodes/:id
 * @group refCodes - Operations about refCodes
 * @returns {object} 200 - An object of refCodes info
 * @returns {Error}  default - Unexpected error
 */
function getRefCodeById(req, res, next) {

  let refCodeId = req.params.id;

  console.log("id" + refCodeId);
  var json_format = iValidator.json_schema(schema.getSchema, refCodeId, "refCode");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  refCodeService.getRefCodeById(refCodeId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.REFCODE_DOES_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add refCodes api
 * @route POST /api/refCodes
 * @group refCodes - Operations about refCodes
 * @param {object} refCodeData.body.required - refCodes details
 * @returns {object} 200 - An object of refCodes info
 * @returns {Error}  default - Unexpected error
 */
function addRefCode(req, res, next) {
  var refCodeData = req.body;

  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, refCodeData, "refCode");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  refCodeService.searchRefCodes({query:{"userId":refCodeData.userId}}).then((data) => {
    if (data != undefined && data.length > 0) {
      return next(errorMethods.sendBadRequest(errorCode.USER_HAS_ALREADY_CREATED_REFERRAL_CODE));
    } else {
      refCodeService.addRefCode(refCodeData).then((data) => {
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
 * update refCodes by id api
 * @route PUT /api/refCodes
 * @group refCodes - Operations about refCodes
 * @returns {object} 200 - An object of refCodes info
 * @returns {Error}  default - Unexpected error
 */
function updateRefCode(req, res, next) {
  var refCodeData = req.body;
  var id = req.params.id;
  refCodeService.getRefCodeById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.REFCODE_DOES_NOT_EXIST));
    } else {
      refCodeService.updateRefCode(id, refCodeData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}


function deleteRefCode(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  refCodeService.getRefCodeById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.REFCODE_DOES_NOT_EXIST));
    } else {
      refCodeService.deleteRefCode(delId).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * get overview of refCodes api
 * @route GET /api/refCodes/overview
 * @group refCodes - Operations about refCodes
 * @returns {object} 200 - An object of refCodes info
 * @returns {Error}  default - Unexpected error
 */
function getAllRefCodesOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  refCodeService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
 * Search refCodes api
 * @route POST /api/refCodes/search
 * @group refCodes - Operations about refCodes
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of refCodes info
 * @returns {Error}  default - Unexpected error
 */
function searchRefCodes(req, res, next) {
  let searchCriteria = req.body;
  refCodeService.searchRefCodes(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Is refCodes exist api
 * @route GET /api/refCodes/exist
 * @group refCodes - Operations about refCodes
 * @param {string} refCodename.query.required - refCodes name
 * @returns {object} 200 - An object of refCodes info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  console.log("name" + name);
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  refCodeService.getRefCodeByRefCodeName(name).then((data) => {
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
