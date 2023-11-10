const vaultService = require('../services/vault.service');
var schema = require('../schemas/vault.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/vaults')
    .get(getAllVaults)
    .post(addVault);
  router.route('/vaults/count')
    .get(getAllVaultsCount);
  router.route('/vaults/overview')
    .get(getAllVaultsOverview);
  router.route('/vaults/exist')
    .get(isExist);
  router.route('/vaults/search')
    .post(search);
  router.route('/vaults/:id')
    .get(getVaultById)
    .delete(deleteVault)
    .put(updateVault);
}

/**
 * Get all a vaults api
 * @route GET /api/vaults
 * @group vaults - Operations about vaults
 * @returns {object} 200 - An object of vaults info
 * @returns {Error}  default - Unexpected error
 */
function getAllVaults(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  var entityId = req.query.entityId;
  var entityType = req.query.entityType;
  if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      vaultService.getVaultsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      vaultService.getVaultsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else if (entityId != undefined && entityType != undefined) {
    vaultService.getAllVaults(entityId, entityType).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
  }else{
    next(errorMethods.sendBadRequest("Missing entityId & entityType"));
  }
}

/**
 * Get vaults by id api
 * @route GET /api/vaults/:id
 * @group vaults - Operations about vaults
 * @returns {object} 200 - An object of vaults info
 * @returns {Error}  default - Unexpected error
 */
function getVaultById(req,res,next) {

  let vaultId = req.params.id;

  console.log("id"+ vaultId);
  var json_format = iValidator.json_schema(schema.getSchema,vaultId,"vault");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  vaultService.getVaultById(vaultId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.VAULT_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add vaults api
 * @route POST /api/vaults
 * @group vaults - Operations about vaults
 * @param {object} vaultData.body.required - vaults details
 * @returns {object} 200 - An object of vaults info
 * @returns {Error}  default - Unexpected error
 */
function addVault(req,res, next) {
  var vaultData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, vaultData, "vault");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   vaultService.getVaultByVaultName(vaultData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.VAULT_ALREADY_EXIST));
    }else{
      vaultService.addVault(vaultData).then((data) => {
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
 * update vaults by id api
 * @route PUT /api/vaults
 * @group vaults - Operations about vaults
 * @returns {object} 200 - An object of vaults info
 * @returns {Error}  default - Unexpected error
 */
function updateVault(req,res, next) {
   var vaultData=req.body;
   var id = req.params.id;
   vaultService.getVaultById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.VAULT_NOT_EXIST));
    }else{
      vaultService.updateVault(id,vaultData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete vaults by id api
 * @route DELETE /api/vaults/:id
 * @group vaults - Operations about vaults
 * @returns {object} 200 - An object of vaults info
 * @returns {Error}  default - Unexpected error
 */
function deleteVault(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  vaultService.getVaultById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.VAULT_NOT_EXIST));
    }else{
      vaultService.deleteVault(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get vaults count api
 * @route GET /api/vaults/count
 * @group vaults - Operations about vaults
 * @returns {object} 200 - An object of vaults info
 * @returns {Error}  default - Unexpected error
 */
function getAllVaultsCount(req,res,next) {
  vaultService.getAllVaultsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.VAULT_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get vaults of quotations api
 * @route GET /api/vaults/overview
 * @group vaults - Operations about vaults
 * @returns {object} 200 - An object of vaults info
 * @returns {Error}  default - Unexpected error
 */
function getAllVaultsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  vaultService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is vaults exist api
 * @route GET /api/vaults/exist
 * @group vaults - Operations about vaults
 * @param {string} vaultname.query.required - vaults name
 * @returns {object} 200 - An object of vaults info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  vaultService.getVaultFolderByName(name).then((data) => {
    if (data != undefined && data.length > 0) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
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
 * Search vaults api
 * @route POST /api/vaults/search
 * @group vaults - Operations about vaults
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of vaults info
 * @returns {Error}  default - Unexpected error
 */
function search(req, res, next) {
  let searchCriteria = req.body;
  if(searchCriteria.query.entityId != undefined &&
    searchCriteria.query.entityType != undefined ){
      vaultService.search(searchCriteria).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }else{
      next(errorMethods.sendBadRequest("Missing entityId & entityType"));
    }
  
}

module.exports.init = init;