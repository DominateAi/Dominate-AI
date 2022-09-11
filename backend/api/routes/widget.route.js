const widgetService = require('../services/widget.service');
var schema = require('../schemas/widget.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/widgets')
    .get(getAllWidgets)
    .post(addWidget);
  router.route('/widgets/count')
    .get(getAllWidgetsCount);
  router.route('/widgets/overview')
    .get(getAllWidgetsOverview);
  router.route('/widgets/name/:name')
    .get(getWidgetByName);
  router.route('/widgets/:id')
    .get(getWidgetById)
    .delete(deleteWidget)
    .put(updateWidget);
  router.route('/widgets/search')
    .post(searchWidgets);
  router.route('/widgets/exist')
    .get(isExist);
}

/**
 * Get all a widgets api
 * @route GET /api/widgets
 * @group widgets - Operations about widgets
 * @returns {object} 200 - An object of widgets info
 * @returns {Error}  default - Unexpected error
 */
function getAllWidgets(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      widgetService.getWidgetsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      widgetService.getWidgetsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    widgetService.getAllWidgets().then((data) => {
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
 * Search widgets api
 * @route POST /api/widgets/search
 * @group widgets - Operations about widgets
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of widgets info
 * @returns {Error}  default - Unexpected error
 */
function searchWidgets(req, res, next) {
  let searchCriteria = req.body;
  widgetService.searchWidgets(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get widgets by id api
 * @route GET /api/widgets/:id
 * @group widgets - Operations about widgets
 * @returns {object} 200 - An object of widgets info
 * @returns {Error}  default - Unexpected error
 */
function getWidgetById(req,res,next) {

  let widgetId = req.params.id;

  console.log("id"+ widgetId);
  var json_format = iValidator.json_schema(schema.getSchema,widgetId,"widget");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  widgetService.getWidgetById(widgetId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.WIDGET_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * Get widgets by id api
 * @route GET /api/widgets/name/:name
 * @group widgets - Operations about widgets
 * @returns {object} 200 - An object of widgets info
 * @returns {Error}  default - Unexpected error
 */
function getWidgetByName(req,res,next) {

  let widgetName = req.params.name;

  console.log("Name:"+ widgetName);
  var json_format = iValidator.json_schema(schema.getSchemaByName,widgetName,"widget");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  widgetService.getWidgetByWidgetName(widgetName).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.WIDGET_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add widgets api
 * @route POST /api/widgets
 * @group widgets - Operations about widgets
 * @param {object} widget.body.required - widgets details
 * @returns {object} 200 - An object of widgets info
 * @returns {Error}  default - Unexpected error
 */
function addWidget(req,res, next) {
  var widgetData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, widgetData, "widget");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   widgetService.getWidgetByWidgetName(widgetData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.WIDGET_ALREADY_EXIST));
    }else{
      widgetService.addWidget(widgetData).then((data) => {
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
 * update widgets by id api
 * @route PUT /api/widgets
 * @group widgets - Operations about widgets
 * @returns {object} 200 - An object of widgets info
 * @returns {Error}  default - Unexpected error
 */
function updateWidget(req,res, next) {
   var widgetData=req.body;
   var id = req.params.id;
   widgetService.getWidgetById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.WIDGET_NOT_EXIST));
    }else{
      widgetService.updateWidget(id,widgetData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete widgets by id api
 * @route DELETE /api/widgets/:id
 * @group widgets - Operations about widgets
 * @returns {object} 200 - An object of widgets info
 * @returns {Error}  default - Unexpected error
 */
function deleteWidget(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  widgetService.getWidgetById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.WIDGET_NOT_EXIST));
    }else{
      widgetService.deleteWidget(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get widgets count api
 * @route GET /api/widgets/count
 * @group widgets - Operations about widgets
 * @returns {object} 200 - An object of widgets info
 * @returns {Error}  default - Unexpected error
 */
function getAllWidgetsCount(req,res,next) {
  widgetService.getAllWidgetsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.WIDGET_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of widgets api
 * @route GET /api/widgets/overview
 * @group widgets - Operations about widgets
 * @returns {object} 200 - An object of widgets info
 * @returns {Error}  default - Unexpected error
 */
function getAllWidgetsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  widgetService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is widgets exist api
 * @route GET /api/widgets/exist
 * @group widgets - Operations about widgets
 * @param {string} widgetname.query.required - widgets name
 * @returns {object} 200 - An object of widgets info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  let widgetId = req.query.widgetId
  console.log("name" + name);
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  widgetService.getWidgetByName(name).then((data) => {
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