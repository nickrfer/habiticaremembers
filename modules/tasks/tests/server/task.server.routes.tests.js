'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Task = mongoose.model('Task'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, task;

/**
 * Task routes tests
 */
describe('Task CRUD tests', function () {

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

    // Save a user to the test db and create new Task
    user.save(function () {
      task = {
        name: 'Task name'
      };

      done();
    });
  });

  it('should be able to save a Task if logged in', function (done) {
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

        // Save a new Task
        agent.post('/api/tasks')
          .send(task)
          .expect(200)
          .end(function (taskSaveErr, taskSaveRes) {
            // Handle Task save error
            if (taskSaveErr) {
              return done(taskSaveErr);
            }

            // Get a list of Tasks
            agent.get('/api/tasks')
              .end(function (tasksGetErr, tasksGetRes) {
                // Handle Task save error
                if (tasksGetErr) {
                  return done(tasksGetErr);
                }

                // Get Tasks list
                var tasks = tasksGetRes.body;

                // Set assertions
                (tasks[0].user._id).should.equal(userId);
                (tasks[0].name).should.match('Task name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Task if not logged in', function (done) {
    agent.post('/api/tasks')
      .send(task)
      .expect(403)
      .end(function (taskSaveErr, taskSaveRes) {
        // Call the assertion callback
        done(taskSaveErr);
      });
  });

  it('should not be able to save an Task if no name is provided', function (done) {
    // Invalidate name field
    task.name = '';

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

        // Save a new Task
        agent.post('/api/tasks')
          .send(task)
          .expect(400)
          .end(function (taskSaveErr, taskSaveRes) {
            // Set message assertion
            (taskSaveRes.body.message).should.match('Please fill Task name');

            // Handle Task save error
            done(taskSaveErr);
          });
      });
  });

  it('should be able to update an Task if signed in', function (done) {
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

        // Save a new Task
        agent.post('/api/tasks')
          .send(task)
          .expect(200)
          .end(function (taskSaveErr, taskSaveRes) {
            // Handle Task save error
            if (taskSaveErr) {
              return done(taskSaveErr);
            }

            // Update Task name
            task.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Task
            agent.put('/api/tasks/' + taskSaveRes.body._id)
              .send(task)
              .expect(200)
              .end(function (taskUpdateErr, taskUpdateRes) {
                // Handle Task update error
                if (taskUpdateErr) {
                  return done(taskUpdateErr);
                }

                // Set assertions
                (taskUpdateRes.body._id).should.equal(taskSaveRes.body._id);
                (taskUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Tasks if not signed in', function (done) {
    // Create new Task model instance
    var taskObj = new Task(task);

    // Save the task
    taskObj.save(function () {
      // Request Tasks
      request(app).get('/api/tasks')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Task if not signed in', function (done) {
    // Create new Task model instance
    var taskObj = new Task(task);

    // Save the Task
    taskObj.save(function () {
      request(app).get('/api/tasks/' + taskObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', task.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Task with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/tasks/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Task is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Task which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Task
    request(app).get('/api/tasks/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Task with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Task if signed in', function (done) {
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

        // Save a new Task
        agent.post('/api/tasks')
          .send(task)
          .expect(200)
          .end(function (taskSaveErr, taskSaveRes) {
            // Handle Task save error
            if (taskSaveErr) {
              return done(taskSaveErr);
            }

            // Delete an existing Task
            agent.delete('/api/tasks/' + taskSaveRes.body._id)
              .send(task)
              .expect(200)
              .end(function (taskDeleteErr, taskDeleteRes) {
                // Handle task error error
                if (taskDeleteErr) {
                  return done(taskDeleteErr);
                }

                // Set assertions
                (taskDeleteRes.body._id).should.equal(taskSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Task if not signed in', function (done) {
    // Set Task user
    task.user = user;

    // Create new Task model instance
    var taskObj = new Task(task);

    // Save the Task
    taskObj.save(function () {
      // Try deleting Task
      request(app).delete('/api/tasks/' + taskObj._id)
        .expect(403)
        .end(function (taskDeleteErr, taskDeleteRes) {
          // Set message assertion
          (taskDeleteRes.body.message).should.match('User is not authorized');

          // Handle Task error error
          done(taskDeleteErr);
        });

    });
  });

  it('should be able to get a single Task that has an orphaned user reference', function (done) {
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

          // Save a new Task
          agent.post('/api/tasks')
            .send(task)
            .expect(200)
            .end(function (taskSaveErr, taskSaveRes) {
              // Handle Task save error
              if (taskSaveErr) {
                return done(taskSaveErr);
              }

              // Set assertions on new Task
              (taskSaveRes.body.name).should.equal(task.name);
              should.exist(taskSaveRes.body.user);
              should.equal(taskSaveRes.body.user._id, orphanId);

              // force the Task to have an orphaned user reference
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

                    // Get the Task
                    agent.get('/api/tasks/' + taskSaveRes.body._id)
                      .expect(200)
                      .end(function (taskInfoErr, taskInfoRes) {
                        // Handle Task error
                        if (taskInfoErr) {
                          return done(taskInfoErr);
                        }

                        // Set assertions
                        (taskInfoRes.body._id).should.equal(taskSaveRes.body._id);
                        (taskInfoRes.body.name).should.equal(task.name);
                        should.equal(taskInfoRes.body.user, undefined);

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
      Task.remove().exec(done);
    });
  });
});
