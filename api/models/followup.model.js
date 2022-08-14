const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
const FollowupStatus = require('../../common/constants/FollowupStatus');
const Ftype = require('../../common/constants/FollowupType');
var uniqueValidator = require('mongoose-unique-validator');
const EntityType = require('../../common/constants/EntityType');

var modelName = 'Followups';

const followupSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  name: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(FollowupStatus)
  },
  type:{
    type: String,
    enum: Object.values(Ftype)
  },
  entityType:{
    type: String,
    enum: Object.values(EntityType)
  },
  entityId:{
    type: String,
    ref: 'Leads',
    required: true
  },
  followupAtDate: {
    type: Date,
    required: true
  },
  followupAtTime: {
    type: Date,
    required: true
  },
  assigned: {
    type: String,
    ref: 'Leads',
    required:true
  },
  assignedPipelead:{
    type: String,
    ref: 'PipeLeads',
    required:true
  },
  organizer:{
    type: String,
    ref: 'Users',
    required: true
  },
  notification: {
    type: Boolean
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

followupSchema.plugin(uniqueValidator);

followupSchema.statics = {
  getById: function(id) {
    return this.findById(id).populate('assigned').populate('organizer');
  },
  search: function(query) {
    return this.find(query).populate({ 
      path: 'assigned',
      populate: {
        path: 'account_id',
        model: 'Accounts'
      } 
   }).populate('organizer').populate('assignedPipelead');
  },
  searchOne: function(query) {
    return this.findOne(query).populate('assigned').populate('organizer');
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
    return this.find(query, null, options).populate('assigned').populate('organizer');
  },
  countDocuments: function (query) {
    return this.count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    return this.aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  },
  followUpByAccount: function(accountId){
    return this.aggregate([
      {$match:{"followupAtDate":{$gt: new Date()}}},
      {$lookup:{from: "leads",localField: "entityId",foreignField: "_id",as: "lead_data"}},
      {$unwind:{path:"$lead_data", preserveNullAndEmptyArrays: true}},
      {$lookup:{from: "accounts",localField: "lead_data.account_id",foreignField: "_id",as: "account_data"}},
      {$unwind:{path:"$account_data", preserveNullAndEmptyArrays: true}},
      {$match:{"account_data._id":accountId}}, {$project:{"account_data":0,"createdAt":0,"updatedAt":0,"createdBy":0,"lastModifiedBy":0}},
      {$lookup:{from: "users",localField: "organizer",foreignField: "_id",as: "user_data"}},
      {$unwind:{path:"$user_data", preserveNullAndEmptyArrays: true}}
    ])
  },
  previousFollowUpsInAccount: function(accountId){
    return this.aggregate([
      {$match:{"followupAtTime":{$lt: new Date()}}},
      {$lookup:{from: "leads",localField: "entityId",foreignField: "_id",as: "lead_data"}},
      {$unwind:{path:"$lead_data", preserveNullAndEmptyArrays: true}},
      {$lookup:{from: "accounts",
         localField: "lead_data.account_id",
         foreignField: "_id",
         as: "account_data"
    }},
      {$unwind:{path:"$account_data", preserveNullAndEmptyArrays: true}},
      {$match:{"account_data._id":accountId}},
      {$project:{"lead_data":0, "account_data":0,"createdAt":0,"updatedAt":0,"createdBy":0,"lastModifiedBy":0}} 
    ])
  },
  latestFollowUp: function(accountId){
    return this.aggregate([
      {$match:{"followupAtTime":{$lt: new Date()}}},
      {$lookup:{from: "leads",localField: "entityId",foreignField: "_id",as: "lead_data"}},
      {$unwind:{path:"$lead_data", preserveNullAndEmptyArrays: true}},
      {$lookup:{from: "accounts", localField: "lead_data.account_id", foreignField: "_id", as: "account_data"}},
      {$unwind:{path:"$account_data", preserveNullAndEmptyArrays: true}},
      {$match:{"account_data._id":accountId}}, {$sort:{"followupAtTime":-1}},
      {$project:{"followupAtTime":1}}
    ])
  }
}

const Followup = mongoose.model(modelName, followupSchema);

module.exports = Followup;