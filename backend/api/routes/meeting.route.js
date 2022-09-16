const meetingService = require('../services/meeting.service');
var schema = require('../schemas/meeting.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/meetings')
    .get(getAllMeetings)
    .post(addMeeting);
  router.route('/meetings/count')
    .get(getAllMeetingsCount);
  router.route('/meetings/overview')
    .get(getAllMeetingsOverview);
  router.route('/meetings/today')
    .get(getTodayMeetings);
  router.route('/meetings/search')
    .post(searchMeetings);
  router.route('/meetings/exist')
    .get(isExist);
  router.route('/meetings/:id')
    .get(getMeetingById)
    .delete(deleteMeeting)
    .put(updateMeeting);
  
}

/**
 * Get all a meetings api
 * @route GET /api/meetings
 * @group meetings - Operations about meetings
 * @returns {object} 200 - An object of meetings info
 * @returns {Error}  default - Unexpected error
 */
function getAllMeetings(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      meetingService.getMeetingsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      meetingService.getMeetingsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    meetingService.getAllMeetings().then((data) => {
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
 * Search meetings api
 * @route POST /api/meetings/search
 * @group meetings - Operations about meetings
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of meetings info
 * @returns {Error}  default - Unexpected error
 */
function searchMeetings(req, res, next) {
  let searchCriteria = req.body;
  meetingService.searchMeetings(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get todays meeting
 * @route GET /api/meetings/today
 * @group meetings - Operations about meetings
 * @returns {object} 200 - An object of meetings info
 * @returns {Error}  default - Unexpected error
 */
function getTodayMeetings(req, res, next) {
  var searchCriteria = {
    pageSize:100000,
    pageNo:1,
    query:{
      
      'fromDate': new Date().toISOString()
    }
  }
  meetingService.searchMeetings(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

getTodayMeetings

/**
 * Get meetings by id api
 * @route GET /api/meetings/:id
 * @group meetings - Operations about meetings
 * @returns {object} 200 - An object of meetings info
 * @returns {Error}  default - Unexpected error
 */
function getMeetingById(req,res,next) {

  let meetingId = req.params.id;

  console.log("id"+ meetingId);
  var json_format = iValidator.json_schema(schema.getSchema,meetingId,"meeting");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  meetingService.getMeetingById(meetingId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.MEETING_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add meetings api
 * @route POST /api/meetings
 * @group meetings - Operations about meetings
 * @param {object} meeting.body.required - meetings details
 * @returns {object} 200 - An object of meetings info
 * @returns {Error}  default - Unexpected error
 */
function addMeeting(req,res, next) {
  var meetingData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, meetingData, "meeting");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   meetingService.addMeeting(meetingData).then((data) => {
    res.json(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });

}

/**
 * update meetings by id api
 * @route PUT /api/meetings
 * @group meetings - Operations about meetings
 * @returns {object} 200 - An object of meetings info
 * @returns {Error}  default - Unexpected error
 */
function updateMeeting(req,res, next) {
   var meetingData=req.body;
   var id = req.params.id;
   meetingService.getMeetingById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.MEETING_NOT_EXIST));
    }else{
      meetingService.updateMeeting(id,meetingData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete meetings by id api
 * @route DELETE /api/meetings/:id
 * @group meetings - Operations about meetings
 * @returns {object} 200 - An object of meetings info
 * @returns {Error}  default - Unexpected error
 */
function deleteMeeting(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  meetingService.getMeetingById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.MEETING_NOT_EXIST));
    }else{
      meetingService.deleteMeeting(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get meetings count api
 * @route GET /api/meetings/count
 * @group meetings - Operations about meetings
 * @returns {object} 200 - An object of meetings info
 * @returns {Error}  default - Unexpected error
 */
function getAllMeetingsCount(req,res,next) {
  meetingService.getAllMeetingsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.MEETING_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of meetings api
 * @route GET /api/meetings/overview
 * @group meetings - Operations about meetings
 * @returns {object} 200 - An object of meetings info
 * @returns {Error}  default - Unexpected error
 */
function getAllMeetingsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  meetingService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is meetings exist api
 * @route GET /api/meetings/exist
 * @group meetings - Operations about meetings
 * @param {string} meetingname.query.required - meetings name
 * @returns {object} 200 - An object of meetings info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  let meetingId = req.query.meetingId
  console.log("name" + name);
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  meetingService.getMeetingByName(name).then((data) => {
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