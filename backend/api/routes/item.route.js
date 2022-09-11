const itemService = require('../services/item.service');
var schema = require('../schemas/item.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');
var Multer = require("multer");
var csv = require('fast-csv');
var parse = csv.parse;
var stringify = require('csv-stringify');
var streamifier = require('streamifier');
var configResolve = require("../../common/configResolver");
var config = configResolve.getConfig();
var limits = {
  files: 10, // allow only 1 file per request
  fileSize: config.max_file_upload_limit * 1024 * 1024, // 1 MB (max file size)
};

function init(router) {
  router.route('/items')
    .get(getAllItems)
    .post(addItem);
  router.route('/items/count')
    .get(getAllItemsCount);
  router.route('/items/search')
    .post(searchItems);
  router.route('/items/overview')
    .get(getAllItemsOverview);
  router.route('/items/search/text')
    .get(textSearch);
  router.route('/items/:id')
    .get(getItemById)
    .delete(deleteItem)
    .put(updateItem);
  router.post('/items/import', Multer({ storage: Multer.memoryStorage(), limits: limits}).single("file"), importItems);
}

/**
 * Get all a items api
 * @route GET /api/items
 * @group items - Operations about items
 * @returns {object} 200 - An object of items info
 * @returns {Error}  default - Unexpected error
 */
function getAllItems(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }
  else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      itemService.getItemsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      itemService.getItemsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    itemService.getAllItems().then((data) => {
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
 * Search items api
 * @route POST /api/items/search
 * @group items - Operations about items
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of items info
 * @returns {Error}  default - Unexpected error
 */
function searchItems(req, res, next) {
  let searchCriteria = req.body;
  itemService.searchItems(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get items by id api
 * @route GET /api/items/:id
 * @group items - Operations about items
 * @returns {object} 200 - An object of items info
 * @returns {Error}  default - Unexpected error
 */
function getItemById(req,res,next) {

  let itemId = req.params.id;

  console.log("id"+ itemId);
  var json_format = iValidator.json_schema(schema.getSchema,itemId,"item");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  itemService.getItemById(itemId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.ITEM_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add items api
 * @route POST /api/items
 * @group items - Operations about items
 * @param {object} itemData.body.required - items details
 * @returns {object} 200 - An object of items info
 * @returns {Error}  default - Unexpected error
 */
function addItem(req,res, next) {
  var itemData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, itemData, "item");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   var searchCriteria = {
     query:{
       $and:[{"type": itemData.type},{"name": itemData.name}]
     }
    }

   itemService.searchItems(searchCriteria).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.ITEM_ALREADY_EXISTS));
    }else{
      itemService.addItem(itemData).then((data) => {
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
 * update items by id api
 * @route PUT /api/items
 * @group items - Operations about items
 * @returns {object} 200 - An object of items info
 * @returns {Error}  default - Unexpected error
 */
function updateItem(req,res, next) {
   var itemData=req.body;
   var id = req.params.id;
   itemService.getItemById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.ITEM_DOES_NOT_EXIST));
    }else{
      itemService.updateItem(id,itemData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete items by id api
 * @route DELETE /api/items/:id
 * @group items - Operations about items
 * @returns {object} 200 - An object of items info
 * @returns {Error}  default - Unexpected error
 */
function deleteItem(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  itemService.getItemById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.ITEM_DOES_NOT_EXIST));
    }else{
      itemService.deleteItem(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get items count api
 * @route GET /api/items/count
 * @group items - Operations about items
 * @returns {object} 200 - An object of items info
 * @returns {Error}  default - Unexpected error
 */
function getAllItemsCount(req,res,next) {
  itemService.getAllItemsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.ITEM_DOES_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of items api
 * @route GET /api/items/overview
 * @group items - Operations about items
 * @returns {object} 200 - An object of items info
 * @returns {Error}  default - Unexpected error
 */
function getAllItemsOverview(req, res, next) {
  
  itemService.getAllItemsOverview().then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Search item api
 * @route GET /api/items/search/text
 * @group items - Operations about item
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of item info
 * @returns {Error}  default - Unexpected error
 */
function textSearch(req, res, next) {
  let text = req.query.text;
  itemService.textSearch(text).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Import items api
 * @route POST /api/items/import
 * @group items - Operations about item
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of item info
 * @returns {Error}  default - Unexpected error
 */

function importItems(inputFile, res, next) {
  try {
  
    let items = [];
    streamifier.createReadStream(inputFile.file.buffer.toString())
    .pipe(csv.parse({ headers: true, ignoreEmpty: true }))
    .on('error', error => console.error(error))
    .on('data', function (data) {
          let item = data;
          items.push(item);
        })
    .on('end', function () {

         itemService.importItems(items).then((data) => {
            res.send(data);
          }).catch((err) => {
                  next(errorMethods.sendServerError(err));
                });
              })
      }
  catch(err){ next(errorMethods.sendServerError(err))}
}

module.exports.init = init;