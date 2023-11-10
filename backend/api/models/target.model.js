const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
var uniqueValidator = require('mongoose-unique-validator');
var TargetStatus = require('../../common/constants/TargetStatus');

const projectAllFields = {  //for projecting in aggregate
    lastModifiedBy:1, entityId:1, targetType:1, status:1, fromDate:1, toDate:1,
    new_leads_dollar_value:1, new_leads_lead_value:1, contacted_leads_dollar_value:1,
    contacted_leads_lead_value:1, closed_leads_dollar_value:1, closed_leads_lead_value:1,
    createdBy:1, createdAt:1
  };  
const reset_data = {    //when user resets data from target panel
  new_leads_dollar_value:0,
  new_leads_lead_value:0,
  contacted_leads_dollar_value:0,
  contacted_leads_lead_value:0,
  closed_leads_dollar_value:0,
  closed_leads_lead_value:0
}

var modelName = 'Targets';

const targetSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuid.v1
  },
  entityId: {
    type: String,
    // ref:'Users',
    required: true // MEMBER ID FOR WHOM TARGET IS TO BE CREATED
  },
  targetType:{
    type: String,
    required : true // ORGANISATION or MEMBER
  },
  status:{
      type : String,
      required : true, // PENDING or ACTIVE
      enum: Object.values(TargetStatus)
  },
  fromDate:{
      type : Date,
      required: true
  },
  toDate:{
    type : Date,
    required: true
  },
  // ACTIVE TARGET DATA
  new_leads_dollar_value:{ 
    type : String 
  },
  new_leads_lead_value:{ 
    type : String 
  },
  contacted_leads_dollar_value:{ 
    type : String 
  },
  contacted_leads_lead_value:{ 
    type : String 
  },
  closed_leads_dollar_value:{ 
    type : String 
  },
  closed_leads_lead_value:{ 
    type : String 
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

targetSchema.plugin(uniqueValidator);

targetSchema.statics = {

    create: function (data) {
    var context = currentContext.getCurrentContext();
    var entityModel = this.db.useDb(context.workspaceId).model(modelName);
    var entity = new entityModel(data);
    return entity.save();
  },
  updateByID : function( id ,data ){
    var context = currentContext.getCurrentContext();
    var options = { new: true };
    return this.db.useDb(context.workspaceId).model(modelName).findOneAndUpdate({ _id: id }, { $set: data }, options);
  },
  deleteByID : function( id ){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findByIdAndDelete(id);
  },
  getOrganisationTargetForCurrentMonth: function (){
    var context = currentContext.getCurrentContext();
    var query = { createdAt : { $gte: moment().startOf('month'), $lte:moment().endOf('month') }, targetType:"ORGANISATION" };
    return this.db.useDb( context.workspaceId ).model( modelName ).findOne(query);
  },
  getTargetByIdStatusAndTargetType : function ( entityId, targetType, status ){
    var context = currentContext.getCurrentContext();
    var query = { 
        entityId : entityId, 
        targetType: targetType,
        status : status,
        createdAt:{ $gte: moment().startOf('month'), $lte:moment().endOf('month') }
      }
    return this.db.useDb( context.workspaceId ).model( modelName ).findOne(query);
  },
  getAllTargets: function( query ){
    var context = currentContext.getCurrentContext();
    return this.db.useDb( context.workspaceId ).model( modelName ).find(query)
  },
  getAllTargetsByYears : function (  filter, year ){
    var context = currentContext.getCurrentContext();
    return this.db.useDb( context.workspaceId ).model( modelName ).aggregate([
      { $project : { year : { $year : "$createdAt" }, ...projectAllFields }},
      { $match :   filter  }
    ])
  },
  getTargetByID: function ( query ){
    var context = currentContext.getCurrentContext();
    return this.db.useDb( context.workspaceId ).model( modelName ).findOne(query);
  },
  resetCurrentMonthOrganisationData : function( filters ){
    var context = currentContext.getCurrentContext();
    filters.entityId = context.userId;
    var options = { new: true };
    return this.db.useDb( context.workspaceId ).model( modelName ).updateMany(filters, reset_data);
  },
  resetCurrentMonthOrganisationAndMembersData: function ( filters ){
    var context = currentContext.getCurrentContext();
    filters.createdBy = context.email;
    var options = { new: true };
    return this.db.useDb( context.workspaceId ).model( modelName ).deleteMany(filters, reset_data);
  },
  groupByKeyAndCountDocumentsByMonth_v2 : function (key, qyear, qassigned, qstatus, targetType) {
    var context = currentContext.getCurrentContext();
    let queryKey = '$' + key;
    let filter = {'$and': [ {'year' :  parseInt(qyear)}, { 'targetType': targetType } ]}; 
    if(qassigned != undefined && qassigned != ""){
      filter['$and'].push({'entityId': qassigned});
    } 
    if(qstatus != undefined){
      filter['$and'].push({'status': qstatus });
    }
    return this.db.useDb(context.workspaceId).model(modelName)
    .aggregate([
      {$project: {year: {$year: queryKey}, month: {$month: queryKey} ,  ...projectAllFields }},
      {$match: filter},
      {$group: {
        _id: {$month: queryKey},
            new_leads_dollar_value:{ $push : "$new_leads_dollar_value" },
            new_leads_lead_value:{ $push : "$new_leads_lead_value" },
            contacted_leads_dollar_value: { $push : "$contacted_leads_dollar_value" },
            contacted_leads_lead_value:{ $push : "$contacted_leads_lead_value" },
            closed_leads_dollar_value:{ $push : "$closed_leads_dollar_value" },
            closed_leads_lead_value:{ $push:"$closed_leads_lead_value" }
      }
     }]);
  },
}

const Target = mongoose.model(modelName, targetSchema);

module.exports = Target;


