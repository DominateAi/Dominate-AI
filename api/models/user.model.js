const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var uniqueValidator = require('mongoose-unique-validator');
const Status = require('../../common/constants/Status');


var modelName = 'Users';

const userSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  email: {
      type: String,
      required: true,
      unique: true,
      // index: true
  },
  name: {
    type: String,
    required: true,
    // index: true
  },
  firstName:{
    type: String,
    required: true
  },
  lastName:{
    type: String,
    required: false
  },
  profileImage:{
    type: String
  },
  phone: {
      type: String
  },
  location: {
      type: String,
  },
  timezone: {
      type: String,
  },
  jobTitle:{
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(Status)
  },
  dateOfJoining: {
    type: Date
  },
  role:{
    type: String,
    ref: 'Roles',
    required: true
  },
  targetedLeads: {
    type: Number
  },
  password:{
    type: String,
    required: true,
    minlength:5
  },
  loggedOff:{
    type: Date
  },
  demo:{
    type: Boolean
  },
  verified:{
  type: Boolean
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

//userSchema.index({'$**': 'text'});

userSchema.plugin(uniqueValidator);

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

/**
 * Password hash middleware.
 */
userSchema.pre('findOneAndUpdate', function findOneAndUpdate(next) {
  const user = this;
  if (user._update.$set.password == undefined) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user._update.$set.password , salt, null, (err, hash) => {
      if (err) { return next(err); }
      user._update.$set.password  = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
 }

userSchema.statics = {
  getById: function(id) {
      return this.findById(id).populate('role');
  },
  search: function(query) {
      return this.find(query).populate('role');
  },
  searchOne: function(query) {
    return this.findOne(query).populate('role');
  },
  comparePassword : async function(oldPassword, newPassword, cb){
    var isMatch = bcrypt.compare(oldPassword, newPassword, (err, isMatch) => {
      cb(err, isMatch);
    });
  return isMatch;
  },
  updateById: function(id, updateData) {
      var options = {new:true};
      return this.findOneAndUpdate({ _id: id}, {$set: updateData}, options);
  },
  deletebyId: function(id) {
    return this.findByIdAndDelete(id);
  },
  getPaginatedResult: function (query, options) {
    return this.find(query, null, options).populate('role');
  },
  countDocuments: function (query) {
    return this.count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    return this.aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  },
  create: function(data) {
    var entity = new this(data);
    return entity.save();
  },
  getTextSearchResult: function(text){
    return this.find(
      {$text: {$search: text}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}
    ).populate('role');
  },
  createEmptyCollection: function(){
    this.createCollection();
    //this.createIndexes();
  },
  workspaceUserSearch: function(query){
    return this.find(query);
  }
}


const User = mongoose.model(modelName, userSchema);

module.exports = User;