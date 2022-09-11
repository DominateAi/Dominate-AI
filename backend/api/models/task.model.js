const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
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
    return this.findById(id).populate('assignee').populate('assignedBy')
  },
  search: function (query) {
    return this.find(query).populate('assignee').populate('assignedBy') 
  },
  searchOne: function (query) {
    return this.findOne(query).populate('assignee').populate('assignedBy')
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
    return this.find(query, null, options).populate('assignee').populate('assignedBy')
  },
  countDocuments: function (query) {
    return this.count(query);
  },
  aggregatedDocuments: function (query) {
    return this.aggregate(query);
  },
  groupByKeyAndCountDocumentsByMonth: function (key, qyear, qassigned) {
    let queryKey = '$' + key;
    

    let filter = {year:  parseInt(qyear)};
    if(qassigned != undefined){
      filter['assignee'] = qassigned;
    }
    return thisaggregate([
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
    let queryKey = '$' + key;
    let filter = {year:  parseInt(qyear)};
    if(qassigned != undefined){
      filter['assignee'] = qassigned;
    }
    return this.aggregate([
      { $match : { completedDate : { $exists : true } } },
      {$project: {year: {$year: queryKey}, month: {$month: queryKey}, createdAt: 1, assignee: 1, completedDate:1  }},
      {$match: filter},
      {$group: {_id: {$month: queryKey},count: {$sum: 1}}
     }]);
  },
}

const Task = mongoose.model(modelName, taskSchema);

module.exports = Task;