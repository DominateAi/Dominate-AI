const otargetService = require('../services/otarget.service');
var schema = require('../schemas/otarget.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/otargets')
    .get(getAllOtargets)
    .post(addOtarget);
  router.route('/otargets/search')
    .post(searchOtargets);
  router.route('/otargets/count')
    .get(getAllOtargetsCount);
  router.route('/otargets/overview')
    .get(getAllOtargetsOverview);
  router.route('/otargets/exist')
    .get(isExist);
  router.route('/otargets/orgmonthlyleadwise')
    .get(orgMonLead);
  router.route('/otargets/orgmondollar')
    .get(orgMonDollar);
  router.route('/otargets/orgrevgraph')
    .get(orgRevGraph);
  router.route('/otargets/orgcountgraph')
    .get(orgCountGraph);
  router.route('/otargets/orgefficiency')
    .get(orgEff);
  router.route('/otargets/monthlytable')
    .get(monthlyTable);
  router.route('/otargets/:id')
    .get(getOtargetById)
    .delete(deleteOtarget)
    .put(updateOtarget);
}

/**
 * Get all a otargets api
 * @route GET /api/otargets
 * @group otargets - Operations about otargets
 * @returns {object} 200 - An object of otargets info
 * @returns {Error}  default - Unexpected error
 */
function getAllOtargets(req, res, next) {
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
      otargetService.getOtargetsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      otargetService.getOtargetsByPage(pageNo, pageSize).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else {
    otargetService.getAllOtargets().then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * Get otargets count api
 * @route GET /api/otargets/count
 * @group otargets - Operations about otargets
 * @returns {object} 200 - An object of otargets info
 * @returns {Error}  default - Unexpected error
 */
function getAllOtargetsCount(req, res, next) {
  //accessResolver.isAuthorized(req);

  otargetService.getAllOtargetsCount().then((data) => {
    res.send({ 'count': data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get otargets by id api
 * @route GET /api/otargets/:id
 * @group otargets - Operations about otargets
 * @returns {object} 200 - An object of otargets info
 * @returns {Error}  default - Unexpected error
 */
function getOtargetById(req, res, next) {

  let otargetId = req.params.id;

  console.log("id" + otargetId);
  var json_format = iValidator.json_schema(schema.getSchema, otargetId, "otarget");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  otargetService.getOtargetById(otargetId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.OTARGET_DOES_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add otargets api
 * @route POST /api/otargets
 * @group otargets - Operations about otargets
 * @param {object} otargetData.body.required - otargets details
 * @returns {object} 200 - An object of otargets info
 * @returns {Error}  default - Unexpected error
 */
function addOtarget(req, res, next) {
  var otargetData = req.body;


  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, otargetData, "otarget");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  otargetService.getOtargetByOtargetName(otargetData.name).then((data) => {
    if (data != undefined && data.length > 0) {
      return next(errorMethods.sendBadRequest(errorCode.OTARGET_ALREADY_EXISTS));
    } else {
      otargetService.addOtarget(otargetData).then((data) => {
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
 * update otargets by id api
 * @route PUT /api/otargets
 * @group otargets - Operations about otargets
 * @returns {object} 200 - An object of otargets info
 * @returns {Error}  default - Unexpected error
 */
function updateOtarget(req, res, next) {
  var otargetData = req.body;
  var id = req.params.id;
  otargetService.getOtargetById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.OTARGET_DOES_NOT_EXIST));
    } else {
      otargetService.updateOtarget(id, otargetData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}


function deleteOtarget(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  otargetService.getOtargetById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.OTARGET_DOES_NOT_EXIST));
    } else {
      otargetService.deleteOtarget(delId).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * get overview of otargets api
 * @route GET /api/otargets/overview
 * @group otargets - Operations about otargets
 * @returns {object} 200 - An object of otargets info
 * @returns {Error}  default - Unexpected error
 */
function getAllOtargetsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  otargetService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
 * Search otargets api
 * @route POST /api/otargets/search
 * @group otargets - Operations about otargets
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of otargets info
 * @returns {Error}  default - Unexpected error
 */
function searchOtargets(req, res, next) {
  let searchCriteria = req.body;
  otargetService.searchOtargets(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Is otargets exist api
 * @route GET /api/otargets/exist
 * @group otargets - Operations about otargets
 * @param {string} otargetname.query.required - otargets name
 * @returns {object} 200 - An object of otargets info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let otargetId = req.query.id;
  // var json_format = iValidator.json_schema(schema.existSchema, otargetId, "name");
  // if (json_format.valid == false) {
  //   return res.status(422).send(json_format.errorMessage);
  // }
  console.log(otargetId);
  otargetService.getOtargetByOtargetName(otargetId).then((data) => {
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
  otargetService.orgMonLead(startDate, endDate).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function orgMonDollar(req,res,next){
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  otargetService.orgMonDollar(startDate, endDate).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function orgRevGraph(req,res,next){
  otargetService.orgRevGraph().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function orgCountGraph(req,res,next){
  otargetService.orgCountGraph().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function orgEff(req,res,next){
  otargetService.orgEff().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function monthlyTable(req,res,next){
  otargetService.monthlyTable().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;
