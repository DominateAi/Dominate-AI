const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
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
    return this.findById(id);
  },
  search: function (query) {
    return this.find(query);
  },
  searchOne: function (query) {
    return this.findOne(query);
  },
  updateById: function (id, updateData) {
    var options = { new: true };
    return this.findOneAndUpdate({ _id: id }, { $set: updateData }, options);
  },
  deletebyId: function (id) {
    return this.findByIdAndDelete(id);
  },
  create: function (data, workspaceId) {
    var entity = new this(data);
    return entity.save();
  },
  getPaginatedResult: function (query, options) {
    return this.find(query, null, options);
  },
  countDocuments: function (query) {
    return this.count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    return this.aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  }
}

const notification = mongoose.model(modelName, notificationSchema);

module.exports = notification;