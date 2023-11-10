const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
const EventSource = require('../../common/constants/EventSource');
var uniqueValidator = require('mongoose-unique-validator');

var modelName = 'Events';

const eventSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1 },
  eventId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  eventSource: {
    type: String,
    required: true,
    enum: Object.values(EventSource)
  },
  eventPayload: {
    type: Object,
    required: true,
  }
}, { timestamps: true });

eventSchema.plugin(uniqueValidator);

eventSchema.statics = {


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
  deletebyId: function (id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findByIdAndDelete(id);
  },
  create: function (data) {
    var context = currentContext.getCurrentContext();
    var entityModel = this.db.useDb(context.workspaceId).model(modelName);
    var entity = new entityModel(data);
    return entity.save();
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

const Events = mongoose.model(modelName, eventSchema);

module.exports = Events;