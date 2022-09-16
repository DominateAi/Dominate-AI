const logService = require('../services/log.service');
var schema = require('../schemas/log.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/logs')
    .get(getAllLogs)
    .post(addLog);
  router.route('/logs/search')
    .post(searchLogs);
  router.route('/logs/count')
    .get(getAllLogsCount);
  router.route('/logs/overview')
    .get(getAllLogsOverview);
  router.route('/logs/exist')
    .get(isExist);
  router.route('/logs/:id')
    .get(getLogById)
    .delete(deleteLog)
    .put(updateLog);
}

/**
 * Get all a logs api
 * @route GET /api/logs
 * @group logs - Operations about logs
 * @returns {object} 200 - An object of logs info
 * @returns {Error}  default - Unexpected error
 */
function getAllLogs(req, res, next) {
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
      logService.getLogsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      logService.getLogsByPage(pageNo, pageSize).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else {
    logService.getAllLogs().then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * Get logs count api
 * @route GET /api/logs/count
 * @group logs - Operations about logs
 * @returns {object} 200 - An object of logs info
 * @returns {Error}  default - Unexpected error
 */
function getAllLogsCount(req, res, next) {
  //accessResolver.isAuthorized(req);

  logService.getAllLogsCount().then((data) => {
    res.send({ 'count': data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get logs by id api
 * @route GET /api/logs/:id
 * @group logs - Operations about logs
 * @returns {object} 200 - An object of logs info
 * @returns {Error}  default - Unexpected error
 */
function getLogById(req, res, next) {

  let logId = req.params.id;

  console.log("id" + logId);
  var json_format = iValidator.json_schema(schema.getSchema, logId, "log");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  logService.getLogById(logId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.DEAL_DOES_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add logs api
 * @route POST /api/logs
 * @group logs - Operations about logs
 * @param {object} logData.body.required - logs details
 * @returns {object} 200 - An object of logs info
 * @returns {Error}  default - Unexpected error
 */
function addLog(req, res, next) {
  var logData = req.body;


  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, logData, "log");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  logService.getLogByLogName(logData.name).then((data) => {
    if (data != undefined && data.length > 0) {
      return next(errorMethods.sendBadRequest(errorCode.DEAL_ALREADY_EXISTS));
    } else {
      logService.addLog(logData).then((data) => {
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
 * update logs by id api
 * @route PUT /api/logs
 * @group logs - Operations about logs
 * @returns {object} 200 - An object of logs info
 * @returns {Error}  default - Unexpected error
 */
function updateLog(req, res, next) {
  var logData = req.body;
  var id = req.params.id;
  logService.getLogById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.DEAL_DOES_NOT_EXIST));
    } else {
      logService.updateLog(id, logData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}


function deleteLog(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  logService.getLogById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.DEAL_DOES_NOT_EXIST));
    } else {
      logService.deleteLog(delId).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * get overview of logs api
 * @route GET /api/logs/overview
 * @group logs - Operations about logs
 * @returns {object} 200 - An object of logs info
 * @returns {Error}  default - Unexpected error
 */
function getAllLogsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  logService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
 * Search logs api
 * @route POST /api/logs/search
 * @group logs - Operations about logs
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of logs info
 * @returns {Error}  default - Unexpected error
 */
function searchLogs(req, res, next) {
  let searchCriteria = req.body;
  logService.searchLogs(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Is logs exist api
 * @route GET /api/logs/exist
 * @group logs - Operations about logs
 * @param {string} logname.query.required - logs name
 * @returns {object} 200 - An object of logs info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  console.log("name" + name);
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  logService.getLogByLogName(name).then((data) => {
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
