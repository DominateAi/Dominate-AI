const achievementService = require('../services/achievement.service');
var schema = require('../schemas/achievement.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/achievements')
    .get(getAllAchievements)
    .post(addAchievement);
  router.route('/achievements/search')
    .post(searchAchievements);
  router.route('/achievements/count')
    .get(getAllAchievementsCount);
  router.route('/achievements/overview')
    .get(getAllAchievementsOverview);
  router.route('/achievements/exist')
    .get(isExist);
  router.route('/achievements/match')
    .get(match);
  router.route('/achievements/:id')
    .get(getAchievementById)
    .delete(deleteAchievement)
    .put(updateAchievement);
}

/**
 * Get all a achievements api
 * @route GET /api/achievements
 * @group achievements - Operations about achievements
 * @returns {object} 200 - An object of achievements info
 * @returns {Error}  default - Unexpected error
 */
function getAllAchievements(req, res, next) {
  //accessResolver.isAuthorized(req);
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }
  else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      achievementService.getAchievementsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      achievementService.getAchievementsByPage(pageNo, pageSize).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else {
    achievementService.getAllAchievements().then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * Get achievements count api
 * @route GET /api/achievements/count
 * @group achievements - Operations about achievements
 * @returns {object} 200 - An object of achievements info
 * @returns {Error}  default - Unexpected error
 */
function getAllAchievementsCount(req, res, next) {
  //accessResolver.isAuthorized(req);

  achievementService.getAllAchievementsCount().then((data) => {
    res.send({ 'count': data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get achievements by id api
 * @route GET /api/achievements/:id
 * @group achievements - Operations about achievements
 * @returns {object} 200 - An object of achievements info
 * @returns {Error}  default - Unexpected error
 */
function getAchievementById(req, res, next) {

  let achievementId = req.params.id;

  console.log("id" + achievementId);
  var json_format = iValidator.json_schema(schema.getSchema, achievementId, "achievement");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  achievementService.getAchievementById(achievementId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.ACHIEVEMENT_DOES_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add achievements api
 * @route POST /api/achievements
 * @group achievements - Operations about achievements
 * @param {object} achievementData.body.required - achievements details
 * @returns {object} 200 - An object of achievements info
 * @returns {Error}  default - Unexpected error
 */
function addAchievement(req, res, next) {
  var achievementData = req.body;


  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, achievementData, "achievement");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  achievementService.getAchievementByAchievementName(achievementData.name).then((data) => {
    if (data != undefined && data.length > 0) {
      return next(errorMethods.sendBadRequest(errorCode.ACHIEVEMENT_ALREADY_EXISTS));
    } else {
      achievementService.addAchievement(achievementData).then((data) => {
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
 * update achievements by id api
 * @route PUT /api/achievements
 * @group achievements - Operations about achievements
 * @returns {object} 200 - An object of achievements info
 * @returns {Error}  default - Unexpected error
 */
function updateAchievement(req, res, next) {
  var achievementData = req.body;
  var id = req.params.id;
  achievementService.getAchievementById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.ACHIEVEMENT_DOES_NOT_EXIST));
    } else {
      achievementService.updateAchievement(id, achievementData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}


function deleteAchievement(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  achievementService.getAchievementById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.ACHIEVEMENT_DOES_NOT_EXIST));
    } else {
      achievementService.deleteAchievement(delId).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * get overview of achievements api
 * @route GET /api/achievements/overview
 * @group achievements - Operations about achievements
 * @returns {object} 200 - An object of achievements info
 * @returns {Error}  default - Unexpected error
 */
function getAllAchievementsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  achievementService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
 * Search achievements api
 * @route POST /api/achievements/search
 * @group achievements - Operations about achievements
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of achievements info
 * @returns {Error}  default - Unexpected error
 */
function searchAchievements(req, res, next) {
  let searchCriteria = req.body;
  achievementService.searchAchievements(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Is achievements exist api
 * @route GET /api/achievements/exist
 * @group achievements - Operations about achievements
 * @param {string} achievementname.query.required - achievements name
 * @returns {object} 200 - An object of achievements info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let Id = req.query.id;
  
//   var json_format = iValidator.json_schema(schema.existSchema, name, "name");
//   if (json_format.valid == false) {
//     return res.status(422).send(json_format.errorMessage);
//   }
  achievementService.getAchievementByAchievementName(Id).then((data) => {
    if (data != undefined) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function match(req, res, next){
  let lead = req.query.lead;
  let type = req.query.type;
  
  achievementService.match(lead, type).then((data) => {
    console.log(data);
    if (Array.isArray(data) && data.length) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


module.exports.init = init;
