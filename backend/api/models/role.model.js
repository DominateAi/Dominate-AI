const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
const Status = require('../../common/constants/Status');
var uniqueValidator = require('mongoose-unique-validator');
const RoleCategory = require('../../common/constants/RoleCategory');

var modelName = 'Roles';

const roleSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  name: {
      type: String,
      required: true,
      // unique: true,
      //index: true
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
  deletebyId: function(id) {
    return this.findByIdAndDelete(id);
  },
  create: function(data) {
    var entity = new this(data);
    return entity.save();
  },getPaginatedResult: function (query, options) {
    return this.find(query, null, options);
  }
}


const Role = mongoose.model(modelName, roleSchema);

module.exports = Role;