const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
const DealStatus = require('../../common/constants/DealStatus');
var uniqueValidator = require('mongoose-unique-validator');
const DealType = require('../../common/constants/DealType');
const DealFrequency = require('../../common/constants/DealFrequency')


var modelName = 'Deals';

const dealSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1 },
  dealname: {
    type: String,
    required: true,
    index: true
  },
  account: {
    type: String,
    required: true,
    ref: 'Accounts'
  },
  salesperson:{
      type: String,
      ref: 'Users'
  },
  lead:{
      type: String,
      ref: 'Leads'
  },
  type: {
    type: String,
    enum: Object.values(DealType)
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(DealStatus)
  },
  value:{
    type: Number
  },
  frequency:{
      type: String,
      enum: Object.values(DealFrequency)
  },
    reasonForDealcancel:{ 
      type : String 
    },
    tags: [
     { type: String }
    ],
    additionalInfo: {
    type: String
  },
    emoji: {
    type: String
  },
 
  closingDate:{
    type: Date
  },
   startDate:{
    type: Date
  },
   endDate:{
    type: Date
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

dealSchema.index({'$**': 'text'});

dealSchema.plugin(uniqueValidator);

dealSchema.statics = {

  
  getById: function (id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findById(id).populate('account').populate('salesperson').populate('lead')
  },
  search: function (query) {
    var context = currentContext.getCurrentContext();
    var conn = this.db.useDb(context.workspaceId).model(modelName);
    return conn.find(query).populate('account').populate('salesperson').populate('lead')
  },
  searchOne: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOne(query).populate('account').populate('salesperson').populate('lead')
  },
  updateById: function (id, updateData) {
    var context = currentContext.getCurrentContext();
    var options = { new: true };
    return this.db.useDb(context.workspaceId).model(modelName).findOneAndUpdate({ _id: id }, { $set: updateData }, options);
  },
  deletebyId: function (id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findByIdAndDelete(id);
  },
  create: function (data) {
    var context = currentContext.getCurrentContext();
    var entityModel = this.db.useDb(context.workspaceId).model(modelName);
    var entity = new entityModel(data);
    return entity.save();
  },
  getPaginatedResult: function (query, options) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options).populate('account').populate('salesperson').populate('lead')
  },
  countDocuments: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).count(query);
  },
  estimatedDocumentCount: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).estimatedDocumentCount(query);
  },
  getAggregateCount: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    console.log(key);
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  },
  
  createEmptyCollection: function(){
    var context = currentContext.getCurrentContext();
    this.db.useDb(context.workspaceId).model(modelName).createCollection();
    this.db.useDb(context.workspaceId).model(modelName).createIndexes();
  },
  getTextSearchResult: function(text){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).find(
      {$text: {$search: text}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}
    );
  },
  matchAndAdd: function (match, add) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"status":match}},
      {$group:{_id:"",total:{$sum: '$' + add}}}
      ])
  },
  accRecurDeals: function () {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"type":"RECURRING"}},
      {$match:{"status":"CLOSED"}},
      {$group:{_id:"$account"}}
      ])
  },
  dealsByAcc: function(account){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"account":account}},
      {$lookup:{from:"leads",localField:"lead",foreignField:"_id",as:"leadsdata"}},
      {$lookup:{from:"users",localField:"salesperson",foreignField:"_id",as:"salespersonsdata"}}
      ])
  },
  monDealsChart: function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$group:{"_id":{$month:"$closingDate"}, count:{$sum:1}}},{$sort:{"_id":1}}])
  },
  countAcc: function(accountId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"account":accountId}},
      {$group:{_id:"",count:{$sum:1}}},{$project:{"_id":0}}
      ])
  },
  recurValue: function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"status":"CLOSED"}},
      {$match:{"type":"RECURRING"}},
      {$group:{_id:"",value:{$sum:"$value"}}}
      ])
  },
  accDealCount: function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$group:{_id:"$account", count:{$sum:1}}},
      {$lookup:{from: "accounts",localField: "_id",foreignField: "_id",as: "account_data"}},
      {$addFields:{accountData:{ $arrayElemAt: [ "$account_data", 0 ] }}},
      {$addFields:{accountname:"$accountData.accountname"}},
      {$sort:{"count":-1}},{$project:{"accountData":0,"account_data":0,"_id":0}}
      ])
  }
}

const Deal = mongoose.model(modelName, dealSchema);

module.exports = Deal;
