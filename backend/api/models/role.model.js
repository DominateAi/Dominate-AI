const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
const Status = require('../../common/constants/Status');
var uniqueValidator = require('mongoose-unique-validator');
const RoleCategory = require('../../common/constants/RoleCategory');

var modelName = 'Roles';

const roleSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  name: {
      type: String,
      required: true,
      unique: true,
      index: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(Status)
  },
  permissions: [{type: String}],
  category:{
    type: String,
    required: true,
    enum: Object.values(RoleCategory)
  },
  internal:{
    type: Boolean,
    required: true
  },
  isdefault:{
    type: Boolean
  },
  url:{
    type: String
  },
  createdBy:{
    type: String,
    required: true
  },
  lastModifiedBy:{
    type: String,
    required: true
  }
}, { timestamps: true });

roleSchema.plugin(uniqueValidator);

roleSchema.statics = {


  getById: function(id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findById(id);
  },
  search: function(query) {
      var context = currentContext.getCurrentContext();
      var conn = this.db.useDb(context.workspaceId).model(modelName);
      // console.log( context.workspaceId );
      return conn.find(query);
  },
  searchOne: function(query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOne(query);
  },
  updateById: function(id, updateData) {
      var context = currentContext.getCurrentContext();
      var options = {new:true};
      return this.db.useDb(context.workspaceId).model(modelName).findOneAndUpdate({ _id: id}, {$set: updateData}, options);
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
  },getPaginatedResult: function (query, options) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options);
  }
}


const Role = mongoose.model(modelName, roleSchema);

module.exports = Role;