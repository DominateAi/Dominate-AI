const verifiedemailService = require('../services/verifiedemail.service');
var schema = require('../schemas/verifiedemail.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/verifiedemails')
    .get(getAllVerifiedemails)
    .post(addVerifiedemail);
  router.route('/verifiedemails/count')
    .get(getAllVerifiedemailsCount);
  router.route('/verifiedemails/overview')
    .get(getAllVerifiedemailsOverview);
  router.route('/verifiedemails/today')
    .get(getTodayVerifiedemails);
  router.route('/verifiedemails/search')
    .post(searchVerifiedemails);
  router.route('/verifiedemails/:id')
    .get(getVerifiedemailById)
    .delete(deleteVerifiedemail)
    .put(updateVerifiedemail);
  
}

/**
 * Get all a verifiedemails api
 * @route GET /api/verifiedemails
 * @group verifiedemails - Operations about verifiedemails
 * @returns {object} 200 - An object of verifiedemails info
 * @returns {Error}  default - Unexpected error
 */
function getAllVerifiedemails(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      verifiedemailService.getVerifiedemailsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      verifiedemailService.getVerifiedemailsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    verifiedemailService.getAllVerifiedemails().then((data) => {
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
 * Search verifiedemails api
 * @route POST /api/verifiedemails/search
 * @group verifiedemails - Operations about verifiedemails
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of verifiedemails info
 * @returns {Error}  default - Unexpected error
 */
function searchVerifiedemails(req, res, next) {
  let searchCriteria = req.body;
  verifiedemailService.searchVerifiedemails(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get todays verifiedemail
 * @route GET /api/verifiedemails/today
 * @group verifiedemails - Operations about verifiedemails
 * @returns {object} 200 - An object of verifiedemails info
 * @returns {Error}  default - Unexpected error
 */
function getTodayVerifiedemails(req, res, next) {
  var searchCriteria = {
    pageSize:100000,
    pageNo:1,
    query:{
      
      'fromDate': new Date().toISOString()
    }
  }
  verifiedemailService.searchVerifiedemails(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

getTodayVerifiedemails

/**
 * Get verifiedemails by id api
 * @route GET /api/verifiedemails/:id
 * @group verifiedemails - Operations about verifiedemails
 * @returns {object} 200 - An object of verifiedemails info
 * @returns {Error}  default - Unexpected error
 */
function getVerifiedemailById(req,res,next) {

  let verifiedemailId = req.params.id;

  console.log("id"+ verifiedemailId);
  var json_format = iValidator.json_schema(schema.getSchema,verifiedemailId,"verifiedemail");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  verifiedemailService.getVerifiedemailById(verifiedemailId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.VERIFIEDEMAIL_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add verifiedemails api
 * @route POST /api/verifiedemails
 * @group verifiedemails - Operations about verifiedemails
 * @param {object} verifiedemail.body.required - verifiedemails details
 * @returns {object} 200 - An object of verifiedemails info
 * @returns {Error}  default - Unexpected error
 */
function addVerifiedemail(req,res, next) {
  var verifiedemailData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, verifiedemailData, "verifiedemail");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   verifiedemailService.addVerifiedemail(verifiedemailData).then((data) => {
    res.json(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });

}

/**
 * update verifiedemails by id api
 * @route PUT /api/verifiedemails
 * @group verifiedemails - Operations about verifiedemails
 * @returns {object} 200 - An object of verifiedemails info
 * @returns {Error}  default - Unexpected error
 */
function updateVerifiedemail(req,res, next) {
   var verifiedemailData=req.body;
   var id = req.params.id;
   verifiedemailService.getVerifiedemailById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.VERIFIEDEMAIL_DOES_NOT_EXIST));
    }else{
      verifiedemailService.updateVerifiedemail(id,verifiedemailData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete verifiedemails by id api
 * @route DELETE /api/verifiedemails/:id
 * @group verifiedemails - Operations about verifiedemails
 * @returns {object} 200 - An object of verifiedemails info
 * @returns {Error}  default - Unexpected error
 */
function deleteVerifiedemail(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  verifiedemailService.getVerifiedemailById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.VERIFIEDEMAIL_DOES_NOT_EXIST));
    }else{
      verifiedemailService.deleteVerifiedemail(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get verifiedemails count api
 * @route GET /api/verifiedemails/count
 * @group verifiedemails - Operations about verifiedemails
 * @returns {object} 200 - An object of verifiedemails info
 * @returns {Error}  default - Unexpected error
 */
function getAllVerifiedemailsCount(req,res,next) {
  verifiedemailService.getAllVerifiedemailsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.VERIFIEDEMAIL_DOES_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of verifiedemails api
 * @route GET /api/verifiedemails/overview
 * @group verifiedemails - Operations about verifiedemails
 * @returns {object} 200 - An object of verifiedemails info
 * @returns {Error}  default - Unexpected error
 */
function getAllVerifiedemailsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  verifiedemailService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;