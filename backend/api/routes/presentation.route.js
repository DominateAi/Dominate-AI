const presentationService = require('../services/presentation.service');
var schema = require('../schemas/presentation.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');
var PresentationType = require("../../common/constants/PresentationType");


function init(router) {
  router.route('/presentations')
    .get(getAllPresentations)
    .post(addPresentation);
  router.route('/presentations/count')
    .get(getAllPresentationsCount);
  router.route('/presentations/search')
    .post(searchPresentations);
  router.route('/presentations/overview')
    .get(getAllPresentationsOverview);
  router.route('/presentations/:id')
    .get(getPresentationById)
    .delete(deletePresentation)
    .put(updatePresentation);
}

/**
 * Get all a presentations api
 * @route GET /api/presentations
 * @group presentations - Operations about presentations
 * @returns {object} 200 - An object of presentations info
 * @returns {Error}  default - Unexpected error
 */
function getAllPresentations(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }
  else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      presentationService.getPresentationsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      presentationService.getPresentationsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    presentationService.getAllPresentations().then((data) => {
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
 * Search presentations api
 * @route POST /api/presentations/search
 * @group presentations - Operations about presentations
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of presentations info
 * @returns {Error}  default - Unexpected error
 */
function searchPresentations(req, res, next) {
  let searchCriteria = req.body;
  presentationService.searchPresentations(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get presentations by id api
 * @route GET /api/presentations/:id
 * @group presentations - Operations about presentations
 * @returns {object} 200 - An object of presentations info
 * @returns {Error}  default - Unexpected error
 */
function getPresentationById(req,res,next) {

  let presentationId = req.params.id;

  console.log("id"+ presentationId);
  var json_format = iValidator.json_schema(schema.getSchema,presentationId,"presentation");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  presentationService.getPresentationById(presentationId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.PROPOSAL_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add presentations api
 * @route POST /api/presentations
 * @group presentations - Operations about presentations
 * @param {object} presentationData.body.required - presentations details
 * @returns {object} 200 - An object of presentations info
 * @returns {Error}  default - Unexpected error
 */
function addPresentation(req,res, next) {
  var presentationData=req.body;
  const token = req.headers['authorization'].split(' ')[1];
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, presentationData, "presentation");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   presentationService.getPresentationByPresentationName(presentationData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.PROPOSAL_ALREADY_EXIST));
    }else{
      if(presentationData.status == PresentationType.SENT && presentationData.attachment == undefined){
        return next(errorMethods.sendBadRequest(errorCode.INVALID_DATA));
      }
      presentationService.addPresentation(presentationData, token ).then((data) => {
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
 * update presentations by id api
 * @route PUT /api/presentations
 * @group presentations - Operations about presentations
 * @returns {object} 200 - An object of presentations info
 * @returns {Error}  default - Unexpected error
 */
function updatePresentation(req,res, next) {
   var presentationData=req.body;
   var id = req.params.id;
   presentationService.getPresentationById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.PROPOSAL_NOT_EXIST));
    }else{
      presentationService.updatePresentation(id,presentationData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete presentations by id api
 * @route DELETE /api/presentations/:id
 * @group presentations - Operations about presentations
 * @returns {object} 200 - An object of presentations info
 * @returns {Error}  default - Unexpected error
 */
function deletePresentation(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  presentationService.getPresentationById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.PROPOSAL_NOT_EXIST));
    }else{
      presentationService.deletePresentation(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get presentations count api
 * @route GET /api/presentations/count
 * @group presentations - Operations about presentations
 * @returns {object} 200 - An object of presentations info
 * @returns {Error}  default - Unexpected error
 */
function getAllPresentationsCount(req,res,next) {
  presentationService.getAllPresentationsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.PROPOSAL_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of presentations api
 * @route GET /api/presentations/overview
 * @group presentations - Operations about presentations
 * @returns {object} 200 - An object of presentations info
 * @returns {Error}  default - Unexpected error
 */
function getAllPresentationsOverview(req, res, next) {
  presentationService.getAllPresentationOverview().then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;