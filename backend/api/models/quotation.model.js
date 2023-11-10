const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
const QuotationType = require('../../common/constants/QuotationType');
var uniqueValidator = require('mongoose-unique-validator');

var modelName = 'Quotations';

const quotationSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  quoteId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name:{
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(QuotationType)
  },
  lead: {
    type: String,
    required: true,
    ref: 'Leads'
  },
  items:[
    {type: Object}
  ],
  additionalInfo:{
    type: Object,
  },
  subTotal:{
    type: Number
  },
  taxes: {
    type: Number
  },
  currency:{
    type: String
  },
  total:{
    type: Number
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

quotationSchema.index({'$**': 'text'});

quotationSchema.plugin(uniqueValidator);

quotationSchema.statics = {


  getById: function(id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findById(id).populate('lead');
  },
  search: function(query) {
    var context = currentContext.getCurrentContext();
    var conn = this.db.useDb(context.workspaceId).model(modelName);
    return conn.find(query).populate('lead');
  },
  searchOne: function(query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOne(query).populate('lead');
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
    return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options).populate('lead');
  },
  countDocuments: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
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
    ).populate('lead');
  }
}

const Quotation = mongoose.model(modelName, quotationSchema);

module.exports = Quotation;