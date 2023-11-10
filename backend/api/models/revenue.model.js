const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
var uniqueValidator = require('mongoose-unique-validator');


var modelName = 'Revenues';

const revenueSchema = new Schema({
  _id: { type: String, default: uuid.v1 },
    deal: {
    type: String,
    //ref: Deals,
    required: true,
    index: true
  },
  revenueAmount: {
    type: Number,
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

revenueSchema.plugin(uniqueValidator);

revenueSchema.statics = {

  getById: function (id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).
    findById(id).populate('deal');
  },
  search: function (query) {
    var context = currentContext.getCurrentContext();
    var conn = this.db.useDb(context.workspaceId).model(modelName);
    return conn.find(query).populate('deal');
  },
  searchOne: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName)
    .findOne(query).populate('deal')
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
    return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options)
    .populate('deal')
  },
  countDocuments: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  },
  monthlyRecurDealsRev: function(startDate, endDate){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{createdAt:{$gt:new Date(startDate), $lt: new Date(endDate)}}},
      {$lookup:{from:"deals",localField:"deal",foreignField:"_id",as:"dealsdata"}},
      {$unwind:"$dealsdata"},
      {$match:{"dealsdata.type":"RECURRING"}},
      {$group:{_id:"", total:{$sum:"$dealsdata.value"}}}
      ])
  },
  dealWithHighestRev:function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
    {$lookup:{from:"deals",localField:"deal",foreignField:"_id",as:"dealsdata"}},
    {$unwind:"$dealsdata"},
    {$group:{_id:"$dealsdata._id", total:{$sum:"$revenueAmount"}, dealName:{$first:"$dealsdata.dealname"}}},
    {$sort:{"revenueAmount":1}}
      ])
  },
  revByDeal:function(deal){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"deal":deal}},
      {$group:{"_id":"", total:{$sum:"$revenueAmount"}}}
      ])
  },
  accrev:function(accountId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$lookup:{from:"deals",localField:"deal",foreignField:"_id",as:"dealsdata"}},
      {$unwind:"$dealsdata"},
      {$lookup:{from:"accounts",localField:"dealsdata.account",foreignField:"_id",as:"accountofdeal"}},
      {$unwind:"$accountofdeal"},
      {$match:{"accountofdeal._id":accountId}},
      {$group:{_id:"",totalrevenue:{$sum:"$revenueAmount"}}}
      ])
  },
  monAccRev:function(accountId, startDate, endDate){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{createdAt:{$gt:new Date(startDate), $lt: new Date(endDate)}}},
      {$lookup:{from:"deals",localField:"deal",foreignField:"_id",as:"dealsdata"}},
      {$unwind:"$dealsdata"},
      {$lookup:{from:"accounts",localField:"dealsdata.account",foreignField:"_id",as:"accountofdeal"}},
      {$unwind:"$accountofdeal"},
      {$match:{"accountofdeal._id":accountId}},
      {$group:{_id:"",totalrevenue:{$sum:"$revenueAmount"}}}
      ])
  },
  accRecurRev:function(accountId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$lookup:{from:"deals",localField:"deal",foreignField:"_id",as:"dealsdata"}},
      {$unwind:"$dealsdata"},
      {$match:{"dealsdata.type":"RECURRING"}},
      {$lookup:{from:"accounts",localField:"dealsdata.account",foreignField:"_id",as:"accountofdeal"}},
      {$unwind:"$accountofdeal"},
      {$match:{"accountofdeal._id":accountId}},
      {$group:{_id:"",totalrevenue:{$sum:"$revenueAmount"}}}
      ])
  },
  highRevDeal:function(accountId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$lookup:{from:"deals",localField:"deal",foreignField:"_id",as:"dealsdata"}},
      {$unwind:"$dealsdata"},
      {$lookup:{from:"accounts",localField:"dealsdata.account",foreignField:"_id",as:"accountofdeal"}},
      {$unwind:"$accountofdeal"},
      {$match:{"accountofdeal._id":accountId}},
      {$group:{_id:"$dealsdata", revenuefromdeal:{$sum:"$revenueAmount"}}},
      {$lookup:{from:"leads",localField:"_id.lead",foreignField:"_id",as:"leadData"}},
      {$sort:{revenuefromdeal:-1}}
      ])
  },
  totalRev:function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$group:{_id:"",total:{$sum:"$revenueAmount"}}}
      ])
  },
  monthwiseRevenueFromAccount:function(accountId, startDate, endDate){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{createdAt:{$gt:new Date(startDate), $lt: new Date(endDate)}}},
      {$lookup:{from:"deals",localField:"deal",foreignField:"_id",as:"dealofrev"}},
      {$unwind:"$dealofrev"},{$lookup:{from:"accounts",localField:"dealofrev.account",foreignField:"_id",as:"accountofdeal"}},
      {$unwind:"$accountofdeal"},{$match:{"accountofdeal._id":accountId}},
      {$group:{"_id":{$month:"$createdAt"}, revenue:{$sum:"$revenueAmount"}}},
      {$sort:{"_id":1}}
      ])
  },
  maxRevChart:function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$lookup:{from:"deals",localField:"deal",foreignField:"_id",as:"dealofrevenue"}},
      {$unwind:"$dealofrevenue"},{$lookup:{from:"accounts",localField:"dealofrevenue.account",foreignField:"_id",as:"accountofdeal"}},
      {$unwind:"$accountofdeal"},{$group:{"_id":"$accountofdeal", revenue:{$sum:"$revenueAmount"}}},
      {$addFields:{"account":"$_id.accountname"}},{$project:{"_id":0}},{$sort:{"revenue":-1}}])
  },
  accMonRevChart:function(accountId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$lookup:{from:"deals",localField:"deal",foreignField:"_id",as:"dealofrevenue"}},
      {$unwind:"$dealofrevenue"},{$lookup:{from:"accounts",localField:"dealofrevenue.account",foreignField:"_id",as:"accountofdeal"}},
      {$unwind:"$accountofdeal"},
      {$match:{"accountofdeal._id":accountId}},
      {$group:{"_id":{$month:"$createdAt"}, revenue:{$sum:"$revenueAmount"}}},
      {$addFields:{"account":"$_id.accountname"}},{$sort:{"_id":1}}])
  },
  monRev:function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$group:{"_id":{$month:"$createdAt"}, revenue:{$sum:"$revenueAmount"}}},{$sort:{"_id":1}}])
    },
  //currently this consists deals of annual and bi-annual frequencies as well, those need to be divided by corresponding values like 6
  //or 12 to make the values correct
  monRecurRev:function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$lookup:{from:"deals",localField:"deal",foreignField:"_id",as:"dealofrev"}},
      {$unwind:"$dealofrev"},{$match:{"dealofrev.type":"RECURRING"}},
      {$group:{"_id":{$month:"$createdAt"}, revenue:{$sum:"$revenueAmount"}}},{$sort:{"_id":1}}])
  },
  recurDealChart:function(startDate, endDate){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$lookup:{from:"deals",localField:"deal",foreignField:"_id",as:"dealofrev"}},
      {$unwind:"$dealofrev"},{$match:{"dealofrev.type":"RECURRING"}},
      {$match:{createdAt:{$gt:new Date(startDate), $lt: new Date(endDate)}} },
      {$group:{"_id":"$dealofrev", revenue:{$sum:"$revenueAmount"}}},
      {$addFields:{"deal":"$_id.dealname"}},{$project:{"_id":0}},{$sort:{"revenue":-1}}])
  },
  bigDealChart:function(startDate, endDate){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$lookup:{from:"deals",localField:"deal",foreignField:"_id",as:"dealofrev"}},
      {$unwind:"$dealofrev"},
      {$match:{"dealofrev.closingDate":{$gt:new Date(startDate), $lt: new Date(endDate)}}},
      {$group:{"_id":"$dealofrev", revenue:{$sum:"$revenueAmount"}}},
      {$addFields:{"deal":"$_id.dealname"}},{$project:{"_id":0}},{$sort:{"revenue":-1}}])
  },
  monthwiseRevenue:function(startDate, endDate){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{createdAt:{$gt:new Date(startDate), $lt: new Date(endDate)}}},
      {$lookup:{from:"deals",localField:"deal",foreignField:"_id",as:"dealofrev"}},
      {$unwind:"$dealofrev"},{$lookup:{from:"accounts",localField:"dealofrev.account",foreignField:"_id",as:"accountofdeal"}},
      {$unwind:"$accountofdeal"},
      {$group:{"_id":{$month:"$createdAt"}, revenue:{$sum:"$revenueAmount"}}},
      {$sort:{"_id":1}}
      ])
  },
  totalRecurRev:function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$lookup:{from:"deals",localField:"deal",foreignField:"_id",as:"dealofrev"}},
      {"$unwind":{path: "$dealofrev",preserveNullAndEmptyArrays: true}},
      {$match:{"dealofrev.type":"RECURRING"}},
      {$group:{_id:"",total:{$sum:"$revenueAmount"}}}])
  },
  revByFrequency: function(account, key, key2){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$lookup:{from:"deals",localField:"deal",foreignField:"_id",as:"dealofrev"}},
      {$unwind:"$dealofrev"},{$match:{"dealofrev.type":key2}},
      {$match:{"dealofrev.frequency":key}},
      {$match:{"dealofrev.account":account}},
      {$lookup:{from:"accounts",localField:"dealofrev.account",foreignField:"_id",as:"acc_data"}},
      {$unwind:"$acc_data"},
      {$group:{"_id":"", revenue:{$sum:"$revenueAmount"}}},
      {$sort:{"_id":1}}
    ])
  },
  revOnetime: function(account, from, to){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$lookup:{from:"deals",localField:"deal",foreignField:"_id",as:"dealofrev"}},
      {$unwind:"$dealofrev"},{$match:{"dealofrev.type":"ONETIME"}},
      {$match:{"dealofrev.account":account}},
      {$match:{"dealofrev.createdAt":{$gt:new Date(from), $lt: new Date(to)}}},
      {$lookup:{from:"accounts",localField:"dealofrev.account",foreignField:"_id",as:"acc_data"}},
      {$unwind:"$acc_data"},
      {$group:{"_id":"", revenue:{$sum:"$revenueAmount"}}},
      {$sort:{"_id":1}}
    ])
  },
  memberWise: function(user, startDate, endDate){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{createdAt:{$gt: new Date(startDate), $lt: new Date(endDate)}}},
      {$lookup:{from:"deals",localField:"deal",foreignField:"_id",as:"deal_data"}},
      {$unwind:{path:"$deal_data",preserveNullAndEmptyArrays:true}},
      {$match:{"deal_data.salesperson":user}},
      {$group:{_id:"$deal_data", revenue:{$sum:"$revenueAmount"}}},
      {$addFields:{dealname:"$_id.dealname"}},
      {$project:{_id:0}}
    ])
  }
}

const Revenue = mongoose.model(modelName, revenueSchema);

module.exports = Revenue;