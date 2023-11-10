const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
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
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findById(id).populate('user');
  },
  search: function (query) {
    var context = currentContext.getCurrentContext();
    var conn = this.db.useDb(context.workspaceId).model(modelName);
    return conn.find(query).populate({ 
      path: 'user',
      populate: {
        path: 'role',
        model: 'Roles'
      } 
   });
  },
  searchOne: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOne(query).populate('user');
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
    var context = currentContext.getCurrentContext();
    var entityModel = this.db.useDb(context.workspaceId).model(modelName);
    var entity = new entityModel(data);
    return entity.save();
  },
  getPaginatedResult: function (query, options) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options).populate('user');
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

const Leave = mongoose.model(modelName, leaveSchema);

module.exports = Leave;