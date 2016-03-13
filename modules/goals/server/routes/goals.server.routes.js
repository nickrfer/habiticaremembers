'use strict';

/**
 * Module dependencies.
 */
var goalsPolicy = require('../policies/goals.server.policy'),
  goals = require('../controllers/goals.server.controller');

module.exports = function (app) {
  // Goals collection routes
  app.route('/api/goals').all(goalsPolicy.isAllowed)
    .get(goals.list)
    .post(goals.create);

  // Single goal routes
  app.route('/api/goals/:goalId').all(goalsPolicy.isAllowed)
    .get(goals.read)
    .put(goals.update)
    .delete(goals.delete);

  // Finish by binding the goal middleware
  app.param('goalId', goals.goalByID);
};
