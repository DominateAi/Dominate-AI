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
  productId:{
    type: String,
  },
  priceId:{
    type: String,
  },
  customerId:{
    type: String,
    required: true,
    unique: true,
  },
  workspaceId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  workspaceUrl: {
    type: String,
    required: true,
    unique: true
  },
  billingId: {
    type: String
  },
  subscriptionId:{
    type: String
  },
  planStatus:{
    type: String,
    required: true,
    enum: Object.values(PlanStatus)
  },
  //COMMENTED FOR STRIPE
  // subscriptionType:{
  //   type: String,
  //   required: true,
  //   enum: Object.values(SubscriptionTypes)
  // },
  // billingType: {
  //   type: String,
  //   required: true,
  //   enum: Object.values(BillingTypes)
  // },
  organizationType: {
    type: String,
    required: true,
    enum: Object.values(OrganizationTypes)
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(Status)
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
  //can remove this, but check entire code for reference
  expirationDate: {
    type: Date,
    required: true
  },
  //can remove this, but check entire code for reference
  subscriptionStarted:{
    type: Date,
    required: true
  },
  //can remove this, but check entire code for reference
  nextSubscription:{
    type: Object
  },
  //can remove this, but check entire code for reference
  deactivatedOn:{
    type: Date
  },
  //can remove this, but check entire code for reference
  isRefundRequested:{
    type: Boolean,
    default : false
  },
  defaultUserEmailId: {
    type: String,
    required: true
  },
  features:{
    type: Array,
    required: true
  },
  //can remove this, but check entire code for reference
  billingInfo:{
    type: Object,
    default:{
      cancellation_request :false,
      isOrganisationAtPendingState:false,
      isManualRequestGenerated:false,
      isManualRequestFailed:false
    }
  }
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
  getPaginatedResult: function (query, options) {
    return this.find(query, null, options);
  },
  countDocuments: function (query) {
    return this.count(query);
  }
}

const Organization = mongoose.model('organizations', organizationSchema);

module.exports = Organization;