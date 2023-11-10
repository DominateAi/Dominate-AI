const callService = require('../services/call.service');
var schema = require('../schemas/call.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/calls')
    .get(getAllCalls)
    .post(addCall);
  router.route('/calls/dial')
    .post(dial);
  router.route('/calls/bill/:id')
    .get(getBill);
  router.route('/calls/count')
    .get(getAllCallsCount);
  router.route('/calls/overview')
    .get(getAllCallsOverview);
  router.route('/calls/:id')
    .get(getCallById)
    .delete(deleteCall)
    .put(updateCall);
  router.route('/calls/search')
    .post(searchCalls);
  router.route('/calls/exist')
    .get(isExist);
}

/**
 * Get all a calls api
 * @route GET /api/calls
 * @group calls - Operations about calls
 * @returns {object} 200 - An object of calls info
 * @returns {Error}  default - Unexpected error
 */
function getAllCalls(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
   if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      callService.getCallsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      callService.getCallsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    callService.getAllCalls().then((data) => {
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
 * Search calls api
 * @route POST /api/calls/search
 * @group calls - Operations about calls
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of calls info
 * @returns {Error}  default - Unexpected error
 */
function searchCalls(req, res, next) {
  let searchCriteria = req.body;
  callService.searchCall(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get calls by id api
 * @route GET /api/calls/:id
 * @group calls - Operations about calls
 * @returns {object} 200 - An object of calls info
 * @returns {Error}  default - Unexpected error
 */
function getCallById(req,res,next) {

  let callId = req.params.id;

  var json_format = iValidator.json_schema(schema.getSchema,callId,"call");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  callService.getCallById(callId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.CALL_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * Get calls bill by id api
 * @route GET /api/calls/bill/:id
 * @group calls - Operations about calls
 * @returns {object} 200 - An object of calls info
 * @returns {Error}  default - Unexpected error
 */
function getBill(req,res,next) {

  let callId = req.params.id;

  var json_format = iValidator.json_schema(schema.getSchema,callId,"call");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  callService.getBill(callId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.CALL_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add calls api
 * @route POST /api/calls
 * @group calls - Operations about calls
 * @param {object} call.body.required - calls details
 * @returns {object} 200 - An object of calls info
 * @returns {Error}  default - Unexpected error
 */
function addCall(req,res, next) {
  var callData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, callData, "call");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   callService.getCallByCallName(callData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.CALL_ALREADY_EXIST));
    }else{
      callService.addCall(callData).then((data) => {
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
 * dial calls api
 * @route POST /api/calls/dial
 * @group calls - Operations about calls
 * @param {object} call.body.required - calls details
 * @returns {object} 200 - An object of calls info
 * @returns {Error}  default - Unexpected error
 */
function dial(req,res, next) {
  var callData=req.body;
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.dialSchema, callData, "call");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   callService.dial(callData).then((data) => {
    res.json(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * update calls by id api
 * @route PUT /api/calls
 * @group calls - Operations about calls
 * @returns {object} 200 - An object of calls info
 * @returns {Error}  default - Unexpected error
 */
function updateCall(req,res, next) {
   var callData=req.body;
   var id = req.params.id;
   callService.getCallById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.CALL_NOT_EXIST));
    }else{
      callService.updateCall(id,callData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete calls by id api
 * @route DELETE /api/calls/:id
 * @group calls - Operations about calls
 * @returns {object} 200 - An object of calls info
 * @returns {Error}  default - Unexpected error
 */
function deleteCall(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  callService.getCallById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.CALL_NOT_EXIST));
    }else{
      callService.deleteCall(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get calls count api
 * @route GET /api/calls/count
 * @group calls - Operations about calls
 * @returns {object} 200 - An object of calls info
 * @returns {Error}  default - Unexpected error
 */
function getAllCallsCount(req,res,next) {
  callService.getAllCallsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.CALL_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of calls api
 * @route GET /api/calls/overview
 * @group calls - Operations about calls
 * @returns {object} 200 - An object of calls info
 * @returns {Error}  default - Unexpected error
 */
function getAllCallsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  callService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is calls exist api
 * @route GET /api/calls/exist
 * @group calls - Operations about calls
 * @param {string} callname.query.required - calls name
 * @returns {object} 200 - An object of calls info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  let callId = req.query.callId;
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  callService.getCallByName(name).then((data) => {
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