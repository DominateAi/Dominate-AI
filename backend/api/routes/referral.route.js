const referralService = require('../services/referral.service');
var schema = require('../schemas/referral.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');

function init(router) {
  router.route('/referrals')
    .get(getAllReferrals);
  router.route('/referrals/search')
    .post(searchReferrals);
  router.route('/referrals/count')
    .get(getAllReferralsCount);
  router.route('/referrals/overview')
    .get(getAllReferralsOverview);
  router.route('/referrals/exist')
    .get(isExist);
  router.route('/referrals/:id')
    .get(getReferralById)
    .delete(deleteReferral)
    .put(updateReferral);
}

/**
 * Get all a referrals api
 * @route GET /api/referrals
 * @group referrals - Operations about referrals
 * @returns {object} 200 - An object of referrals info
 * @returns {Error}  default - Unexpected error
 */
function getAllReferrals(req, res, next) {
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
      referralService.getReferralsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      referralService.getReferralsByPage(pageNo, pageSize).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else {
    referralService.getAllReferrals().then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * Get referrals count api
 * @route GET /api/referrals/count
 * @group referrals - Operations about referrals
 * @returns {object} 200 - An object of referrals info
 * @returns {Error}  default - Unexpected error
 */
function getAllReferralsCount(req, res, next) {
  referralService.getAllReferralsCount().then((data) => {
    res.send({ 'count': data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get referrals by id api
 * @route GET /api/referrals/:id
 * @group referrals - Operations about referrals
 * @returns {object} 200 - An object of referrals info
 * @returns {Error}  default - Unexpected error
 */
function getReferralById(req, res, next) {

  let referralId = req.params.id;

  console.log("id" + referralId);
  var json_format = iValidator.json_schema(schema.getSchema, referralId, "referral");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  referralService.getReferralById(referralId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.REFERRAL_DOES_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add referrals api
 * @route POST /api/referrals
 * @group referrals - Operations about referrals
 * @param {object} referralData.body.required - referrals details
 * @returns {object} 200 - An object of referrals info
 * @returns {Error}  default - Unexpected error
 */
function addReferral(req, res, next) {
  var referralData = req.body;
  var type = req.body.type
  var act = req.body.act
  var oldStatus = req.body.oldStatus;
  var newStatus = req.body.newStatus;
  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, referralData, "referral");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  referralService.getReferralByReferralName(referralData.name).then((data) => {
    if (data != undefined && data.length > 0) {
      return next(errorMethods.sendBadRequest(errorCode.REFERRAL_ALREADY_EXISTS));
    } else {
      referralService.addReferral(referralData, type, act, undefined, oldStatus, newStatus).then((data) => {
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
 * update referrals by id api
 * @route PUT /api/referrals
 * @group referrals - Operations about referrals
 * @returns {object} 200 - An object of referrals info
 * @returns {Error}  default - Unexpected error
 */
function updateReferral(req, res, next) {
  var referralData = req.body;
  var id = req.params.id;
  referralService.getReferralById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.REFERRAL_DOES_NOT_EXIST));
    } else {
      referralService.updateReferral(id, referralData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}


function deleteReferral(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  referralService.getReferralById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.REFERRAL_DOES_NOT_EXIST));
    } else {
      referralService.deleteReferral(delId).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * get overview of referrals api
 * @route GET /api/referrals/overview
 * @group referrals - Operations about referrals
 * @returns {object} 200 - An object of referrals info
 * @returns {Error}  default - Unexpected error
 */
function getAllReferralsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  referralService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
 * Search referrals api
 * @route POST /api/referrals/search
 * @group referrals - Operations about referrals
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of referrals info
 * @returns {Error}  default - Unexpected error
 */
function searchReferrals(req, res, next) {
  let searchCriteria = req.body;
  referralService.searchReferrals(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Is referrals exist api
 * @route GET /api/referrals/exist
 * @group referrals - Operations about referrals
 * @param {string} referralname.query.required - referrals name
 * @returns {object} 200 - An object of referrals info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  console.log("name" + name);
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  referralService.getReferralByReferralName(name).then((data) => {
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
