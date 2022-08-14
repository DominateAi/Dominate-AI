const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
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
    return this.find(query);
  },
  getById: function (id) {
    return this.findById(id).populate('assigned');
  },
  search: function (query) {
    return this.find(query).populate('assigned').populate('account_id');
  },
  searchOne: function (query) {
    return this.findOne(query).populate('assigned').populate('account_id');
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
    return this.find(query, null, options).populate('assigned').populate('account_id');
  },
  /********************************
   * ADDITION BY SHUBHAM
   ********************************/
  getPaginatedResultWithNotesAndFollowups : function ( filters, options ) {
    return this.aggregate([
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
    return this.count(query);
  },
  estimatedDocumentCount: function (query) {
    return this.estimatedDocumentCount(query);
  },
  getAggregateCount: function (query) {
    return this.aggregate(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    return this.aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  },
  import: function (items) {
    return this.insertMany(items);
  },
  export: function () {
    return this.find({}).lean();
  },
  createEmptyCollection: function(){
    this.createCollection();
    this.createIndexes();
  },
  getTextSearchResult: function(text){
    return this.find(
      {$text: {$search: text}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}
    ).populate('assigned');
  },
  groupByKeyAndCountDocumentsByYears: function (key, sumBy, qassigned) {
    let queryKey = '$' + key;
    if(sumBy == undefined){
      sumBy = 1;
    }

    let filter = {};
    if(qassigned != undefined){
      filter['assigned'] = qassigned;
    }

    return this.aggregate([
      {$project: {year: {$year: queryKey}, month: {$month: queryKey}, createdAt: 1, worth:1, convertedDate: 1, assigned: 1}},
      {$match: filter},
      {$group: {_id: {$year: queryKey},count: {$sum: sumBy}}
     }]);
  },
  groupByKeyAndCountDocumentsByMonth: function (key, qyear, sumBy, qassigned, qstatus) {
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
    return this.aggregate([
      {$project: {year: {$year: queryKey}, month: {$month: queryKey}, createdAt: 1, worth:1, convertedDate: 1, assigned: 1, status: 1}},
      {$match: filter},
      {$group: {_id: {$month: queryKey},count: {$sum: sumBy}}
     }]);
  },

  /**************************************************************
   * @DESC - EDIT BY SHUBHAM - groupByKeyAndCountDocumentsByMonth
   **************************************************************/
  groupByKeyAndCountDocumentsByMonth_v2 : function (key, qyear, sumBy, qassigned, qstatus) {
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
    return this.aggregate([
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
    let queryKey = '$' + key;
    if(sumBy == undefined){
      sumBy = 1;
    }

    let filter = {year: parseInt(qyear), month: parseInt(qmonth)};
    if(qassigned != undefined){
      filter['assigned'] = qassigned;
    }
    return this.aggregate([
      {$project: {year: {$year: queryKey}, month: {$month: queryKey}, createdAt: 1, worth:1, convertedDate: 1, assigned: 1}},
      {$match: filter},
      {$group: {_id: {$week: queryKey},count: {$sum: sumBy}}
     }]);
  },
  groupByKeyAndCountDocumentsByDay: function (key, qyear, qmonth, qweek, sumBy, qassigned) {
    let queryKey = '$' + key;
    if(sumBy == undefined){
      sumBy = 1;
    }
    let filter = {year: parseInt(qyear), week: parseInt(qweek)};
    if(qassigned != undefined){
      filter['assigned'] = qassigned;
    }
    return this.aggregate([
      {$project: {year: {$year: queryKey}, month: {$month: queryKey}, week: {$week: queryKey}, createdAt: 1, worth:1, convertedDate: 1, assigned: 1}},
      {$match: {year: parseInt(qyear), week: parseInt(qweek)}},
      {$group: {_id: queryKey,count: {$sum: sumBy}}
     }]);
  },


    /**************************************************************
   * @DESC - EDIT BY SHUBHAM - groupByKeyAndCountDocumentsByMonth
   **************************************************************/
  groupByKeyAndCountDocumentsByMonth_v3 : function (key, qyear, sumBy, qassigned, qstatus) {
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
    return this.aggregate([
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
    return this.aggregate([
      {$match:{"assigned":member}},
      {$group:{_id:null, count:{$sum:1}, data:{$push:"$$ROOT"}}},{$unwind:"$data"},
      {$group:{_id:"$data.status", count:{"$sum":1},total:{$first:"$count"}}},
      {$project:{count:1,"status":1,"percentage":{$multiply:[{$divide:[100,"$total"]},"$count"]}}},
      {$match:{"_id":"CONVERTED"}}
      ]);
    },
  pipeLeadsByAccountId: function(account){
    return this.aggregate([
      {$match:{"account_id":account}}
      ]);
  },
  usersForAccount: function(account){ //caution - function exists only at model level
    return this.aggregate([
      {$match:{"account_id":account}},
      {$lookup:{from:"users",localField:"assigned",foreignField:"_id",as:"userdata"}},
      {$unwind:"$userdata"},
      {$group:{_id:"$userdata"}}
      ])
  },
  countAcc: function(accountId){
    return this.aggregate([
      {$match:{"account_id":accountId}},
      {$group:{_id:"",count:{$sum:1}}},{$project:{"_id":0}}
      ])
    },
  userAccCount: function(user, startDate, endDate){
      return this.aggregate([
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
