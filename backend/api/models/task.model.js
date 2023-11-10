const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
const TaskStatus = require('../../common/constants/TaskStatus');
var uniqueValidator = require('mongoose-unique-validator');

var modelName = 'Tasks';

const taskSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1 },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  fromDate: {
    type: Date
  },
  toDate: {
    type: Date
  },
  completedDate:{
    type: Date
  },
  assignedBy:{
    type:String,
    ref: 'Users'
  },
  /* project: {
    type: String,
    ref: 'Projects' 
  }, */
  status: {
    type: String,
    required: true,
    enum: Object.values(TaskStatus)
  },
  /* milestone: {
    type: String,
    ref: 'Milestones' 
  }, */
  assignee: {
    type: String,
    required: true,
    ref: 'Users',
    index: true
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

taskSchema.plugin(uniqueValidator);

taskSchema.statics = {


  getById: function (id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findById(id).populate('assignee').populate('assignedBy')
    /* .populate({ path: 'milestone'})
    .populate({ path: 'project' , populate: { path: 'members' }}) */;
  },
  search: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).find(query).populate('assignee').populate('assignedBy') 
    /* .populate({ path: 'milestone'})
    .populate({ path: 'project', populate: { path: 'members' }}) */;
  },
  searchOne: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOne(query).populate('assignee').populate('assignedBy')
    /* .populate({ path: 'milestone'})
    .populate({ path: 'project', populate: { path: 'members' }}) */;
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
    return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options).populate('assignee').populate('assignedBy')
    /* .populate({ path: 'milestone'})
    .populate({ path: 'project', populate: { path: 'members' }}) */;
  },
  countDocuments: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).count(query);
  },
  aggregatedDocuments: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate(query);
  },
  groupByKeyAndCountDocumentsByMonth: function (key, qyear, qassigned) {
    var context = currentContext.getCurrentContext();
    let queryKey = '$' + key;
    

    let filter = {year:  parseInt(qyear)};
    if(qassigned != undefined){
      filter['assignee'] = qassigned;
    }
    return this.db.useDb(context.workspaceId).model(modelName)
    .aggregate([
      {$project: {year: {$year: queryKey}, month: {$month: queryKey}, createdAt: 1, assignee: 1, completedDate:1  }},
      {$match: filter},
      {$group: {_id: {$month: queryKey},count: {$sum: 1}}
     }]);
  },
  /*******************************************
   * EDIT BY SHUBHAM - groupByKeyAndCountDocumentsByMonth
   * V2
   *******************************************/
  groupByKeyAndCountDocumentsByMonth_v2: function (key, qyear, qassigned) {
    var context = currentContext.getCurrentContext();
    let queryKey = '$' + key;
    

    let filter = {year:  parseInt(qyear)};
    if(qassigned != undefined){
      filter['assignee'] = qassigned;
    }
    return this.db.useDb(context.workspaceId).model(modelName)
    .aggregate([
      { $match : { completedDate : { $exists : true } } },
      {$project: {year: {$year: queryKey}, month: {$month: queryKey}, createdAt: 1, assignee: 1, completedDate:1  }},
      {$match: filter},
      {$group: {_id: {$month: queryKey},count: {$sum: 1}}
     }]);
  },
}

const Task = mongoose.model(modelName, taskSchema);

module.exports = Task;