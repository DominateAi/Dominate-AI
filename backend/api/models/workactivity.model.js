const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
const WorkactivityType = require('../../common/constants/WorkactivityType');
var uniqueValidator = require('mongoose-unique-validator');

var modelName = 'Workactivities';

const workactivitySchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  type:{
    type: String,
    required: true,
    enum: Object.values(WorkactivityType)
  },
  user: {
    type: String,
    required: true,
    ref: 'Users'
  },
  date:{
    type: Date,
    required:true
  },
  description:{
    type: Object,
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

workactivitySchema.index({'$**': 'text'});

workactivitySchema.plugin(uniqueValidator);

workactivitySchema.statics = {
  getById: function(id) {
    return this.findById(id);
  },
  search: function(query) {
    return this.find(query).populate('lead');
  },
  searchOne: function(query) {
    return this.findOne(query);
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
    return this.find(query, null, options);
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
    );
  }
}

const Workactivity = mongoose.model(modelName, workactivitySchema);

module.exports = Workactivity;