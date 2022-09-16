const dealService = require('../services/deal.service');
var schema = require('../schemas/deal.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/deals')
    .get(getAllDeals)
    .post(addDeal);
  router.route('/deals/search')
    .post(searchDeals);
  router.route('/deals/count')
    .get(getAllDealsCount);
  router.route('/deals/overview')
    .get(getAllDealsOverview);
  router.route('/deals/exist')
    .get(isExist);
  router.route('/deals/matchandadd')
    .get(matchAndAdd);
  router.route('/deals/monthlyrecurdealsrev')
    .get(monthlyRecurDealsRev);  
  router.route('/deals/dealhighrev')
    .get(dealWithHighestRev);
  router.route('/deals/dealsbyacc')
    .get(dealsByAcc);
  router.route('/deals/widget')
    .get(widget);
  router.route('/deals/mondealschart')
    .get(monDealsChart);
  router.route('/deals/:id')
    .get(getDealById)
    .delete(deleteDeal)
    .put(updateDeal);
}

/**
 * Get all a deals api
 * @route GET /api/deals
 * @group deals - Operations about deals
 * @returns {object} 200 - An object of deals info
 * @returns {Error}  default - Unexpected error
 */
function getAllDeals(req, res, next) {
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
      dealService.getDealsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      dealService.getDealsByPage(pageNo, pageSize).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else {
    dealService.getAllDeals().then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * Get deals count api
 * @route GET /api/deals/count
 * @group deals - Operations about deals
 * @returns {object} 200 - An object of deals info
 * @returns {Error}  default - Unexpected error
 */
function getAllDealsCount(req, res, next) {
  //accessResolver.isAuthorized(req);

  dealService.getAllDealsCount().then((data) => {
    res.send({ 'count': data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get deals by id api
 * @route GET /api/deals/:id
 * @group deals - Operations about deals
 * @returns {object} 200 - An object of deals info
 * @returns {Error}  default - Unexpected error
 */
function getDealById(req, res, next) {

  let dealId = req.params.id;

  console.log("id" + dealId);
  var json_format = iValidator.json_schema(schema.getSchema, dealId, "deal");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  dealService.getDealById(dealId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.DEAL_DOES_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add deals api
 * @route POST /api/deals
 * @group deals - Operations about deals
 * @param {object} dealData.body.required - deals details
 * @returns {object} 200 - An object of deals info
 * @returns {Error}  default - Unexpected error
 */
function addDeal(req, res, next) {
  var dealData = req.body;


  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, dealData, "deal");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  dealService.getDealByDealName(dealData.name).then((data) => {
    if (data != undefined && data.length > 0) {
      return next(errorMethods.sendBadRequest(errorCode.DEAL_ALREADY_EXISTS));
    } else {
      dealService.addDeal(dealData).then((data) => {
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
 * update deals by id api
 * @route PUT /api/deals
 * @group deals - Operations about deals
 * @returns {object} 200 - An object of deals info
 * @returns {Error}  default - Unexpected error
 */
function updateDeal(req, res, next) {
  var dealData = req.body;
  var id = req.params.id;
  dealService.getDealById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.DEAL_DOES_NOT_EXIST));
    } else {
      dealService.updateDeal(id, dealData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}


function deleteDeal(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  dealService.getDealById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.DEAL_DOES_NOT_EXIST));
    } else {
      dealService.deleteDeal(delId).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * get overview of deals api
 * @route GET /api/deals/overview
 * @group deals - Operations about deals
 * @returns {object} 200 - An object of deals info
 * @returns {Error}  default - Unexpected error
 */
function getAllDealsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  dealService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
 * Search deals api
 * @route POST /api/deals/search
 * @group deals - Operations about deals
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of deals info
 * @returns {Error}  default - Unexpected error
 */
function searchDeals(req, res, next) {
  let searchCriteria = req.body;
  dealService.searchDeals(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Is deals exist api
 * @route GET /api/deals/exist
 * @group deals - Operations about deals
 * @param {string} dealname.query.required - deals name
 * @returns {object} 200 - An object of deals info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  console.log("name" + name);
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  dealService.getDealByDealName(name).then((data) => {
    if (data != undefined) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * match and add api
 * @route GET /api/deals/matchandadd
 * @group deals - matches for a value and adds them
 * @param {string} dealname.query.required - deals name
 * @returns {object} 200 - An object of deals info
 * @returns {Error}  default - Unexpected error
 */


function matchAndAdd(req, res, next) {
 let add = req.query.add 
 let match = req.query.match
  dealService.matchAndAdd(match, add).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function monthlyRecurDealsRev(req, res, next) {
  let startDate = req.query.startDate 
  let endDate = req.query.endDate
   dealService.monthlyRecurDealsRev(startDate, endDate).then((data) => {
     res.json(data);
   }).catch((err) => {
     next(errorMethods.sendServerError(err));
   });
 }

 function dealWithHighestRev(req, res, next) {
   dealService.dealWithHighestRev().then((data) => {
     res.json(data);
   }).catch((err) => {
     next(errorMethods.sendServerError(err));
   });
 }

 function dealsByAcc(req, res, next) {
   let account = req.query.account;
  dealService.dealsByAcc(account).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function widget(req, res, next) {
 dealService.widget().then((data) => {
   res.json(data);
 }).catch((err) => {
   next(errorMethods.sendServerError(err));
 });
}

function monDealsChart(req, res, next) {
  dealService.monDealsChart().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
 }

module.exports.init = init;
