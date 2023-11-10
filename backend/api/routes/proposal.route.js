const proposalService = require('../services/proposal.service');
var schema = require('../schemas/proposal.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');
var ProposalType = require("../../common/constants/ProposalType");


function init(router) {
  router.route('/proposals')
    .get(getAllProposals)
    .post(addProposal);
  router.route('/proposals/count')
    .get(getAllProposalsCount);
  router.route('/proposals/search')
    .post(searchProposals);
  router.route('/proposals/overview')
    .get(getAllProposalsOverview);
  router.route('/proposals/:id')
    .get(getProposalById)
    .delete(deleteProposal)
    .put(updateProposal);
}

/**
 * Get all a proposals api
 * @route GET /api/proposals
 * @group proposals - Operations about proposals
 * @returns {object} 200 - An object of proposals info
 * @returns {Error}  default - Unexpected error
 */
function getAllProposals(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }
  else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      proposalService.getProposalsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      proposalService.getProposalsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    proposalService.getAllProposals().then((data) => {
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
 * Search proposals api
 * @route POST /api/proposals/search
 * @group proposals - Operations about proposals
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of proposals info
 * @returns {Error}  default - Unexpected error
 */
function searchProposals(req, res, next) {
  let searchCriteria = req.body;
  proposalService.searchProposals(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get proposals by id api
 * @route GET /api/proposals/:id
 * @group proposals - Operations about proposals
 * @returns {object} 200 - An object of proposals info
 * @returns {Error}  default - Unexpected error
 */
function getProposalById(req,res,next) {

  let proposalId = req.params.id;

  console.log("id"+ proposalId);
  var json_format = iValidator.json_schema(schema.getSchema,proposalId,"proposal");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  proposalService.getProposalById(proposalId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.PROPOSAL_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add proposals api
 * @route POST /api/proposals
 * @group proposals - Operations about proposals
 * @param {object} proposalData.body.required - proposals details
 * @returns {object} 200 - An object of proposals info
 * @returns {Error}  default - Unexpected error
 */
function addProposal(req,res, next) {
  var proposalData=req.body;
  const token = req.headers['authorization'].split(' ')[1];
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, proposalData, "proposal");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   proposalService.getProposalByProposalName(proposalData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.PROPOSAL_ALREADY_EXIST));
    }else{
      if(proposalData.status == ProposalType.SENT && proposalData.attachment == undefined){
        return next(errorMethods.sendBadRequest(errorCode.INVALID_DATA));
      }
      proposalService.addProposal(proposalData, token ).then((data) => {
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
 * update proposals by id api
 * @route PUT /api/proposals
 * @group proposals - Operations about proposals
 * @returns {object} 200 - An object of proposals info
 * @returns {Error}  default - Unexpected error
 */
function updateProposal(req,res, next) {
   var proposalData=req.body;
   var id = req.params.id;
   proposalService.getProposalById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.PROPOSAL_NOT_EXIST));
    }else{
      proposalService.updateProposal(id,proposalData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete proposals by id api
 * @route DELETE /api/proposals/:id
 * @group proposals - Operations about proposals
 * @returns {object} 200 - An object of proposals info
 * @returns {Error}  default - Unexpected error
 */
function deleteProposal(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  proposalService.getProposalById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.PROPOSAL_NOT_EXIST));
    }else{
      proposalService.deleteProposal(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get proposals count api
 * @route GET /api/proposals/count
 * @group proposals - Operations about proposals
 * @returns {object} 200 - An object of proposals info
 * @returns {Error}  default - Unexpected error
 */
function getAllProposalsCount(req,res,next) {
  proposalService.getAllProposalsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.PROPOSAL_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of proposals api
 * @route GET /api/proposals/overview
 * @group proposals - Operations about proposals
 * @returns {object} 200 - An object of proposals info
 * @returns {Error}  default - Unexpected error
 */
function getAllProposalsOverview(req, res, next) {
  proposalService.getAllProposalOverview().then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;