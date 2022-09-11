const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
const BillingTypes = require('../../common/constants/BillingTypes');
const SubscriptionTypes = require('../../common/constants/SubscriptionTypes');
const OrganizationTypes = require('../../common/constants/OrganizationTypes');
const PlanStatus = require('../../common/constants/PlanStatus');
const Status = require('../../common/constants/Status');

const organizationSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1 },
  organizationName: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  lastModifiedBy: {
    type: String,
    required: true
  },
  logo: {
    type: String
  },
  address:{
    type: Object
  },
  defaultUserEmailId: {
    type: String,
    required: true
  },
}, { timestamps: true });

organizationSchema.statics = {

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
  createEmptyCollection: function(){
    this.createCollection();
    this.createIndexes();
  },
  getPaginatedResult: function (query, options) {
    return this.find(query, null, options);
  },
  countDocuments: function (query) {
    return this.count(query);
  }
}

const Organization = mongoose.model('organizations', organizationSchema);

module.exports = Organization;