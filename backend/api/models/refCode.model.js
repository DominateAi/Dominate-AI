const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
var uniqueValidator = require('mongoose-unique-validator');

var modelName = 'RefCodes';

const refCodeSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  userId:{
    type: String,
    required: true,
    ref: 'Users'
  },
  referralCode:{
    type: String,
    required: true,
    unique: true
  },
  URL:{
    type: String,
    required:true
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

refCodeSchema.index({'$**': 'text'});

refCodeSchema.plugin(uniqueValidator);

refCodeSchema.statics = {
  getById: function (id) {
    return this.findById(id);
  },
  search: function (query) {
    return this.find(query);
  },
  searchOne: function (query) {
    return this.findOne(query);
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
    return this.find(query, null, options);
  },
  countDocuments: function (query) {
    return this.count(query);
  }
}

const RefCode = mongoose.model(modelName, refCodeSchema);

module.exports = RefCode;