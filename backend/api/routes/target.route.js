const targetServices = require('../services/target.service');
const userServices = require('../services/user.service');
var schema = require('../schemas/target.validation.schema.json');
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init( router ){
    router.route('/targets')
        .get(getAllTargets)
        .post(createTarget)
        .put(resetTargetofThatMonth)
        .delete( deleteTargetofThatMonth );
    router.route('/targets/organisation')
        .get(getOrganisationTargetForCurrentMonth);
    router.route('/target/widget')
        .get( getAllWidgetData );
    router.route('/target/pending')
        .post(createPendingTarget)
    router.route('/target/:id')
        .get(getTargetById)
        .put(updateTargetById)
        .delete(deleteTargetById);
}

/******************************************************
 * @DESC       - API TO CHECK ORGANISATION DATA FOR CURRENT MONTH EXISTS
 * @ROUTE      - /targets/organisation
 * @ACCESS     - PRIVATE
 * @PROTECTION - PASSPORT JWT AND LOCAL STRATEGY
 * @RETURNS    - {object} - 200 - AN OBJECT OF NEW TARGET
 * @RETURNS    - default - UNEXPECTED ERROR
 * @METHODS    - GET
 ******************************************************/
async function getOrganisationTargetForCurrentMonth( req, res, next ){
    try{
        let returnData = await targetServices.checkIfOrganisationTargetForCurrentMonth();
        return res.json(returnData);
    } catch ( err ){ 
        next(errorMethods.sendServerError(err));
    }  
}

/******************************************************
 * @DESC       - API TO CREATE A NEW TARGET
 * @ROUTE      - /api/targets
 * @ACCESS     - PRIVATE
 * @PROTECTION - PASSPORT JWT AND LOCAL STRATEGY
 * @RETURNS    - {object} - 200 - AN OBJECT OF NEW TARGET
 * @RETURNS    - default - UNEXPECTED ERROR
 * @METHODS    - POST
 ******************************************************/
async function createTarget( req, res, next ){
    try{
        var targetData = req.body;
        // VALIDATE THE REQ.BODY
        var json_format = iValidator.json_schema( schema.postSchema, targetData, "target"  );
        if( json_format.valid == false ){
            return res.status( 422 ).send( json_format );
        }
        
        // CHECK IF THE ENTITY ID USER EXISTS OR NOT
        let userResponse = await userServices.getUserById( targetData.entityId );
        if( userResponse == undefined || userResponse.size == 0 ){
            return next(errorMethods.sendBadRequest(errorCode.USER_NOT_EXIST));
        }
        // CHECK IF DATA ALREADY EXISTS
        let getTargetData = await targetServices.getTarget( targetData );
        if( getTargetData ){
            return next(errorMethods.sendBadRequest(errorCode.TARGET_ALREADY_EXIST));
        }
        // CHECK IF ORGANISATION TARGET HAS BEEN CREATED OR NOT FIRST - WHILE CREATING A MEMBER TARGET
        if( targetData.targetType === "MEMBER" ){
            let getTargetData = await targetServices.getOrganisationTargetForCurrentMonth();
            if( !getTargetData ){console.log("No error")
                return next(errorMethods.sendBadRequest(errorCode.ORGANISATION_TARGET_NOT_EXIST));
            }
            targetData.targetType = "MEMBER";
        }
        
        // CREATE A NEW PENDING TARGET
        // let creatingPendingTarget = await targetServices.createPendingTargetFromLastMonth(); 
        // CREATE A NEW TARGET 
        let targetDatas = await targetServices.addtarget(targetData);
        return res.json(targetDatas);
    } catch ( err ){
        next(errorMethods.sendServerError(err));
    }
}

/******************************************************
 * @DESC       - API TO GET ALL TARGET
 * @ROUTE      - /api/targets
 * @ACCESS     - PRIVATE
 * @PROTECTION - PASSPORT JWT AND LOCAL STRATEGY
 * @RETURNS    - {object} - 200 - AN OBJECT OF NEW TARGET
 * @RETURNS    - default - UNEXPECTED ERROR
 * @METHODS    - GET
 * @PARAMS     - NO PARAMS - MEANS GET DATA AS A MEMBER 
 ******************************************************/
async function getAllTargets(req, res, next){
    try{
        var isOrganisation = req.query.isOrganisation;
        var sendAll = req.query.sendAll;
        var year = req.query.year;
        var user_id = req.query.user_id;
        var isPending = req.query.isPending;
        let allTargetData = await targetServices.getAllTargets( isOrganisation, sendAll, year, isPending, user_id );
        return res.json(allTargetData);
    } catch ( err ){ 
        next(errorMethods.sendServerError(err));  
     }
}

/******************************************************
 * @DESC       - API TO RESET TARGET - OF RUNNING MONTH
 * @ROUTE      - /api/targets
 * @ACCESS     - PRIVATE
 * @PROTECTION - PASSPORT JWT AND LOCAL STRATEGY
 * @RETURNS    - {object} - 200 - AN OBJECT OF NEW TARGET
 * @RETURNS    - default - UNEXPECTED ERROR
 * @METHODS    - PUT
 ******************************************************/
async function resetTargetofThatMonth( req, res, next ){
    try{
        var deleteAll = req.query.deleteAll;
        let resetData = await targetServices.resetData( deleteAll );
        return res.json(resetData);
    } catch( err ){
        next(errorMethods.sendServerError(err));  
    }
}

/******************************************************
 * @DESC       - API TO DELETE TARGET - OF RUNNING MONTH
 * @ROUTE      - /api/targets
 * @ACCESS     - PRIVATE
 * @PROTECTION - PASSPORT JWT AND LOCAL STRATEGY
 * @RETURNS    - {object} - 200 - AN OBJECT OF NEW TARGET
 * @RETURNS    - default - UNEXPECTED ERROR
 * @METHODS    - DELETE
 ******************************************************/
async function deleteTargetofThatMonth( req, res, next ){
    try{
        var deleteAll = req.query.deleteAll;
        let resetData = await targetServices.deleteAllData( deleteAll );
        return res.json(resetData);
    } catch( err ){
        next(errorMethods.sendServerError(err));  
    }
}

/******************************************************
 * @DESC       - API TO GET TARGET BY ID
 * @ROUTE      - /api/target/:id
 * @ACCESS     - PRIVATE
 * @PROTECTION - PASSPORT JWT AND LOCAL STRATEGY
 * @RETURNS    - {object} - 200 - AN OBJECT OF NEW TARGET
 * @RETURNS    - default - UNEXPECTED ERROR
 * @METHODS    - GET
 * @PARAMS     - NO PARAMS - MEANS GET DATA AS A MEMBER 
 ******************************************************/
async function getTargetById(req, res, next){
    try{
        console.log("Hellow")
        var id = req.params.id;
        let targetData = await targetServices.getTargetById( id );
        return res.json( targetData );
    } catch ( err ) {
        next(errorMethods.sendServerError(err));  
    }
}

/******************************************************
 * @DESC       - API TO UPDATE TARGET BY ID
 * @ROUTE      - /api/target/:id
 * @ACCESS     - PRIVATE
 * @PROTECTION - PASSPORT JWT AND LOCAL STRATEGY
 * @RETURNS    - {object} - 200 - AN OBJECT OF NEW TARGET
 * @RETURNS    - default - UNEXPECTED ERROR
 * @METHODS    - PUT
 * @PARAMS     - NO PARAMS - MEANS GET DATA AS A MEMBER 
 ******************************************************/
async function updateTargetById( req, res, next ){
    try{
        var id = req.params.id;
        var data = req.body;
        let targetUpdate = await targetServices.updateDataById( id, data );
        return res.json( targetUpdate );
    } catch ( err ){
        next(errorMethods.sendServerError(err));
    }
}

/******************************************************
 * @DESC       - API TO DELETE TARGET BY ID
 * @ROUTE      - /api/target/:id
 * @ACCESS     - PRIVATE
 * @PROTECTION - PASSPORT JWT AND LOCAL STRATEGY
 * @RETURNS    - {object} - 200 - AN OBJECT OF NEW TARGET
 * @RETURNS    - default - UNEXPECTED ERROR
 * @METHODS    - DELETE
 * @PARAMS     - NO PARAMS - MEANS GET DATA AS A MEMBER 
 ******************************************************/
async function deleteTargetById( req, res, next ){
    try{
        var id = req.params.id;
        await targetServices.deleteDataById( id );
        return res.json({ message : "Data deleted successfully", success : true });
    } catch ( err ){
        next(errorMethods.sendServerError(err));
    }
}


/******************************************************
 * @DESC       - API TO CREATE A PENDING TARGET FOR THE 
 * @DESC       - WHOLE ORGANISATION
 * @ROUTE      - /api/target/pending
 * @ACCESS     - PRIVATE
 * @PROTECTION - PASSPORT JWT AND LOCAL STRATEGY
 * @RETURNS    - {object} - 200 - AN OBJECT OF NEW TARGET
 * @RETURNS    - default - UNEXPECTED ERROR
 * @METHODS    - POST
 ******************************************************/
async function createPendingTarget( req, res, next ){
    try{
        console.log("Pending");
        let createPendingTarget = await targetServices.createPendingTargetFromLastMonth();
        return res.json({ message:"All pending target for that month has been successfully created.", code:200 });
    } catch ( err ){
        next( errorMethods.sendServerError(err) );
    }
}

/******************************************************
 * @DESC       - API TO GET WIDGET DATA
 * @ROUTE      - /api/target/widget
 * @ACCESS     - PRIVATE
 * @PROTECTION - PASSPORT JWT AND LOCAL STRATEGY
 * @RETURNS    - {object} - 200 - AN OBJECT OF NEW TARGET
 * @RETURNS    - default - UNEXPECTED ERROR
 * @METHODS    - POST
 ******************************************************/
async function getAllWidgetData( req, res, next ) {
    try{
        var widgetNo = req.query.widgetNo;
        var isOrganisation = req.query.isOrganisation;
        if( widgetNo === "1" ){
            let returnData = await targetServices.getMonthlyTargetLeadWise(isOrganisation);
            return res.json( returnData );
        } else if( widgetNo === "2" ){
            let returnData = await targetServices.getMonthlyTargetDollarWise(isOrganisation);
            return res.json( returnData );
        } else if ( widgetNo === "3" ){
            let returnData = await targetServices.getOwnerWiseLead();
            return res.json( returnData );
        }  else if ( widgetNo === "4" ){
            let monthly_revenue_result = await targetServices.getCurrentMonthRevenue( isOrganisation );
            return res.json(monthly_revenue_result);
        } else if ( widgetNo === "5"  ){
            let returnDAta = await targetServices.getExpectedRevenueGraphByMonth( isOrganisation );
            return res.json(returnDAta)
        } else if ( widgetNo === "6" ){
            return res.json({
                "revenue_forecast":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                "labels":["Jan","Feb","Mar","Apr","June","Jul","Aug","Sept","Oct","Nov","Dec"]
            }) 
        }
        else {
            next(errorMethods.sendBadRequest(errorCode.INVALID_DATA));
        }
    } catch ( err ){
        next( errorMethods.sendServerError(err) );
    }
}

module.exports.init = init;