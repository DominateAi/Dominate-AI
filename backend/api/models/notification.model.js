const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
const Status = require('../../common/constants/Status');
var uniqueValidator = require('mongoose-unique-validator');
const NotificationType = require('../../common/constants/NotificationType');

var modelName = 'Notifications';

const notificationSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1 },
  notification: {
    type: Object,
    required: true
  },
  notificationType: {
    type: String,
    required: true,
    enum: Object.values(NotificationType)
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String
  },
  isRead: {
    type: Boolean
  },
}, { timestamps: true });

notificationSchema.plugin(uniqueValidator);

notificationSchema.statics = {


  getById: function (id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findById(id);
  },
  search: function (query) {
    var context = currentContext.getCurrentContext();
    var conn = this.db.useDb(context.workspaceId).model(modelName);
    return conn.find(query);
  },
  searchOne: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOne(query);
  },
  updateById: function (id, updateData) {
    var context = currentContext.getCurrentContext();
    var options = { new: true };
    return this.db.useDb(context.workspaceId).model(modelName).findOneAndUpdate({ _id: id }, { $set: updateData }, options);
  },
  deletebyId: function (id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findByIdAndDelete(id);
  },
  create: function (data, workspaceId) {

    var entityModel = this.db.useDb(workspaceId).model(modelName);
    var entity = new entityModel(data);
    return entity.save();
  },
  getPaginatedResult: function (query, options) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options);
  },
  countDocuments: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  }
}

const notification = mongoose.model(modelName, notificationSchema);

module.exports = notification;