'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Goal Schema
 */
var GoalSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  timeInMinutes: {
    type: Number,
    min: 1,
    max: 60,
    required: 'Time in minutes cannot be blank'
  },
  timeCompleted: {
    type: Number,
    default: 0
  },
  dateCompleted: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Goal', GoalSchema);
