'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Goal = mongoose.model('Goal'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a goal
 */
exports.create = function (req, res) {
  var goal = new Goal(req.body);
  goal.user = req.user;

  goal.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(goal);
    }
  });
};

/**
 * Show the current goal
 */
exports.read = function (req, res) {
  res.json(req.goal);
};

/**
 * Update a goal
 */
exports.update = function (req, res) {
  var goal = req.goal;

  goal.title = req.body.title;
  goal.timeInMinutes = req.body.timeInMinutes;

  goal.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(goal);
    }
  });
};

/**
 * Delete an goal
 */
exports.delete = function (req, res) {
  var goal = req.goal;

  goal.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(goal);
    }
  });
};

/**
 * List of Goals
 */
exports.list = function (req, res) {
  Goal.find(req.query).sort('-created').populate('user', 'displayName').exec(function (err, goals) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(goals);
    }
  });
};

/**
 * Goal middleware
 */
exports.goalByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Goal is invalid'
    });
  }

  Goal.findById(id).populate('user', 'displayName').exec(function (err, goal) {
    if (err) {
      return next(err);
    } else if (!goal) {
      return res.status(404).send({
        message: 'No goal with that identifier has been found'
      });
    }
    req.goal = goal;
    next();
  });
};
