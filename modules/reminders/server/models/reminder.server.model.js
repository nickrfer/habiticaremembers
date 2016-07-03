'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Reminder Schema
 */
var ReminderSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Reminder name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Reminder', ReminderSchema);
