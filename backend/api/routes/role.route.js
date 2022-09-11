const roleService = require('../services/role.service');
var schema = require('../schemas/role.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
    router.route('/roles')
        .get(getAllRoles)
        .post(addRole);
    router.route('/roles/search')
        .post(searchRoles);
    router.route('/roles/:id')
        .get(getRoleById)
        .delete(deleteRole)
        .put(updateRole); 
}

/**
 * Get all a roles api
 * @route GET /api/roles
 * @group roles - Operations about roles
 * @returns {object} 200 - An object of roles info
 * @returns {Error}  default - Unexpected error
 */
function getAllRoles(req,res, next) {
  //accessResolver.isAuthorized(req);
  roleService.getAllRoles().then((data) => {
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
 * Search roles api
 * @route POST /api/roles/search
 * @group roles - Operations about roles
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of roles info
 * @returns {Error}  default - Unexpected error
 */
function searchRoles(req, res, next) {
  let searchCriteria = req.body;
  roleService.searchRoles(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get roles by id api
 * @route GET /api/roles/:id
 * @group roles - Operations about roles
 * @returns {object} 200 - An object of roles info
 * @returns {Error}  default - Unexpected error
 */
function getRoleById(req,res,next) {

  let roleId = req.params.id;

  console.log("id"+ roleId);
  var json_format = iValidator.json_schema(schema.getSchema,roleId,"role");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  roleService.getRoleById(roleId).then((data) => {
      if(data == null || data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.ROLE_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add roles api
 * @route POST /api/roles
 * @group roles - Operations about roles
 * @param {object} roleData.body.required - roles details
 * @returns {object} 200 - An object of roles info
 * @returns {Error}  default - Unexpected error
 */
function addRole(req,res, next) {
  var roleData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, roleData, "role");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   roleService.getRoleByRoleName(roleData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.ROLE_ALREADY_EXIST));
    }else{
      roleService.addRole(roleData).then((data) => {
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
 * update roles by id api
 * @route PUT /api/roles
 * @group roles - Operations about roles
 * @returns {object} 200 - An object of roles info
 * @returns {Error}  default - Unexpected error
 */
function updateRole(req,res, next) {
   var roleData=req.body;
   var id = req.params.id;
   roleService.getRoleById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.ROLE_NOT_EXIST));
    }else{
      roleService.updateRole(id,roleData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
  
}

/**
 * delete roles by id api
 * @route DELETE /api/roles/:id
 * @group roles - Operations about roles
 * @returns {object} 200 - An object of roles info
 * @returns {Error}  default - Unexpected error
 */
function deleteRole(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  roleService.getRoleById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.ROLE_NOT_EXIST));
    }else{
      roleService.deleteRole(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
  
}


module.exports.init = init;
