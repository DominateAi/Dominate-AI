const billingService = require('../services/billing.service');
var schema = require('../schemas/billing.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');



function init(router) {
  router.route('/billings')
    .get(getAllBillings)
    .post(addBilling);
  router.route('/billings/count')
    .get(getAllBillingsCount);
  router.route('/billings/overview')
    .get(getAllBillingsOverview);
  router.route('/billings/organization/:id')
    .get(getAllBillingsbyOrganizationId);
  router.route('/billings/:id')
    .get(getBillingById)
    .delete(deleteBilling)
    .put(updateBilling);
  router.route('/billings/search')
    .post(searchBillings);
  router.route('/billings/exist')
    .get(isExist);
}

/**
 * Get all a billings api
 * @route GET /api/billings
 * @group billings - Operations about billings
 * @returns {object} 200 - An object of billings info
 * @returns {Error}  default - Unexpected error
 */
function getAllBillings(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }
  else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      billingService.getBillingsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      billingService.getBillingsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    billingService.getAllBillings().then((data) => {
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
 * Search billings api
 * @route POST /api/billings/search
 * @group billings - Operations about billings
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of billings info
 * @returns {Error}  default - Unexpected error
 */
function searchBillings(req, res, next) {
  let searchCriteria = req.body;
  billingService.searchBilling(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get billings by id api
 * @route GET /api/billings/:id
 * @group billings - Operations about billings
 * @returns {object} 200 - An object of billings info
 * @returns {Error}  default - Unexpected error
 */
function getBillingById(req,res,next) {

  let billingId = req.params.id;

  var json_format = iValidator.json_schema(schema.getSchema,billingId,"billing");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  billingService.getBillingById(billingId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.BILLING_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * Get billings by org id api
 * @route GET /api/billings/organization/:id
 * @group billings - Operations about billings
 * @returns {object} 200 - An object of billings info
 * @returns {Error}  default - Unexpected error
 */
function getAllBillingsbyOrganizationId(req,res,next) {

  let orgId = req.params.id;

  var json_format = iValidator.json_schema(schema.getSchema,orgId,"billing");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  billingService.getAllBillingsbyOrganizationId(orgId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.BILLING_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}



/**
 * add billings api
 * @route POST /api/billings
 * @group billings - Operations about billings
 * @param {object} billing.body.required - billings details
 * @returns {object} 200 - An object of billings info
 * @returns {Error}  default - Unexpected error
 */
function addBilling(req,res, next) {
  var billingData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, billingData, "billing");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   billingService.getBillingByBillingName(billingData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.BILLING_ALREADY_EXIST));
    }else{
      billingService.addBilling(billingData).then((data) => {
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
 * update billings by id api
 * @route PUT /api/billings
 * @group billings - Operations about billings
 * @returns {object} 200 - An object of billings info
 * @returns {Error}  default - Unexpected error
 */
function updateBilling(req,res, next) {
   var billingData=req.body;
   var id = req.params.id;
   billingService.getBillingById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.BILLING_NOT_EXIST));
    }else{
      billingService.updateBilling(id,billingData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete billings by id api
 * @route DELETE /api/billings/:id
 * @group billings - Operations about billings
 * @returns {object} 200 - An object of billings info
 * @returns {Error}  default - Unexpected error
 */
function deleteBilling(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  billingService.getBillingById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.BILLING_NOT_EXIST));
    }else{
      billingService.deleteBilling(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get billings count api
 * @route GET /api/billings/count
 * @group billings - Operations about billings
 * @returns {object} 200 - An object of billings info
 * @returns {Error}  default - Unexpected error
 */
function getAllBillingsCount(req,res,next) {
  billingService.getAllBillingsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.BILLING_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of billings api
 * @route GET /api/billings/overview
 * @group billings - Operations about billings
 * @returns {object} 200 - An object of billings info
 * @returns {Error}  default - Unexpected error
 */
function getAllBillingsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  billingService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is billings exist api
 * @route GET /api/billings/exist
 * @group billings - Operations about billings
 * @param {string} billingname.query.required - billings name
 * @returns {object} 200 - An object of billings info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  let billingId = req.query.billingId;
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  billingService.getBillingByName(name).then((data) => {
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