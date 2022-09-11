const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var uniqueValidator = require('mongoose-unique-validator');

var modelName = 'Activities';

const activitySchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuid.v1
  },
  entityType: {
    type: String,

    required: true
  },
  entityId: {
    type: String,
    required: true
  },
  activityType:{
    type: String
  },
  data: {
    type: Object,
    required: true
  },
  user:{
    type: String,
    ref: 'Users',
    required: true
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

activitySchema.plugin(uniqueValidator);

activitySchema.statics = {
  getById: function (id) {
    return this.findById(id).populate('user');
  },
  search: function (query) {
    return this.find(query).populate('user');
  },
  searchOne: function (query) {
    return this.findOne(query).populate('user');
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
    return this.find(query, null, options).populate('user');
  },
  countDocuments: function (query) {
    return this.count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    return this.aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  }
}

const Activity = mongoose.model(modelName, activitySchema);

module.exports = Activity;