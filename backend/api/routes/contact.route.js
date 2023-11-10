var currentContext = require('../../common/currentContext');
const contactService = require('../services/contact.service');
var schema = require('../schemas/contact.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');
var Multer = require("multer");
const fs = require('fs');
var csv = require('fast-csv');
var parse = csv.parse;
var stringify = require('csv-stringify');
var streamifier = require('streamifier');
var configResolve = require("../../common/configResolver");
const { CONTACT_EMAIL_ALREADY_EXISTS } = require('../../common/error-code');
var config = configResolve.getConfig();
var limits = {
  files: 10, // allow only 1 file per request
  fileSize: config.max_file_upload_limit * 1024 * 1024, // 1 MB (max file size)
};


 
function init(router) {
  router.route('/contacts')
    .get(getAllContacts)
    .post(addContact);
  router.route('/contacts/search')
    .post(searchContacts);
  router.route('/contacts/export')
    .get(exportContacts);
  router.route('/contacts/count')
    .get(getAllContactsCount);
  router.route('/contacts/overview')
    .get(getAllContactsOverview);
  router.route('/contacts/bulkdelete')
    .post(bulkDelete);
  router.route('/contacts/exist')
    .get(isExist);
  router.route('/contacts/emailExist')
    .get(emailExist);
  router.route('/contacts/:id')
    .get(getContactById)
    .delete(deleteContact)
    .put(updateContact);
  router.post('/contacts/import', Multer({ storage: Multer.memoryStorage(), limits: limits}).single("file"), importContacts);
}

/**
 * Get all a contacts api
 * @route GET /api/contacts
 * @group contacts - Operations about contacts
 * @returns {object} 200 - An object of contacts info
 * @returns {Error}  default - Unexpected error
 */
function getAllContacts(req, res, next) {
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
      contactService.getContactsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      contactService.getContactsByPage(pageNo, pageSize).then((data) => {
        res.send(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  } else {
    contactService.getAllContacts().then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * Get contacts count api
 * @route GET /api/contacts/count
 * @group contacts - Operations about contacts
 * @returns {object} 200 - An object of contacts info
 * @returns {Error}  default - Unexpected error
 */
function getAllContactsCount(req, res, next) {
  //accessResolver.isAuthorized(req);

  contactService.getAllContactsCount().then((data) => {
    res.send({ 'count': data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get contacts by id api
 * @route GET /api/contacts/:id
 * @group contacts - Operations about contacts
 * @returns {object} 200 - An object of contacts info
 * @returns {Error}  default - Unexpected error
 */
function getContactById(req, res, next) {

  let contactId = req.params.id;

  console.log("id" + contactId);
  var json_format = iValidator.json_schema(schema.getSchema, contactId, "contact");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  contactService.getContactById(contactId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.CONTACT_DOES_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * add contacts api
 * @route POST /api/contacts
 * @group contacts - Operations about contacts
 * @param {object} contactData.body.required - contacts details
 * @returns {object} 200 - An object of contacts info
 * @returns {Error}  default - Unexpected error
 */
async function addContact(req, res, next) {
  try{
  var conData = req.body;
  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, conData, "contact");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  if(conData.email == ""){
    var contactData =  await contactService.addContact(conData)
    res.json(contactData);
  }else{
 var data = await contactService.getContactByContactEmail(conData.email)
    if (data) {
      return next(errorMethods.sendBadRequest(errorCode.CONTACT_EMAIL_ALREADY_EXISTS));
    } else {
    var contactData =  await contactService.addContact(conData)
        res.json(contactData);
    }
  }
  }catch(err){ next(errorMethods.sendServerError(err))}

}

/**
 * update contacts by id api
 * @route PUT /api/contacts
 * @group contacts - Operations about contacts
 * @returns {object} 200 - An object of contacts info
 * @returns {Error}  default - Unexpected error
 */
function updateContact(req, res, next) {
  var contactData = req.body;
  var id = req.params.id;
  contactService.getContactById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.CONTACT_DOES_NOT_EXIST));
    } else {
      contactService.updateContact(id, contactData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}


function deleteContact(req, res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  contactService.getContactById(delId).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.CONTACT_DOES_NOT_EXIST));
    } else {
      contactService.deleteContact(delId).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * get overview of contacts api
 * @route GET /api/contacts/overview
 * @group contacts - Operations about contacts
 * @returns {object} 200 - An object of contacts info
 * @returns {Error}  default - Unexpected error
 */
function getAllContactsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  contactService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
 * Search contacts api
 * @route POST /api/contacts/search
 * @group contacts - Operations about contacts
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of contacts info
 * @returns {Error}  default - Unexpected error
 */
function searchContacts(req, res, next) {
  let searchCriteria = req.body;
  contactService.searchContacts(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Is contacts exist api
 * @route GET /api/contacts/exist
 * @group contacts - Operations about contacts
 * @param {string} contactname.query.required - contacts name
 * @returns {object} 200 - An object of contacts info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  console.log("name" + name);
  contactService.getContactByContactName(name).then((data) => {
    if (data != undefined) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function exportContacts(req, res, next) {
  contactService.exportContacts().then((data) => {
   res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function importContacts(inputFile, res, next) {
  try {
  
    let contacts = [];
    streamifier.createReadStream(inputFile.file.buffer.toString())
    .pipe(csv.parse({ headers: true, ignoreEmpty: true }))
    .on('error', error => console.error(error))
    .on('data', function (data) {
          let contact = data;
          contacts.push(contact);
        })
    .on('end', function () {

         contactService.importContacts(contacts).then((data) => {
            res.send(data);
          }).catch((err) => {
                  next(errorMethods.sendServerError(err));
                });
              })
      }
  catch(err){ next(errorMethods.sendServerError(err))}
}

function bulkDelete(req, res, next) {
  let contacts = req.body;
  contactService.bulkDelete(contacts).then((data) => {
   res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function emailExist(req, res, next){
  let email = req.query.email;
  contactService.getContactByContactEmail(email).then((data) => {
    if (data != undefined) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;
