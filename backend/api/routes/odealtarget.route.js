const odealtargetService = require('../services/odealtarget.service');
var schema = require('../schemas/odealtarget.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/odealtargets')
    .get(getAllOdealtargets)
    .post(addOdealtarget);
  router.route('/odealtargets/search')
    .post(searchOdealtargets);
  router.route('/odealtargets/count')
    .get(getAllOdealtargetsCount);
  router.route('/odealtargets/overview')
    .get(getAllOdealtargetsOverview);
  router.route('/odealtargets/exist')
    .get(isExist);
  router.route('/odealtargets/orgmonthlyleadwise')
    .get(orgMonLead);
  router.route('/odealtargets/orgmondollar')
    .get(orgMonDollar);
  router.route('/odealtargets/orgrevgraph')
    .get(orgRevGraph);
  router.route('/odealtargets/orgcountgraph')
    .get(orgCountGraph);
  router.route('/odealtargets/orgefficiency')
    .get(orgEff);
  router.route('/odealtargets/monthlytable')
    .get(monthlyTable);
  router.route('/odealtargets/:id')
    .get(getOdealtargetById)
    .delete(deleteOdealtarget)
    .put(updateOdealtarget);
}

/**
 * Get all a odealtargets api
 * @route GET /api/odealtargets
 * @group odealtargets - Operations about odealtargets
 * @returns {object} 200 - An object of odealtargets info
 * @returns {Error}  default - Unexpected error
 */
function getAllOdealtargets(req, res, next) {
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
      odealtargetService.getOdealtargetsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      odealtargetService.getOdealtargetsByPage(pageNo, pageSize).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else {
    odealtargetService.getAllOdealtargets().then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * Get odealtargets count api
 * @route GET /api/odealtargets/count
 * @group odealtargets - Operations about odealtargets
 * @returns {object} 200 - An object of odealtargets info
 * @returns {Error}  default - Unexpected error
 */
function getAllOdealtargetsCount(req, res, next) {
  //accessResolver.isAuthorized(req);

  odealtargetService.getAllOdealtargetsCount().then((data) => {
    res.send({ 'count': data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get odealtargets by id api
 * @route GET /api/odealtargets/:id
 * @group odealtargets - Operations about odealtargets
 * @returns {object} 200 - An object of odealtargets info
 * @returns {Error}  default - Unexpected error
 */
function getOdealtargetById(req, res, next) {

  let odealtargetId = req.params.id;

  console.log("id" + odealtargetId);
  var json_format = iValidator.json_schema(schema.getSchema, odealtargetId, "odealtarget");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  odealtargetService.getOdealtargetById(odealtargetId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.ODEALTARGET_DOES_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add odealtargets api
 * @route POST /api/odealtargets
 * @group odealtargets - Operations about odealtargets
 * @param {object} odealtargetData.body.required - odealtargets details
 * @returns {object} 200 - An object of odealtargets info
 * @returns {Error}  default - Unexpected error
 */
function addOdealtarget(req, res, next) {
  var odealtargetData = req.body;


  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, odealtargetData, "odealtarget");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  odealtargetService.getOdealtargetByOdealtargetName(odealtargetData.name).then((data) => {
    if (data != undefined && data.length > 0) {
      return next(errorMethods.sendBadRequest(errorCode.ODEALTARGET_ALREADY_EXISTS));
    } else {
      odealtargetService.addOdealtarget(odealtargetData).then((data) => {
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
 * update odealtargets by id api
 * @route PUT /api/odealtargets
 * @group odealtargets - Operations about odealtargets
 * @returns {object} 200 - An object of odealtargets info
 * @returns {Error}  default - Unexpected error
 */
function updateOdealtarget(req, res, next) {
  var odealtargetData = req.body;
  var id = req.params.id;
  odealtargetService.getOdealtargetById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.ODEALTARGET_DOES_NOT_EXIST));
    } else {
      odealtargetService.updateOdealtarget(id, odealtargetData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}


function deleteOdealtarget(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  odealtargetService.getOdealtargetById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.ODEALTARGET_DOES_NOT_EXIST));
    } else {
      odealtargetService.deleteOdealtarget(delId).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * get overview of odealtargets api
 * @route GET /api/odealtargets/overview
 * @group odealtargets - Operations about odealtargets
 * @returns {object} 200 - An object of odealtargets info
 * @returns {Error}  default - Unexpected error
 */
function getAllOdealtargetsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  odealtargetService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
 * Search odealtargets api
 * @route POST /api/odealtargets/search
 * @group odealtargets - Operations about odealtargets
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of odealtargets info
 * @returns {Error}  default - Unexpected error
 */
function searchOdealtargets(req, res, next) {
  let searchCriteria = req.body;
  odealtargetService.searchOdealtargets(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Is odealtargets exist api
 * @route GET /api/odealtargets/exist
 * @group odealtargets - Operations about odealtargets
 * @param {string} odealtargetname.query.required - odealtargets name
 * @returns {object} 200 - An object of odealtargets info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let odealtargetId = req.query.id;
  // var json_format = iValidator.json_schema(schema.existSchema, odealtargetId, "name");
  // if (json_format.valid == false) {
  //   return res.status(422).send(json_format.errorMessage);
  // }
  console.log(odealtargetId);
  odealtargetService.getOdealtargetByOdealtargetName(odealtargetId).then((data) => {
    if (data != undefined) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function orgMonLead(req,res,next){
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  odealtargetService.orgMonLead(startDate, endDate).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function orgMonDollar(req,res,next){
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  odealtargetService.orgMonDollar(startDate, endDate).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function orgRevGraph(req,res,next){
  odealtargetService.orgRevGraph().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function orgCountGraph(req,res,next){
  odealtargetService.orgCountGraph().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function orgEff(req,res,next){
  odealtargetService.orgEff().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function monthlyTable(req,res,next){
  odealtargetService.monthlyTable().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;
