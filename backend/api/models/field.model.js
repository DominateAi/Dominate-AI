const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
const FieldEntity = require('../../common/constants/FieldEntity');
var uniqueValidator = require('mongoose-unique-validator');
const FieldType = require('../../common/constants/FieldType');
const FieldCategory = require('../../common/constants/FieldCategory');

var modelName = 'Fields';

const fieldSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1 },
  name: {
    type: String,
    required: true,
    index: true
  },
  entity: {
    type: String,
    required: true,
    enum: Object.values(FieldEntity)
  },
  type:{
      type: String,
      required: true,
      enum: Object.values(FieldType)
  },
  category:{
      type: String,
      enum: Object.values(FieldCategory)
  },
  options: [
    { type: String }
   ],
    additionalInfo: {
    type: String
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

fieldSchema.index({'$**': 'text'});

fieldSchema.plugin(uniqueValidator);

fieldSchema.statics = {

  getById: function (id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findById(id)
  },
  search: function (query) {
    var context = currentContext.getCurrentContext();
    var conn = this.db.useDb(context.workspaceId).model(modelName);
    return conn.find(query)
  },
  searchOne: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOne(query);
  },
  getPaginatedResult: function (query, options) {
    return this.db.useDb(context.workspaceId).model(modelName).findOne(query)
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
    console.log(data);
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
  }
}

const Field = mongoose.model(modelName, fieldSchema);

module.exports = Field;
