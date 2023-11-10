const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
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
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findById(id).populate({ 
    path: 'cards',populate: {path: 'account',model: 'Accounts'}}).populate({ path: 'cards',
    populate: {path: 'salesperson',model: 'Users'}}).populate({path: 'cards',populate: {
    path: 'lead',model: 'Leads'}});
  },
  search: function(query) {
    var context = currentContext.getCurrentContext();
    var conn = this.db.useDb(context.workspaceId).model(modelName);
    return conn.find(query).populate({ 
      path: 'cards',populate: {path: 'account',model: 'Accounts'}}).populate({ path: 'cards',
      populate: {path: 'salesperson',model: 'Users'}}).populate({path: 'cards',populate: {
      path: 'lead',model: 'Leads'}});
  },
  searchOne: function(query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOne(query).populate({ 
      path: 'cards',populate: {path: 'account',model: 'Accounts'}}).populate({ path: 'cards',
      populate: {path: 'salesperson',model: 'Users'}}).populate({path: 'cards',populate: {
      path: 'lead',model: 'Leads'}});
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
    return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options).populate({ 
      path: 'cards',populate: {path: 'account',model: 'Accounts'}}).populate({ path: 'cards',
      populate: {path: 'salesperson',model: 'Users'}}).populate({path: 'cards',populate: {
      path: 'lead',model: 'Leads'}});
  },
  countDocuments: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  },
  globalAggregate: function( data ) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate( data );
  }
}

const PipelineList = mongoose.model(modelName, pipelineListSchema);

module.exports = PipelineList;