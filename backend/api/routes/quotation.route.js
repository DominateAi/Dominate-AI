const quotationService = require('../services/quotation.service');
var schema = require('../schemas/quotation.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/quotations')
    .get(getAllQuotations)
    .post(addQuotation);
  router.route('/quotations/count')
    .get(getAllQuotationsCount);
  router.route('/quotations/search')
    .post(searchQuotations);
  router.route('/quotations/overview')
    .get(getAllQuotationsOverview);
  router.route('/quotations/search/text')
    .get(textSearch);
  router.route('/quotations/:id')
    .get(getQuotationById)
    .delete(deleteQuotation)
    .put(updateQuotation);
}

/**
 * Get all a quotations api
 * @route GET /api/quotations
 * @group quotations - Operations about quotations
 * @returns {object} 200 - An object of quotations info
 * @returns {Error}  default - Unexpected error
 */
function getAllQuotations(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }
  else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      quotationService.getQuotationsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      quotationService.getQuotationsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    quotationService.getAllQuotations().then((data) => {
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
 * Search quotations api
 * @route POST /api/quotations/search
 * @group quotations - Operations about quotations
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of quotations info
 * @returns {Error}  default - Unexpected error
 */
function searchQuotations(req, res, next) {
  let searchCriteria = req.body;
  quotationService.searchQuotations(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get quotations by id api
 * @route GET /api/quotations/:id
 * @group quotations - Operations about quotations
 * @returns {object} 200 - An object of quotations info
 * @returns {Error}  default - Unexpected error
 */
function getQuotationById(req,res,next) {

  let quotationId = req.params.id;

  console.log("id"+ quotationId);
  var json_format = iValidator.json_schema(schema.getSchema,quotationId,"quotation");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  quotationService.getQuotationById(quotationId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.QUOTATION_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add quotations api
 * @route POST /api/quotations
 * @group quotations - Operations about quotations
 * @param {object} quotationData.body.required - quotations details
 * @returns {object} 200 - An object of quotations info
 * @returns {Error}  default - Unexpected error
 */
function addQuotation(req,res, next) {
  var quotationData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, quotationData, "quotation");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   quotationService.getQuotationByQuotationName(quotationData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.QUOTATION_ALREADY_EXIST));
    }else{
      quotationService.addQuotation(quotationData).then((data) => {
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
 * update quotations by id api
 * @route PUT /api/quotations
 * @group quotations - Operations about quotations
 * @returns {object} 200 - An object of quotations info
 * @returns {Error}  default - Unexpected error
 */
function updateQuotation(req,res, next) {
   var quotationData=req.body;
   var id = req.params.id;
   quotationService.getQuotationById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.QUOTATION_NOT_EXIST));
    }else{
      quotationService.updateQuotation(id,quotationData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete quotations by id api
 * @route DELETE /api/quotations/:id
 * @group quotations - Operations about quotations
 * @returns {object} 200 - An object of quotations info
 * @returns {Error}  default - Unexpected error
 */
function deleteQuotation(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  quotationService.getQuotationById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.QUOTATION_NOT_EXIST));
    }else{
      quotationService.deleteQuotation(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get quotations count api
 * @route GET /api/quotations/count
 * @group quotations - Operations about quotations
 * @returns {object} 200 - An object of quotations info
 * @returns {Error}  default - Unexpected error
 */
function getAllQuotationsCount(req,res,next) {
  quotationService.getAllQuotationsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.QUOTATION_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of quotations api
 * @route GET /api/quotations/overview
 * @group quotations - Operations about quotations
 * @returns {object} 200 - An object of quotations info
 * @returns {Error}  default - Unexpected error
 */
function getAllQuotationsOverview(req, res, next) {
  
  quotationService.getAllQuotationsOverview().then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Search quotation api
 * @route GET /api/quotations/search/text
 * @group quotations - Operations about quotation
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of quotation info
 * @returns {Error}  default - Unexpected error
 */
function textSearch(req, res, next) {
  let text = req.query.text;
  quotationService.textSearch(text).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;