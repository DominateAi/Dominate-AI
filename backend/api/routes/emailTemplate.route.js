const emailTemplateService = require('../services/emailTemplate.service');
var schema = require('../schemas/emailTemplate.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/emailTemplates')
    .get(getAllEmailTemplates)
    .post(addEmailTemplate);
  router.route('/emailTemplates/count')
    .get(getAllEmailTemplatesCount);
  router.route('/emailTemplates/overview')
    .get(getAllEmailTemplatesOverview);
  router.route('/emailTemplates/:id')
    .get(getEmailTemplateById)
    .delete(deleteEmailTemplate)
    .put(updateEmailTemplate);
  router.route('/emailTemplates/search')
    .post(searchEmailTemplates);
  router.route('/emailTemplates/exist')
    .get(isExist);
}

/**
 * Get all a emailTemplates api
 * @route GET /api/emailTemplates
 * @group emailTemplates - Operations about emailTemplates
 * @returns {object} 200 - An object of emailTemplates info
 * @returns {Error}  default - Unexpected error
 */
function getAllEmailTemplates(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      emailTemplateService.getEmailTemplatesByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      emailTemplateService.getEmailTemplatesByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    emailTemplateService.getAllEmailTemplates().then((data) => {
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
 * Search emailTemplates api
 * @route POST /api/emailTemplates/search
 * @group emailTemplates - Operations about emailTemplates
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of emailTemplates info
 * @returns {Error}  default - Unexpected error
 */
function searchEmailTemplates(req, res, next) {
  let searchCriteria = req.body;
  emailTemplateService.searchEmailTemplate(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get emailTemplates by id api
 * @route GET /api/emailTemplates/:id
 * @group emailTemplates - Operations about emailTemplates
 * @returns {object} 200 - An object of emailTemplates info
 * @returns {Error}  default - Unexpected error
 */
function getEmailTemplateById(req,res,next) {

  let emailTemplateId = req.params.id;

  var json_format = iValidator.json_schema(schema.getSchema,emailTemplateId,"emailTemplate");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  emailTemplateService.getEmailTemplateById(emailTemplateId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.EMAILTEMPLATE_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add emailTemplates api
 * @route POST /api/emailTemplates
 * @group emailTemplates - Operations about emailTemplates
 * @param {object} emailTemplate.body.required - emailTemplates details
 * @returns {object} 200 - An object of emailTemplates info
 * @returns {Error}  default - Unexpected error
 */
function addEmailTemplate(req,res, next) {
  var emailTemplateData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, emailTemplateData, "emailTemplate");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   emailTemplateService.getEmailTemplateByEmailTemplateName(emailTemplateData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.EMAILTEMPLATE_ALREADY_EXIST));
    }else{
      emailTemplateService.addEmailTemplate(emailTemplateData).then((data) => {
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
 * update emailTemplates by id api
 * @route PUT /api/emailTemplates
 * @group emailTemplates - Operations about emailTemplates
 * @returns {object} 200 - An object of emailTemplates info
 * @returns {Error}  default - Unexpected error
 */
function updateEmailTemplate(req,res, next) {
   var emailTemplateData=req.body;
   var id = req.params.id;
   emailTemplateService.getEmailTemplateById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.EMAILTEMPLATE_NOT_EXIST));
    }else{
      emailTemplateService.updateEmailTemplate(id,emailTemplateData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete emailTemplates by id api
 * @route DELETE /api/emailTemplates/:id
 * @group emailTemplates - Operations about emailTemplates
 * @returns {object} 200 - An object of emailTemplates info
 * @returns {Error}  default - Unexpected error
 */
function deleteEmailTemplate(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  emailTemplateService.getEmailTemplateById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.EMAILTEMPLATE_NOT_EXIST));
    }else{
      emailTemplateService.deleteEmailTemplate(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get emailTemplates count api
 * @route GET /api/emailTemplates/count
 * @group emailTemplates - Operations about emailTemplates
 * @returns {object} 200 - An object of emailTemplates info
 * @returns {Error}  default - Unexpected error
 */
function getAllEmailTemplatesCount(req,res,next) {
  emailTemplateService.getAllEmailTemplatesCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.EMAILTEMPLATE_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of emailTemplates api
 * @route GET /api/emailTemplates/overview
 * @group emailTemplates - Operations about emailTemplates
 * @returns {object} 200 - An object of emailTemplates info
 * @returns {Error}  default - Unexpected error
 */
function getAllEmailTemplatesOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  emailTemplateService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is emailTemplates exist api
 * @route GET /api/emailTemplates/exist
 * @group emailTemplates - Operations about emailTemplates
 * @param {string} emailTemplatename.query.required - emailTemplates name
 * @returns {object} 200 - An object of emailTemplates info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  let emailTemplateId = req.query.emailTemplateId;
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  emailTemplateService.getEmailTemplateByName(name).then((data) => {
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