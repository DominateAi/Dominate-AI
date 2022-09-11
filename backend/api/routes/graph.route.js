var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
const moment = require('moment');
const graphService = require('../services/graph.service');
const leadService = require('../services/lead.service');
const ViewType = require('../../common/constants/ViewType'); 
var graphSchema = require('../schemas/graph.validation.schema.json');
var iValidator = require('../../common/iValidator');

function init(router) {
    router.route('/graph/email')
        .get(getEmailCountByTimestamp);
    router.route('/graph/lead')
        .get(getLeadCountByTimestamp);
    router.route('/graph/lead/media/date-filter')
        .get( getLeadCountByMediaWithDateFilter )
    router.route('/graph/lead/media')
        .get(getLeadCountByMediaWithDateFilter);  // CHANGED getLeadCountByMedia to getLeadCountByMediaWithDateFilter
    router.route('/graph/customer/status')
        .get(getCustomerCountByStatus);
    router.route('/graph/leads/prediction')
        .get(getLeadsPrediction);
    router.route('/graph/users/target')
        .get(getUsersTarget);
    router.route('/graph/leads/status')
        .get(getLeadsByStatus);
}

/******************************************
 * @DESC - DATE FILTER
 ******************************************/
async function getLeadCountByMediaWithDateFilter( req, res, next ){
    try{
        var startDate = req.query.startDate;
        var endDate = req.query.endDate;
        let returnData = await leadService.getLeadCountBySocialMediaWithDateFilter( startDate, endDate );
        return res.json( returnData );
    } catch ( err ) {
        next(errorMethods.sendServerError("Error while getting Data"));
    } 
}


/**
 * Get email by timestamp api
 * @route GET /api/graph/email
 * @group email - Operations about email
 * @returns {object} 200 - An object of email info
 * @returns {Error}  default - Unexpected error
 */
function getEmailCountByTimestamp(req, res, next) {
    let startOfWeek = moment().startOf('isoWeek');
    let endOfWeek = moment().endOf('isoWeek');

    graphService.getEmailCountByTimestamp(startOfWeek, endOfWeek).then((data)=>{
        res.json(data);
    }).catch((err)=>{
        console.log(err);
        next(errorMethods.sendServerError("Error while getting email"));
    });
    
}

/**
 * Get leads by timestamp api
 * @route GET /api/graph/lead
 * @group lead - Operations about lead
 * @returns {object} 200 - An object of lead info
 * @returns {Error}  default - Unexpected error
 */
function getLeadCountByTimestamp(req, res, next) {
    let view = req.query.view;
    let year = req.query.year;
    let month = req.query.month;
    let week = req.query.week;
    let revenue = req.query.revenue;
    let sumBy = undefined;
    if(revenue != undefined){
        sumBy = '$worth';
    }

    var json_format = undefined;
    if(view == ViewType.YEARLY){
        json_format = {
            valid : true
        };
    }else if(view == ViewType.MONTHLY){
        json_format = iValidator.json_schema(graphSchema.monthlySchema, year, "graph");
    }else if(view == ViewType.WEEKLY){
        json_format = iValidator.json_schema(graphSchema.weeklySchema, year, month, "graph");
    }else if(view == ViewType.DAILY){
        json_format = iValidator.json_schema(graphSchema.dailySchema, year, week, "graph");
    }else{
        return next(errorMethods.sendBadRequest(errorCode.INVALID_INPUT));
    }
    
    if (json_format.valid == false) {
        return res.status(422).send(json_format.errorMessage);
    }

    graphService.getLeadCountByTimeStamp(view, year, month, week, sumBy).then((data)=>{
        res.json(data);
    }).catch((err)=>{
        console.log(err);
        next(errorMethods.sendServerError("Error while getting lead"));
    });
    
}

/**
 * Get leads by media api
 * @route GET /api/graph/lead/media
 * @group email - Operations about lead
 * @returns {object} 200 - An object of lead info
 * @returns {Error}  default - Unexpected error
 */
function getLeadCountByMedia(req, res, next) {
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;
    graphService.getLeadCountByMedia( startDate, endDate ).then((data)=>{
        res.json(data);
    }).catch((err)=>{
        console.log(err);
        next(errorMethods.sendServerError("Error while getting lead"));
    });   
}

/**
 * Get customer count by status api
 * @route GET /api/graph/customer/status
 * @group email - Operations about customer
 * @returns {object} 200 - An object of customer info
 * @returns {Error}  default - Unexpected error
 */
function getCustomerCountByStatus(req, res, next) {
    let year = req.query.year;
    if(year == undefined){
        return next(errorMethods.sendBadRequest(errorCode.INVALID_INPUT));
    }
    graphService.getCustomerCountByStatus(year).then((data)=>{
        res.json(data);
    }).catch((err)=>{
        console.log(err);
        next(errorMethods.sendServerError("Error while getting lead"));
    });
    
}

/**
 * Get leads revenue prediction api
 * @route GET /api/graph/leads/prediction
 * @group email - Operations about leads
 * @returns {object} 200 - An object of leads info
 * @returns {Error}  default - Unexpected error
 */
function getLeadsPrediction(req, res, next){
    let type = req.query.type;
    if(type == 'revenue'){
        type = '$worth'
    }else{
        return next(errorMethods.sendBadRequest(errorCode.INVALID_INPUT));
    }
    graphService.getLeadsPrediction(type).then((data)=>{
        res.json(data);
    }).catch((err)=>{
        console.log(err);
        next(errorMethods.sendServerError("Error while getting lead"));
    });
}

/**
 * Get users target api
 * @route GET /api/graph/users/target
 * @group email - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getUsersTarget(req, res, next){
    graphService.getUsersTarget().then((data)=>{
        res.json(data);
    }).catch((err)=>{
        console.log(err);
        next(errorMethods.sendServerError("Error while getting lead"));
    });
}

/**
 * Get leads status api
 * @route GET /api/graph/leads/status
 * @group email - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getLeadsByStatus(req, res, next){
    graphService.getLeadsByStatus().then((data)=>{
        res.json(data);
    }).catch((err)=>{
        console.log(err);
        next(errorMethods.sendServerError("Error while getting lead"));
    });
}






module.exports.init = init;