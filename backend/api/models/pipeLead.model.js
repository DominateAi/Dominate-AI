const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
const LeadStatus = require('../../common/constants/LeadStatus');
var uniqueValidator = require('mongoose-unique-validator');
const LeadDegree = require('../../common/constants/LeadDegree');

var modelName = 'PipeLeads';

const pipeLeadSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1 },
  name: {
    type: String,
    required: true,
    index: true
  },
  account_id:{
    type:String,
    required:true,
    ref:'Accounts'
  },
  email: {
    type: String,
    index: true
  },
  phone: {
    type: String,
    required: true,
  },
  phoneCode:{
    type:Object
  },
  reason_for_drop:{ type : String },
  tags: [{ type: String }],
  isKanban: {
    type: Boolean
  },
  isHidden: {
    type: Boolean
  },
  assigned: {
    type: String,
    ref: 'Users',
    required: true
  },
  degree: {
    type: String,
    required: true,
    enum: Object.values(LeadDegree)
  },
  additionalInfo: {
    type: String
  },
  profileImage: {
    type: String
  },
  emoji: {
    type: String
  },
  about: {
    type: String
  },
  pipeline:{
    type:String,
    required:true,
    ref:'LeadPipelines'
  },
  stage:{
    type:String,
    required:true,
    ref:'LeadStages'
  },
  createdBy: {
    type: String,
    required: true
  },
  source:{
    type:String
  },
  worth:{
    type: Number
  },
  closingDate:{
    type: Date
  },
  convertedDate:{
    type: Date
  },
  lastModifiedBy: {
    type: String,
    required: true
  },
  media: { type: Object }
}, { timestamps: true });

pipeLeadSchema.index({'$**': 'text'});

pipeLeadSchema.plugin(uniqueValidator);

pipeLeadSchema.statics = {

  targetSearch : function ( query ){
    // console.log("Eh")
    var context = currentContext.getCurrentContext();
    var conn = this.db.useDb(context.workspaceId).model(modelName);
    return conn.find(query);
  },
  getById: function (id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findById(id).populate('assigned');
  },
  search: function (query) {
    var context = currentContext.getCurrentContext();
    var conn = this.db.useDb(context.workspaceId).model(modelName);
    return conn.find(query).populate('assigned').populate('account_id');
  },
  searchOne: function (query) {
    var context = currentContext.getCurrentContext();
    var conn = this.db.useDb(context.workspaceId).model(modelName);
    return conn.findOne(query).populate('assigned').populate('account_id');
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
    return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options).populate('assigned').populate('account_id');
  },
  /********************************
   * ADDITION BY SHUBHAM
   ********************************/
  getPaginatedResultWithNotesAndFollowups : function ( filters, options ) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {
         $lookup:{
            from: "notes",
            localField: "_id",
            foreignField: "entityId",
            as: "notes"
            }
       },
       {
          $lookup:{
            from: "followups",
            localField: "_id",
            foreignField: "assigned",
            as: "followups"
          }
       }
  ]);
  },
  countDocuments: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).count(query);
  },
  estimatedDocumentCount: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).estimatedDocumentCount(query);
  },
  getAggregateCount: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  },
  import: function (items) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).insertMany(items);
  },
  export: function () {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).find({}).lean();
  },
  createEmptyCollection: function(){
    var context = currentContext.getCurrentContext();
    this.db.useDb(context.workspaceId).model(modelName).createCollection();
    this.db.useDb(context.workspaceId).model(modelName).createIndexes();
  },
  getTextSearchResult: function(text){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).find(
      {$text: {$search: text}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}
    ).populate('assigned');
  },
  groupByKeyAndCountDocumentsByYears: function (key, sumBy, qassigned) {
    var context = currentContext.getCurrentContext();
    let queryKey = '$' + key;
    if(sumBy == undefined){
      sumBy = 1;
    }

    let filter = {};
    if(qassigned != undefined){
      filter['assigned'] = qassigned;
    }


    return this.db.useDb(context.workspaceId).model(modelName)
    .aggregate([
      {$project: {year: {$year: queryKey}, month: {$month: queryKey}, createdAt: 1, worth:1, convertedDate: 1, assigned: 1}},
      {$match: filter},
      {$group: {_id: {$year: queryKey},count: {$sum: sumBy}}
     }]);
  },
  groupByKeyAndCountDocumentsByMonth: function (key, qyear, sumBy, qassigned, qstatus) {
    var context = currentContext.getCurrentContext();
    let queryKey = '$' + key;
    if(sumBy == undefined){
      sumBy = 1;
    }

    let filter = {'$and': [ {'year' :  parseInt(qyear)}]};
    if(qassigned != undefined){
      filter['$and'].push({'assigned': qassigned});
    }
    if(qstatus != undefined){
      filter['$and'].push({'status': {
          '$ne': qstatus
         }
      });
    }
    return this.db.useDb(context.workspaceId).model(modelName)
    .aggregate([
      {$project: {year: {$year: queryKey}, month: {$month: queryKey}, createdAt: 1, worth:1, convertedDate: 1, assigned: 1, status: 1}},
      {$match: filter},
      {$group: {_id: {$month: queryKey},count: {$sum: sumBy}}
     }]);
  },

  /**************************************************************
   * @DESC - EDIT BY SHUBHAM - groupByKeyAndCountDocumentsByMonth
   **************************************************************/
  groupByKeyAndCountDocumentsByMonth_v2 : function (key, qyear, sumBy, qassigned, qstatus) {
    var context = currentContext.getCurrentContext();
    let queryKey = '$' + key;
    if(sumBy == undefined){
      sumBy = 1;
    }

    let filter = {'$and': [ {'year' :  parseInt(qyear)}]};
    if(qassigned != undefined){
      filter['$and'].push({'assigned': qassigned});
    }
    if(qstatus != undefined){
      filter['$and'].push({'status': {
          '$ne': qstatus
         }
      });
    }
    return this.db.useDb(context.workspaceId).model(modelName)
    .aggregate([
      { $match : { convertedDate : { $exists : true } } },
      {$project: {year: {$year: queryKey}, month: {$month: queryKey}, createdAt: 1, worth:1, convertedDate: 1, assigned: 1, status: 1}},
      {$match: filter},
      {$group: {
        _id: {$month: queryKey},
        count: {$sum: sumBy},
        worthAmt:{ $push:"$worth" }
      }
     }]);
  },

  groupByKeyAndCountDocumentsByWeek: function (key, qyear, qmonth, sumBy, qassigned) {
    var context = currentContext.getCurrentContext();
    let queryKey = '$' + key;
    if(sumBy == undefined){
      sumBy = 1;
    }

    let filter = {year: parseInt(qyear), month: parseInt(qmonth)};
    if(qassigned != undefined){
      filter['assigned'] = qassigned;
    }
    return this.db.useDb(context.workspaceId).model(modelName)
    .aggregate([
      {$project: {year: {$year: queryKey}, month: {$month: queryKey}, createdAt: 1, worth:1, convertedDate: 1, assigned: 1}},
      {$match: filter},
      {$group: {_id: {$week: queryKey},count: {$sum: sumBy}}
     }]);
  },
  groupByKeyAndCountDocumentsByDay: function (key, qyear, qmonth, qweek, sumBy, qassigned) {
    var context = currentContext.getCurrentContext();
    let queryKey = '$' + key;
    if(sumBy == undefined){
      sumBy = 1;
    }
    let filter = {year: parseInt(qyear), week: parseInt(qweek)};
    if(qassigned != undefined){
      filter['assigned'] = qassigned;
    }
    return this.db.useDb(context.workspaceId).model(modelName)
    .aggregate([
      {$project: {year: {$year: queryKey}, month: {$month: queryKey}, week: {$week: queryKey}, createdAt: 1, worth:1, convertedDate: 1, assigned: 1}},
      {$match: {year: parseInt(qyear), week: parseInt(qweek)}},
      {$group: {_id: queryKey,count: {$sum: sumBy}}
     }]);
  },


    /**************************************************************
   * @DESC - EDIT BY SHUBHAM - groupByKeyAndCountDocumentsByMonth
   **************************************************************/
  groupByKeyAndCountDocumentsByMonth_v3 : function (key, qyear, sumBy, qassigned, qstatus) {
    var context = currentContext.getCurrentContext();
    let queryKey = '$' + key;
    if(sumBy == undefined){
      sumBy = 1;
    }

    let filter = {'$and': [ {'year' :  parseInt(qyear)}]};
    if(qassigned != undefined && qassigned != ""){
      filter['$and'].push({'assigned': qassigned});
    }
    if(qstatus != undefined){
      filter['$and'].push({'status': qstatus
      });
    }
    return this.db.useDb(context.workspaceId).model(modelName)
    .aggregate([
      {$project: {year: {$year: queryKey}, month: {$month: queryKey}, createdAt: 1, worth:1, convertedDate: 1, assigned: 1, status: 1}},
      {$match: filter},
      {$group: {
        _id: {$month: queryKey},
        count: {$sum: sumBy},
        worthAmt:{ $push:"$worth" }
      }
     }]);
  },
  closedPercentage: function (member) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"assigned":member}},
      {$group:{_id:null, count:{$sum:1}, data:{$push:"$$ROOT"}}},{$unwind:"$data"},
      {$group:{_id:"$data.status", count:{"$sum":1},total:{$first:"$count"}}},
      {$project:{count:1,"status":1,"percentage":{$multiply:[{$divide:[100,"$total"]},"$count"]}}},
      {$match:{"_id":"CONVERTED"}}
      ]);
    },
  pipeLeadsByAccountId: function(account){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"account_id":account}}
      ]);
  },
  usersForAccount: function(account){ //caution - function exists only at model level
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"account_id":account}},
      {$lookup:{from:"users",localField:"assigned",foreignField:"_id",as:"userdata"}},
      {$unwind:"$userdata"},
      {$group:{_id:"$userdata"}}
      ])
  },
  countAcc: function(accountId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"account_id":accountId}},
      {$group:{_id:"",count:{$sum:1}}},{$project:{"_id":0}}
      ])
    },
  userAccCount: function(user, startDate, endDate){
      var context = currentContext.getCurrentContext();
      return this.db.useDb(context.workspaceId).model(modelName).aggregate([
        {$match:{"assigned":user}},
        {$lookup: {from:"accounts",localField:"account_id",foreignField:"_id",as:"account"}},
        {$unwind:{path:"$account",preserveNullAndEmptyArrays:true}},
        {$match:{createdAt:{$gt:new Date(startDate), $lt:new Date(endDate)}}},
        {$group:{_id:"$account"}},
        {$match:{"_id":{$ne:null}}},
        {$group:{_id:"",count:{$sum:1}}}
        ])
    }
}


const PipeLead = mongoose.model(modelName, pipeLeadSchema);

module.exports = PipeLead;
