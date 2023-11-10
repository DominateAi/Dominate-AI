const elistService = require('../services/elist.service');
var schema = require('../schemas/elist.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/elists')
    .get(getAllElists)
    .post(addElist);
  router.route('/elists/count')
    .get(getAllElistsCount);
  router.route('/elists/overview')
    .get(getAllElistsOverview);
  router.route('/elists/today')
    .get(getTodayElists);
  router.route('/elists/search')
    .post(searchElists);
  router.route('/elists/exist')
    .get(isExist);
  router.route('/elists/:id')
    .get(getElistById)
    .delete(deleteElist)
    .put(updateElist);
  router.route('/elists/verify/:id')
    .get(verifyElist)
  router.route('/elists/contactsByElist/:id')
    .get(contactsByElist)
  router.route('/elists/keepValidated/:id')
    .get(keepValidated)
  router.route('/elists/isInvalid/:id')
    .get(isInvalid)
}

/**
 * Get all a elists api
 * @route GET /api/elists
 * @group elists - Operations about elists
 * @returns {object} 200 - An object of elists info
 * @returns {Error}  default - Unexpected error
 */
function getAllElists(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      elistService.getElistsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      elistService.getElistsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    elistService.getAllElists().then((data) => {
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
 * Search elists api
 * @route POST /api/elists/search
 * @group elists - Operations about elists
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of elists info
 * @returns {Error}  default - Unexpected error
 */
function searchElists(req, res, next) {
  let searchCriteria = req.body;
  elistService.searchElists(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get todays elist
 * @route GET /api/elists/today
 * @group elists - Operations about elists
 * @returns {object} 200 - An object of elists info
 * @returns {Error}  default - Unexpected error
 */
function getTodayElists(req, res, next) {
  var searchCriteria = {
    pageSize:100000,
    pageNo:1,
    query:{
      
      'fromDate': new Date().toISOString()
    }
  }
  elistService.searchElists(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

getTodayElists

/**
 * Get elists by id api
 * @route GET /api/elists/:id
 * @group elists - Operations about elists
 * @returns {object} 200 - An object of elists info
 * @returns {Error}  default - Unexpected error
 */
function getElistById(req,res,next) {

  let elistId = req.params.id;

  console.log("id"+ elistId);
  var json_format = iValidator.json_schema(schema.getSchema,elistId,"elist");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  elistService.getElistById(elistId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.ELIST_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add elists api
 * @route POST /api/elists
 * @group elists - Operations about elists
 * @param {object} elist.body.required - elists details
 * @returns {object} 200 - An object of elists info
 * @returns {Error}  default - Unexpected error
 */
function addElist(req,res, next) {
  var elistData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, elistData, "elist");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   elistService.addElist(elistData).then((data) => {
    res.json(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });

}

/**
 * update elists by id api
 * @route PUT /api/elists
 * @group elists - Operations about elists
 * @returns {object} 200 - An object of elists info
 * @returns {Error}  default - Unexpected error
 */
function updateElist(req,res, next) {
   var elistData=req.body;
   var id = req.params.id;
   elistService.getElistById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.ELIST_DOES_NOT_EXIST));
    }else{
      elistService.updateElist(id,elistData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete elists by id api
 * @route DELETE /api/elists/:id
 * @group elists - Operations about elists
 * @returns {object} 200 - An object of elists info
 * @returns {Error}  default - Unexpected error
 */
function deleteElist(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  elistService.getElistById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.ELIST_DOES_NOT_EXIST));
    }else{
      elistService.deleteElist(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get elists count api
 * @route GET /api/elists/count
 * @group elists - Operations about elists
 * @returns {object} 200 - An object of elists info
 * @returns {Error}  default - Unexpected error
 */
function getAllElistsCount(req,res,next) {
  elistService.getAllElistsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.ELIST_DOES_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of elists api
 * @route GET /api/elists/overview
 * @group elists - Operations about elists
 * @returns {object} 200 - An object of elists info
 * @returns {Error}  default - Unexpected error
 */
function getAllElistsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  elistService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is elists exist api
 * @route GET /api/elists/exist
 * @group elists - Operations about elists
 * @param {string} elistname.query.required - elists name
 * @returns {object} 200 - An object of elists info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  let elistId = req.query.elistId
  console.log("name" + name);
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  elistService.getElistByName(name).then((data) => {
    if (data != undefined && data.length > 0) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}



function verifyElist(req,res, next) {
  var id = req.params.id;
  elistService.getElistById(id).then((data)=>{
   if(data == undefined || data.length == 0){
     return next(errorMethods.sendBadRequest(errorCode.ELIST_DOES_NOT_EXIST));
   }else{
     elistService.verifyElist(id).then((data)=>{
       res.json(data);
     }).catch((err)=>{
     next(errorMethods.sendServerError(err));
    });
   }
 });
}

function contactsByElist(req,res, next) {
  var id = req.params.id;
  elistService.getElistById(id).then((data)=>{
   if(data == undefined || data.length == 0){
     return next(errorMethods.sendBadRequest(errorCode.ELIST_DOES_NOT_EXIST));
   }else{
     elistService.contactsByElist(id).then((data)=>{
       res.json(data);
     }).catch((err)=>{
     next(errorMethods.sendServerError(err));
    });
   }
 });
}

function keepValidated(req,res, next) {
  var id = req.params.id;
  elistService.getElistById(id).then((data)=>{
   if(data == undefined || data.length == 0){
     return next(errorMethods.sendBadRequest(errorCode.ELIST_DOES_NOT_EXIST));
   }else{
     elistService.keepValidated(id).then((data)=>{
       res.json(data);
     }).catch((err)=>{
     next(errorMethods.sendServerError(err));
    });
   }
 });
}

function isInvalid(req,res, next) {
  var id = req.params.id;
  elistService.getElistById(id).then((data)=>{
   if(data == undefined || data.length == 0){
     return next(errorMethods.sendBadRequest(errorCode.ELIST_DOES_NOT_EXIST));
   }else{
     elistService.isInvalid(id).then((data)=>{
       res.json(data);
     }).catch((err)=>{
     next(errorMethods.sendServerError(err));
    });
   }
 });
}

module.exports.init = init;