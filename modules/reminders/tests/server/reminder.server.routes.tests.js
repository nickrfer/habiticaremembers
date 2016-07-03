'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Reminder = mongoose.model('Reminder'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, reminder;

/**
 * Reminder routes tests
 */
describe('Reminder CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Reminder
    user.save(function () {
      reminder = {
        name: 'Reminder name'
      };

      done();
    });
  });

  it('should be able to save a Reminder if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Reminder
        agent.post('/api/reminders')
          .send(reminder)
          .expect(200)
          .end(function (reminderSaveErr, reminderSaveRes) {
            // Handle Reminder save error
            if (reminderSaveErr) {
              return done(reminderSaveErr);
            }

            // Get a list of Reminders
            agent.get('/api/reminders')
              .end(function (remindersGetErr, remindersGetRes) {
                // Handle Reminder save error
                if (remindersGetErr) {
                  return done(remindersGetErr);
                }

                // Get Reminders list
                var reminders = remindersGetRes.body;

                // Set assertions
                (reminders[0].user._id).should.equal(userId);
                (reminders[0].name).should.match('Reminder name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Reminder if not logged in', function (done) {
    agent.post('/api/reminders')
      .send(reminder)
      .expect(403)
      .end(function (reminderSaveErr, reminderSaveRes) {
        // Call the assertion callback
        done(reminderSaveErr);
      });
  });

  it('should not be able to save an Reminder if no name is provided', function (done) {
    // Invalidate name field
    reminder.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Reminder
        agent.post('/api/reminders')
          .send(reminder)
          .expect(400)
          .end(function (reminderSaveErr, reminderSaveRes) {
            // Set message assertion
            (reminderSaveRes.body.message).should.match('Please fill Reminder name');

            // Handle Reminder save error
            done(reminderSaveErr);
          });
      });
  });

  it('should be able to update an Reminder if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Reminder
        agent.post('/api/reminders')
          .send(reminder)
          .expect(200)
          .end(function (reminderSaveErr, reminderSaveRes) {
            // Handle Reminder save error
            if (reminderSaveErr) {
              return done(reminderSaveErr);
            }

            // Update Reminder name
            reminder.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Reminder
            agent.put('/api/reminders/' + reminderSaveRes.body._id)
              .send(reminder)
              .expect(200)
              .end(function (reminderUpdateErr, reminderUpdateRes) {
                // Handle Reminder update error
                if (reminderUpdateErr) {
                  return done(reminderUpdateErr);
                }

                // Set assertions
                (reminderUpdateRes.body._id).should.equal(reminderSaveRes.body._id);
                (reminderUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Reminders if not signed in', function (done) {
    // Create new Reminder model instance
    var reminderObj = new Reminder(reminder);

    // Save the reminder
    reminderObj.save(function () {
      // Request Reminders
      request(app).get('/api/reminders')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Reminder if not signed in', function (done) {
    // Create new Reminder model instance
    var reminderObj = new Reminder(reminder);

    // Save the Reminder
    reminderObj.save(function () {
      request(app).get('/api/reminders/' + reminderObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', reminder.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Reminder with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/reminders/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Reminder is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Reminder which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Reminder
    request(app).get('/api/reminders/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Reminder with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Reminder if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Reminder
        agent.post('/api/reminders')
          .send(reminder)
          .expect(200)
          .end(function (reminderSaveErr, reminderSaveRes) {
            // Handle Reminder save error
            if (reminderSaveErr) {
              return done(reminderSaveErr);
            }

            // Delete an existing Reminder
            agent.delete('/api/reminders/' + reminderSaveRes.body._id)
              .send(reminder)
              .expect(200)
              .end(function (reminderDeleteErr, reminderDeleteRes) {
                // Handle reminder error error
                if (reminderDeleteErr) {
                  return done(reminderDeleteErr);
                }

                // Set assertions
                (reminderDeleteRes.body._id).should.equal(reminderSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Reminder if not signed in', function (done) {
    // Set Reminder user
    reminder.user = user;

    // Create new Reminder model instance
    var reminderObj = new Reminder(reminder);

    // Save the Reminder
    reminderObj.save(function () {
      // Try deleting Reminder
      request(app).delete('/api/reminders/' + reminderObj._id)
        .expect(403)
        .end(function (reminderDeleteErr, reminderDeleteRes) {
          // Set message assertion
          (reminderDeleteRes.body.message).should.match('User is not authorized');

          // Handle Reminder error error
          done(reminderDeleteErr);
        });

    });
  });

  it('should be able to get a single Reminder that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Reminder
          agent.post('/api/reminders')
            .send(reminder)
            .expect(200)
            .end(function (reminderSaveErr, reminderSaveRes) {
              // Handle Reminder save error
              if (reminderSaveErr) {
                return done(reminderSaveErr);
              }

              // Set assertions on new Reminder
              (reminderSaveRes.body.name).should.equal(reminder.name);
              should.exist(reminderSaveRes.body.user);
              should.equal(reminderSaveRes.body.user._id, orphanId);

              // force the Reminder to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Reminder
                    agent.get('/api/reminders/' + reminderSaveRes.body._id)
                      .expect(200)
                      .end(function (reminderInfoErr, reminderInfoRes) {
                        // Handle Reminder error
                        if (reminderInfoErr) {
                          return done(reminderInfoErr);
                        }

                        // Set assertions
                        (reminderInfoRes.body._id).should.equal(reminderSaveRes.body._id);
                        (reminderInfoRes.body.name).should.equal(reminder.name);
                        should.equal(reminderInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Reminder.remove().exec(done);
    });
  });
});
