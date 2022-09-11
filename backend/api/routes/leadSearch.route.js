var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
const moment = require('moment');
const leadSearchService = require('../services/leadSearch.service');


function init(router) {
    router.route('/leadSearch')
        .post(leadSearch);
}


/**
 * Get leads from lead search service 
 * @route GET /api/leadSearch
 * @returns {object} 200 - An object of leads info
 * @returns {Error}  default - Unexpected error
 */
function leadSearch(req, res, next) {
    let requestBody = req.body;
    leadSearchService.leadSearch(requestBody).then((data)=>{
        res.json(data);
    }).catch((err)=>{
        console.log(err);
        next(errorMethods.sendServerError("Error while getting leads"));
    });
    
}

module.exports.init = init;