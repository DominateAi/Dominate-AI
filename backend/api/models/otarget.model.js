const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
var uniqueValidator = require('mongoose-unique-validator');

var modelName = 'Otargets';

const otargetSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  targetDate: {
    type: Date,
    required: true
  },
  targetData:{
    newLeads:{
      type:Number
    },
    contactedLeads:{
      type:Number
    },
    convertedLeads:{
      type:Number
    },
    newLeadsDollars:{
      type:Number
    },
    contactedLeadsDollars:{
      type:Number
    },
    convertedLeadsDollars:{
      type:Number
    }
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

otargetSchema.plugin(uniqueValidator);

otargetSchema.statics = {


  getById: function(id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findById(id);
  },
  search: function(query) {
    var context = currentContext.getCurrentContext();
    var conn = this.db.useDb(context.workspaceId).model(modelName);
    return conn.find(query);
  },
  searchOne: function(query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOne(query);
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
    return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options);
  },
  countDocuments: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  },
  monthOrgTarget: function(startDate, endDate){
    var context = currentContext.getCurrentContext();
    console.log("Reached here")
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"targetDate":{$gt:new Date(startDate), $lt: new Date(endDate)}}},
      {$project:{"targetData.newLeads":1,"targetData.contactedLeads":1, "targetData.convertedLeads":1,
      "targetData.newLeadsDollars":1,"targetData.contactedLeadsDollars":1,"targetData.convertedLeadsDollars":1}},
      {$addFields:{"targetNewLeads":"$targetData.newLeads","targetContactedLeads":"$targetData.contactedLeads",
      "targetConvertedLeads":"$targetData.convertedLeads","targetNewLeadDollars":"$targetData.newLeadsDollars",
      "targetContactedLeadDollars":"$targetData.contactedLeadsDollars","targetConvertedLeadDollars":"$targetData.convertedLeadsDollars"}},
      {$project:{"targetData":0}}
      ])
  },
  orgExpected: function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$group:{"_id":{$month:"$targetDate"},rev:{$sum:"$targetData.convertedLeadsDollars"}}},
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
  orgCountExp: function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$group:{"_id":{$month:"$targetDate"},count:{$sum:"$targetData.convertedLeads"}}},
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
  monthlyTargetsTable: function(user){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$group:{"_id":{$month:"$targetDate"}, "targetId":{$first:"$_id"},"target":{$first:"$targetData"}}},
      {$addFields:{targetNewLeads:"$target.newLeads", targetContactedLeads:"$target.contactedLeads", targetConvertedLeads:"$target.convertedLeads", 
       targetNewLeadsDollars:"$target.newLeadsDollars", targetContactedLeadsDollars:"$target.contactedLeadsDollars", targetConvertedLeadsDollars:"$target.convertedLeadsDollars"}},
      {$project:{"target":0}} ,{$sort:{"_id":1}}
      ])
  }
}

const Otarget = mongoose.model(modelName, otargetSchema);

module.exports = Otarget;