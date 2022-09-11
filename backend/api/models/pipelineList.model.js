const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var uniqueValidator = require('mongoose-unique-validator');
const PipelineListType = require('../../common/constants/PipelineListType');

var modelName = 'PipelineLists';

const pipelineListSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  name: {
    type: String,
    required: true,
    index: true
  },
  pipeline: {
    type: String,
    ref: 'Pipelines',
    required:true
  },
  cards:[{type:String, ref:'Deals'}],
  type:{
    type: String,
    required: true,
    enum: Object.values(PipelineListType)
  },
  additionalInfo:{
    type:Object,
  },
  createdBy:{
    type: String,
    required: true
  },
  lastModifiedBy:{
    type: String,
    required: true
  }
}, { timestamps: true });

pipelineListSchema.plugin(uniqueValidator);

pipelineListSchema.statics = {
  getById: function(id) {
    return this.findById(id).populate({ 
    path: 'cards',populate: {path: 'account',model: 'Accounts'}}).populate({ path: 'cards',
    populate: {path: 'salesperson',model: 'Users'}}).populate({path: 'cards',populate: {
    path: 'lead',model: 'Leads'}});
  },
  search: function(query) {
    return this.find(query).populate({ 
      path: 'cards',populate: {path: 'account',model: 'Accounts'}}).populate({ path: 'cards',
      populate: {path: 'salesperson',model: 'Users'}}).populate({path: 'cards',populate: {
      path: 'lead',model: 'Leads'}});
  },
  searchOne: function(query) {
    return this.findOne(query).populate({ 
      path: 'cards',populate: {path: 'account',model: 'Accounts'}}).populate({ path: 'cards',
      populate: {path: 'salesperson',model: 'Users'}}).populate({path: 'cards',populate: {
      path: 'lead',model: 'Leads'}});
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
    return this.find(query, null, options).populate({ 
      path: 'cards',populate: {path: 'account',model: 'Accounts'}}).populate({ path: 'cards',
      populate: {path: 'salesperson',model: 'Users'}}).populate({path: 'cards',populate: {
      path: 'lead',model: 'Leads'}});
  },
  countDocuments: function (query) {
    return this.count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    return this.aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  },
  globalAggregate: function( data ) {
    return this.aggregate( data );
  }
}

const PipelineList = mongoose.model(modelName, pipelineListSchema);

module.exports = PipelineList;