'use strict';

(function () {
  // Goals Controller Spec
  describe('Goals Controller Tests', function () {
    // Initialize global variables
    var ArticlesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Goals,
      mockArticle;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Articles_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Goals = _Articles_;

      // create mock goal
      mockArticle = new Goals({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Goal about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Goals controller.
      ArticlesController = $controller('ArticlesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one goal object fetched from XHR', inject(function (Goals) {
      // Create a sample goals array that includes the new goal
      var sampleArticles = [mockArticle];

      // Set GET response
      $httpBackend.expectGET('api/goals').respond(sampleArticles);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.goals).toEqualData(sampleArticles);
    }));

    it('$scope.findOne() should create an array with one goal object fetched from XHR using a goalId URL parameter', inject(function (Goals) {
      // Set the URL parameter
      $stateParams.goalId = mockArticle._id;

      // Set GET response
      $httpBackend.expectGET(/api\/goals\/([0-9a-fA-F]{24})$/).respond(mockArticle);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.goal).toEqualData(mockArticle);
    }));

    describe('$scope.create()', function () {
      var sampleArticlePostData;

      beforeEach(function () {
        // Create a sample goal object
        sampleArticlePostData = new Goals({
          title: 'A Goal about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'A Goal about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Goals) {
        // Set POST response
        $httpBackend.expectPOST('api/goals', sampleArticlePostData).respond(mockArticle);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the goal was created
        expect($location.path.calls.mostRecent().args[0]).toBe('goals/' + mockArticle._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/goals', sampleArticlePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock goal in scope
        scope.goal = mockArticle;
      });

      it('should update a valid goal', inject(function (Goals) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/goals\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/goals/' + mockArticle._id);
      }));

      it('should set scope.error to error response message', inject(function (Goals) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/goals\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(goal)', function () {
      beforeEach(function () {
        // Create new goals array and include the goal
        scope.goals = [mockArticle, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/goals\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockArticle);
      });

      it('should send a DELETE request with a valid goalId and remove the goal from the scope', inject(function (Goals) {
        expect(scope.goals.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.goal = mockArticle;

        $httpBackend.expectDELETE(/api\/goals\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to goals', function () {
        expect($location.path).toHaveBeenCalledWith('goals');
      });
    });
  });
}());
