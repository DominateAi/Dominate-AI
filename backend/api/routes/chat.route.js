const chatService = require('../services/chat.service');
var schema = require('../schemas/chat.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');
const redis = require('redis');
var configResolve = require("../../common/configResolver");
const redisHost = configResolve.getConfig().redisHost;
const client = redis.createClient({ host: 'redis', port: 6379 })


function init(router) {
  router.route('/chats/:id')
    .get(getAllChats);
  router.route(`/chats`)
    .post(addOfflineChat)
    .put(readAllChat)
    .get(getAllUsersChat);
  router.route('/chats/search/text')
    .get(textSearch);
}

async function addOfflineChat( req, res, next ){
  try{
    let body = req.body;
    let create_chat = await chatService.addChat( body, body.workspaceId );
    return res.json("OK");
  } catch ( err ){
    next(errorMethods.sendServerError(err));
  }
}

/**
 * Get all a Chats api
 * @route GET /api/Chats
 * @group Chats - Operations about Chats
 * @returns {object} 200 - An object of Chats info
 * @returns {Error}  default - Unexpected error
 */
function getAllChats(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = "createdAt";
  var toId = req.params.id;
  if (!toId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }

  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }

  chatService.getChatsByPageWithSort(pageNo, pageSize, sortBy, toId).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

async function readAllChat( req, res, next ){
  try{
    let user_id = req.query.id;
    let update_chats = await chatService.readAllChats(user_id);
    return res.json(update_chats)
  } catch ( err ){
    next(errorMethods.sendServerError(err));
  }
}

async function getAllUsersChat( req, res, next ){
  try{
    let all_users = await chatService.getAllUsersForChats();
    return res.json(all_users);
  } catch( err ){
    next(errorMethods.sendServerError(err));
  }
}

/*
text search for chat
*/
function textSearch(req, res, next) {
  let text = req.query.text;
  chatService.textSearch(text).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


module.exports.init = init;
