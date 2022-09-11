const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
const Status = require('../../common/constants/Status');
var uniqueValidator = require('mongoose-unique-validator');

var modelName = 'Dashboards';

const dashboardSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  name: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  user: {
    type: String,
    ref: 'Users',
    required: true
  },
  widgets: [{
    type: String,
    ref: 'Widgets',
    required: true
  }],
  status: {
    type: String,
    required: true,
    enum: Object.values(Status)
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

dashboardSchema.plugin(uniqueValidator);

dashboardSchema.statics = {


  getById: function(id) {
    return this.findById(id).populate('user').populate('widgets');
  },
  search: function(query) {
    return this.find(query).populate('user').populate('widgets');
  },
  searchOne: function(query) {
    return this.findOne(query).populate('user').populate('widgets');
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
    return this.find(query, null, options).populate('user').populate('widgets');
  },
  countDocuments: function (query) {
    return this.count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    return this.aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  }
}

const Dashboard = mongoose.model(modelName, dashboardSchema);

module.exports = Dashboard;