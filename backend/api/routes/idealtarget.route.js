const idealtargetService = require('../services/idealtarget.service');
var schema = require('../schemas/idealtarget.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/idealtargets')
    .get(getAllIdealtargets)
    .post(addIdealtarget);
  router.route('/idealtargets/search')
    .post(searchIdealtargets);
  router.route('/idealtargets/count')
    .get(getAllIdealtargetsCount);
  router.route('/idealtargets/overview')
    .get(getAllIdealtargetsOverview);
  router.route('/idealtargets/exist')
    .get(isExist);
  router.route('/idealtargets/thismonthtarget')
    .get(thisMonthTarget);
  router.route('/idealtargets/tarByUser')
    .get(getTargetByUser);
  router.route('/idealtargets/indmonthlyleadwise')
    .get(indMonLead);
  router.route('/idealtargets/indmondollar')
    .get(indMonDollar);
  router.route('/idealtargets/ownerwise')
    .get(ownerWiseGraph)
  router.route('/idealtargets/indrevgraph')
    .get(indRevGraph);
  router.route('/idealtargets/quarterdata')
    .get(quarterData);
  router.route('/idealtargets/orgquarterdata')
    .get(orgQuarterData);
  router.route('/idealtargets/indcountgraph')
    .get(indCountGraph);
  router.route('/idealtargets/indefficiency')
    .get(indEff);
  router.route('/idealtargets/monthlytable')
    .get(monthlyTable);
  router.route('/idealtargets/:id')
    .get(getIdealtargetById)
    .delete(deleteIdealtarget)
    .put(updateIdealtarget);
}

/**
 * Get all a idealtargets api
 * @route GET /api/idealtargets
 * @group idealtargets - Operations about idealtargets
 * @returns {object} 200 - An object of idealtargets info
 * @returns {Error}  default - Unexpected error
 */
function getAllIdealtargets(req, res, next) {
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
      idealtargetService.getIdealtargetsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      idealtargetService.getIdealtargetsByPage(pageNo, pageSize).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else {
    idealtargetService.getAllIdealtargets().then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * Get idealtargets count api
 * @route GET /api/idealtargets/count
 * @group idealtargets - Operations about idealtargets
 * @returns {object} 200 - An object of idealtargets info
 * @returns {Error}  default - Unexpected error
 */
function getAllIdealtargetsCount(req, res, next) {
  //accessResolver.isAuthorized(req);

  idealtargetService.getAllIdealtargetsCount().then((data) => {
    res.send({ 'count': data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get idealtargets by id api
 * @route GET /api/idealtargets/:id
 * @group idealtargets - Operations about idealtargets
 * @returns {object} 200 - An object of idealtargets info
 * @returns {Error}  default - Unexpected error
 */
function getIdealtargetById(req, res, next) {

  let idealtargetId = req.params.id;

  console.log("id" + idealtargetId);
  var json_format = iValidator.json_schema(schema.getSchema, idealtargetId, "idealtarget");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  idealtargetService.getIdealtargetById(idealtargetId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.IDEALTARGET_DOES_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add idealtargets api
 * @route POST /api/idealtargets
 * @group idealtargets - Operations about idealtargets
 * @param {object} idealtargetData.body.required - idealtargets details
 * @returns {object} 200 - An object of idealtargets info
 * @returns {Error}  default - Unexpected error
 */
function addIdealtarget(req, res, next) {
  var idealtargetData = req.body;


  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, idealtargetData, "idealtarget");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  idealtargetService.getIdealtargetByIdealtargetName(idealtargetData.name).then((data) => {
    if (data != undefined && data.length > 0) {
      return next(errorMethods.sendBadRequest(errorCode.IDEALTARGET_ALREADY_EXISTS));
    } else {
      idealtargetService.addIdealtarget(idealtargetData).then((data) => {
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
 * update idealtargets by id api
 * @route PUT /api/idealtargets
 * @group idealtargets - Operations about idealtargets
 * @returns {object} 200 - An object of idealtargets info
 * @returns {Error}  default - Unexpected error
 */
function updateIdealtarget(req, res, next) {
  var idealtargetData = req.body;
  var id = req.params.id;
  idealtargetService.getIdealtargetById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.IDEALTARGET_DOES_NOT_EXIST));
    } else {
      idealtargetService.updateIdealtarget(id, idealtargetData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}


function deleteIdealtarget(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  idealtargetService.getIdealtargetById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.IDEALTARGET_DOES_NOT_EXIST));
    } else {
      idealtargetService.deleteIdealtarget(delId).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * get overview of idealtargets api
 * @route GET /api/idealtargets/overview
 * @group idealtargets - Operations about idealtargets
 * @returns {object} 200 - An object of idealtargets info
 * @returns {Error}  default - Unexpected error
 */
function getAllIdealtargetsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  idealtargetService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
 * Search idealtargets api
 * @route POST /api/idealtargets/search
 * @group idealtargets - Operations about idealtargets
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of idealtargets info
 * @returns {Error}  default - Unexpected error
 */
function searchIdealtargets(req, res, next) {
  let searchCriteria = req.body;
  idealtargetService.searchIdealtargets(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Is idealtargets exist api
 * @route GET /api/idealtargets/exist
 * @group idealtargets - Operations about idealtargets
 * @param {string} idealtargetname.query.required - idealtargets name
 * @returns {object} 200 - An object of idealtargets info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let assigned = req.query.assigned;
  // var json_format = iValidator.json_schema(schema.existSchema, assigned, "assigned");
  // if (json_format.valid == false) {
  //   return res.status(422).send(json_format.errorMessage);
  // }
  idealtargetService.getIdealtargetByIdealtargetName(assigned).then((data) => {
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
    idealtargetService.thisMonthOrgTarget(startDate,endDate).then((data) => {
      res.json(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
  else{
    idealtargetService.thisMonthTarget(user, startDate,endDate).then((data) => {
      res.json(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
  
}

function getTargetByUser(req, res, next) {
  let user = req.query.user;
  idealtargetService.getTargetByUser(user).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function indMonLead(req, res, next) {
  let user = req.query.user;
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  idealtargetService.indMonLead(user, startDate, endDate).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function indMonDollar(req, res, next) {
  let user = req.query.user;
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  idealtargetService.indMonDollar(user, startDate, endDate).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function ownerWiseGraph(req, res, next) {
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  idealtargetService.ownerWiseGraph(startDate, endDate).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function indRevGraph(req, res, next) {
  let user = req.query.user;
  idealtargetService.indRevGraph(user).then((data) => {
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
  idealtargetService.quarterData(user, quarterStart, quarterEnd, monthStart, monthEnd, prevMonStart, prevMonEnd).then((data) => {
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
  idealtargetService.orgQuarterData(quarterStart, quarterEnd, monthStart, monthEnd, prevMonStart, prevMonEnd).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function indCountGraph(req, res, next) {
  let user = req.query.user;
  idealtargetService.indCountGraph(user).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function indEff(req, res, next) {
  let user = req.query.user;
  idealtargetService.indEff(user).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function monthlyTable(req, res, next) {
  let user = req.query.user;
  idealtargetService.monthlyTable(user).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;
