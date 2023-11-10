const fileService = require('../services/file.service');
var schema = require('../schemas/file.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');
const redis = require('redis');
var configResolve = require("../../common/configResolver");
const redisHost = configResolve.getConfig().redisHost;
const client = redis.createClient({ host: redisHost, port: 6379 })


function init(router) {
  router.route('/files')
    .get(getAllFiles)
    .post(addFile);
  router.route('/files/count')
    .get(getAllFilesCount);
  router.route('/files/overview')
    .get(getAllFilesOverview);
  router.route('/files/:id')
    .get(getFileById)
    .delete(deleteFile)
    .put(updateFile);
  router.route('/files/search')
    .post(searchFiles);
}

/**
 * Get all files api
 * @route GET /api/files
 * @group files - Operations about files
 * @returns {object} 200 - An object of files info
 * @returns {Error}  default - Unexpected error
 */
function getAllFiles(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }
  else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      fileService.getFilesByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      fileService.getFilesByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    fileService.getAllFiles().then((data) => {
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
 * Search files api
 * @route POST /api/files/search
 * @group files - Operations about projects
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of files info
 * @returns {Error}  default - Unexpected error
 */
function searchFiles(req, res, next) {
  let searchCriteria = req.body;
  fileService.searchFiles(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get files by id api
 * @route GET /api/files/:id
 * @group files - Operations about projects
 * @returns {object} 200 - An object of files info
 * @returns {Error}  default - Unexpected error
 */
function getFileById(req,res,next) {

  let fileId = req.params.id;

  console.log("id"+ fileId);
  var json_format = iValidator.json_schema(schema.getSchema,fileId,"file");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  fileService.getFileById(fileId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.FILE_DOES_NOT_EXIST));
      }
      var redisData = data;
      client.setex(fileId, 3600, JSON.stringify(redisData));
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add files api
 * @route POST /api/files
 * @group files - Operations about projects
 * @param {object} file.body.required - files details
 * @returns {object} 200 - An object of files info
 * @returns {Error}  default - Unexpected error
 */
function addFile(req,res, next) {
  var fileData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, fileData, "file");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
  {
      fileService.addFile(fileData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }

}

/**
 * update files by id api
 * @route PUT /api/files
 * @group files - Operations about files
 * @returns {object} 200 - An object of files info
 * @returns {Error}  default - Unexpected error
 */
function updateFile(req,res, next) {
   var fileData=req.body;
   var id = req.params.id;
   fileService.getFileById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.FILE_DOES_NOT_EXIST));
    }else{
      fileService.updateFile(id,fileData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete files by id api
 * @route DELETE /api/files/:id
 * @group files - Operations about files
 * @returns {object} 200 - An object of files info
 * @returns {Error}  default - Unexpected error
 */
function deleteFile(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  fileService.getFileById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.FILE_DOES_NOT_EXIST));
    }else{
      fileService.deleteFile(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get files count api
 * @route GET /api/files/count
 * @group files - Operations about files
 * @returns {object} 200 - An object of files info
 * @returns {Error}  default - Unexpected error
 */
function getAllFilesCount(req,res,next) {
  fileService.getAllFilesCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.FILE_DOES_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of files api
 * @route GET /api/files/overview
 * @group files - Operations about files
 * @returns {object} 200 - An object of files info
 * @returns {Error}  default - Unexpected error
 */
function getAllFilesOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  fileService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


module.exports.init = init;
