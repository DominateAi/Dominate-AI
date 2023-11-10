const regdemailService = require('../services/regdemail.service');
var schema = require('../schemas/regdemail.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/regdemails')
    .get(getAllRegdemails)
    .post(addRegdemail);
  router.route('/regdemails/count')
    .get(getAllRegdemailsCount);
  router.route('/regdemails/overview')
    .get(getAllRegdemailsOverview);
  router.route('/regdemails/today')
    .get(getTodayRegdemails);
  router.route('/regdemails/search')
    .post(searchRegdemails);
  router.route('/regdemails/exist')
    .get(isExist);
  router.route('/regdemails/:id')
    .get(getRegdemailById)
    .delete(deleteRegdemail)
    .put(updateRegdemail);
  router.route('/regdemails/verify/:id')
    .get(verifyEmail)
}

/**
 * Get all a regdemails api
 * @route GET /api/regdemails
 * @group regdemails - Operations about regdemails
 * @returns {object} 200 - An object of regdemails info
 * @returns {Error}  default - Unexpected error
 */
function getAllRegdemails(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      regdemailService.getRegdemailsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      regdemailService.getRegdemailsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    regdemailService.getAllRegdemails().then((data) => {
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
 * Search regdemails api
 * @route POST /api/regdemails/search
 * @group regdemails - Operations about regdemails
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of regdemails info
 * @returns {Error}  default - Unexpected error
 */
function searchRegdemails(req, res, next) {
  let searchCriteria = req.body;
  regdemailService.searchRegdemails(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get todays regdemail
 * @route GET /api/regdemails/today
 * @group regdemails - Operations about regdemails
 * @returns {object} 200 - An object of regdemails info
 * @returns {Error}  default - Unexpected error
 */
function getTodayRegdemails(req, res, next) {
  var searchCriteria = {
    pageSize:100000,
    pageNo:1,
    query:{
      
      'fromDate': new Date().toISOString()
    }
  }
  regdemailService.searchRegdemails(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

getTodayRegdemails

/**
 * Get regdemails by id api
 * @route GET /api/regdemails/:id
 * @group regdemails - Operations about regdemails
 * @returns {object} 200 - An object of regdemails info
 * @returns {Error}  default - Unexpected error
 */
function getRegdemailById(req,res,next) {

  let regdemailId = req.params.id;

  console.log("id"+ regdemailId);
  var json_format = iValidator.json_schema(schema.getSchema,regdemailId,"regdemail");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  regdemailService.getRegdemailById(regdemailId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.REGDEMAIL_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add regdemails api
 * @route POST /api/regdemails
 * @group regdemails - Operations about regdemails
 * @param {object} regdemail.body.required - regdemails details
 * @returns {object} 200 - An object of regdemails info
 * @returns {Error}  default - Unexpected error
 */
function addRegdemail(req,res, next) {
  var regdemailData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, regdemailData, "regdemail");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   regdemailService.addRegdemail(regdemailData).then((data) => {
    res.json(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });

}

/**
 * update regdemails by id api
 * @route PUT /api/regdemails
 * @group regdemails - Operations about regdemails
 * @returns {object} 200 - An object of regdemails info
 * @returns {Error}  default - Unexpected error
 */
function updateRegdemail(req,res, next) {
   var regdemailData=req.body;
   var id = req.params.id;
   regdemailService.getRegdemailById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.REGDEMAIL_DOES_NOT_EXIST));
    }else{
      regdemailService.updateRegdemail(id,regdemailData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete regdemails by id api
 * @route DELETE /api/regdemails/:id
 * @group regdemails - Operations about regdemails
 * @returns {object} 200 - An object of regdemails info
 * @returns {Error}  default - Unexpected error
 */
function deleteRegdemail(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  regdemailService.getRegdemailById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.REGDEMAIL_DOES_NOT_EXIST));
    }else{
      regdemailService.deleteRegdemail(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get regdemails count api
 * @route GET /api/regdemails/count
 * @group regdemails - Operations about regdemails
 * @returns {object} 200 - An object of regdemails info
 * @returns {Error}  default - Unexpected error
 */
function getAllRegdemailsCount(req,res,next) {
  regdemailService.getAllRegdemailsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.REGDEMAIL_DOES_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of regdemails api
 * @route GET /api/regdemails/overview
 * @group regdemails - Operations about regdemails
 * @returns {object} 200 - An object of regdemails info
 * @returns {Error}  default - Unexpected error
 */
function getAllRegdemailsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  regdemailService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is regdemails exist api
 * @route GET /api/regdemails/exist
 * @group regdemails - Operations about regdemails
 * @param {string} regdemailname.query.required - regdemails name
 * @returns {object} 200 - An object of regdemails info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let email = req.query.email;

  regdemailService.getRegdemailByEmail(email).then((data) => {
    if (data != undefined && data.length > 0) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function verifyEmail(req, res, next) {
  var id = req.params.id;
  regdemailService.getRegdemailById(id).then((data)=>{
   if(data == undefined || data.length == 0){
     return next(errorMethods.sendBadRequest(errorCode.REGDEMAIL_DOES_NOT_EXIST));
   }else{
     regdemailService.sendVerifyLink(id).then((data)=>{
       res.json(data);
     }).catch((err)=>{
     next(errorMethods.sendServerError(err));
    });
   }
 });
}

module.exports.init = init;