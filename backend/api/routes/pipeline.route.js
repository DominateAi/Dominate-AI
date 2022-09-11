const pipelineService = require('../services/pipeline.service');
var schema = require('../schemas/pipeline.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/pipelines')
    .get(getAllPipelines)
    .post(addPipeline);
  router.route('/pipelines/search')
    .post(searchPipelines);
  router.route('/pipelines/count')
    .get(getAllPipelinesCount);
  router.route('/pipelines/overview')
    .get(getAllPipelinesOverview);
  router.route('/pipelines/exist')
    .get(isExist);
  router.route('/pipelines/:id')
    .get(getPipelineById)
    .delete(deletePipeline)
    .put(updatePipeline);
}

/**
 * Get all a pipelines api
 * @route GET /api/pipelines
 * @group pipelines - Operations about pipelines
 * @returns {object} 200 - An object of pipelines info
 * @returns {Error}  default - Unexpected error
 */
function getAllPipelines(req, res, next) {
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
      pipelineService.getPipelinesByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      pipelineService.getPipelinesByPage(pageNo, pageSize).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else {
    pipelineService.getAllPipelines().then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * Get pipelines count api
 * @route GET /api/pipelines/count
 * @group pipelines - Operations about pipelines
 * @returns {object} 200 - An object of pipelines info
 * @returns {Error}  default - Unexpected error
 */
function getAllPipelinesCount(req, res, next) {
  //accessResolver.isAuthorized(req);

  pipelineService.getAllPipelinesCount().then((data) => {
    res.send({ 'count': data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get pipelines by id api
 * @route GET /api/pipelines/:id
 * @group pipelines - Operations about pipelines
 * @returns {object} 200 - An object of pipelines info
 * @returns {Error}  default - Unexpected error
 */
function getPipelineById(req, res, next) {

  let pipelineId = req.params.id;

  console.log("id" + pipelineId);
  var json_format = iValidator.json_schema(schema.getSchema, pipelineId, "pipeline");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  pipelineService.getPipelineById(pipelineId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.PIPELINE_DOES_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add pipelines api
 * @route POST /api/pipelines
 * @group pipelines - Operations about pipelines
 * @param {object} pipelineData.body.required - pipelines details
 * @returns {object} 200 - An object of pipelines info
 * @returns {Error}  default - Unexpected error
 */
function addPipeline(req, res, next) {
  var pipelineData = req.body;

  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, pipelineData, "pipeline");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  pipelineService.getPipelineByPipelineName(pipelineData.name).then((data) => {
    if (data != undefined && data.length > 0) {
      return next(errorMethods.sendBadRequest(errorCode.PIPELINE_ALREADY_EXISTS));
    } else {
      pipelineService.addPipeline(pipelineData).then((data) => {
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
 * update pipelines by id api
 * @route PUT /api/pipelines
 * @group pipelines - Operations about pipelines
 * @returns {object} 200 - An object of pipelines info
 * @returns {Error}  default - Unexpected error
 */
function updatePipeline(req, res, next) {
  var pipelineData = req.body;
  var id = req.params.id;
  pipelineService.getPipelineById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.PIPELINE_DOES_NOT_EXIST));
    } else {
      pipelineService.updatePipeline(id, pipelineData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}


function deletePipeline(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  pipelineService.getPipelineById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.PIPELINE_DOES_NOT_EXIST));
    } else {
      pipelineService.deletePipeline(delId).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * get overview of pipelines api
 * @route GET /api/pipelines/overview
 * @group pipelines - Operations about pipelines
 * @returns {object} 200 - An object of pipelines info
 * @returns {Error}  default - Unexpected error
 */
function getAllPipelinesOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  pipelineService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
 * Search pipelines api
 * @route POST /api/pipelines/search
 * @group pipelines - Operations about pipelines
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of pipelines info
 * @returns {Error}  default - Unexpected error
 */
function searchPipelines(req, res, next) {
  let searchCriteria = req.body;
  pipelineService.searchPipelines(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Is pipelines exist api
 * @route GET /api/pipelines/exist
 * @group pipelines - Operations about pipelines
 * @param {string} pipelinename.query.required - pipelines name
 * @returns {object} 200 - An object of pipelines info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  console.log("name" + name);
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  pipelineService.getPipelineByPipelineName(name).then((data) => {
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
