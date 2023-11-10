const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
var uniqueValidator = require('mongoose-unique-validator');
const ReferralStatus = require('../../common/constants/ReferralStatus');
const BillingTypes = require('../../common/constants/BillingTypes');

var modelName = 'Referrals';

const referralSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  refCodeId:{
    type: String,
    //required: true,
    ref:'RefCodes'
  },
  fromID:{
    type: String,
    //required:true,
    ref: 'Users'
  },
  toID:{
    type: String,
    required:true,
    unique: true
  },
  toWorkspaceID:{
    type: String,
    required: true
  },
  toEmail:{
    type: String,
    required: true
  },
  referralCode:{
    type: String,
    required: true
  },
  signedUpOn:{
    type: Date,
    required: true
  },
  status:{
    type: String,
    required: true,
    enum: Object.values(ReferralStatus)
  },
  paidOn:{
    type: Date
  },
  planPurchased:{
    type: String,
    enum: Object.values(BillingTypes)
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

referralSchema.index({'$**': 'text'});

referralSchema.plugin(uniqueValidator);

referralSchema.statics = {
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
  create: function (data) {
    var entity = new this(data);
    return entity.save();
  },
  getPaginatedResult: function (query, options) {
    return this.find(query, null, options)
  },
  countDocuments: function (query) {
    return this.count(query);
  }
}

const Referral = mongoose.model(modelName, referralSchema);

module.exports = Referral;