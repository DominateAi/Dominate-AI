const leadPipelineService = require('../services/leadPipeline.service');
var schema = require('../schemas/leadPipeline.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var leadPipelineger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/leadPipelines')
    .get(getAllLeadPipelines)
    .post(addLeadPipeline);
  router.route('/leadPipelines/search')
    .post(searchLeadPipelines);
  router.route('/leadPipelines/count')
    .get(getAllLeadPipelinesCount);
  router.route('/leadPipelines/overview')
    .get(getAllLeadPipelinesOverview);
  router.route('/leadPipelines/exist')
    .get(isExist);
  router.route('/leadPipelines/countData')
    .get(countData);
  router.route('/leadPipelines/:id')
    .get(getLeadPipelineById)
    .delete(deleteLeadPipeline)
    .put(updateLeadPipeline);
  router.route('/leadPipelines/funnel/:id')
    .get(kanbanView);
}

/**
 * Get all a leadPipelines api
 * @route GET /api/leadPipelines
 * @group leadPipelines - Operations about leadPipelines
 * @returns {object} 200 - An object of leadPipelines info
 * @returns {Error}  default - Unexpected error
 */
function getAllLeadPipelines(req, res, next) {
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
      leadPipelineService.getLeadPipelinesByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      leadPipelineService.getLeadPipelinesByPage(pageNo, pageSize).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else {
    leadPipelineService.getAllLeadPipelines().then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * Get leadPipelines count api
 * @route GET /api/leadPipelines/count
 * @group leadPipelines - Operations about leadPipelines
 * @returns {object} 200 - An object of leadPipelines info
 * @returns {Error}  default - Unexpected error
 */
function getAllLeadPipelinesCount(req, res, next) {
  //accessResolver.isAuthorized(req);

  leadPipelineService.getAllLeadPipelinesCount().then((data) => {
    res.send({ 'count': data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get leadPipelines by id api
 * @route GET /api/leadPipelines/:id
 * @group leadPipelines - Operations about leadPipelines
 * @returns {object} 200 - An object of leadPipelines info
 * @returns {Error}  default - Unexpected error
 */
function getLeadPipelineById(req, res, next) {

  let leadPipelineId = req.params.id;

  var json_format = iValidator.json_schema(schema.getSchema, leadPipelineId, "leadPipeline");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  leadPipelineService.getLeadPipelineById(leadPipelineId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.LEADPIPELINE_DOES_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add leadPipelines api
 * @route POST /api/leadPipelines
 * @group leadPipelines - Operations about leadPipelines
 * @param {object} leadPipelineData.body.required - leadPipelines details
 * @returns {object} 200 - An object of leadPipelines info
 * @returns {Error}  default - Unexpected error
 */
function addLeadPipeline(req, res, next) {
  var leadPipelineData = req.body;


  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, leadPipelineData, "leadPipeline");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  leadPipelineService.getLeadPipelineByLeadPipelineName(leadPipelineData.name).then((data) => {
    if (data != undefined && data.length > 0) {
      return next(errorMethods.sendBadRequest(errorCode.LEADPIPELINE_ALREADY_EXISTS));
    } else {
      leadPipelineService.addLeadPipeline(leadPipelineData).then((data) => {
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
 * update leadPipelines by id api
 * @route PUT /api/leadPipelines
 * @group leadPipelines - Operations about leadPipelines
 * @returns {object} 200 - An object of leadPipelines info
 * @returns {Error}  default - Unexpected error
 */
function updateLeadPipeline(req, res, next) {
  var leadPipelineData = req.body;
  var id = req.params.id;
  leadPipelineService.getLeadPipelineById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.LEADPIPELINE_DOES_NOT_EXIST));
    } else {
      leadPipelineService.updateLeadPipeline(id, leadPipelineData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}


function deleteLeadPipeline(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  leadPipelineService.getLeadPipelineById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.LEADPIPELINE_DOES_NOT_EXIST));
    } else {
      leadPipelineService.deleteLeadPipeline(delId).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * get overview of leadPipelines api
 * @route GET /api/leadPipelines/overview
 * @group leadPipelines - Operations about leadPipelines
 * @returns {object} 200 - An object of leadPipelines info
 * @returns {Error}  default - Unexpected error
 */
function getAllLeadPipelinesOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  leadPipelineService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
 * Search leadPipelines api
 * @route POST /api/leadPipelines/search
 * @group leadPipelines - Operations about leadPipelines
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of leadPipelines info
 * @returns {Error}  default - Unexpected error
 */
function searchLeadPipelines(req, res, next) {
  let searchCriteria = req.body;
  leadPipelineService.searchLeadPipelines(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Is leadPipelines exist api
 * @route GET /api/leadPipelines/exist
 * @group leadPipelines - Operations about leadPipelines
 * @param {string} leadPipelinename.query.required - leadPipelines name
 * @returns {object} 200 - An object of leadPipelines info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  leadPipelineService.getLeadPipelineByLeadPipelineName(name).then((data) => {
    if (data != undefined) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function kanbanView(req, res, next) {
  let pipelineId = req.params.id;
  leadPipelineService.kanbanView(pipelineId).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function countData(req, res, next) {
  leadPipelineService.countData().then((data) => {
    
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


module.exports.init = init;
