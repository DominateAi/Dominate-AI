const itargetService = require('../services/itarget.service');
var schema = require('../schemas/itarget.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/itargets')
    .get(getAllItargets)
    .post(addItarget);
  router.route('/itargets/search')
    .post(searchItargets);
  router.route('/itargets/count')
    .get(getAllItargetsCount);
  router.route('/itargets/overview')
    .get(getAllItargetsOverview);
  router.route('/itargets/exist')
    .get(isExist);
  router.route('/itargets/thismonthtarget')
    .get(thisMonthTarget);
  router.route('/itargets/tarByUser')
    .get(getTargetByUser);
  router.route('/itargets/indmonthlyleadwise')
    .get(indMonLead);
  router.route('/itargets/indmondollar')
    .get(indMonDollar);
  router.route('/itargets/ownerwise')
    .get(ownerWiseGraph)
  router.route('/itargets/indrevgraph')
    .get(indRevGraph);
  router.route('/itargets/quarterdata')
    .get(quarterData);
  router.route('/itargets/orgquarterdata')
    .get(orgQuarterData);
  router.route('/itargets/indcountgraph')
    .get(indCountGraph);
  router.route('/itargets/indefficiency')
    .get(indEff);
  router.route('/itargets/monthlytable')
    .get(monthlyTable);
  router.route('/itargets/:id')
    .get(getItargetById)
    .delete(deleteItarget)
    .put(updateItarget);
}

/**
 * Get all a itargets api
 * @route GET /api/itargets
 * @group itargets - Operations about itargets
 * @returns {object} 200 - An object of itargets info
 * @returns {Error}  default - Unexpected error
 */
function getAllItargets(req, res, next) {
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
      itargetService.getItargetsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      itargetService.getItargetsByPage(pageNo, pageSize).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else {
    itargetService.getAllItargets().then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * Get itargets count api
 * @route GET /api/itargets/count
 * @group itargets - Operations about itargets
 * @returns {object} 200 - An object of itargets info
 * @returns {Error}  default - Unexpected error
 */
function getAllItargetsCount(req, res, next) {
  //accessResolver.isAuthorized(req);

  itargetService.getAllItargetsCount().then((data) => {
    res.send({ 'count': data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get itargets by id api
 * @route GET /api/itargets/:id
 * @group itargets - Operations about itargets
 * @returns {object} 200 - An object of itargets info
 * @returns {Error}  default - Unexpected error
 */
function getItargetById(req, res, next) {

  let itargetId = req.params.id;

  console.log("id" + itargetId);
  var json_format = iValidator.json_schema(schema.getSchema, itargetId, "itarget");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  itargetService.getItargetById(itargetId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.ITARGET_DOES_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add itargets api
 * @route POST /api/itargets
 * @group itargets - Operations about itargets
 * @param {object} itargetData.body.required - itargets details
 * @returns {object} 200 - An object of itargets info
 * @returns {Error}  default - Unexpected error
 */
function addItarget(req, res, next) {
  var itargetData = req.body;


  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, itargetData, "itarget");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  itargetService.getItargetByItargetName(itargetData.name).then((data) => {
    if (data != undefined && data.length > 0) {
      return next(errorMethods.sendBadRequest(errorCode.ITARGET_ALREADY_EXISTS));
    } else {
      itargetService.addItarget(itargetData).then((data) => {
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
 * update itargets by id api
 * @route PUT /api/itargets
 * @group itargets - Operations about itargets
 * @returns {object} 200 - An object of itargets info
 * @returns {Error}  default - Unexpected error
 */
function updateItarget(req, res, next) {
  var itargetData = req.body;
  var id = req.params.id;
  itargetService.getItargetById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.ITARGET_DOES_NOT_EXIST));
    } else {
      itargetService.updateItarget(id, itargetData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}


function deleteItarget(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  itargetService.getItargetById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.ITARGET_DOES_NOT_EXIST));
    } else {
      itargetService.deleteItarget(delId).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * get overview of itargets api
 * @route GET /api/itargets/overview
 * @group itargets - Operations about itargets
 * @returns {object} 200 - An object of itargets info
 * @returns {Error}  default - Unexpected error
 */
function getAllItargetsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  itargetService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
 * Search itargets api
 * @route POST /api/itargets/search
 * @group itargets - Operations about itargets
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of itargets info
 * @returns {Error}  default - Unexpected error
 */
function searchItargets(req, res, next) {
  let searchCriteria = req.body;
  itargetService.searchItargets(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Is itargets exist api
 * @route GET /api/itargets/exist
 * @group itargets - Operations about itargets
 * @param {string} itargetname.query.required - itargets name
 * @returns {object} 200 - An object of itargets info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let assigned = req.query.assigned;
  // var json_format = iValidator.json_schema(schema.existSchema, assigned, "assigned");
  // if (json_format.valid == false) {
  //   return res.status(422).send(json_format.errorMessage);
  // }
  itargetService.getItargetByItargetName(assigned).then((data) => {
    if (data != undefined) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function thisMonthTarget(req,res,next){
  let user = req.query.user;
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  if(user==undefined || user==null)
  {
    itargetService.thisMonthOrgTarget(startDate,endDate).then((data) => {
      res.json(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
  else{
    itargetService.thisMonthTarget(user, startDate,endDate).then((data) => {
      res.json(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
  
}

function getTargetByUser(req, res, next) {
  let user = req.query.user;
  itargetService.getTargetByUser(user).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function indMonLead(req, res, next) {
  let user = req.query.user;
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  itargetService.indMonLead(user, startDate, endDate).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function indMonDollar(req, res, next) {
  let user = req.query.user;
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  itargetService.indMonDollar(user, startDate, endDate).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function ownerWiseGraph(req, res, next) {
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  itargetService.ownerWiseGraph(startDate, endDate).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function indRevGraph(req, res, next) {
  let user = req.query.user;
  itargetService.indRevGraph(user).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function quarterData(req, res, next) {
  let user = req.query.user;
  let quarterStart = req.query.quarterStart;
  let quarterEnd = req.query.quarterEnd;
  let monthStart = req.query.monthStart;
  let monthEnd = req.query.monthEnd;
  let prevMonStart = req.query.prevMonStart;
  let prevMonEnd = req.query.prevMonEnd;
  itargetService.quarterData(user, quarterStart, quarterEnd, monthStart, monthEnd, prevMonStart, prevMonEnd).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function orgQuarterData(req, res, next) {
  let quarterStart = req.query.quarterStart;
  let quarterEnd = req.query.quarterEnd;
  let monthStart = req.query.monthStart;
  let monthEnd = req.query.monthEnd;
  let prevMonStart = req.query.prevMonStart;
  let prevMonEnd = req.query.prevMonEnd;
  itargetService.orgQuarterData(quarterStart, quarterEnd, monthStart, monthEnd, prevMonStart, prevMonEnd).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function indCountGraph(req, res, next) {
  let user = req.query.user;
  itargetService.indCountGraph(user).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function indEff(req, res, next) {
  let user = req.query.user;
  itargetService.indEff(user).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function monthlyTable(req, res, next) {
  let user = req.query.user;
  itargetService.monthlyTable(user).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;
