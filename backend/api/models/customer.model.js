const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
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
      // index: true,
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
    return this.findById(id);
  },
  search: function(query) {
    return this.find(query);
  },
  searchOne: function(query) {
    return this.findOne(query);
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
    return this.find(query, null, options);
  },
  countDocuments: function (query) {
    return this.count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    return this.aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  },
  getTextSearchResult: function(text){
    return this.find(
      {$text: {$search: text}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}
    );
  },
  createEmptyCollection: function(){
    this.createCollection();
    this.createIndexes();
  },
  getAggregateCount: function(){
    return this.aggregate(query);
  },
  groupByKeyAndCountDocumentsByMonth: function (key, qyear, qstatus) {
    let queryKey = '$' + key;
    return this.aggregate([
      {$project: {year: {$year: queryKey}, month: {$month: queryKey}, createdAt: 1, status:1}},
      {$match: {year:  parseInt(qyear), status: qstatus}},
      {$group: {_id: {$month: queryKey},count: {$sum: 1}}
     }]);
  }
}

const Customer = mongoose.model(modelName, customerSchema);

module.exports = Customer;