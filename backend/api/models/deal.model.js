const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
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
    return this.findById(id).populate('account').populate('salesperson').populate('lead')
  },
  search: function (query) {
    return this.find(query).populate('account').populate('salesperson').populate('lead')
  },
  searchOne: function (query) {
    return this.findOne(query).populate('account').populate('salesperson').populate('lead')
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
    return this.find(query, null, options).populate('account').populate('salesperson').populate('lead')
  },
  countDocuments: function (query) {
    return this.count(query);
  },
  estimatedDocumentCount: function (query) {
    return this.estimatedDocumentCount(query);
  },
  getAggregateCount: function (query) {
    return this.aggregate(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    return this.aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  },
  createEmptyCollection: function(){
    this.createCollection();
    this.createIndexes();
  },
  getTextSearchResult: function(text){
    return this.find(
      {$text: {$search: text}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}
    );
  },
  matchAndAdd: function (match, add) {
    return this.aggregate([
      {$match:{"status":match}},
      {$group:{_id:"",total:{$sum: '$' + add}}}
      ])
  },
  accRecurDeals: function () {
    return this.aggregate([
      {$match:{"type":"RECURRING"}},
      {$match:{"status":"CLOSED"}},
      {$group:{_id:"$account"}}
      ])
  },
  dealsByAcc: function(account){
    return this.aggregate([
      {$match:{"account":account}},
      {$lookup:{from:"leads",localField:"lead",foreignField:"_id",as:"leadsdata"}},
      {$lookup:{from:"users",localField:"salesperson",foreignField:"_id",as:"salespersonsdata"}}
      ])
  },
  monDealsChart: function(){
    return this.aggregate([
      {$group:{"_id":{$month:"$closingDate"}, count:{$sum:1}}},{$sort:{"_id":1}}])
  },
  countAcc: function(accountId){
    return this.aggregate([
      {$match:{"account":accountId}},
      {$group:{_id:"",count:{$sum:1}}},{$project:{"_id":0}}
      ])
  },
  recurValue: function(){
    return this.aggregate([
      {$match:{"status":"CLOSED"}},
      {$match:{"type":"RECURRING"}},
      {$group:{_id:"",value:{$sum:"$value"}}}
      ])
  },
  accDealCount: function(){
    return this.aggregate([
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
