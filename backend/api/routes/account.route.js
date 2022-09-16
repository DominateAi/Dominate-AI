const accountService = require('../services/account.service');
var schema = require('../schemas/account.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/accounts')
    .get(getAllAccounts)
    .post(addAccount);
  router.route('/accounts/search')
    .post(searchAccounts);
  router.route('/accounts/count')
    .get(getAllAccountsCount);
  router.route('/accounts/overview')
    .get(getAllAccountsOverview);
  router.route('/accounts/exist')
    .get(isExist);
  router.route('/accounts/accwithdeals')
    .get(accWithDeals)
  router.route('/accounts/accrecurdeals')
    .get(accRecurDeals)
  router.route('/accounts/widget')
    .get(widget);
  router.route('/accounts/aldchart')
    .get(aldChart);
  router.route('/accounts/acc-rev-chart')
    .get(accRevChart)
  router.route('/accounts/acc-deal-count')
    .get(accDealCount);
  router.route('/accounts/:id')
    .get(getAccountById)
    .delete(deleteAccount)
    .put(updateAccount);
}

/**
 * Get all a accounts api
 * @route GET /api/accounts
 * @group accounts - Operations about accounts
 * @returns {object} 200 - An object of accounts info
 * @returns {Error}  default - Unexpected error
 */
function getAllAccounts(req, res, next) {
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
      accountService.getAccountsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      accountService.getAccountsByPage(pageNo, pageSize).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else {
    accountService.getAllAccounts().then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * Get accounts count api
 * @route GET /api/accounts/count
 * @group accounts - Operations about accounts
 * @returns {object} 200 - An object of accounts info
 * @returns {Error}  default - Unexpected error
 */
function getAllAccountsCount(req, res, next) {

  accountService.getAllAccountsCount().then((data) => {
    res.send({ 'count': data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get accounts by id api
 * @route GET /api/accounts/:id
 * @group accounts - Operations about accounts
 * @returns {object} 200 - An object of accounts info
 * @returns {Error}  default - Unexpected error
 */
function getAccountById(req, res, next) {

  let accountId = req.params.id;

  console.log("id" + accountId);
  var json_format = iValidator.json_schema(schema.getSchema, accountId, "account");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  accountService.getAccountById(accountId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.ACCOUNT_DOES_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add accounts api
 * @route POST /api/accounts
 * @group accounts - Operations about accounts
 * @param {object} accountData.body.required - accounts details
 * @returns {object} 200 - An object of accounts info
 * @returns {Error}  default - Unexpected error
 */
function addAccount(req, res, next) {
  var accountData = req.body;
 console.log("ASdasd")

  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, accountData, "account");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  accountService.getAccountByAccountName(accountData.name).then((data) => {
    if (data != undefined && data.length > 0) {
      return next(errorMethods.sendBadRequest(errorCode.ACCOUNT_ALREADY_EXISTS));
    } else {
      accountService.addAccount(accountData).then((data) => {
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
 * update accounts by id api
 * @route PUT /api/accounts
 * @group accounts - Operations about accounts
 * @returns {object} 200 - An object of accounts info
 * @returns {Error}  default - Unexpected error
 */
function updateAccount(req, res, next) {
  var accountData = req.body;
  var id = req.params.id;
  accountService.getAccountById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.ACCOUNT_DOES_NOT_EXIST));
    } else {
      accountService.updateAccount(id, accountData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}


function deleteAccount(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  accountService.getAccountById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.ACCOUNT_DOES_NOT_EXIST));
    } else {
      accountService.deleteAccount(delId).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * get overview of accounts api
 * @route GET /api/accounts/overview
 * @group accounts - Operations about accounts
 * @returns {object} 200 - An object of accounts info
 * @returns {Error}  default - Unexpected error
 */
function getAllAccountsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  accountService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
 * Search accounts api
 * @route POST /api/accounts/search
 * @group accounts - Operations about accounts
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of accounts info
 * @returns {Error}  default - Unexpected error
 */
function searchAccounts(req, res, next) {
  let searchCriteria = req.body;
  accountService.searchAccounts(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Is accounts exist api
 * @route GET /api/accounts/exist
 * @group accounts - Operations about accounts
 * @param {string} accountname.query.required - accounts name
 * @returns {object} 200 - An object of accounts info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  accountService.getAccountByAccountName(name).then((data) => {
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
 * gets count of the accounts that have a deal associated with them
 * @route GET /api/accounts/accwithdeals
 * @group accounts - Operations about accounts
 * @param {string} accountname.query.required - accounts name
 * @returns {object} 200 - An object of accounts info
 * @returns {Error}  default - Unexpected error
 */

function accWithDeals(req, res, next) {
  accountService.accWithDeals().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function accRecurDeals(req, res, next) {
  accountService.accRecurDeals().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function widget(req, res, next) {
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  accountService.widget(startDate, endDate).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function aldChart(req, res, next) {
  accountService.aldChart().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function accDealCount(req, res, next) {
  accountService.accDealCount().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function accRevChart(req, res, next) {
  accountService.accRevChart().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;
