const calenderService = require('../services/calender.service');
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/calenders')
    .get(getAllCalenders)
  router.route('/calender/all')
    .get(getAllCalenderWithAllTypes)
  router.route('/calenders/holiday')
    .get(getAllHolidays)
  router.route('/calenders/upcomingEvents')
    .get(getUpcomingEvents)
  router.route('/calenders/getDayCalender')
    .get(getDayCalendar)
}

/**
 * Get all a calenders api
 * @route GET /api/calenders
 * @group calenders - Operations about calenders
 * @returns {object} 200 - An object of calenders info
 * @returns {Error}  default - Unexpected error
 */
function getAllCalenders(req, res, next) {
  var type = req.query.type;
  var month = parseInt(req.query.month);
  var year = parseInt(req.query.year);
  if (month <= 0 || isNaN(month) || year <= 0 || isNaN(year)) {
    errMsg = { "error": true, "message": "invalid month or year." };
    res.send(errMsg);
  } else {
    calenderService.getAllCalenders(type, month, year).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
  }
}

/**
 * Get all holiday api
 * @route GET /api/calenders/holiday
 * @group calenders - Operations about calenders
 * @returns {object} 200 - An object of calenders info
 * @returns {Error}  default - Unexpected error
 */
function getAllHolidays(req, res, next) {
  var year = parseInt(req.query.year);
  let month = parseInt(req.query.month);
  if (year <= 0 || isNaN(year)) {
    errMsg = { "error": true, "message": "invalid year." };
    res.send(errMsg);
  } else {
    calenderService.getAllHolidays(month, year).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
  }
}

/**
 * Get all a calenders upcomingEvents api
 * @route GET /api/calenders/upcomingEvents
 * @group calenders - Operations about calenders
 * @returns {object} 200 - An object of calenders info
 * @returns {Error}  default - Unexpected error
 */
function getUpcomingEvents(req, res, next) {
  calenderService.getUpcomingEvents().then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });

}

/******************************************************
 * @DESC       - API TO FOLLOWUPS AND MEETING ON THE SAME GRAPH
 * @ROUTE      - /api/calender/all
 * @ACCESS     - PRIVATE
 * @PROTECTION - PASSPORT JWT AND LOCAL STRATEGY
 * @RETURNS    - {object} - 200 - AN OBJECT OF NEW TARGET
 * @RETURNS    - default - UNEXPECTED ERROR
 * @METHODS    - GET
 * @PARAMS     - year = 2020 - Year
 * @PARAMS     - month=2 - Number of month
 ******************************************************/
async function getAllCalenderWithAllTypes( req, res, next ) {
  try{
    var month = parseInt(req.query.month);
    var year = parseInt(req.query.year);
    if (month <= 0 || isNaN(month) || year <= 0 || isNaN(year)) {
      errMsg = { "error": true, "message": "invalid month or year." };
      res.send(errMsg);
    } else {
      let returnData = await calenderService.getAllCalenderWithAllTypes( month, year );
      return res.json( returnData );
    } 
  } catch ( err ) {
    next(errorMethods.sendServerError(err));
  } 
}


async function getDayCalendar( req, res, next ) {
  try{
    var month = parseInt(req.query.month);
    var year = parseInt(req.query.year);
    var date = parseInt(req.query.date);
    if (month <= 0 || isNaN(month) || year <= 0 || isNaN(year) || date <= 0 || isNaN(date)) {
      errMsg = { "error": true, "message": "invalid month or year." };
      res.send(errMsg);
    } else {
      let returnData = await calenderService.getDayCalendar( month, year, date );
      return res.json( returnData );
    } 
  } catch ( err ) {
    next(errorMethods.sendServerError(err));
  } 
}

module.exports.init = init;