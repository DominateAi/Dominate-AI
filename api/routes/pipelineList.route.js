const pipelineListService = require('../services/pipelineList.service');
var schema = require('../schemas/pipelineList.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/pipelineLists')
    .get(getAllPipelineLists)
    .post(addPipelineList);
  router.route('/pipelineLists/search')
    .post(searchPipelineLists);
  router.route('/pipelineLists/count')
    .get(getAllPipelineListsCount);
  router.route('/pipelineLists/overview')
    .get(getAllPipelineListsOverview);
  router.route('/pipelineLists/exist')
    .get(isExist);
  router.route('/pipelineLists/:id')
    .get(getPipelineListById)
    .delete(deletePipelineList)
    .put(updatePipelineList);
}

/**
 * Get all a pipelineLists api
 * @route GET /api/pipelineLists
 * @group pipelineLists - Operations about pipelineLists
 * @returns {object} 200 - An object of pipelineLists info
 * @returns {Error}  default - Unexpected error
 */
function getAllPipelineLists(req, res, next) {
  //accessResolver.isAuthorized(req);
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }
  else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      pipelineListService.getPipelineListsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      pipelineListService.getPipelineListsByPage(pageNo, pageSize).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else {
    pipelineListService.getAllPipelineLists().then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * Get pipelineLists count api
 * @route GET /api/pipelineLists/count
 * @group pipelineLists - Operations about pipelineLists
 * @returns {object} 200 - An object of pipelineLists info
 * @returns {Error}  default - Unexpected error
 */
function getAllPipelineListsCount(req, res, next) {
  //accessResolver.isAuthorized(req);

  pipelineListService.getAllPipelineListsCount().then((data) => {
    res.send({ 'count': data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get pipelineLists by id api
 * @route GET /api/pipelineLists/:id
 * @group pipelineLists - Operations about pipelineLists
 * @returns {object} 200 - An object of pipelineLists info
 * @returns {Error}  default - Unexpected error
 */
function getPipelineListById(req, res, next) {

  let pipelineListId = req.params.id;

  console.log("id" + pipelineListId);
  var json_format = iValidator.json_schema(schema.getSchema, pipelineListId, "pipelineList");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  pipelineListService.getPipelineListById(pipelineListId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.PROJECT_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add pipelineLists api
 * @route POST /api/pipelineLists
 * @group pipelineLists - Operations about pipelineLists
 * @param {object} pipelineListData.body.required - pipelineLists details
 * @returns {object} 200 - An object of pipelineLists info
 * @returns {Error}  default - Unexpected error
 */
function addPipelineList(req, res, next) {
  var pipelineListData = req.body;


  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, pipelineListData, "pipelineList");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  pipelineListService.getPipelineListByPipelineListName(pipelineListData.name).then((data) => {
    if (data != undefined && data.length > 0) {
      return next(errorMethods.sendBadRequest(errorCode.PROJECT_ALREADY_EXIST));
    } else {
      pipelineListService.addPipelineList(pipelineListData).then((data) => {
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
 * update pipelineLists by id api
 * @route PUT /api/pipelineLists
 * @group pipelineLists - Operations about pipelineLists
 * @returns {object} 200 - An object of pipelineLists info
 * @returns {Error}  default - Unexpected error
 */
function updatePipelineList(req, res, next) {
  var pipelineListData = req.body;
  var id = req.params.id;
  pipelineListService.getPipelineListById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.PROJECT_NOT_EXIST));
    } else {
      pipelineListService.updatePipelineList(id, pipelineListData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}


function deletePipelineList(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  pipelineListService.getPipelineListById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.PROJECT_NOT_EXIST));
    } else {
      pipelineListService.deletePipelineList(delId).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * get overview of pipelineLists api
 * @route GET /api/pipelineLists/overview
 * @group pipelineLists - Operations about pipelineLists
 * @returns {object} 200 - An object of pipelineLists info
 * @returns {Error}  default - Unexpected error
 */
function getAllPipelineListsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  pipelineListService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * @typedef SearchCriteria
 * @property {string} pageSize.required
 * @property {string} pageNo.required 
 * @property {string} query.required 
 */
/**
 * Search pipelineLists api
 * @route POST /api/pipelineLists/search
 * @group pipelineLists - Operations about pipelineLists
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of pipelineLists info
 * @returns {Error}  default - Unexpected error
 */
function searchPipelineLists(req, res, next) {
  let searchCriteria = req.body;
  pipelineListService.searchPipelineLists(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Is pipelineLists exist api
 * @route GET /api/pipelineLists/exist
 * @group pipelineLists - Operations about pipelineLists
 * @param {string} pipelineListname.query.required - pipelineLists name
 * @returns {object} 200 - An object of pipelineLists info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  console.log("name" + name);
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  pipelineListService.getPipelineListByPipelineListName(name).then((data) => {
    if (data != undefined) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;
