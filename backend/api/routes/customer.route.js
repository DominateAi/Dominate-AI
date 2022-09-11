const customerService = require('../services/customer.service');
var schema = require('../schemas/customer.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/customers')
    .get(getAllCustomers)
    .post(addCustomer);
  router.route('/customers/count')
    .get(getAllCustomersCount);
  router.route('/customers/status/:status')
    .get(getAllCustomersByStatus);
  router.route('/customers/search')
    .post(searchCustomers);
  router.route('/customers/overview')
    .get(getAllCustomersOverview);
  router.route('/customers/exist')
    .get(isExist);
  router.route('/customers/search/text')
    .get(textSearch);
  router.route('/customers/:id')
    .get(getCustomerById)
    .delete(deleteCustomer)
    .put(updateCustomer);
}

/**
 * Get all a customers api
 * @route GET /api/customers
 * @group customers - Operations about customers
 * @returns {object} 200 - An object of customers info
 * @returns {Error}  default - Unexpected error
 */
function getAllCustomers(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  var startsWith = req.query.startsWith;
  var assigned = req.query.assigned;
  if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      customerService.getCustomersByPageWithSort(pageNo, pageSize, sortBy, startsWith, assigned).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      customerService.getCustomersByPage(pageNo, pageSize,startsWith, assigned).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else {
    customerService.getAllCustomers(startsWith, assigned).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * Get customers by id api
 * @route GET /api/customers/:id
 * @group customers - Operations about customers
 * @returns {object} 200 - An object of customers info
 * @returns {Error}  default - Unexpected error
 */
function getCustomerById(req, res, next) {

  let customerId = req.params.id;

  var json_format = iValidator.json_schema(schema.getSchema, customerId, "customer");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  customerService.getCustomerById(customerId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.CUSTOMER_NOT_EXIST));
    }
    res.send({ "count": data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add customers api
 * @route POST /api/customers
 * @group customers - Operations about customers
 * @param {object} customersData.body.required - customers details
 * @returns {object} 200 - An object of customers info
 * @returns {Error}  default - Unexpected error
 */
function addCustomer(req, res, next) {
  var customerData = req.body;


  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, customerData, "customer");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  customerService.getCustomerByCustomerName(customerData.name).then((data) => {
    if (data != undefined) {
      return next(errorMethods.sendBadRequest(errorCode.CUSTOMER_ALREADY_EXIST));
    } else {
      customerService.addCustomer(customerData).then((data) => {
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
 * update customers by id api
 * @route PUT /api/customers
 * @group customers - Operations about customers
 * @returns {object} 200 - An object of customers info
 * @returns {Error}  default - Unexpected error
 */
function updateCustomer(req, res, next) {
  var customerData = req.body;
  var id = req.params.id;
  customerService.getCustomerById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.CUSTOMER_NOT_EXIST));
    } else {
      customerService.updateCustomer(id, customerData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * customers by id api
 * @route DELETE /api/customers/:id
 * @group customers - Operations about customers
 * @returns {object} 200 - An object of customers info
 * @returns {Error}  default - Unexpected error
 */
function deleteCustomer(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  customerService.getCustomerById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.CUSTOMER_NOT_EXIST));
    } else {
      customerService.deleteCustomer(delId, data).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get customers count api
 * @route GET /api/customers/count
 * @group customers - Operations about customers
 * @returns {object} 200 - An object of customers info
 * @returns {Error}  default - Unexpected error
 */
function getAllCustomersCount(req, res, next) {
  let key = req.query.key;
  let value = req.query.value;
  var query = {};
  if(key != undefined && value != undefined){
    query[key] = value;
    
    getCountOfCustomer(query, next, res);
  } else if (key != undefined){
    leadService.getAggregateCount(key).then((data)=>{
      if (data == undefined) {
        return next(errorMethods.sendBadRequest(errorCode.CUSTOMER_NOT_EXIST));
      }
      res.send(data);
    }).catch((err)=>{
      next(errorMethods.sendServerError(err));
    });
  }else{
    getCountOfCustomer(query, next, res);
  }  
  /* let filter = req.query.filter;
  var query = {}

  customerService.getAllCustomersCount(query).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.CUSTOMER_NOT_EXIST));
    }
    res.send({ "count": data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  }); */
}

function getCountOfCustomer(query, next, res) {
  customerService.getAllCustomersCount(query).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.CUSTOMER_NOT_EXIST));
    }
    res.send({ "count": data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * get overview of customers api
 * @route GET /api/customers/overview
 * @group customers - Operations about customers
 * @returns {object} 200 - An object of customers info
 * @returns {Error}  default - Unexpected error
 */
function getAllCustomersOverview(req, res, next) {
  
  customerService.getAllCustomersOverview().then((data) => {
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
 * Search customers api
 * @route POST /api/customers/search
 * @group customers - Operations about customers
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of customers info
 * @returns {Error}  default - Unexpected error
 */
function searchCustomers(req, res, next) {
  let searchCriteria = req.body;
  customerService.searchCustomers(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is customers exist api
 * @route GET /api/customers/exist
 * @group customers - Operations about customers
 * @param {string} customername.query.required - customers name
 * @returns {object} 200 - An object of customers info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  customerService.getCustomerByCustomerName(name).then((data) => {
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
 * Search customer api
 * @route GET /api/leads/customer/text
 * @group leads - Operations about customer
 * @returns {object} 200 - An object of customer info
 * @returns {Error}  default - Unexpected error
 */
function textSearch(req, res, next) {
  let text = req.query.text;
  let assigned = req.query.assigned;
  let status = req.query.status;
  customerService.textSearch(text, assigned, status).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get all a customers api
 * @route GET /api/customers/status/:status
 * @group customers - Operations about customers
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getAllCustomersByStatus(req,res, next) {
  logger.info("In get all customers route");
  let status = req.params.status;
  let query = {
    pageNo: 1,
    pageSize: 1000000,
    query: {
      '$and':[{
        'status' : status
      }
    ]
    }
  };
  customerService.searchCustomers(query).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

module.exports.init = init;
