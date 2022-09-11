const emailService = require('../services/email.service');
var schema = require('../schemas/email.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/emails')
    .get(getAllEmails)
    .post(addEmail);
  router.route('/emails/count')
    .get(getAllEmailsCount);
  router.route('/emails/search')
    .post(searchEmails);
  router.route('/emails/overview')
    .get(getAllEmailsOverview);
  router.route('/emails/:id')
    .get(getEmailById)
    .delete(deleteEmail)
    .put(updateEmail);
}

/**
 * Get all a emails api
 * @route GET /api/emails
 * @group emails - Operations about emails
 * @returns {object} 200 - An object of emails info
 * @returns {Error}  default - Unexpected error
 */
function getAllEmails(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  var entityId = req.query.entityId;
  var entityType = req.query.entityType;
  var status = req.query.status;
  if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      emailService.getEmailsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      emailService.getEmailsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else if (entityId != undefined && entityType != undefined){
    emailService.getAllEmails(entityId, entityType, status).then((data) => {
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
 * Search emails api
 * @route POST /api/emails/search
 * @group emails - Operations about emails
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of emails info
 * @returns {Error}  default - Unexpected error
 */
function searchEmails(req, res, next) {
  let searchCriteria = req.body;
  if(searchCriteria.query.entityId != undefined &&
    searchCriteria.query.entityType != undefined ){
      emailService.searchEmails(searchCriteria).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }else{
      next(errorMethods.sendBadRequest("Missing entityId & entityType"));
    }
  
}

/**
 * Get emails by id api
 * @route GET /api/emails/:id
 * @group emails - Operations about emails
 * @returns {object} 200 - An object of emails info
 * @returns {Error}  default - Unexpected error
 */
function getEmailById(req,res,next) {

  let emailId = req.params.id;

  var json_format = iValidator.json_schema(schema.getSchema,emailId,"email");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  emailService.getEmailById(emailId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.EMAIL_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add emails api
 * @route POST /api/emails
 * @group emails - Operations about emails
 * @param {object} emailData.body.required - emails details
 * @returns {object} 200 - An object of emails info
 * @returns {Error}  default - Unexpected error
 */
function addEmail(req,res, next) {
  var emailData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, emailData, "email");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
      emailService.addEmail(emailData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }


/**
 * emails by id api
 * @route DELETE /api/emails/:id
 * @group emails - Operations about emails
 * @returns {object} 200 - An object of emails info
 * @returns {Error}  default - Unexpected error
 */
function deleteEmail(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  emailService.getEmailById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.EMAIL_NOT_EXIST));
    }else{
      emailService.deleteEmail(delId, data).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}


/**
 * update email by id api
 * @route PUT /api/emails
 * @group email - Operations about email
 * @returns {object} 200 - An object of email info
 * @returns {Error}  default - Unexpected error
 */
function updateEmail(req,res, next) {
  var emailData=req.body;
  var id = req.params.id;
  emailService.getEmailById(id).then((data)=>{
   if(data == undefined || data.length == 0){
     return next(errorMethods.sendBadRequest(errorCode.EMAIL_NOT_EXIST));
   }else{
    emailService.updateEmail(id,emailData).then((data)=>{
       res.json(data);
     }).catch((err)=>{
     next(errorMethods.sendServerError(err));
    });
   }
 });
}

/**
 * Get emails count api
 * @route GET /api/emails/count
 * @group emails - Operations about emails
 * @returns {object} 200 - An object of emails info
 * @returns {Error}  default - Unexpected error
 */
function getAllEmailsCount(req,res,next) {
  emailService.getAllEmailsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.EMAIL_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of emails api
 * @route GET /api/emails/overview
 * @group emails - Operations about emails
 * @returns {object} 200 - An object of emails info
 * @returns {Error}  default - Unexpected error
 */
function getAllEmailsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  emailService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;