const activityService = require('../services/activity.service');
var schema = require('../schemas/activity.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/activities')
    .get(getAllActivities)
    .post(addActivity);
  router.route('/activities/count')
    .get(getAllActivitiesCount);
  router.route('/activities/search')
    .post(searchActivities);
  router.route('/activities/overview')
    .get(getAllActivitiesOverview);
  router.route('/activities/:id')
    .get(getActivityById)
    .delete(deleteActivity)
    .put(updateActivity);
}

/**
 * Get all a activities api
 * @route GET /api/activities
 * @group activities - Operations about activities
 * @returns {object} 200 - An object of activities info
 * @returns {Error}  default - Unexpected error
 */
function getAllActivities(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  var entityId = req.query.entityId;
  var entityType = req.query.entityType;
  // if (pageNo > 0) {
  //   if (sortBy != null || sortBy != undefined) {
  //     activityService.getActivitiesByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
  //     res.send(data);
  //   }).catch((err) => {
  //     next(errorMethods.sendServerError(err));
  //   });
  //   } else {
  //     activityService.getActivitiesByPage(pageNo, pageSize).then((data) => {
  //     res.send(data);
  //   }).catch((err) => {
  //     next(errorMethods.sendServerError(err));
  //   });
  //   }
  // } else if (entityId != undefined && entityType != undefined) {
    console.log(entityId, entityType);
    activityService.getAllActivities(entityId, entityType).then((data) => {
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
 * Search activities api
 * @route POST /api/activities/search
 * @group activities - Operations about activities
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of activities info
 * @returns {Error}  default - Unexpected error
 */
function searchActivities(req, res, next) {
  let searchCriteria = req.body;
  if(searchCriteria.query.entityId != undefined &&
    searchCriteria.query.entityType != undefined ){
      activityService.searchActivities(searchCriteria).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }else{
      next(errorMethods.sendBadRequest("Missing entityId & entityType"));
    }
  
}

/**
 * Get activities by id api
 * @route GET /api/activities/:id
 * @group activities - Operations about activities
 * @returns {object} 200 - An object of activities info
 * @returns {Error}  default - Unexpected error
 */
function getActivityById(req,res,next) {

  let activityId = req.params.id;
  var json_format = iValidator.json_schema(schema.getSchema,activityId,"activity");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  activityService.getActivityById(activityId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.ACTIVITY_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add activities api
 * @route POST /api/activities
 * @group activities - Operations about activities
 * @param {object} activitiesData.body.required - activities details
 * @returns {object} 200 - An object of activities info
 * @returns {Error}  default - Unexpected error
 */
function addActivity(req,res, next) {
  var activityData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, activityData, "activity");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   activityService.getActivityByActivityName(activityData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.ACTIVITY_ALREADY_EXIST));
    }else{
      activityService.addActivity(activityData).then((data) => {
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
 * update activities by id api
 * @route PUT /api/activities
 * @group activities - Operations about activities
 * @returns {object} 200 - An object of activities info
 * @returns {Error}  default - Unexpected error
 */
function updateActivity(req,res, next) {
   var activityData=req.body;
   var id = req.params.id;
   activityService.getActivityById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.ACTIVITY_NOT_EXIST));
    }else{
      activityService.updateActivity(id,activityData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}


/**
 * activities by id api
 * @route DELETE /api/activities/:id
 * @group activities - Operations about activities
 * @returns {object} 200 - An object of activities info
 * @returns {Error}  default - Unexpected error
 */
function deleteActivity(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  activityService.getActivityById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.ACTIVITY_NOT_EXIST));
    }else{
      activityService.deleteActivity(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get activities count api
 * @route GET /api/activities/count
 * @group activities - Operations about activities
 * @returns {object} 200 - An object of activities info
 * @returns {Error}  default - Unexpected error
 */
function getAllActivitiesCount(req,res,next) {
  activityService.getAllActivitiesCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.ACTIVITY_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of activities api
 * @route GET /api/activities/overview
 * @group activities - Operations about activities
 * @returns {object} 200 - An object of activities info
 * @returns {Error}  default - Unexpected error
 */
function getAllActivitiesOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  activityService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;