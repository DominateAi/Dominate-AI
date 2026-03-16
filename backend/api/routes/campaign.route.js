const campaignService = require('../services/campaign.service');
var schema = require('../schemas/campaign.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');
const { reject } = require('lodash');


function init(router) {
  router.route('/campaigns')
    .get(getAllCampaigns)
    .post(addCampaign);
  router.route('/campaigns/count')
    .get(getAllCampaignsCount);
  router.route('/campaigns/overview')
    .get(getAllCampaignsOverview);
  router.route('/campaigns/today')
    .get(getTodayCampaigns);
  router.route('/campaigns/search')
    .post(searchCampaigns);
  router.route('/campaigns/exist')
    .get(isExist);
  router.route('/campaigns/changeStatus')
    .post(changeStatus);
  router.route('/campaigns/:id')
    .get(getCampaignById)
    .delete(deleteCampaign)
    .put(updateCampaign);
  router.route('/campaigns/campaignProfileCompleted/:id')
    .get(campaignProfileCompleted)
}

/**
 * Get all a campaigns api
 * @route GET /api/campaigns
 * @group campaigns - Operations about campaigns
 * @returns {object} 200 - An object of campaigns info
 * @returns {Error}  default - Unexpected error
 */
function getAllCampaigns(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      campaignService.getCampaignsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      campaignService.getCampaignsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    campaignService.getAllCampaigns().then((data) => {
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
 * Search campaigns api
 * @route POST /api/campaigns/search
 * @group campaigns - Operations about campaigns
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of campaigns info
 * @returns {Error}  default - Unexpected error
 */
function searchCampaigns(req, res, next) {
  let searchCriteria = req.body;
  campaignService.searchCampaigns(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get todays campaign
 * @route GET /api/campaigns/today
 * @group campaigns - Operations about campaigns
 * @returns {object} 200 - An object of campaigns info
 * @returns {Error}  default - Unexpected error
 */
function getTodayCampaigns(req, res, next) {
  var searchCriteria = {
    pageSize:100000,
    pageNo:1,
    query:{
      
      'fromDate': new Date().toISOString()
    }
  }
  campaignService.searchCampaigns(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

getTodayCampaigns

/**
 * Get campaigns by id api
 * @route GET /api/campaigns/:id
 * @group campaigns - Operations about campaigns
 * @returns {object} 200 - An object of campaigns info
 * @returns {Error}  default - Unexpected error
 */
function getCampaignById(req,res,next) {

  let campaignId = req.params.id;

  console.log("id"+ campaignId);
  var json_format = iValidator.json_schema(schema.getSchema,campaignId,"campaign");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  campaignService.getCampaignById(campaignId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.CAMPAIGN_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add campaigns api
 * @route POST /api/campaigns
 * @group campaigns - Operations about campaigns
 * @param {object} campaign.body.required - campaigns details
 * @returns {object} 200 - An object of campaigns info
 * @returns {Error}  default - Unexpected error
 */
function addCampaign(req,res, next) {
  var campaignData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, campaignData, "campaign");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   campaignService.addCampaign(campaignData).then((data) => {
    res.json(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });

}

/**
 * update campaigns by id api
 * @route PUT /api/campaigns
 * @group campaigns - Operations about campaigns
 * @returns {object} 200 - An object of campaigns info
 * @returns {Error}  default - Unexpected error
 */
function updateCampaign(req,res, next) {
   var campaignData=req.body;
   var id = req.params.id;
   campaignService.getCampaignById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.CAMPAIGN_DOES_NOT_EXIST));
    }else{
      campaignService.updateCampaign(id,campaignData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete campaigns by id api
 * @route DELETE /api/campaigns/:id
 * @group campaigns - Operations about campaigns
 * @returns {object} 200 - An object of campaigns info
 * @returns {Error}  default - Unexpected error
 */
function deleteCampaign(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  campaignService.getCampaignById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.CAMPAIGN_DOES_NOT_EXIST));
    }else{
      campaignService.deleteCampaign(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get campaigns count api
 * @route GET /api/campaigns/count
 * @group campaigns - Operations about campaigns
 * @returns {object} 200 - An object of campaigns info
 * @returns {Error}  default - Unexpected error
 */
function getAllCampaignsCount(req,res,next) {
  campaignService.getAllCampaignsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.CAMPAIGN_DOES_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of campaigns api
 * @route GET /api/campaigns/overview
 * @group campaigns - Operations about campaigns
 * @returns {object} 200 - An object of campaigns info
 * @returns {Error}  default - Unexpected error
 */
function getAllCampaignsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  campaignService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is campaigns exist api
 * @route GET /api/campaigns/exist
 * @group campaigns - Operations about campaigns
 * @param {string} campaignname.query.required - campaigns name
 * @returns {object} 200 - An object of campaigns info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  let campaignId = req.query.campaignId
  console.log("name" + name);
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  campaignService.getCampaignByName(name).then((data) => {
    if (data != undefined && data.length > 0) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

async function campaignProfileCompleted(req, res, next) {
  try{
  var id = req.params.id;
   var data = await campaignService.getCampaignById(id)
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.CAMPAIGN_DOES_NOT_EXIST));
    }else{
    var response = await campaignService.campaignProfileCompleted(id)
    res.send(response);
    }
  }catch(err){reject(err)}
}

async function changeStatus(req, res, next) {
  try{
  var id = req.body.id;
  var status = req.body.newStatus;
   var data = await campaignService.getCampaignById(id)
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.CAMPAIGN_DOES_NOT_EXIST));
    }else{
      if(data.campaignScheduled == true){
    var response = await campaignService.changeStatus(id, status)
    res.json(response); // Use res.json to safely send JSON data
      }
    else{
      return next(errorMethods.sendBadRequest(errorCode.CAMPAIGN_NOT_SCHEDULED));
     }
    }
  }catch(err){reject(err)}
}

module.exports.init = init;