const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
var uniqueValidator = require('mongoose-unique-validator');
const CustomerStatus = require('./../../common/constants/CustomerStatus');

var modelName = 'Customers';

const customerSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  name: {
      type: String,
      required: true,
      index: true
  },
  company: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
      index: true,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  country: {
    type: String,
  },
  lead:{
    type: String,
    ref: 'Leads'
  },
  status: {
    type: String,
    required: true,
    index: true,
    enum: Object.values(CustomerStatus)
  },
  tags: [{type: String}],
  followups: [{type: Date}],
  shippingAddress: {
    type: Object
  },
  billingAddress: {
    type: Object
  },
  profileImage:{
    type: String
  },
  about: {
    type:String
  },
  createdBy:{
    type: String,
    required: true
  },
  lastModifiedBy:{
    type: String,
    required: true
  },
  media: { type: Object }
}, { timestamps: true });

customerSchema.index({'$**': 'text'});

customerSchema.plugin(uniqueValidator);

customerSchema.statics = {


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
  },
  getTextSearchResult: function(text){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).find(
      {$text: {$search: text}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}
    );
  },
  createEmptyCollection: function(){
    var context = currentContext.getCurrentContext();
    this.db.useDb(context.workspaceId).model(modelName).createCollection();
    this.db.useDb(context.workspaceId).model(modelName).createIndexes();
  },
  getAggregateCount: function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate(query);
  },
  groupByKeyAndCountDocumentsByMonth: function (key, qyear, qstatus) {
    var context = currentContext.getCurrentContext();
    let queryKey = '$' + key;
    return this.db.useDb(context.workspaceId).model(modelName)
    .aggregate([
      {$project: {year: {$year: queryKey}, month: {$month: queryKey}, createdAt: 1, status:1}},
      {$match: {year:  parseInt(qyear), status: qstatus}},
      {$group: {_id: {$month: queryKey},count: {$sum: 1}}
     }]);
  }
}

const Customer = mongoose.model(modelName, customerSchema);

module.exports = Customer;