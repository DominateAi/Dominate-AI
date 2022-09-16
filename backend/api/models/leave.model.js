const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
const LeaveType = require('../../common/constants/LeaveType');
const LeaveStatus = require('../../common/constants/LeaveStatus');
var uniqueValidator = require('mongoose-unique-validator');

var modelName = 'Leaves';

const leaveSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1 },
  leaveType: {
    type: String,
    required: true,
    enum: Object.values(LeaveType)
  },
  leaveStatus: {
    type: String,
    required: true,
    enum: Object.values(LeaveStatus)
  },
  fromDate: {
    type: Date,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String
  },
  user:{
    type: String,
    ref: 'Users',
    required: true
  },
  hidden:{
    type: Boolean,
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

leaveSchema.plugin(uniqueValidator);

leaveSchema.statics = {

  getById: function (id) {
    return this.findById(id).populate('user');
  },
  search: function (query) {
    return this.find(query).populate({ 
      path: 'user',
      populate: {
        path: 'role',
        model: 'Roles'
      } 
   });
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

const Leave = mongoose.model(modelName, leaveSchema);

module.exports = Leave;