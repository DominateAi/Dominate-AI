const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
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
    return this.findById(id).populate('lead');
  },
  search: function(query) {
    return this.find(query).populate('lead');
  },
  searchOne: function(query) {
    return this.findOne(query).populate('lead');
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
    return this.find(query, null, options).populate('lead');
  },
  countDocuments: function (query) {
    return this.count(query);
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
    ).populate('lead');
  }
}

const Quotation = mongoose.model(modelName, quotationSchema);

module.exports = Quotation;