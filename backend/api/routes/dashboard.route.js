const dashboardService = require('../services/dashboard.service');
var schema = require('../schemas/dashboard.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/dashboards')
    .get(getAllDashboards)
    .post(addDashboard);
  router.route('/dashboards/count')
    .get(getAllDashboardsCount);
  router.route('/dashboards/overview')
    .get(getAllDashboardsOverview);
  router.route('/dashboards/:id')
    .get(getDashboardById)
    .delete(deleteDashboard)
    .put(updateDashboard);
  router.route('/dashboards/search')
    .post(searchDashboards);
  router.route('/dashboards/exist')
    .get(isExist);
}

/**
 * Get all a dashboards api
 * @route GET /api/dashboards
 * @group dashboards - Operations about dashboards
 * @returns {object} 200 - An object of dashboards info
 * @returns {Error}  default - Unexpected error
 */
function getAllDashboards(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  let userId = req.query.userId;
  if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      dashboardService.getDashboardsByPageWithSort(pageNo, pageSize, sortBy,userId).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      dashboardService.getDashboardsByPage(pageNo, pageSize,userId).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    dashboardService.getAllDashboards(userId).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
  }
}

/**
 * @typedef SearchCriteria
 * @property {string} pageSize.required
 * @property {string} pageNo.required 
 * @property {string} query.required 
 */
/**
 * Search dashboards api
 * @route POST /api/dashboards/search
 * @group dashboards - Operations about dashboards
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of dashboards info
 * @returns {Error}  default - Unexpected error
 */
function searchDashboards(req, res, next) {
  let searchCriteria = req.body;
  dashboardService.searchDashboards(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get dashboards by id api
 * @route GET /api/dashboards/:id
 * @group dashboards - Operations about dashboards
 * @returns {object} 200 - An object of dashboards info
 * @returns {Error}  default - Unexpected error
 */
function getDashboardById(req,res,next) {

  let dashboardId = req.params.id;

  var json_format = iValidator.json_schema(schema.getSchema,dashboardId,"dashboard");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  dashboardService.getDashboardById(dashboardId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.DASHBOARD_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add dashboards api
 * @route POST /api/dashboards
 * @group dashboards - Operations about dashboards
 * @param {object} dashboard.body.required - dashboards details
 * @returns {object} 200 - An object of dashboards info
 * @returns {Error}  default - Unexpected error
 */
function addDashboard(req,res, next) {
  var dashboardData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, dashboardData, "dashboard");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   dashboardService.getDashboardByDashboardName(dashboardData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.DASHBOARD_ALREADY_EXIST));
    }else{
      dashboardService.addDashboard(dashboardData).then((data) => {
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
 * update dashboards by id api
 * @route PUT /api/dashboards
 * @group dashboards - Operations about dashboards
 * @returns {object} 200 - An object of dashboards info
 * @returns {Error}  default - Unexpected error
 */
function updateDashboard(req,res, next) {
   var dashboardData=req.body;
   var id = req.params.id;
   dashboardService.getDashboardById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.DASHBOARD_NOT_EXIST));
    }else{
      dashboardService.updateDashboard(id,dashboardData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete dashboards by id api
 * @route DELETE /api/dashboards/:id
 * @group dashboards - Operations about dashboards
 * @returns {object} 200 - An object of dashboards info
 * @returns {Error}  default - Unexpected error
 */
function deleteDashboard(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  dashboardService.getDashboardById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.DASHBOARD_NOT_EXIST));
    }else{
      dashboardService.deleteDashboard(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get dashboards count api
 * @route GET /api/dashboards/count
 * @group dashboards - Operations about dashboards
 * @returns {object} 200 - An object of dashboards info
 * @returns {Error}  default - Unexpected error
 */
function getAllDashboardsCount(req,res,next) {
  dashboardService.getAllDashboardsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.DASHBOARD_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of dashboards api
 * @route GET /api/dashboards/overview
 * @group dashboards - Operations about dashboards
 * @returns {object} 200 - An object of dashboards info
 * @returns {Error}  default - Unexpected error
 */
function getAllDashboardsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  dashboardService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is dashboards exist api
 * @route GET /api/dashboards/exist
 * @group dashboards - Operations about dashboards
 * @param {string} dashboardname.query.required - dashboards name
 * @returns {object} 200 - An object of dashboards info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  let dashboardId = req.query.dashboardId;
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  dashboardService.getDashboardByName(name).then((data) => {
    if (data != undefined && data.length > 0) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;