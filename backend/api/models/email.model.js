const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
const Status = require('../../common/constants/Status');
var uniqueValidator = require('mongoose-unique-validator');
const EntityType = require('../../common/constants/EntityType');
const EmailStatus = require('../../common/constants/EmailStatus');

var modelName = 'Emails';

const emailSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  to: {
    type: String,
    required: true,
    index: true
  },
  subject: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(EmailStatus)
  },
  body: {
    type: String,
  },
  entityType: {
    type: String,
    required: true,
    enum: Object.values(EntityType)
  },
  entityId: {
    type: String,
    required: true
  },
  organizer:{
    type: String,
    ref: 'Users',
    required: true
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

emailSchema.plugin(uniqueValidator);

emailSchema.statics = {


  getById: function(id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findById(id).populate('organizer');
  },
  search: function(query) {
    var context = currentContext.getCurrentContext();
    var conn = this.db.useDb(context.workspaceId).model(modelName);
    return conn.find(query).populate('organizer');
  },
  searchOne: function(query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOne(query).populate('organizer');
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
    return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options).populate('organizer');
  },
  countDocuments: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  },
  groupByKeyAndCountDocumentsWithTimeframe: function (key, startDate, endDate) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName)
    .aggregate([
      { $match: {
              $and:[
                  { createdAt: { $lte: new Date(endDate) } },
                  { createdAt: { $gte: new Date(startDate) } }
              ]
          } },
      { $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  },
  emailCountByAcc: function(accountId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName)
    .aggregate([
      {$lookup:{from: "leads",localField: "entityId",foreignField: "_id",as: "lead_data"}},
      {$unwind:{path:"$lead_data", preserveNullAndEmptyArrays: true}},
      {$lookup:{from: "accounts",
         localField: "lead_data.account_id",
         foreignField: "_id",
         as: "account_data"}},
      {$unwind:{path:"$account_data", preserveNullAndEmptyArrays: true}},
      {$match:{"account_data._id":accountId}},
      {$group:{_id:"",count:{$sum:1}}}
    ])
  }
}

const Email = mongoose.model(modelName, emailSchema);

module.exports = Email;