const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
var uniqueValidator = require('mongoose-unique-validator');
const FollowupStatus = require('../../common/constants/FollowupStatus');
var modelName = 'Meetings';

const meetingSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  subject: {
    type: String,
    required: true,
    index: true
  },
  location: {
    type: String,
    index: true
  },
  meetingDate: {
    type: Date,
    required: true
  },
  meetingTime: {
    type: Date,
    required: true
  },
  meetingEndTime:{
    type: Date
  },
  assigned:{
    type: String,
    ref: 'Leads',
    required: true
  },
  assignedPipelead:{
    type: String,
    ref: 'PipeLeads',
    required: true
  },
  organizer:{
    type: String,
    ref: 'Users'
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(FollowupStatus)
  },
  createdBy: {
    type: String,
    required: true
  },
  lastModifiedBy: {
    type: String,
    required: true
  }
}, { timestamps: true });

meetingSchema.plugin(uniqueValidator);

meetingSchema.statics = {


  getById: function(id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findById(id).populate('participant').populate('organizer').populate('assigned');
  },
  search: function(query) {
    var context = currentContext.getCurrentContext();
    var conn = this.db.useDb(context.workspaceId).model(modelName);
    return conn.find(query).populate('participant').populate('assignedPipelead').populate('organizer').populate({ 
      path: 'assigned',
      populate: {
        path: 'account_id',
        model: 'Accounts'
      } 
   })
  },
  searchOne: function(query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOne(query).populate('participant').populate('organizer').populate('assigned');
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
    return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options).populate('participant').populate('organizer').populate('assigned');
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

const Meeting = mongoose.model(modelName, meetingSchema);

module.exports = Meeting;