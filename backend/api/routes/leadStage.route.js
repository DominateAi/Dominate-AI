const leadStageService = require('../services/leadStage.service');
var schema = require('../schemas/leadStage.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var leadStageger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/leadStages')
    .get(getAllLeadStages)
    .post(addLeadStage);
  router.route('/leadStages/search')
    .post(searchLeadStages);
  router.route('/leadStages/count')
    .get(getAllLeadStagesCount);
  router.route('/leadStages/overview')
    .get(getAllLeadStagesOverview);
  router.route('/leadStages/exist')
    .get(isExist);
  router.route('/leadStages/:id')
    .get(getLeadStageById)
    .delete(deleteLeadStage)
    .put(updateLeadStage);
}

/**
 * Get all a leadStages api
 * @route GET /api/leadStages
 * @group leadStages - Operations about leadStages
 * @returns {object} 200 - An object of leadStages info
 * @returns {Error}  default - Unexpected error
 */
function getAllLeadStages(req, res, next) {
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
      leadStageService.getLeadStagesByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      leadStageService.getLeadStagesByPage(pageNo, pageSize).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else {
    leadStageService.getAllLeadStages().then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * Get leadStages count api
 * @route GET /api/leadStages/count
 * @group leadStages - Operations about leadStages
 * @returns {object} 200 - An object of leadStages info
 * @returns {Error}  default - Unexpected error
 */
function getAllLeadStagesCount(req, res, next) {
  //accessResolver.isAuthorized(req);

  leadStageService.getAllLeadStagesCount().then((data) => {
    res.send({ 'count': data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get leadStages by id api
 * @route GET /api/leadStages/:id
 * @group leadStages - Operations about leadStages
 * @returns {object} 200 - An object of leadStages info
 * @returns {Error}  default - Unexpected error
 */
function getLeadStageById(req, res, next) {

  let leadStageId = req.params.id;

  console.leadStage("id" + leadStageId);
  var json_format = iValidator.json_schema(schema.getSchema, leadStageId, "leadStage");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  leadStageService.getLeadStageById(leadStageId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.DEAL_DOES_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add leadStages api
 * @route POST /api/leadStages
 * @group leadStages - Operations about leadStages
 * @param {object} leadStageData.body.required - leadStages details
 * @returns {object} 200 - An object of leadStages info
 * @returns {Error}  default - Unexpected error
 */
function addLeadStage(req, res, next) {
  var leadStageData = req.body;


  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, leadStageData, "leadStage");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  leadStageService.getLeadStageByLeadStageName(leadStageData.name).then((data) => {
    if (data != undefined && data.length > 0) {
      return next(errorMethods.sendBadRequest(errorCode.DEAL_ALREADY_EXISTS));
    } else {
      leadStageService.addLeadStage(leadStageData).then((data) => {
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
 * update leadStages by id api
 * @route PUT /api/leadStages
 * @group leadStages - Operations about leadStages
 * @returns {object} 200 - An object of leadStages info
 * @returns {Error}  default - Unexpected error
 */
function updateLeadStage(req, res, next) {
  var leadStageData = req.body;
  var id = req.params.id;
  leadStageService.getLeadStageById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.DEAL_DOES_NOT_EXIST));
    } else {
      leadStageService.updateLeadStage(id, leadStageData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}


function deleteLeadStage(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  leadStageService.getLeadStageById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.DEAL_DOES_NOT_EXIST));
    } else {
      leadStageService.deleteLeadStage(delId).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * get overview of leadStages api
 * @route GET /api/leadStages/overview
 * @group leadStages - Operations about leadStages
 * @returns {object} 200 - An object of leadStages info
 * @returns {Error}  default - Unexpected error
 */
function getAllLeadStagesOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  leadStageService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
 * Search leadStages api
 * @route POST /api/leadStages/search
 * @group leadStages - Operations about leadStages
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of leadStages info
 * @returns {Error}  default - Unexpected error
 */
function searchLeadStages(req, res, next) {
  let searchCriteria = req.body;
  leadStageService.searchLeadStages(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Is leadStages exist api
 * @route GET /api/leadStages/exist
 * @group leadStages - Operations about leadStages
 * @param {string} leadStagename.query.required - leadStages name
 * @returns {object} 200 - An object of leadStages info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  console.leadStage("name" + name);
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  leadStageService.getLeadStageByLeadStageName(name).then((data) => {
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
