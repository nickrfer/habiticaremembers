'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Reminder = mongoose.model('Reminder'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Reminder
 */
exports.create = function(req, res) {
  var reminder = new Reminder(req.body);
  reminder.user = req.user;

  reminder.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(reminder);
    }
  });
};

/**
 * Show the current Reminder
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var reminder = req.reminder ? req.reminder.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  reminder.isCurrentUserOwner = req.user && reminder.user && reminder.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(reminder);
};

/**
 * Update a Reminder
 */
exports.update = function(req, res) {
  var reminder = req.reminder ;

  reminder = _.extend(reminder , req.body);

  reminder.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(reminder);
    }
  });
};

/**
 * Delete an Reminder
 */
exports.delete = function(req, res) {
  var reminder = req.reminder ;

  reminder.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(reminder);
    }
  });
};

/**
 * List of Reminders
 */
exports.list = function(req, res) { 
  Reminder.find().sort('-created').populate('user', 'displayName').exec(function(err, reminders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(reminders);
    }
  });
};

/**
 * Reminder middleware
 */
exports.reminderByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Reminder is invalid'
    });
  }

  Reminder.findById(id).populate('user', 'displayName').exec(function (err, reminder) {
    if (err) {
      return next(err);
    } else if (!reminder) {
      return res.status(404).send({
        message: 'No Reminder with that identifier has been found'
      });
    }
    req.reminder = reminder;
    next();
  });
};
