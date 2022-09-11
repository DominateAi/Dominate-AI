const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var uniqueValidator = require('mongoose-unique-validator');
const LeadStatus = require('../../common/constants/LeadStatus');

var modelName = 'Achievements';

const achievementSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  user: {
    type: String,
    ref: 'Users',
   required: true
  },
  lead:{
    type: String,
    ref: 'Leads',
    required: true
  },
  onDate: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(LeadStatus)
  },
  value:{
    type: Number
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

achievementSchema.plugin(uniqueValidator);

achievementSchema.statics = {
  getById: function(id) {
    return this.findById(id).populate('assigned');
  },
  search: function(query) {
    return this.find(query).populate('assigned');
  },
  searchOne: function(query) {
    return this.findOne(query).populate('assigned');
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
    return this.find(query, null, options).populate('assigned');
  },
  countDocuments: function (query) {
    return this.count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    return this.aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  },
  match: function(lead, type){
    return this.aggregate([
      {$match:{"lead":lead}},
      {$match:{"type":type}}
      ])
  },
  monthAchievement: function(user, startDate,endDate){
    return this.aggregate([
      {$match:{"onDate":{$gt:new Date(startDate), $lt: new Date(endDate)}}},
      {$match:{"user":user}},
      {$group:{"_id":"$type", count:{$sum:1}, dollars:{$sum:"$value"}}}
      ])
  },
  monthOrgAchievement: function(startDate,endDate){
    return this.aggregate([
      {$match:{"onDate":{$gt:new Date(startDate), $lt: new Date(endDate)}}},
      {$group:{"_id":"$type", count:{$sum:1}, dollars:{$sum:"$value"}}}
      ])
  },
  indAcquired: function(user){
    return this.aggregate([
      {$match:{"user":user}},
      {$match:{"type":"CONVERTED"}},
      {$group:{"_id":{$month:"$onDate"},rev:{$sum:"$value"}}},
      {$project:{_id:1, rev:1, "month":{$switch:{
      branches:[{case:{$eq:["$_id",1]},then:"jan"},{case:{$eq:["$_id",2]},then:"feb"},
      {case:{$eq:["$_id",3]},then:"mar"},{case:{$eq:["$_id",4]},then:"apr"},
      {case:{$eq:["$_id",5]},then:"may"},{case:{$eq:["$_id",6]},then:"jun"},
      {case:{$eq:["$_id",7]},then:"jul"},{case:{$eq:["$_id",8]},then:"aug"},
      {case:{$eq:["$_id",9]},then:"sep"},{case:{$eq:["$_id",10]},then:"oct"},
      {case:{$eq:["$_id",11]},then:"nov"},{case:{$eq:["$_id",12]},then:"dec"}]}}}},
      {$sort:{"_id":1}}
      ])
  },
  indCountAcq : function(user){
    return this.aggregate([
      {$match:{"user":user}},
      {$match:{"type":"CONVERTED"}},
      {$group:{"_id":{$month:"$onDate"},count:{$sum:1}}},
      {$project:{_id:1, count:1, "month":{$switch:{
      branches:[{case:{$eq:["$_id",1]},then:"jan"},{case:{$eq:["$_id",2]},then:"feb"},
      {case:{$eq:["$_id",3]},then:"mar"},{case:{$eq:["$_id",4]},then:"apr"},
      {case:{$eq:["$_id",5]},then:"may"},{case:{$eq:["$_id",6]},then:"jun"},
      {case:{$eq:["$_id",7]},then:"jul"},{case:{$eq:["$_id",8]},then:"aug"},
      {case:{$eq:["$_id",9]},then:"sep"},{case:{$eq:["$_id",10]},then:"oct"},
      {case:{$eq:["$_id",11]},then:"nov"},{case:{$eq:["$_id",12]},then:"dec"}]}}}},
      {$sort:{"_id":1}}
      ])
  },
  orgAcquired: function(){
    return this.aggregate([
      {$match:{"type":"CONVERTED"}},
      {$group:{"_id":{$month:"$onDate"},rev:{$sum:"$value"}}},
      {$project:{_id:1, rev:1, "month":{$switch:{
      branches:[{case:{$eq:["$_id",1]},then:"jan"},{case:{$eq:["$_id",2]},then:"feb"},
      {case:{$eq:["$_id",3]},then:"mar"},{case:{$eq:["$_id",4]},then:"apr"},
      {case:{$eq:["$_id",5]},then:"may"},{case:{$eq:["$_id",6]},then:"jun"},
      {case:{$eq:["$_id",7]},then:"jul"},{case:{$eq:["$_id",8]},then:"aug"},
      {case:{$eq:["$_id",9]},then:"sep"},{case:{$eq:["$_id",10]},then:"oct"},
      {case:{$eq:["$_id",11]},then:"nov"},{case:{$eq:["$_id",12]},then:"dec"}]}}}},
      {$sort:{"_id":1}}
      ])
  },
  orgCountAcq: function(){
    return this.aggregate([
      {$match:{"type":"CONVERTED"}},
      {$group:{"_id":{$month:"$onDate"},count:{$sum:1}}},
      {$project:{_id:1, count:1, "month":{$switch:{
      branches:[{case:{$eq:["$_id",1]},then:"jan"},{case:{$eq:["$_id",2]},then:"feb"},
      {case:{$eq:["$_id",3]},then:"mar"},{case:{$eq:["$_id",4]},then:"apr"},
      {case:{$eq:["$_id",5]},then:"may"},{case:{$eq:["$_id",6]},then:"jun"},
      {case:{$eq:["$_id",7]},then:"jul"},{case:{$eq:["$_id",8]},then:"aug"},
      {case:{$eq:["$_id",9]},then:"sep"},{case:{$eq:["$_id",10]},then:"oct"},
      {case:{$eq:["$_id",11]},then:"nov"},{case:{$eq:["$_id",12]},then:"dec"}]}}}},
      {$sort:{"_id":1}}
      ])
  },
  indMonNew: function(user){
    return this.aggregate([
      {$match:{"user":user}},
      {$match:{"type":"NEW_LEAD"}},
      {$group:{"_id":{$month:"$onDate"}, count:{$sum:1}, dollars:{$sum:"$value"}}},
      {$sort:{"_id":1}}
      ])
  },
  indMonContacted: function(user){
    return this.aggregate([
      {$match:{"user":user}},
      {$match:{"type":"CONTACTED_LEADS"}},
      {$group:{"_id":{$month:"$onDate"}, count:{$sum:1}, dollars:{$sum:"$value"}}},
      {$sort:{"_id":1}}
      ])
  },
  indMonConverted: function(user){
    return this.aggregate([
      {$match:{"user":user}},
      {$match:{"type":"CONVERTED"}},
      {$group:{"_id":{$month:"$onDate"}, count:{$sum:1}, dollars:{$sum:"$value"}}},
      {$sort:{"_id":1}}
      ])
  },
  orgMonNew: function(){
    return this.aggregate([
      {$match:{"type":"NEW_LEAD"}},
      {$group:{"_id":{$month:"$onDate"}, count:{$sum:1}, dollars:{$sum:"$value"}}},
      {$sort:{"_id":1}}
      ])
  },
  orgMonContacted: function(){
    return this.aggregate([
      {$match:{"type":"CONTACTED_LEADS"}},
      {$group:{"_id":{$month:"$onDate"}, count:{$sum:1}, dollars:{$sum:"$value"}}},
      {$sort:{"_id":1}}
      ])
  },
  orgMonConverted: function(){
    return this.aggregate([
      {$match:{"type":"CONVERTED"}},
      {$group:{"_id":{$month:"$onDate"}, count:{$sum:1}, dollars:{$sum:"$value"}}},
      {$sort:{"_id":1}}
      ])
  }
}

const Achievement = mongoose.model(modelName, achievementSchema);

module.exports = Achievement;