'use strict';

/**
 * Module dependencies
 */
var remindersPolicy = require('../policies/reminders.server.policy'),
  reminders = require('../controllers/reminders.server.controller');

module.exports = function(app) {
  // Reminders Routes
  app.route('/api/reminders').all(remindersPolicy.isAllowed)
    .get(reminders.list)
    .post(reminders.create);

  app.route('/api/reminders/:reminderId').all(remindersPolicy.isAllowed)
    .get(reminders.read)
    .put(reminders.update)
    .delete(reminders.delete);

  // Finish by binding the Reminder middleware
  app.param('reminderId', reminders.reminderByID);
};
