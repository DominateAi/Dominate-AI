const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
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
    return this.findById(id).populate('organizer');
  },
  search: function(query) {
    return this.find(query).populate('organizer');
  },
  searchOne: function(query) {
    return this.findOne(query).populate('organizer');
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
    return this.find(query, null, options).populate('organizer');
  },
  countDocuments: function (query) {
    return this.count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    return this.aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  },
  groupByKeyAndCountDocumentsWithTimeframe: function (key, startDate, endDate) {
    return this.aggregate([
      { $match: {
              $and:[
                  { createdAt: { $lte: new Date(endDate) } },
                  { createdAt: { $gte: new Date(startDate) } }
              ]
          } },
      { $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  },
  emailCountByAcc: function(accountId){
    return this.aggregate([
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