const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var uniqueValidator = require('mongoose-unique-validator');

var modelName = 'LeadPipelines';

const leadPipelineSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1 },
  leadPipelineName: {
    type: String,
    required: true,
    index: true
  },
  description:{
    type: String,
    required: true
  },
  additionalInfo:{
    type: Object
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

leadPipelineSchema.index({'$**': 'text'});

leadPipelineSchema.plugin(uniqueValidator);

leadPipelineSchema.statics = {
  getById: function (id) {
    return this.findById(id)
  },
  search: function (query) {
    return this.find(query)
  },
  searchOne: function (query) {
    return this.findOne(query)
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
  create2: function (data) {
    var entity = new this(data);
    return entity.save();
  },
  getPaginatedResult: function (query, options) {
    return this.find(query, null, options)
  },
  countDocuments: function (query) {
    return this.count(query);
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
  }
}

const LeadPipeline = mongoose.model(modelName, leadPipelineSchema);

module.exports = LeadPipeline;
