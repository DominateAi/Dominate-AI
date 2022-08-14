const leaveService = require('../services/leave.service');
var schema = require('../schemas/leave.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');
const LeaveStatus = require('../../common/constants/LeaveStatus');

function init(router) {
  router.route('/leaves')
    .get(getAllLeaves)
    .post(addLeave);
  router.route('/leaves/holiday')
    .post(addHoliday);
  router.route('/leaves/count')
    .get(getAllLeavesCount);
  router.route('/leaves/overview')
    .get(getAllLeavesOverview);
  router.route('/leaves/search')
    .post(searchLeaves);
  router.route('/leaves/approval-pending')
    .get(getAllApprovalPending);
  router.route('/leaves/on-leave')
    .get(getAllOnLeave);
  router.route('/leaves/upcoming-leaves')
    .get(getAllUpcomingLeaves);
  router.route('/leaves/:id')
    .get(getLeaveById)
    .delete(deleteLeave)
    .put(updateLeave)
  router.route('/leaves/:id/approve')
    .put(approveLeave)
}

/**
 * Get all a leaves api
 * @route GET /api/leaves
 * @group leaves - Operations about leaves
 * @returns {object} 200 - An object of leaves info
 * @returns {Error}  default - Unexpected error
 */
function getAllLeaves(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  var startDate = req.query.startDate;
  var endDate = req.query.endDate;
  if (startDate != undefined && endDate != undefined) {
    leaveService.getAllLeavesWithinTimeframe(startDate, endDate).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      leaveService.getLeavesByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      leaveService.getLeavesByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    leaveService.getAllLeaves().then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
  }
}

/**
 * Get leaves by id api
 * @route GET /api/leaves/:id
 * @group leaves - Operations about leaves
 * @returns {object} 200 - An object of leaves info
 * @returns {Error}  default - Unexpected error
 */
function getLeaveById(req,res,next) {

  let leaveId = req.params.id;

  console.log("id"+ leaveId);
  var json_format = iValidator.json_schema(schema.getSchema,leaveId,"leave");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  leaveService.getLeaveById(leaveId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.LEAVE_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add leaves api
 * @route POST /api/leaves
 * @group leaves - Operations about leaves
 * @param {object} leaveData.body.required - leaves details
 * @returns {object} 200 - An object of leaves info
 * @returns {Error}  default - Unexpected error
 */
function addLeave(req,res, next) {
  var leaveData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, leaveData, "leave");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   leaveService.addLeave(leaveData).then((data) => {
      res.json(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add leaves api
 * @route POST /api/leaves/holiday
 * @group leaves - Operations about leaves
 * @param {object} leaveData.body.required - leaves details
 * @returns {object} 200 - An object of leaves info
 * @returns {Error}  default - Unexpected error
 */
function addHoliday(req,res, next) {
  var leaveData=req.body;
 
   leaveService.addHoliday(leaveData).then((data) => {
      res.json(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * update leaves by id api
 * @route PUT /api/leaves
 * @group leaves - Operations about leaves
 * @returns {object} 200 - An object of leaves info
 * @returns {Error}  default - Unexpected error
 */
function updateLeave(req,res, next) {
   var leaveData=req.body;
   var id = req.params.id;

   if(leaveData.leaveStatus === LeaveStatus.APPROVED && leaveData.leaveType != 'HOLIDAY'){
    return next(errorMethods.sendAccessDenied(errorCode.CANNOT_APPROVE_LEAVE));
   }

   leaveService.getLeaveById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.LEAVE_NOT_EXIST));
    }else{
      leaveService.updateLeave(id,leaveData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete leaves by id api
 * @route DELETE /api/leaves/:id
 * @group leaves - Operations about leaves
 * @returns {object} 200 - An object of leaves info
 * @returns {Error}  default - Unexpected error
 */
function deleteLeave(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  leaveService.getLeaveById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.LEAVE_NOT_EXIST));
    }else{
      leaveService.deleteLeave(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get leaves count api
 * @route GET /api/leaves/count
 * @group leaves - Operations about leaves
 * @returns {object} 200 - An object of leaves info
 * @returns {Error}  default - Unexpected error
 */
function getAllLeavesCount(req,res,next) {
  leaveService.getAllLeavesCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.LEAVE_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of leaves api
 * @route GET /api/leaves/overview
 * @group leaves - Operations about leaves
 * @returns {object} 200 - An object of leaves info
 * @returns {Error}  default - Unexpected error
 */
function getAllLeavesOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  leaveService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function approveLeave(req,res, next) {
  var id = req.params.id;

  leaveService.getLeaveById(id).then((data)=>{
   if(data == undefined || data.length == 0){
     return next(errorMethods.sendBadRequest(errorCode.LEAVE_NOT_EXIST));
   }else{
     leaveService.approveLeave(id,data).then((data)=>{
       res.json(data);
     }).catch((err)=>{
     next(errorMethods.sendServerError(err));
    });
   }
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
 * @route POST /api/leave/search
 * @group leads - Operations about leads
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of leads info
 * @returns {Error}  default - Unexpected error
 */
function searchLeaves(req, res, next) {
  let searchCriteria = req.body;
  leaveService.searchLeaves(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function getAllApprovalPending(req, res, next) {

  leaveService.getAllApprovalPendingLeaves().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function getAllOnLeave(req, res, next) {

  leaveService.getAllOnLeaves().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function getAllUpcomingLeaves(req, res, next) {

  leaveService.getAllUpcomingLeaves().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;