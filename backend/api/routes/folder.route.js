const folderService = require('../services/folder.service');
var schema = require('../schemas/folder.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/folders')
    .get(getAllFolders)
    .post(addFolder);
  router.route('/folders/count')
    .get(getAllFoldersCount);
  router.route('/folders/overview')
    .get(getAllFoldersOverview);
  router.route('/folders/today')
    .get(getTodayFolders);
  router.route('/folders/search')
    .post(searchFolders);
  router.route('/folders/exist')
    .get(isExist);
  router.route('/folders/:id')
    .get(getFolderById)
    .delete(deleteFolder)
    .put(updateFolder);
  
}

/**
 * Get all a folders api
 * @route GET /api/folders
 * @group folders - Operations about folders
 * @returns {object} 200 - An object of folders info
 * @returns {Error}  default - Unexpected error
 */
function getAllFolders(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      folderService.getFoldersByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      folderService.getFoldersByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    folderService.getAllFolders().then((data) => {
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
 * Search folders api
 * @route POST /api/folders/search
 * @group folders - Operations about folders
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of folders info
 * @returns {Error}  default - Unexpected error
 */
function searchFolders(req, res, next) {
  let searchCriteria = req.body;
  folderService.searchFolders(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get todays folder
 * @route GET /api/folders/today
 * @group folders - Operations about folders
 * @returns {object} 200 - An object of folders info
 * @returns {Error}  default - Unexpected error
 */
function getTodayFolders(req, res, next) {
  var searchCriteria = {
    pageSize:100000,
    pageNo:1,
    query:{
      
      'fromDate': new Date().toISOString()
    }
  }
  folderService.searchFolders(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

getTodayFolders

/**
 * Get folders by id api
 * @route GET /api/folders/:id
 * @group folders - Operations about folders
 * @returns {object} 200 - An object of folders info
 * @returns {Error}  default - Unexpected error
 */
function getFolderById(req,res,next) {

  let folderId = req.params.id;

  console.log("id"+ folderId);
  var json_format = iValidator.json_schema(schema.getSchema,folderId,"folder");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  folderService.getFolderById(folderId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.MEETING_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add folders api
 * @route POST /api/folders
 * @group folders - Operations about folders
 * @param {object} folder.body.required - folders details
 * @returns {object} 200 - An object of folders info
 * @returns {Error}  default - Unexpected error
 */
function addFolder(req,res, next) {
  var folderData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, folderData, "folder");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   folderService.addFolder(folderData).then((data) => {
    res.json(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });

}

/**
 * update folders by id api
 * @route PUT /api/folders
 * @group folders - Operations about folders
 * @returns {object} 200 - An object of folders info
 * @returns {Error}  default - Unexpected error
 */
function updateFolder(req,res, next) {
   var folderData=req.body;
   var id = req.params.id;
   folderService.getFolderById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.MEETING_NOT_EXIST));
    }else{
      folderService.updateFolder(id,folderData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete folders by id api
 * @route DELETE /api/folders/:id
 * @group folders - Operations about folders
 * @returns {object} 200 - An object of folders info
 * @returns {Error}  default - Unexpected error
 */
function deleteFolder(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  folderService.getFolderById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.MEETING_NOT_EXIST));
    }else{
      folderService.deleteFolder(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get folders count api
 * @route GET /api/folders/count
 * @group folders - Operations about folders
 * @returns {object} 200 - An object of folders info
 * @returns {Error}  default - Unexpected error
 */
function getAllFoldersCount(req,res,next) {
  folderService.getAllFoldersCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.MEETING_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of folders api
 * @route GET /api/folders/overview
 * @group folders - Operations about folders
 * @returns {object} 200 - An object of folders info
 * @returns {Error}  default - Unexpected error
 */
function getAllFoldersOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  folderService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is folders exist api
 * @route GET /api/folders/exist
 * @group folders - Operations about folders
 * @param {string} foldername.query.required - folders name
 * @returns {object} 200 - An object of folders info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  let folderId = req.query.folderId
  console.log("name" + name);
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  folderService.getFolderByName(name).then((data) => {
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