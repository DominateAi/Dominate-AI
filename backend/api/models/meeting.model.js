const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
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
    return this.findById(id).populate('participant').populate('organizer').populate('assigned');
  },
  search: function(query) {
    return this.find(query).populate('participant').populate('assignedPipelead').populate('organizer').populate({ 
      path: 'assigned',
      populate: {
        path: 'account_id',
        model: 'Accounts'
      } 
   })
  },
  searchOne: function(query) {
    return this.findOne(query).populate('participant').populate('organizer').populate('assigned');
  },
  updateById: function(id, updateData) {
    var options = { new: true };
    return this.findOneAndUpdate({ _id: id }, { $set: updateData }, options);
  },
  deletebyId: function(id) {
    return this.findByIdAndDelete(id);
  },
  create: function(data) {
    var entity = new this(data);
    return entity.save();
  },
  getPaginatedResult: function (query, options) {
    return this.find(query, null, options).populate('participant').populate('organizer').populate('assigned');
  },
  countDocuments: function (query) {
    return this.count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    return this.aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  }
}

const Meeting = mongoose.model(modelName, meetingSchema);

module.exports = Meeting;