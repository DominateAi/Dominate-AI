const subscriptionService = require('../services/subscription.service');
var schema = require('../schemas/subscription.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/subscriptions')
    .get(getAllSubscriptions)
    .post(addSubscription);
  router.route('/subscriptions/count')
    .get(getAllSubscriptionsCount);
  router.route('/subscriptions/overview')
    .get(getAllSubscriptionsOverview);
  router.route('/subscriptions/:id')
    .get(getSubscriptionById)
    .delete(deleteSubscription)
    .put(updateSubscription);
}

/**
 * Get all a subscriptions api
 * @route GET /api/subscriptions
 * @group subscriptions - Operations about subscriptions
 * @returns {object} 200 - An object of subscriptions info
 * @returns {Error}  default - Unexpected error
 */
function getAllSubscriptions(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }
  else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      subscriptionService.getSubscriptionsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      subscriptionService.getSubscriptionsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    subscriptionService.getAllSubscriptions().then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
  }
}

/**
 * Get subscriptions by id api
 * @route GET /api/subscriptions/:id
 * @group subscriptions - Operations about subscriptions
 * @returns {object} 200 - An object of subscriptions info
 * @returns {Error}  default - Unexpected error
 */
function getSubscriptionById(req,res,next) {

  let subscriptionId = req.params.id;

  console.log("id"+ subscriptionId);
  var json_format = iValidator.json_schema(schema.getSchema,subscriptionId,"subscription");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  subscriptionService.getSubscriptionById(subscriptionId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.SUBSCRIPTION_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add subscriptions api
 * @route POST /api/subscriptions
 * @group subscriptions - Operations about subscriptions
 * @param {object} subscriptionData.body.required - subscriptions details
 * @returns {object} 200 - An object of subscriptions info
 * @returns {Error}  default - Unexpected error
 */
function addSubscription(req,res, next) {
  var subscriptionData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, subscriptionData, "subscription");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   subscriptionService.getSubscriptionBySubscriptionName(subscriptionData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.SUBSCRIPTION_ALREADY_EXIST));
    }else{
      subscriptionService.addSubscription(subscriptionData).then((data) => {
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
 * update subscriptions by id api
 * @route PUT /api/subscriptions
 * @group subscriptions - Operations about subscriptions
 * @returns {object} 200 - An object of subscriptions info
 * @returns {Error}  default - Unexpected error
 */
function updateSubscription(req,res, next) {
   var subscriptionData=req.body;
   var id = req.params.id;
   subscriptionService.getSubscriptionById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.SUBSCRIPTION_NOT_EXIST));
    }else{
      subscriptionService.updateSubscription(id,subscriptionData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete subscriptions by id api
 * @route DELETE /api/subscriptions/:id
 * @group subscriptions - Operations about subscriptions
 * @returns {object} 200 - An object of subscriptions info
 * @returns {Error}  default - Unexpected error
 */
function deleteSubscription(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  subscriptionService.getSubscriptionById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.SUBSCRIPTION_NOT_EXIST));
    }else{
      subscriptionService.deleteSubscription(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get subscriptions count api
 * @route GET /api/subscriptions/count
 * @group subscriptions - Operations about subscriptions
 * @returns {object} 200 - An object of subscriptions info
 * @returns {Error}  default - Unexpected error
 */
function getAllSubscriptionsCount(req,res,next) {
  subscriptionService.getAllSubscriptionsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.SUBSCRIPTION_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of subscriptions api
 * @route GET /api/subscriptions/overview
 * @group subscriptions - Operations about subscriptions
 * @returns {object} 200 - An object of subscriptions info
 * @returns {Error}  default - Unexpected error
 */
function getAllSubscriptionsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  subscriptionService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;