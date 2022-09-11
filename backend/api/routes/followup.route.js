const followupService = require('../services/followup.service');
var schema = require('../schemas/followup.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/followups')
    .get(getAllFollowups)
    .post(addFollowup);
  router.route('/followups/count')
    .get(getAllFollowupsCount);
  router.route('/followups/overview')
    .get(getAllFollowupsOverview);
  router.route('/followups/followupCount')
    .post(followupCount)
  router.route('/followups/:id')
    .get(getFollowupById)
    .delete(deleteFollowup)
    .put(updateFollowup);
  router.route('/followups/search')
    .post(searchFollowups);
  router.route('/followups/exist')
    .get(isExist);
  router.route('/followups/comm-overview')
    .post(commOverview)
  router.route('/followups/comm-overview-chart')
    .post(commOverviewChart)
  router.route('/followups/portfolio-count')
    .post(portfolioCount)
}

/**
 * Get all a followups api
 * @route GET /api/followups
 * @group followups - Operations about followups
 * @returns {object} 200 - An object of followups info
 * @returns {Error}  default - Unexpected error
 */
function getAllFollowups(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  var entityId = req.query.entityId;
  var entityType = req.query.entityType;
  if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      followupService.getFollowupsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      console.log("test commit");
        res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      followupService.getFollowupsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else if (entityId != undefined && entityType != undefined) {
    followupService.getAllFollowups(entityId,entityType).then((data) => {
      console.log("testing");
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
  }else{
    next(errorMethods.sendBadRequest("Missing entityId & entityType"));
  }
}

/**
 * @typedef SearchCriteria
 * @property {string} pageSize.required
 * @property {string} pageNo.required 
 * @property {string} query.required 
 */
/**
 * Search followups api
 * @route POST /api/followups/search
 * @group followups - Operations about followups
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of followups info
 * @returns {Error}  default - Unexpected error
 */
function searchFollowups(req, res, next) {
  let searchCriteria = req.body;
      followupService.searchFollowups(searchCriteria).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
}

/**
 * Get followups by id api
 * @route GET /api/followups/:id
 * @group followups - Operations about followups
 * @returns {object} 200 - An object of followups info
 * @returns {Error}  default - Unexpected error
 */
function getFollowupById(req,res,next) {

  let followupId = req.params.id;

  var json_format = iValidator.json_schema(schema.getSchema,followupId,"followup");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  followupService.getFollowupById(followupId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.FOLLOWUP_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add followups api
 * @route POST /api/followups
 * @group followups - Operations about followups
 * @param {object} followup.body.required - followups details
 * @returns {object} 200 - An object of followups info
 * @returns {Error}  default - Unexpected error
 */
function addFollowup(req,res, next) {
  var followupData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, followupData, "followup");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   followupService.addFollowup(followupData).then((data) => {
    res.json(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });

}

/**
 * update followups by id api
 * @route PUT /api/followups
 * @group followups - Operations about followups
 * @returns {object} 200 - An object of followups info
 * @returns {Error}  default - Unexpected error
 */
function updateFollowup(req,res, next) {
   var followupData=req.body;
   var id = req.params.id;
   followupService.getFollowupById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.FOLLOWUP_NOT_EXIST));
    }else{
      followupService.updateFollowup(id,followupData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete followups by id api
 * @route DELETE /api/followups/:id
 * @group followups - Operations about followups
 * @returns {object} 200 - An object of followups info
 * @returns {Error}  default - Unexpected error
 */
function deleteFollowup(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  followupService.getFollowupById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.FOLLOWUP_NOT_EXIST));
    }else{
      followupService.deleteFollowup(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get followups count api
 * @route GET /api/followups/count
 * @group followups - Operations about followups
 * @returns {object} 200 - An object of followups info
 * @returns {Error}  default - Unexpected error
 */
function getAllFollowupsCount(req,res,next) {
  followupService.getAllFollowupsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.FOLLOWUP_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of followups api
 * @route GET /api/followups/overview
 * @group followups - Operations about followups
 * @returns {object} 200 - An object of followups info
 * @returns {Error}  default - Unexpected error
 */
function getAllFollowupsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  followupService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is followups exist api
 * @route GET /api/followups/exist
 * @group followups - Operations about followups
 * @param {string} followupname.query.required - followups name
 * @returns {object} 200 - An object of followups info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  let followupId = req.query.followupId;
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  followupService.getFollowupByName(name).then((data) => {
    if (data != undefined && data.length > 0) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * get communication overview of followups api
 * @route POST /api/followups/overview
 * @group followups - Operations about followups
 * @returns {object} 200 - An object of followups info
 * @returns {Error}  default - Unexpected error
 */
 function commOverview(req, res, next) {
  let user = req.body.user;
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  if (!user || !startDate || !endDate) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  followupService.commOverview(user, startDate, endDate).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * get communication overview chart of followups api
 * @route POST /api/followups/overview
 * @group followups - Operations about followups
 * @returns {object} 200 - An object of followups info
 * @returns {Error}  default - Unexpected error
 */
 function commOverviewChart(req, res, next) {
  let user = req.body.user;
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  if (!user || !startDate || !endDate) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  followupService.commOverviewChart(user, startDate, endDate).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * portfolio count
 * @route POST /api/followups/overview
 * @group followups - Operations about followups
 * @returns {object} 200 - An object of followups info
 * @returns {Error}  default - Unexpected error
 */
 function portfolioCount(req, res, next) {
  let user = req.body.user;
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  if (!user || !startDate || !endDate) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  followupService.portfolioCount(user, startDate, endDate).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function followupCount(req, res, next) {
  let query = req.body.query;
  let type = req.body.type;
  let assigned = req.body.assigned
      followupService.followupCount(type, query, assigned).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
}

module.exports.init = init;