const leadService = require('../services/lead.service');
var schema = require('../schemas/lead.validation.schema.json')
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
  router.route('/leads')
    .get(getAllLeads)
    .post(addLead);
  router.route('/leads/export')
    .get(exportLeads);
  router.route('/leads/countOverview')
    .post(countOverview)
  router.route('/leads/count')
    .get(getAllLeadsCount);
  router.route('/leads/socialMedia/count')
    .get(getAllSocialMediaLeadsCount);
  router.route('/leads/exist')
    .get(isExist);
  router.route('/leads/allLeadsCP')
    .get(allLeadsCP)
  router.route('/leads/leadCP/:id')
    .get(leadCP);
  router.route('/leads/followups/user/:userId')
    .get(getAllFollowupsByUserId);
  router.route('/leads/today/all')
    .get(getAllDataForToday);
  router.route('/leads/today')
    .get(getTodaysData);
  router.route('/leads/leadsbyacc')
    .get(leadsByAccountId);
  router.route('/leads/meetings/user/:userId')
    .get(getAllMeetingsByUserId);
  router.route('/leads/status/:status')
    .get(getAllLeadsByStatus);
  router.route('/leads/overview')
    .get(getAllLeadsOverview);
  router.route('/leads/search')
    .post(searchLeads);
  router.route('/leads/search/entity')
    .post(postSearchLeadsByEntity)
  router.route('/leads/search/entity/:entity')
    .get(searchLeadsByEntity);
  router.route('/leads/search/text')
    .get(textSearch);
  router.route('/leads/closure/:id')
    .get(leadClosures);
  router.route('/leads/leaderboard')
    .get(getLeaderboard);
  router.route('/leads/timeline/:id')
    .get(leadTimeline);
  router.route('/leads/widget')
    .get(getAllWidgetData)
  router.route('/leads/avgcp')
    .get(getAvgCP);
  router.route('/leads/:id')
    .get(getLeadById)
    .delete(deleteLead)
    .put(updateLead);
  router.post('/leads/import', Multer({ storage: Multer.memoryStorage(), limits: limits}).single("file"), importLeads);
  router.post('/leads/importest', Multer({ storage: Multer.memoryStorage(), limits: limits}).single("file"), importest);
  router.post('/leads/import/json', importJSONLeads );
  router.post('/leads/import/overwrite', overwrite);
  router.post('/leads/import/notoverwrite',notoverwrite);
  router.post('/leads/import/checkfields', Multer({ storage: Multer.memoryStorage(), limits: limits}).single("file"), checkFields);
}

/**
 * Get all a leads api
 * @route GET /api/leads
 * @group leads - Operations about leads
 * @returns {object} 200 - An object of leads info
 * @returns {Error}  default - Unexpected error
 */
function getAllLeads(req, res, next) {
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
    leadService.getAllLeadsWithinTimeframe(startDate, endDate, assigned, isKanban, isHidden, status).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  } else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      leadService.getLeadsByPageWithSort(pageNo, pageSize, sortBy, assigned, isKanban, isHidden, status).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      leadService.getLeadsByPage(pageNo, pageSize, assigned, isKanban, isHidden, status).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else if ( isKanban !== undefined && isNotes !== undefined && isFollowups !== undefined ){
    console.log("asdasd")
    leadService.getAllLeads(assigned, isKanban, isHidden, isNotes, isFollowups).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
  else {
    leadService.getAllLeads(assigned, isKanban, isHidden).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }

}

/**
 * Get leads by id api
 * @route GET /api/leads/:id
 * @group leads - Operations about leads
 * @returns {object} 200 - An object of leads info
 * @returns {Error}  default - Unexpected error
 */
function getLeadById(req, res, next) {

  let leadId = req.params.id;

  console.log("id" + leadId);
  var json_format = iValidator.json_schema(schema.getSchema, leadId, "lead");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  leadService.getLeadById(leadId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.LEAD_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add leads api
 * @route POST /api/leads
 * @group leads - Operations about leads
 * @param {object} leadData.body.required - leads details
 * @returns {object} 200 - An object of leads info
 * @returns {Error}  default - Unexpected error
 */
function addLead(req, res, next) {
  var leadData = req.body;


  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, leadData, "lead");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  leadService.getLeadByLeadName(leadData.name).then((data) => {
    if (data != undefined) {
      return next(errorMethods.sendBadRequest(errorCode.LEAD_ALREADY_EXIST));
    } else {
      leadService.addLead(leadData).then((data) => {
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
 * update leads by id api
 * @route PUT /api/leads
 * @group leads - Operations about leads
 * @returns {object} 200 - An object of leads info
 * @returns {Error}  default - Unexpected error
 */
function updateLead(req, res, next) {
  var leadData = req.body;
  var id = req.params.id;
  leadService.getById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.LEAD_NOT_EXIST));
    } else {
      var user = currentContext.getCurrentContext();
      if (data.assigned != undefined && user.userId != data.assigned._id && !user.isAdmin) {
        return next(errorMethods.sendBadRequest(errorCode.ACCESS_DENIED));
      } else {
        leadService.updateLead(id, leadData).then((data) => {
         res.json(data);
        }).catch((err) => {
          next(errorMethods.sendServerError(err));
        });
      }
    }
  });
}

/**
 * delete leads by id api
 * @route DELETE /api/leads/:id
 * @group leads - Operations about leads
 * @returns {object} 200 - An object of leads info
 * @returns {Error}  default - Unexpected error
 */
function deleteLead(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  leadService.getById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.LEAD_NOT_EXIST));
    } else {
      leadService.deleteLead(delId, data).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get leads count api
 * @route GET /api/leads/count
 * @group leads - Operations about leads
 * @returns {object} 200 - An object of leads info
 * @returns {Error}  default - Unexpected error
 */
function getAllLeadsCount(req, res, next) {
  let key = req.query.key;
  let value = req.query.value;
  let entity = req.query.entity;
  let assigned = req.query.assigned;
  var query = {};
  if( assigned != undefined){
    let searchCriteria = { query : { assigned:assigned } };
    leadService.searchLeads(searchCriteria).then((data) => {
      res.json({
        count: data.length
      });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }else if( entity != undefined ){
    if (entity == 'meetings' || entity == 'followups') {
      leadService.searchLeadsByEntity(entity).then((data) => {
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
    getLeadCount(query, next, res);
  } else if (key != undefined) {
    leadService.getAggregateCount(key).then((data) => {
      if (data == undefined) {
        return next(errorMethods.sendBadRequest(errorCode.LEAD_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  } else {
    getLeadCount(query, next, res);
  }
}

/**
 * Get social leads count api
 * @route GET /api/leads/socialMedia/count
 * @group leads - Operations about leads
 * @returns {object} 200 - An object of leads info
 * @returns {Error}  default - Unexpected error
 */
function getAllSocialMediaLeadsCount(req, res, next) {
  // var socialMedia = ['www.facebook.com', 'www.twitter.com', 'www.instagram.com', 'www.linkedin.com'];
  var socialMedia = ["Facebook","LinkedIn","Instagram"];
  var query = {
    'source':{
      '$in': socialMedia
    }
  };
  getLeadCount(query, next, res);
}



function getLeadCount(query, next, res) {
  leadService.getAllLeadsCount(query).then((data) => {
    if (data == undefined) {
      return next(errorMethods.sendBadRequest(errorCode.LEAD_NOT_EXIST));
    }
    res.send({ "count": data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * get overview of leads api
 * @route GET /api/leads/overview
 * @group leads - Operations about leads
 * @returns {object} 200 - An object of leads info
 * @returns {Error}  default - Unexpected error
 */
function getAllLeadsOverview(req, res, next) {

  leadService.getAllLeadsOverview().then((data) => {
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
 * Search leads api
 * @route POST /api/leads/search
 * @group leads - Operations about leads
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of leads info
 * @returns {Error}  default - Unexpected error
 */
function searchLeads(req, res, next) {
  let searchCriteria = req.body;
  leadService.searchLeads(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Search leads api
 * @route POST /api/leads/search/entity/:entity
 * @group leads - Operations about leads
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of leads info
 * @returns {Error}  default - Unexpected error
 */
function searchLeadsByEntity(req, res, next) {
  var entity = req.params.entity;
  if (entity == 'meetings' || entity == 'followups') {
    leadService.searchLeadsByEntity(entity).then((data) => {
      res.json(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  } else {
    next(errorMethods.sendBadRequest("Unsupported type"))
  }
}

function postSearchLeadsByEntity(req, res, next){
  var entity = req.body.entity
  var query = req.body.query
  if (entity == 'MEETING' || entity == 'FOLLOWUP') {
    leadService.postSearchLeadsByEntity(entity, query).then((data) => {
      res.json(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  } else {
    next(errorMethods.sendBadRequest("Unsupported type"))
  }
}



/**
 * Search leads api
 * @route GET /api/leads/search/text
 * @group leads - Operations about leads
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of leads info
 * @returns {Error}  default - Unexpected error
 */
function textSearch(req, res, next) {
  let text = req.query.text;
  let isHidden = req.query.isHidden;
  let assigned = req.query.assigned;
  leadService.textSearch(text, assigned, isHidden).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is leads exist api
 * @route GET /api/leads/exist
 * @group leads - Operations about leads
 * @param {string} customername.query.required - leads name
 * @returns {object} 200 - An object of leads info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next) {
  let name = req.query.name;
  console.log("name" + name);
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  leadService.getLeadByLeadName(name).then((data) => {
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
 * Lead clousure rate by user 
 * @route GET /api/leads/closure/:id
 * @group leads - Operations about leads
 * @param {string} startDate.query.required - startDate
 * @param {string} endDate.query.required - endDate
 * @param {string} id.pathParam.required - userId
 * @returns {object} 200 - An object of leads info
 * @returns {Error}  default - Unexpected error
 */
function leadClosures(req, res, next) {
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  let userId = req.params.id;
  leadService.getLeadClosureRate(userId, startDate, endDate).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * import leads 
 * @route POST /api/leads/import
 * @group leads - Operations about leads
 * @param {string} fileType.query.required - startDate
 * @returns {object} 200 - All leads
 * @returns {Error}  default - Unexpected error
 */
function importLeads(req, res, next) {
  const inputFile = req.file;
  if (!inputFile) {
    res.status(400).send("No file uploaded.");
  }
  importCSVData(inputFile, res, next);
}

function exportLeads(req, res, next) {
  leadService.exportLeads().then((data) => {
   res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function getLeaderboard(req, res, next) {
  
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

  leadService.getLeaderboard(startDate, endDate).then((leads) => {
    res.json(leads);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  })
}

/**
 * Get all a leads api
 * @route GET /api/leads/status/:status
 * @group customers - Operations about customers
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getAllLeadsByStatus(req, res, next) {
  logger.info("In get all leads route");
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
  leadService.searchLeads(query).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * get followups by userid api
 * @route GET /api/leads/followups/user/:userId
 * @group followups - Operations about followups
 * @returns {object} 200 - An object of followups info
 * @returns {Error}  default - Unexpected error
 */
function getAllFollowupsByUserId(req, res, next) {
  let userId = req.params.userId;
  if (!userId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  leadService.getAllFollowupsByUserId(userId).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * get followups by userid api
 * @route GET /api/leads/today/all
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
  leadService.getAllDataForToday(type, isOrganisation).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * get followups by userid api
 * @route GET /api/leads/meetings/user/:userId
 * @group followups - Operations about followups
 * @returns {object} 200 - An object of followups info
 * @returns {Error}  default - Unexpected error
 */
function getAllMeetingsByUserId(req, res, next) {
  let userId = req.params.userId;
  if (!userId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  leadService.getAllMeetingsByUserId(userId).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * get timeline by leadid api
 * @route GET /api/leads/timeline/:id
 * @group followups - Operations about lead timeline
 * @returns {object} 200 - An object of lead info
 * @returns {Error}  default - Unexpected error
 */
function leadTimeline(req, res, next) {
  let leadId = req.params.id;
  if (!leadId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  leadService.leadTimeline(leadId).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function importJSONLeads( req, res, next ){
  try{
    let leads = req.body;
    leadService.importest(leads).then((data) => {
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
    let leads = [];
    streamifier.createReadStream(inputFile.file.buffer.toString())
    .pipe(csv.parse({ headers: true, ignoreEmpty: true }))
    .on('error', error => console.error(error))
    .on("data", function (data) {
        let lead = {
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
        leads.push(lead);
      })
      .on("end", function () {
        leadService.importLeads(leads).then((data) => {
          res.send({ "count": leads.length });
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
    let leads = [];
    streamifier.createReadStream(inputFile.file.buffer.toString())
    .pipe(csv.parse({ headers: true, ignoreEmpty: true }))
    .on('error', error => console.error(error))
      .on("data", function (data) {
        let lead = data;
        leads.push(lead);
      })
      .on("end", function () {
       leadService.importest(leads).then((data) => {
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
    let leads = [];
    streamifier.createReadStream(inputFile.file.buffer.toString())
    .pipe(csv.parse({ headers: true, ignoreEmpty: true }))
    .on('error', error => console.error(error))
      .on("data", function (data) {
        let lead = data;
        leads.push(lead);
      })
      .on("end", function () {
       leadService.checkFields(leads).then((data) => {
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
 * @ROUTE      - /api/leads/widget
 * @ACCESS     - PRIVATE
 * @PROTECTION - PASSPORT JWT AND LOCAL STRATEGY
 * @RETURNS    - {object} - 200 - AN OBJECT OF NEW TARGET
 * @RETURNS    - default - UNEXPECTED ERROR
 * @METHODS    - GET
 * @PARAMS     - widgetNo=1 for getting leads in pipline
 * @PARAMS     - widgetNo=2 for getting count according to degree and status.
 ******************************************************/
async function getAllWidgetData( req, res, next ){
  try{
    const widgetNo = req.query.widgetNo;
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;
    var isOrganisation = req.query.isOrganisation;
    if( widgetNo === "1" ){
    let returnData = await leadService.getLeadsInPipeline( startDate, endDate, isOrganisation );
    return res.json(returnData);
    } else if ( widgetNo === "2" ){
    let returnData = await leadService.getLeadsWithDegreeAndStatus( startDate, endDate, isOrganisation );
    return res.json(returnData);
    } else if( widgetNo === "3" ){
      let returnData = await leadService.reasonForLeadDrop( startDate, endDate, isOrganisation );
      return res.json(returnData);
    } else if ( widgetNo === "4" ){
      let returnData = await leadService.getLeadBySourceRevenue( startDate, endDate, isOrganisation );
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
 * @ROUTE      - /api/leads/today
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
    let returnData = await leadService.getAllTodayData( type, isOrganisation );
    return res.json( returnData );
  } catch ( err ) {
    next(errorMethods.sendServerError(err));
  }
}

/******************************************************
 * @DESC       - API TO GET LEAD CLOSURE PROBABILITY
 * @ROUTE      - /api/leads/leadCP/:id
 * @ACCESS     - PRIVATE
 * @PROTECTION - PASSPORT JWT AND LOCAL STRATEGY
 * @RETURNS    - {object} - 200 - AN OBJECT OF NEW TARGET
 * @RETURNS    - default - UNEXPECTED ERROR
 * @METHODS    - GET
 * @PARAMS     - 
 * @PARAMS     - 
 ******************************************************/

function leadCP(req, res, next) {
  let lead = req.params.id;
  leadService.leadCP(lead).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function allLeadsCP(req, res, next) {
  leadService.allLeadsCP().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function leadsByAccountId(req, res, next) {
  let account = req.query.account;
  leadService.leadsByAccountId(account).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function overwrite(req, res, next) {
  let leads = req.body;
  leadService.overwrite(leads).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function notoverwrite(req, res, next) {
  let leads = req.body;
  leadService.notoverwrite(leads).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function getAvgCP(req, res, next) {
  leadService.getAvgCP().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function countOverview( req, res, next ){
  let query = req.body
  leadService.countOverview(query).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;
