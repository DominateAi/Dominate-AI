const notificationService = require('../services/notification.service');
var schema = require('../schemas/notification.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/notifications')
    .get(getAllNotifications)
  router.route('/notifications/:id/read')
    .put(updateNotificationRead)
}

/**
 * Get all a Notifications api
 * @route GET /api/Notifications
 * @group Notifications - Operations about Notifications
 * @returns {object} 200 - An object of Notifications info
 * @returns {Error}  default - Unexpected error
 */
function getAllNotifications(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = "createdAt";

  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }

  notificationService.getNotificationsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * update notes by id api
 * @route PUT /api/notification/:id
 * @group notes - Operations about notification
 * @returns {object} 200 - An object of notification info
 * @returns {Error}  default - Unexpected error
 */
function updateNotificationRead(req, res, next) {
  var id = req.params.id;
  notificationService.getNotificationById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.NOTIFICATION_NOT_EXIST));
    } else {
      data.isRead = true;
      notificationService.updateNotification(id, data).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

module.exports.init = init;