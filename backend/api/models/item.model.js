const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v1: uuidv1, v4: uuidv4 } = require('uuid');
const ItemType = require('../../common/constants/ItemType');
var currentContext = require('../../common/currentContext');
var uniqueValidator = require('mongoose-unique-validator');

var modelName = 'Items';

const itemSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv1},
  code: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: Object.values(ItemType),
    required: true
  },
  vendor: {
    type: String,
  },
  cost:{
    type: Number,
    required: true
  },
  tax:{
    type: Number
  },
  description:{
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

itemSchema.plugin(uniqueValidator);

itemSchema.statics = {


  getById: function(id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findById(id).populate('participant').populate('organizer').populate('assigned');
  },
  search: function(query) {
    var context = currentContext.getCurrentContext();
    var conn = this.db.useDb(context.workspaceId).model(modelName);
    return conn.find(query).populate('participant').populate('organizer').populate('assigned');
  },
  searchOne: function(query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOne(query).populate('participant').populate('organizer').populate('assigned');
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
    return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options).populate('participant').populate('organizer').populate('assigned');
  },
  countDocuments: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  }
}

const Item = mongoose.model(modelName, itemSchema);

module.exports = Item;