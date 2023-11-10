const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
const Status = require('../../common/constants/Status');
var uniqueValidator = require('mongoose-unique-validator');


var modelName = 'Accounts';

const accountSchema = new Schema({
  _id: { type: String, default: uuid.v1 },
  accountname: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  description: {
    type: String
  },
  primaryContactPerson: {
    type: Object
  },
  secondaryContactPerson:{
    type: [Object]
  },
onBoardingDate:{
  type: Date
},
coverImg:{
    type:String,
  },
  defaultEmail:{
    type: String
  },
   website:{
      type: String
   },
   location:{
    type: String
   },
   addresses:{
    type: Object
   },
   credibility:{
     type: String
   },
   tags: [{ type: String }],
   documents:{
      type: [Object]
   },
   accountstatus:{
    type :String,
    required: true,
    enum: Object.values(Status)
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

accountSchema.plugin(uniqueValidator);

accountSchema.statics = {

  getById: function (id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).
    findById(id)
  },
  search: function (query) {
    var context = currentContext.getCurrentContext();
    var conn = this.db.useDb(context.workspaceId).model(modelName);
    return conn.find(query).populate('customer')
  },
  searchOne: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName)
    .findOne(query)
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

const Account = mongoose.model(modelName, accountSchema);

module.exports = Account;