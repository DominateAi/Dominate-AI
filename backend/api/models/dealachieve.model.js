const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
var uniqueValidator = require('mongoose-unique-validator');
const LeadStatus = require('../../common/constants/LeadStatus');
const DealStatus = require('../../common/constants/DealStatus');

var modelName = 'Dealachieves';

const dealachieveSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  user: {
    type: String,
    ref: 'Users',
   required: true
  },
  deal:{
    type: String,
    ref: 'Deals',
    required: true
  },
  onDate: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(DealStatus)
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

dealachieveSchema.plugin(uniqueValidator);

dealachieveSchema.statics = {
  getById: function(id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findById(id).populate('assigned');
  },
  search: function(query) {
    var context = currentContext.getCurrentContext();
    var conn = this.db.useDb(context.workspaceId).model(modelName);
    return conn.find(query).populate('assigned');
  },
  searchOne: function(query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOne(query).populate('assigned');
  },
  updateById: function(id, updateData) {
    var context = currentContext.getCurrentContext();
    var options = { new: true };
    return this.db.useDb(context.workspaceId).model(modelName).findOneAndUpdate({ _id: id }, { $set: updateData }, options);
  },
  deletebyId: function(id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findByIdAndDelete(id);
  },
  create: function(data) {
    var context = currentContext.getCurrentContext();
    var entityModel = this.db.useDb(context.workspaceId).model(modelName);
    var entity = new entityModel(data);
    return entity.save();
  },
  getPaginatedResult: function (query, options) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options).populate('assigned');
  },
  countDocuments: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  },
  match: function(deal, type){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"deal":deal}},
      {$match:{"type":type}}
      ])
  },
  monthAchievement: function(user, startDate,endDate){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"onDate":{$gt:new Date(startDate), $lt: new Date(endDate)}}},
      {$match:{"user":user}},
      {$group:{"_id":"$type", count:{$sum:1}, dollars:{$sum:"$value"}}}
      ])
  },
  monthOrgAchievement: function(startDate,endDate){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"onDate":{$gt:new Date(startDate), $lt: new Date(endDate)}}},
      {$group:{"_id":"$type", count:{$sum:1}, dollars:{$sum:"$value"}}}
      ])
  },
  indAcquired: function(user){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"user":user}},
      {$match:{"type":"CLOSED"}},
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
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"user":user}},
      {$match:{"type":"CLOSED"}},
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
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"type":"CLOSED"}},
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
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"type":"CLOSED"}},
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
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"user":user}},
      {$match:{"type":"OTHER"}},
      {$group:{"_id":{$month:"$onDate"}, count:{$sum:1}, dollars:{$sum:"$value"}}},
      {$sort:{"_id":1}}
      ])
  },
  indMonConverted: function(user){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"user":user}},
      {$match:{"type":"CLOSED"}},
      {$group:{"_id":{$month:"$onDate"}, count:{$sum:1}, dollars:{$sum:"$value"}}},
      {$sort:{"_id":1}}
      ])
  },
  orgMonNew: function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"type":"OTHER"}},
      {$group:{"_id":{$month:"$onDate"}, count:{$sum:1}, dollars:{$sum:"$value"}}},
      {$sort:{"_id":1}}
      ])
  },
  orgMonConverted: function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"type":"CLOSED"}},
      {$group:{"_id":{$month:"$onDate"}, count:{$sum:1}, dollars:{$sum:"$value"}}},
      {$sort:{"_id":1}}
      ])
  }
}

const Dealachieve = mongoose.model(modelName, dealachieveSchema);

module.exports = Dealachieve;