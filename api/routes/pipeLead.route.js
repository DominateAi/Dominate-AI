const pipeLeadService = require('../services/pipeLead.service');
var schema = require('../schemas/pipeLead.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');
var currentContext = require('../../common/currentContext');
var Multer = require("multer");
var csv = require('fast-csv');
var parse = csv.parse;
var stringify = require('csv-stringify');
var streamifier = require('streamifier');
const moment = require('moment');
//const csva = require('csv-parser')
const fs = require('fs')
var configResolve = require("../../common/configResolver");
var config = configResolve.getConfig();

var limits = {
  files: 10, // allow only 1 file per request
  fileSize: config.max_file_upload_limit * 1024 * 1024, // 1 MB (max file size)
};

function init(router) {
  router.route('/pipeLeads')
    .get(getAllPipeLeads)
    .post(addPipeLead);
  router.route('/pipeLeads/export')
    .get(exportPipeLeads);
  router.route('/pipeLeads/countOverview')
    .post(countOverview)
  router.route('/pipeLeads/count')
    .get(getAllPipeLeadsCount);
  router.route('/pipeLeads/socialMedia/count')
    .get(getAllSocialMediaPipeLeadsCount);
  router.route('/pipeLeads/exist')
    .get(isExist);
  router.route('/pipeLeads/allPipeLeadsCP')
    .get(allPipeLeadsCP)
  router.route('/pipeLeads/pipeLeadCP/:id')
    .get(pipeLeadCP);
  router.route('/pipeLeads/followups/user/:userId')
    .get(getAllFollowupsByUserId);
  router.route('/pipeLeads/today/all')
    .get(getAllDataForToday);
  router.route('/pipeLeads/today')
    .get(getTodaysData);
  router.route('/pipeLeads/pipeLeadsbyacc')
    .get(pipeLeadsByAccountId);
  router.route('/pipeLeads/meetings/user/:userId')
    .get(getAllMeetingsByUserId);
  router.route('/pipeLeads/status/:status')
    .get(getAllPipeLeadsByStatus);
  router.route('/pipeLeads/overview')
    .get(getAllPipeLeadsOverview);
  router.route('/pipeLeads/search')
    .post(searchPipeLeads);
  router.route('/pipeLeads/search/entity')
    .post(postSearchPipeLeadsByEntity)
  router.route('/pipeLeads/search/entity/:entity')
    .get(searchPipeLeadsByEntity);
  router.route('/pipeLeads/search/text')
    .get(textSearch);
  router.route('/pipeLeads/closure/:id')
    .get(pipeLeadClosures);
  router.route('/pipeLeads/pipeLeaderboard')
    .get(getPipeLeaderboard);
  router.route('/pipeLeads/timeline/:id')
    .get(pipeLeadTimeline);
  router.route('/pipeLeads/widget')
    .get(getAllWidgetData)
  router.route('/pipeLeads/avgcp')
    .get(getAvgCP);
  router.route('/pipeLeads/:id')
    .get(getPipeLeadById)
    .delete(deletePipeLead)
    .put(updatePipeLead);
  router.post('/pipeLeads/import', Multer({ storage: Multer.memoryStorage(), limits: limits}).single("file"), importPipeLeads);
  router.post('/pipeLeads/importest', Multer({ storage: Multer.memoryStorage(), limits: limits}).single("file"), importest);
  router.post('/pipeLeads/import/json', importJSONPipeLeads );
  router.post('/pipeLeads/import/overwrite', overwrite);
  router.post('/pipeLeads/import/notoverwrite',notoverwrite);
  router.post('/pipeLeads/import/checkfields', Multer({ storage: Multer.memoryStorage(), limits: limits}).single("file"), checkFields);
}

/**
 * Get all a pipeLeads api
 * @route GET /api/pipeLeads
 * @group pipeLeads - Operations about pipeLeads
 * @returns {object} 200 - An object of pipeLeads info
 * @returns {Error}  default - Unexpected error
 */
function getAllPipeLeads(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  var startDate = req.query.startDate;
  var endDate = req.query.endDate;
  var assigned = req.query.assigned;
  var isKanban = req.query.isKanban;
  var isHidden = req.query.isHidden;
  // ADDITION BY SHUBHAM
  var isNotes = req.query.isNotes;
  var isFollowups = req.query.isFollowups;
  var status = req.query.status;
  if (startDate != undefined && endDate != undefined) {
    pipeLeadService.getAllPipeLeadsWithinTimeframe(startDate, endDate, assigned, isKanban, isHidden, status).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  } else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      pipeLeadService.getPipeLeadsByPageWithSort(pageNo, pageSize, sortBy, assigned, isKanban, isHidden, status).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      pipeLeadService.getPipeLeadsByPage(pageNo, pageSize, assigned, isKanban, isHidden, status).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else if ( isKanban !== undefined && isNotes !== undefined && isFollowups !== undefined ){
    console.log("asdasd")
    pipeLeadService.getAllPipeLeads(assigned, isKanban, isHidden, isNotes, isFollowups).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
  else {
    pipeLeadService.getAllPipeLeads(assigned, isKanban, isHidden).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }

}

/**
 * Get pipeLeads by id api
 * @route GET /api/pipeLeads/:id
 * @group pipeLeads - Operations about pipeLeads
 * @returns {object} 200 - An object of pipeLeads info
 * @returns {Error}  default - Unexpected error
 */
function getPipeLeadById(req, res, next) {

  let pipeLeadId = req.params.id;

  console.log("id" + pipeLeadId);
  var json_format = iValidator.json_schema(schema.getSchema, pipeLeadId, "pipeLead");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  pipeLeadService.getPipeLeadById(pipeLeadId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.LEAD_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add pipeLeads api
 * @route POST /api/pipeLeads
 * @group pipeLeads - Operations about pipeLeads
 * @param {object} pipeLeadData.body.required - pipeLeads details
 * @returns {object} 200 - An object of pipeLeads info
 * @returns {Error}  default - Unexpected error
 */
function addPipeLead(req, res, next) {
  var pipeLeadData = req.body;


  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, pipeLeadData, "pipeLead");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  pipeLeadService.getPipeLeadByPipeLeadName(pipeLeadData.name).then((data) => {
    if (data != undefined) {
      return next(errorMethods.sendBadRequest(errorCode.LEAD_ALREADY_EXIST));
    } else {
      pipeLeadService.addPipeLead(pipeLeadData).then((data) => {
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
 * update pipeLeads by id api
 * @route PUT /api/pipeLeads
 * @group pipeLeads - Operations about pipeLeads
 * @returns {object} 200 - An object of pipeLeads info
 * @returns {Error}  default - Unexpected error
 */
function updatePipeLead(req, res, next) {
  var pipeLeadData = req.body;
  var id = req.params.id;
  pipeLeadService.getById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.LEAD_NOT_EXIST));
    } else {
      var user = currentContext.getCurrentContext();
      if (data.assigned != undefined && user.userId != data.assigned._id && !user.isAdmin) {
        return next(errorMethods.sendBadRequest(errorCode.ACCESS_DENIED));
      } else {
        pipeLeadService.updatePipeLead(id, pipeLeadData).then((data) => {
         res.json(data);
        }).catch((err) => {
          next(errorMethods.sendServerError(err));
        });
      }
    }
  });
}

/**
 * delete pipeLeads by id api
 * @route DELETE /api/pipeLeads/:id
 * @group pipeLeads - Operations about pipeLeads
 * @returns {object} 200 - An object of pipeLeads info
 * @returns {Error}  default - Unexpected error
 */
function deletePipeLead(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  pipeLeadService.getById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.LEAD_NOT_EXIST));
    } else {
      pipeLeadService.deletePipeLead(delId).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get pipeLeads count api
 * @route GET /api/pipeLeads/count
 * @group pipeLeads - Operations about pipeLeads
 * @returns {object} 200 - An object of pipeLeads info
 * @returns {Error}  default - Unexpected error
 */
function getAllPipeLeadsCount(req, res, next) {
  let key = req.query.key;
  let value = req.query.value;
  let entity = req.query.entity;
  let assigned = req.query.assigned;
  var query = {};
  if( assigned != undefined){
    let searchCriteria = { query : { assigned:assigned } };
    pipeLeadService.searchPipeLeads(searchCriteria).then((data) => {
      res.json({
        count: data.length
      });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }else if( entity != undefined ){
    if (entity == 'meetings' || entity == 'followups') {
      pipeLeadService.searchPipeLeadsByEntity(entity).then((data) => {
        res.json({
          count: data.length
        });
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      next(errorMethods.sendBadRequest("Unsupported type"))
    }
  }  else if (key != undefined && value != undefined) {
    query[key] = value;
    getPipeLeadCount(query, next, res);
  } else if (key != undefined) {
    pipeLeadService.getAggregateCount(key).then((data) => {
      if (data == undefined) {
        return next(errorMethods.sendBadRequest(errorCode.LEAD_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  } else {
    getPipeLeadCount(query, next, res);
  }
}

/**
 * Get social pipeLeads count api
 * @route GET /api/pipeLeads/socialMedia/count
 * @group pipeLeads - Operations about pipeLeads
 * @returns {object} 200 - An object of pipeLeads info
 * @returns {Error}  default - Unexpected error
 */
function getAllSocialMediaPipeLeadsCount(req, res, next) {
  // var socialMedia = ['www.facebook.com', 'www.twitter.com', 'www.instagram.com', 'www.linkedin.com'];
  var socialMedia = ["Facebook","LinkedIn","Instagram"];
  var query = {
    'source':{
      '$in': socialMedia
    }
  };
  getPipeLeadCount(query, next, res);
}



function getPipeLeadCount(query, next, res) {
  pipeLeadService.getAllPipeLeadsCount(query).then((data) => {
    if (data == undefined) {
      return next(errorMethods.sendBadRequest(errorCode.LEAD_NOT_EXIST));
    }
    res.send({ "count": data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * get overview of pipeLeads api
 * @route GET /api/pipeLeads/overview
 * @group pipeLeads - Operations about pipeLeads
 * @returns {object} 200 - An object of pipeLeads info
 * @returns {Error}  default - Unexpected error
 */
function getAllPipeLeadsOverview(req, res, next) {

  pipeLeadService.getAllPipeLeadsOverview().then((data) => {
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
 * Search pipeLeads api
 * @route POST /api/pipeLeads/search
 * @group pipeLeads - Operations about pipeLeads
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of pipeLeads info
 * @returns {Error}  default - Unexpected error
 */
function searchPipeLeads(req, res, next) {
  let searchCriteria = req.body;
  pipeLeadService.searchPipeLeads(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Search pipeLeads api
 * @route POST /api/pipeLeads/search/entity/:entity
 * @group pipeLeads - Operations about pipeLeads
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of pipeLeads info
 * @returns {Error}  default - Unexpected error
 */
function searchPipeLeadsByEntity(req, res, next) {
  var entity = req.params.entity;
  if (entity == 'meetings' || entity == 'followups') {
    pipeLeadService.searchPipeLeadsByEntity(entity).then((data) => {
      res.json(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  } else {
    next(errorMethods.sendBadRequest("Unsupported type"))
  }
}

function postSearchPipeLeadsByEntity(req, res, next){
  var entity = req.body.entity
  var query = req.body.query
  if (entity == 'MEETING' || entity == 'FOLLOWUP') {
    pipeLeadService.postSearchPipeLeadsByEntity(entity, query).then((data) => {
      res.json(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  } else {
    next(errorMethods.sendBadRequest("Unsupported type"))
  }
}



/**
 * Search pipeLeads api
 * @route GET /api/pipeLeads/search/text
 * @group pipeLeads - Operations about pipeLeads
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of pipeLeads info
 * @returns {Error}  default - Unexpected error
 */
function textSearch(req, res, next) {
  let text = req.query.text;
  let isHidden = req.query.isHidden;
  let assigned = req.query.assigned;
  pipeLeadService.textSearch(text, assigned, isHidden).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is pipeLeads exist api
 * @route GET /api/pipeLeads/exist
 * @group pipeLeads - Operations about pipeLeads
 * @param {string} customername.query.required - pipeLeads name
 * @returns {object} 200 - An object of pipeLeads info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next) {
  let name = req.query.name;
  console.log("name" + name);
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  pipeLeadService.getPipeLeadByPipeLeadName(name).then((data) => {
    if (data != undefined) {
      res.json({ 'isExist': true });
    } else {
      res.json({ 'isExist': false });
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * PipeLead clousure rate by user 
 * @route GET /api/pipeLeads/closure/:id
 * @group pipeLeads - Operations about pipeLeads
 * @param {string} startDate.query.required - startDate
 * @param {string} endDate.query.required - endDate
 * @param {string} id.pathParam.required - userId
 * @returns {object} 200 - An object of pipeLeads info
 * @returns {Error}  default - Unexpected error
 */
function pipeLeadClosures(req, res, next) {
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  let userId = req.params.id;
  pipeLeadService.getPipeLeadClosureRate(userId, startDate, endDate).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * import pipeLeads 
 * @route POST /api/pipeLeads/import
 * @group pipeLeads - Operations about pipeLeads
 * @param {string} fileType.query.required - startDate
 * @returns {object} 200 - All pipeLeads
 * @returns {Error}  default - Unexpected error
 */
function importPipeLeads(req, res, next) {
  const inputFile = req.file;
  if (!inputFile) {
    res.status(400).send("No file uploaded.");
  }
  importCSVData(inputFile, res, next);
}

function exportPipeLeads(req, res, next) {
  pipeLeadService.exportPipeLeads().then((data) => {
   res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function getPipeLeaderboard(req, res, next) {
  
  let period = req.query.period;
  
  //let startDate = req.query.startDate;
  //let endDate = req.query.endDate;
  let todayDate = moment(); 
  if(period != undefined && period == 'current'){
    startDate = todayDate.startOf('month').toISOString();
    endDate = todayDate.endOf('month').toISOString();
  }else if(period != undefined &&  period == 'previous'){
    let previousMonth = todayDate.subtract(1,'months');
    startDate = previousMonth.startOf('month').toISOString();
    endDate = previousMonth.endOf('month').toISOString();
  }else{
    return next(errorMethods.sendBadRequest(errorCode.INVALID_INPUT));
  }

  console.log("StartDate: " +  startDate);
  console.log("EndDate: " + endDate);

  pipeLeadService.getPipeLeaderboard(startDate, endDate).then((pipeLeads) => {
    res.json(pipeLeads);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  })
}

/**
 * Get all a pipeLeads api
 * @route GET /api/pipeLeads/status/:status
 * @group customers - Operations about customers
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getAllPipeLeadsByStatus(req, res, next) {
  logger.info("In get all pipeLeads route");
  let status = req.params.status;
  let query = {
    pageNo: 1,
    pageSize: 1000000,
    query: {
      '$and': [{
        'status': status
      }
      ]
    }
  };
  pipeLeadService.searchPipeLeads(query).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * get followups by userid api
 * @route GET /api/pipeLeads/followups/user/:userId
 * @group followups - Operations about followups
 * @returns {object} 200 - An object of followups info
 * @returns {Error}  default - Unexpected error
 */
function getAllFollowupsByUserId(req, res, next) {
  let userId = req.params.userId;
  if (!userId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  pipeLeadService.getAllFollowupsByUserId(userId).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * get followups by userid api
 * @route GET /api/pipeLeads/today/all
 * @group followups - Operations about followups
 * @returns {object} 200 - An object of followups info
 * @returns {Error}  default - Unexpected error
 */
function getAllDataForToday(req, res, next) {
  let type = req.query.type;
  var isOrganisation = req.query.isOrganisation;
  if(type == undefined || type != 'followup' && type != 'meeting'){
    return next(errorMethods.sendBadRequest(errorCode.INVALID_INPUT));
  }
  pipeLeadService.getAllDataForToday(type, isOrganisation).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * get followups by userid api
 * @route GET /api/pipeLeads/meetings/user/:userId
 * @group followups - Operations about followups
 * @returns {object} 200 - An object of followups info
 * @returns {Error}  default - Unexpected error
 */
function getAllMeetingsByUserId(req, res, next) {
  let userId = req.params.userId;
  if (!userId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  pipeLeadService.getAllMeetingsByUserId(userId).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * get timeline by pipeLeadid api
 * @route GET /api/pipeLeads/timeline/:id
 * @group followups - Operations about pipeLead timeline
 * @returns {object} 200 - An object of pipeLead info
 * @returns {Error}  default - Unexpected error
 */
function pipeLeadTimeline(req, res, next) {
  let pipeLeadId = req.params.id;
  if (!pipeLeadId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  pipeLeadService.pipeLeadTimeline(pipeLeadId).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function importJSONPipeLeads( req, res, next ){
  try{
    let pipeLeads = req.body;
    pipeLeadService.importest(pipeLeads).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  } catch( err ){
    next(errorMethods.sendServerError(err));
  }
}


function importCSVData(inputFile, res, next) {
  try {
    let pipeLeads = [];
    streamifier.createReadStream(inputFile.file.buffer.toString())
    .pipe(csv.parse({ headers: true, ignoreEmpty: true }))
    .on('error', error => console.error(error))
    .on("data", function (data) {
        let pipeLead = {
          "name": data.name,
          "company": data.company,
          "email": data.email,
          "phone": data.phone,
          "status": data.status,
          "isHidden": data.isHidden,
          "isKanban": data.isKanban,
          "additionalInfo": data.additionalInfo,
          "profileImage": data.profileImage,
          "about": data.about,
          "createdBy": data.createdBy,
          "lastModifiedBy": data.lastModifiedBy,
          "tags": data.tags,
          "followups": data.followups,
          "degree": data.degree
        }
        pipeLeads.push(pipeLead);
      })
      .on("end", function () {
        pipeLeadService.importPipeLeads(pipeLeads).then((data) => {
          res.send({ "count": pipeLeads.length });
        }).catch((err) => {
          next(errorMethods.sendServerError(err));
        });
      });
  }
  catch (error) {
    next(errorMethods.sendServerError(error));
  }
}

function importest(inputFile, res, next) {
  try {
    let pipeLeads = [];
    streamifier.createReadStream(inputFile.file.buffer.toString())
    .pipe(csv.parse({ headers: true, ignoreEmpty: true }))
    .on('error', error => console.error(error))
      .on("data", function (data) {
        let pipeLead = data;
        pipeLeads.push(pipeLead);
      })
      .on("end", function () {
       pipeLeadService.importest(pipeLeads).then((data) => {
          res.send(data);
        }).catch((err) => {
          next(errorMethods.sendServerError(err));
        });
      });
  }
  catch (error) {
    next(errorMethods.sendServerError(error));
  }
}

function checkFields(inputFile,res,next){
  try {
    let pipeLeads = [];
    streamifier.createReadStream(inputFile.file.buffer.toString())
    .pipe(csv.parse({ headers: true, ignoreEmpty: true }))
    .on('error', error => console.error(error))
      .on("data", function (data) {
        let pipeLead = data;
        pipeLeads.push(pipeLead);
      })
      .on("end", function () {
       pipeLeadService.checkFields(pipeLeads).then((data) => {
          res.send(data);
        }).catch((err) => {
          next(errorMethods.sendServerError(err));
        });
      });
  }
  catch (error) {
    next(errorMethods.sendServerError(error));
  }
}


/******************************************************
 * @DESC       - API TO GET ALL LEADS RELATED WIDGET DATA
 * @ROUTE      - /api/pipeLeads/widget
 * @ACCESS     - PRIVATE
 * @PROTECTION - PASSPORT JWT AND LOCAL STRATEGY
 * @RETURNS    - {object} - 200 - AN OBJECT OF NEW TARGET
 * @RETURNS    - default - UNEXPECTED ERROR
 * @METHODS    - GET
 * @PARAMS     - widgetNo=1 for getting pipeLeads in pipline
 * @PARAMS     - widgetNo=2 for getting count according to degree and status.
 ******************************************************/
async function getAllWidgetData( req, res, next ){
  try{
    const widgetNo = req.query.widgetNo;
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;
    var isOrganisation = req.query.isOrganisation;
    if( widgetNo === "1" ){
    let returnData = await pipeLeadService.getPipeLeadsInPipeline( startDate, endDate, isOrganisation );
    return res.json(returnData);
    } else if ( widgetNo === "2" ){
    let returnData = await pipeLeadService.getPipeLeadsWithDegreeAndStatus( startDate, endDate, isOrganisation );
    return res.json(returnData);
    } else if( widgetNo === "3" ){
      let returnData = await pipeLeadService.reasonForPipeLeadDrop( startDate, endDate, isOrganisation );
      return res.json(returnData);
    } else if ( widgetNo === "4" ){
      let returnData = await pipeLeadService.getPipeLeadBySourceRevenue( startDate, endDate, isOrganisation );
      return res.json(returnData);
    }
    else {
      next( errorMethods.sendBadRequest(errorCode.INVALID_DATA) );
    }
  } catch ( err ){
    next(errorMethods.sendServerError(error));
  }
}

/******************************************************
 * @DESC       - API TO GET ALL THE DATA FOR TODAY'S FOLLOWUPS & MEETING
 * @ROUTE      - /api/pipeLeads/today
 * @ACCESS     - PRIVATE
 * @PROTECTION - PASSPORT JWT AND LOCAL STRATEGY
 * @RETURNS    - {object} - 200 - AN OBJECT OF NEW TARGET
 * @RETURNS    - default - UNEXPECTED ERROR
 * @METHODS    - GET
 * @PARAMS     - 
 * @PARAMS     - 
 ******************************************************/
async function getTodaysData( req, res, next ) {
  try{
    var type = req.query.type;
    var isOrganisation = req.query.isOrganisation;
    if(type == undefined || type != 'followup' && type != 'meeting'){
      return next(errorMethods.sendBadRequest(errorCode.INVALID_INPUT));
    }
    let returnData = await pipeLeadService.getAllTodayData( type, isOrganisation );
    return res.json( returnData );
  } catch ( err ) {
    next(errorMethods.sendServerError(err));
  }
}

/******************************************************
 * @DESC       - API TO GET LEAD CLOSURE PROBABILITY
 * @ROUTE      - /api/pipeLeads/pipeLeadCP/:id
 * @ACCESS     - PRIVATE
 * @PROTECTION - PASSPORT JWT AND LOCAL STRATEGY
 * @RETURNS    - {object} - 200 - AN OBJECT OF NEW TARGET
 * @RETURNS    - default - UNEXPECTED ERROR
 * @METHODS    - GET
 * @PARAMS     - 
 * @PARAMS     - 
 ******************************************************/

function pipeLeadCP(req, res, next) {
  let pipeLead = req.params.id;
  pipeLeadService.pipeLeadCP(pipeLead).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function allPipeLeadsCP(req, res, next) {
  pipeLeadService.allPipeLeadsCP().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function pipeLeadsByAccountId(req, res, next) {
  let account = req.query.account;
  pipeLeadService.pipeLeadsByAccountId(account).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function overwrite(req, res, next) {
  let pipeLeads = req.body;
  pipeLeadService.overwrite(pipeLeads).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function notoverwrite(req, res, next) {
  let pipeLeads = req.body;
  pipeLeadService.notoverwrite(pipeLeads).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function getAvgCP(req, res, next) {
  pipeLeadService.getAvgCP().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function countOverview( req, res, next ){
  let query = req.body
  pipeLeadService.countOverview(query).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;
