'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Goal = mongoose.model('Goal'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, goal;

/**
 * Goal routes tests
 */
describe('Goal CRUD tests', function () {

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

    // Save a user to the test db and create new goal
    user.save(function () {
      goal = {
        title: 'Goal Title',
        content: 'Goal Content'
      };

      done();
    });
  });

  it('should be able to save an goal if logged in', function (done) {
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

        // Save a new goal
        agent.post('/api/goals')
          .send(goal)
          .expect(200)
          .end(function (articleSaveErr, articleSaveRes) {
            // Handle goal save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Get a list of goals
            agent.get('/api/goals')
              .end(function (articlesGetErr, articlesGetRes) {
                // Handle goal save error
                if (articlesGetErr) {
                  return done(articlesGetErr);
                }

                // Get goals list
                var goals = articlesGetRes.body;

                // Set assertions
                (goals[0].user._id).should.equal(userId);
                (goals[0].title).should.match('Goal Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an goal if not logged in', function (done) {
    agent.post('/api/goals')
      .send(goal)
      .expect(403)
      .end(function (articleSaveErr, articleSaveRes) {
        // Call the assertion callback
        done(articleSaveErr);
      });
  });

  it('should not be able to save an goal if no title is provided', function (done) {
    // Invalidate title field
    goal.title = '';

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

        // Save a new goal
        agent.post('/api/goals')
          .send(goal)
          .expect(400)
          .end(function (articleSaveErr, articleSaveRes) {
            // Set message assertion
            (articleSaveRes.body.message).should.match('Title cannot be blank');

            // Handle goal save error
            done(articleSaveErr);
          });
      });
  });

  it('should be able to update an goal if signed in', function (done) {
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

        // Save a new goal
        agent.post('/api/goals')
          .send(goal)
          .expect(200)
          .end(function (articleSaveErr, articleSaveRes) {
            // Handle goal save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Update goal title
            goal.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing goal
            agent.put('/api/goals/' + articleSaveRes.body._id)
              .send(goal)
              .expect(200)
              .end(function (articleUpdateErr, articleUpdateRes) {
                // Handle goal update error
                if (articleUpdateErr) {
                  return done(articleUpdateErr);
                }

                // Set assertions
                (articleUpdateRes.body._id).should.equal(articleSaveRes.body._id);
                (articleUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of goals if not signed in', function (done) {
    // Create new goal model instance
    var articleObj = new Goal(goal);

    // Save the goal
    articleObj.save(function () {
      // Request goals
      request(app).get('/api/goals')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single goal if not signed in', function (done) {
    // Create new goal model instance
    var articleObj = new Goal(goal);

    // Save the goal
    articleObj.save(function () {
      request(app).get('/api/goals/' + articleObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', goal.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single goal with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/goals/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Goal is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single goal which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent goal
    request(app).get('/api/goals/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No goal with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an goal if signed in', function (done) {
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

        // Save a new goal
        agent.post('/api/goals')
          .send(goal)
          .expect(200)
          .end(function (articleSaveErr, articleSaveRes) {
            // Handle goal save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Delete an existing goal
            agent.delete('/api/goals/' + articleSaveRes.body._id)
              .send(goal)
              .expect(200)
              .end(function (articleDeleteErr, articleDeleteRes) {
                // Handle goal error error
                if (articleDeleteErr) {
                  return done(articleDeleteErr);
                }

                // Set assertions
                (articleDeleteRes.body._id).should.equal(articleSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an goal if not signed in', function (done) {
    // Set goal user
    goal.user = user;

    // Create new goal model instance
    var articleObj = new Goal(goal);

    // Save the goal
    articleObj.save(function () {
      // Try deleting goal
      request(app).delete('/api/goals/' + articleObj._id)
        .expect(403)
        .end(function (articleDeleteErr, articleDeleteRes) {
          // Set message assertion
          (articleDeleteRes.body.message).should.match('User is not authorized');

          // Handle goal error error
          done(articleDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Goal.remove().exec(done);
    });
  });
});
