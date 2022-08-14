const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
const ItemType = require('../../common/constants/ItemType');
var uniqueValidator = require('mongoose-unique-validator');

var modelName = 'Items';

const itemSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
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
    return this.findById(id).populate('participant').populate('organizer').populate('assigned');
  },
  search: function(query) {
    return this.find(query).populate('participant').populate('organizer').populate('assigned');
  },
  searchOne: function(query) {
    return this.findOne(query).populate('participant').populate('organizer').populate('assigned');
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
    return this.find(query, null, options).populate('participant').populate('organizer').populate('assigned');
  },
  countDocuments: function (query) {
    return this.count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    return this.aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  }
}

const Item = mongoose.model(modelName, itemSchema);

module.exports = Item;