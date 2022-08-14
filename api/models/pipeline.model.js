const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var uniqueValidator = require('mongoose-unique-validator');

var modelName = 'Pipelines';

const pipelineSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  name:{
    type : String,
    required: true
  },
  try:{type:String},

  additionalInfo:{
    type: Object,
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

pipelineSchema.plugin(uniqueValidator);

pipelineSchema.statics = {
  getById: function(id) {
    return this.findById(id)
  },
  search: function(query) {
    return this.find(query)
  },
  searchOne: function(query) {
    return this.findOne(query)
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
  create2: function(data){
    var entity = new this(data);
    return entity.save();
  },
  getPaginatedResult: function (query, options) {
    return this.find(query, null, options);
  },
  countDocuments: function (query) {
    return this.count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    return this.aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  }
}

const Pipeline = mongoose.model(modelName, pipelineSchema);

module.exports = Pipeline;