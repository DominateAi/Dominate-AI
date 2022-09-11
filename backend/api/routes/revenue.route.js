const revenueService = require('../services/revenue.service');
var schema = require('../schemas/revenue.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/revenues')
    .get(getAllRevenues)
    .post(addRevenue);
  router.route('/revenues/search')
    .post(searchRevenues);
  router.route('/revenues/count')
    .get(getAllRevenuesCount);
  router.route('/revenues/overview')
    .get(getAllRevenuesOverview);
  router.route('/revenues/exist')
    .get(isExist);
  router.route('/revenues/totalrev')
    .get(totalRev);
  router.route('/revenues/totalaccrev')
    .get(accrev);
  router.route('/revenues/monaccrev')
    .get(monAccRev);
  router.route('/revenues/recurev')
    .get(accRecurRev);
  router.route('/revenues/highrevdeal')
    .get(highRevDeal);
  router.route('/revenues/widget')
    .get(widget);
  router.route('/revenues/revforecast')
    .get(revForecast);
  router.route('/revenues/maxrevchart')
    .get(maxRevChart);
  router.route('/revenues/accmonrevchart')
    .get(accMonRevChart);
  router.route('/revenues/monrevchart')
    .get(monRevChart);
  router.route('/revenues/recurdealchart')
    .get(recurDealChart);
  router.route('/revenues/bigdealchart')
    .get(bigDealChart);
  router.route('/revenues/revpredictchart')
    .get(revPredictChart);
  router.route('/revenues/projectionchart')
    .get(projectionChart);
  router.route('/revenues/member-wise')
    .post(memberWise);
  router.route('/revenues/member-chart')
    .post(memberChart);
  router.route('/revenues/:id')
    .get(getRevenueById)
    .delete(deleteRevenue)
    .put(updateRevenue);
}

/**
 * Get all a revenues api
 * @route GET /api/revenues
 * @group revenues - Operations about revenues
 * @returns {object} 200 - An object of revenues info
 * @returns {Error}  default - Unexpected error
 */
function getAllRevenues(req, res, next) {
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
      revenueService.getRevenuesByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      revenueService.getRevenuesByPage(pageNo, pageSize).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else {
    revenueService.getAllRevenues().then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * Get revenues count api
 * @route GET /api/revenues/count
 * @group revenues - Operations about revenues
 * @returns {object} 200 - An object of revenues info
 * @returns {Error}  default - Unexpected error
 */
function getAllRevenuesCount(req, res, next) {
  //accessResolver.isAuthorized(req);

  revenueService.getAllRevenuesCount().then((data) => {
    res.send({ 'count': data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get revenues by id api
 * @route GET /api/revenues/:id
 * @group revenues - Operations about revenues
 * @returns {object} 200 - An object of revenues info
 * @returns {Error}  default - Unexpected error
 */
function getRevenueById(req, res, next) {

  let revenueId = req.params.id;

  console.log("id" + revenueId);
  var json_format = iValidator.json_schema(schema.getSchema, revenueId, "revenue");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  revenueService.getRevenueById(revenueId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.REVENUE_DOES_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add revenues api
 * @route POST /api/revenues
 * @group revenues - Operations about revenues
 * @param {object} revenueData.body.required - revenues details
 * @returns {object} 200 - An object of revenues info
 * @returns {Error}  default - Unexpected error
 */
function addRevenue(req, res, next) {
  var revenueData = req.body;


  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, revenueData, "revenue");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  revenueService.getRevenueByRevenueName(revenueData.name).then((data) => {
    if (data != undefined && data.length > 0) {
      return next(errorMethods.sendBadRequest(errorCode.REVENUE_ALREADY_EXISTS));
    } else {
      revenueService.addRevenue(revenueData).then((data) => {
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
 * update revenues by id api
 * @route PUT /api/revenues
 * @group revenues - Operations about revenues
 * @returns {object} 200 - An object of revenues info
 * @returns {Error}  default - Unexpected error
 */
function updateRevenue(req, res, next) {
  var revenueData = req.body;
  var id = req.params.id;
  revenueService.getRevenueById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.REVENUE_DOES_NOT_EXIST));
    } else {
      revenueService.updateRevenue(id, revenueData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}


function deleteRevenue(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  revenueService.getRevenueById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.REVENUE_DOES_NOT_EXIST));
    } else {
      revenueService.deleteRevenue(delId).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * get overview of revenues api
 * @route GET /api/revenues/overview
 * @group revenues - Operations about revenues
 * @returns {object} 200 - An object of revenues info
 * @returns {Error}  default - Unexpected error
 */
function getAllRevenuesOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  revenueService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
 * Search revenues api
 * @route POST /api/revenues/search
 * @group revenues - Operations about revenues
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of revenues info
 * @returns {Error}  default - Unexpected error
 */
function searchRevenues(req, res, next) {
  let searchCriteria = req.body;
  revenueService.searchRevenues(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Is revenues exist api
 * @route GET /api/revenues/exist
 * @group revenues - Operations about revenues
 * @param {string} revenuename.query.required - revenues name
 * @returns {object} 200 - An object of revenues info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  console.log("name" + name);
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  revenueService.getRevenueByRevenueName(name).then((data) => {
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
 * Get revenue till date from the account
 * @route GET /api/revenues/accrev
 * @group revenues - Operations about revenues
 * @param {string} req.query.account - account Id
 * @returns {object} 200 - An object of revenues info
 * @returns {Error}  default - Unexpected error
 */

function accrev(req, res, next) {
  let accountId = req.query.account;
  revenueService.accrev(accountId).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get monthly revenue from account
 * @route GET /api/revenues/monaccrev
 * @group revenues - Operations about revenues
 * @param {string} req.query.account - account Id
 * @returns {object} 200 - An object of revenues info
 * @returns {Error}  default - Unexpected error
 */

function monAccRev(req, res, next) {
  let accountId = req.query.account;
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  revenueService.monAccRev(accountId, startDate, endDate).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get recurring revenue from this account till date
 * @route GET /api/revenues/revurev
 * @group revenues - Operations about revenues
 * @param {string} req.query.account - account Id
 * @returns {object} 200 - An object of revenues info
 * @returns {Error}  default - Unexpected error
 */
function accRecurRev(req, res, next) {
  let accountId = req.query.account;
  revenueService.accRecurRev(accountId).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Deals sorted based on revenue
 * @route GET /api/revenues/highrevdeal
 * @group revenues - Operations about revenues
 * @param {string} req.query.account - account Id
 * @returns {object} 200 - An object of revenues info
 * @returns {Error}  default - Unexpected error
 */
function highRevDeal(req, res, next) {
  let accountId = req.query.account;
  revenueService.highRevDeal(accountId).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function totalRev(req, res, next) {
  revenueService.totalRev().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function widget(req, res, next) {
  let accountId = req.query.account;
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  revenueService.widget(accountId, startDate, endDate).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function revForecast(req, res, next) {
  let accountId = req.query.account;
  revenueService.revForecast(accountId).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function maxRevChart(req, res, next) {
  revenueService.maxRevChart().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function accMonRevChart(req, res, next) {
 let accountId = req.query.account;
  revenueService.accMonRevChart(accountId).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function monRevChart(req, res, next) {
  revenueService.monRevChart().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function recurDealChart(req, res, next) {
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  console.log("hello");
  revenueService.recurDealChart(startDate, endDate).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function bigDealChart(req, res, next) {
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  revenueService.bigDealChart(startDate, endDate).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function revPredictChart(req, res, next) {
  revenueService.revPredictChart().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function projectionChart(req, res, next) {
  revenueService.projectionChart().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function memberWise(req, res, next) {
let user = req.body.user
let startDate = req.body.startDate
let endDate = req.body.endDate
  revenueService.memberWise(user, startDate, endDate).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function memberChart(req, res, next) {
  let user = req.body.user
  let startDate = req.body.startDate
  let endDate = req.body.endDate
    revenueService.memberChart(user, startDate, endDate).then((data) => {
      res.json(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }

module.exports.init = init;
