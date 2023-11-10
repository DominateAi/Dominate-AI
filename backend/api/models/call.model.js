const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
const CallStatus = require('../../common/constants/CallStatus');
const CallDirection = require('../../common/constants/CallDirection');
var uniqueValidator = require('mongoose-unique-validator');

var modelName = 'Calls';

const callSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  from: {
    type: String,
    required: true,
    index: true
  },
  to: {
    type: String,
    required: true,
    index: true
  },
  callerId:{
    type: String
  },
  callSid: {
    type: String,
    index: true
  },
  startTime:{
    type: String
  },
  endTime:{
    type: String
  },
  callDuration:{
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(CallStatus)
  },
  entityType:{
    type: String
  },
  entityId:{
    type: String
  },
  recordingUrl:{
    type: String
  },
  direction:{
    type: String,
    enum: Object.values(CallDirection)
  },
  createdBy: {
    type: String,
    required: true
  },
  data:{
    type: Object
  },
  lastModifiedBy: {
    type: String,
    required: true
  }
}, { timestamps: true });

callSchema.plugin(uniqueValidator);

callSchema.statics = {


  getById: function(id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findById(id);
  },
  search: function(query) {
    var context = currentContext.getCurrentContext();
    var conn = this.db.useDb(context.workspaceId).model(modelName);
    return conn.find(query);
  },
  searchOne: function(query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOne(query);
  },
  updateById: function(id, updateData) {
    var context = currentContext.getCurrentContext();
    var options = { new: true };
    return this.db.useDb(context.workspaceId).model(modelName).findOneAndUpdate({ _id: id }, { $set: updateData }, options);
  },
  deletebyId: function(id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findByIdAndDelete(id);
  },
  create: function(data) {
    var context = currentContext.getCurrentContext();
    var entityModel = this.db.useDb(context.workspaceId).model(modelName);
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

const Call = mongoose.model(modelName, callSchema);

module.exports = Call;