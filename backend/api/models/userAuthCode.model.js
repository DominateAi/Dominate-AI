const mongoose = require('mongoose');
var uuid = require('node-uuid');
var uniqueValidator = require('mongoose-unique-validator');
var currentContext = require('../../common/currentContext');


var modelName = 'UserAuthCodes';

const userAuthCodeSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  email: {
      type: String,
      required: true,
      index: true
  },
  authCode: {
      type: String
  },
  type: {
    type: String
  },
  workspaceId: {
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

userAuthCodeSchema.plugin(uniqueValidator);


userAuthCodeSchema.statics = {

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
      var options = {new:true};
      return this.db.useDb(context.workspaceId).model(modelName)
      .findOneAndUpdate({ _id: id}, {$set: updateData}, options);
  },
  deletebyId: function(query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOneAndDelete(query);
  },
  create: function(data) {
     var context = currentContext.getCurrentContext();
     var entityModel = this.db.useDb(context.workspaceId).model(modelName);
     var entity = new entityModel(data);
     return entity.save();
  }
}

const UserAuthCode = mongoose.model(modelName, userAuthCodeSchema);

module.exports = UserAuthCode;