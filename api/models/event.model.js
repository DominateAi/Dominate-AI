const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
const EventSource = require('../../common/constants/EventSource');
var uniqueValidator = require('mongoose-unique-validator');

var modelName = 'Events';

const eventSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1 },
  eventId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  eventSource: {
    type: String,
    required: true,
    enum: Object.values(EventSource)
  },
  eventPayload: {
    type: Object,
    required: true,
  }
}, { timestamps: true });

eventSchema.plugin(uniqueValidator);

eventSchema.statics = {
  getById: function (id) {
    return this.findById(id);
  },
  search: function (query) {
    return this.find(query);
  },
  searchOne: function (query) {
    return this.findOne(query);
  },
  deletebyId: function (id) {
    return this.findByIdAndDelete(id);
  },
  create: function (data) {
    var entity = new this(data);
    return entity.save();
  },
  countDocuments: function (query) {
    return this.count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    return this.aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  }
}

const Events = mongoose.model(modelName, eventSchema);

module.exports = Events;