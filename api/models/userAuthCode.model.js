const mongoose = require('mongoose');
var uuid = require('node-uuid');
var uniqueValidator = require('mongoose-unique-validator');

var modelName = 'UserAuthCodes';

const userAuthCodeSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  email: {
      type: String,
      required: true,
      //index: true
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
      return this.findById(id);
  },
  search: function(query) {
      return this.find(query);
  },
  searchOne: function(query) {
    return this.findOne(query);
  },
  updateById: function(id, updateData) {
      var options = {new:true};
      return this.findOneAndUpdate({ _id: id}, {$set: updateData}, options);
  },
  deletebyId: function(query) {
    return this.findOneAndDelete(query);
  },
  create: function(data) {
     var entity = new this(data);
     return entity.save();
  }
}

const UserAuthCode = mongoose.model(modelName, userAuthCodeSchema);

module.exports = UserAuthCode;