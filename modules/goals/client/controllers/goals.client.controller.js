'use strict';

// Goals controller
angular.module('goals').controller('GoalsController', ['$scope', '$interval',
    '$stateParams', '$location', 'Authentication', 'Goals',
  function ($scope, $interval, $stateParams, $location, Authentication, Goals) {
    $scope.authentication = Authentication;
    
    var stop;
    
    // Initialize the progress bar
    $scope.initProgress = function(goal) {
        if (angular.isDefined(stop) || goal.timeCompleted >= goal.timeInMinutes) return;
        
        $scope.tracking = goal;
        $scope.timeInSeconds = goal.timeCompleted * 60;
        
        stop = $interval(function() {
            $scope.timeInSeconds = $scope.timeInSeconds + 1;
            goal.timeCompleted = Math.floor($scope.timeInSeconds / 60);
            
            console.log(goal.timeCompleted);
            
            if (goal.timeCompleted >= goal.timeInMinutes) {
                $scope.stopProgress();
            }
          }, 1000);
    };
    
    // Stops the progress bar
    $scope.stopProgress = function() {
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
            $scope.tracking = null;
        }
    };

    // Create new Goal
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'goalForm');

        return false;
      }

      // Create new Goal object
      var goal = new Goals({
        title: this.title,
        timeInMinutes: this.timeInMinutes
      });

      // Redirect after save
      goal.$save(function (response) {
        $location.path('goals');

        // Clear form fields
        $scope.title = '';
        $scope.timeInMinutes = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Goal
    $scope.remove = function (goal) {
      if (goal) {
        goal.$remove();

        for (var i in $scope.goals) {
          if ($scope.goals[i] === goal) {
            $scope.goals.splice(i, 1);
          }
        }
      } else {
        $scope.goal.$remove(function () {
          $location.path('goals');
        });
      }
    };

    // Update existing Goal
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'goalForm');

        return false;
      }

      var goal = $scope.goal;

      goal.$update(function () {
        $location.path('goals');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Goals
    $scope.find = function () {
      $scope.goals = Goals.query({user: $scope.authentication.user._id});
    };

    // Find existing Goal
    $scope.findOne = function () {
      $scope.goal = Goals.get({
        goalId: $stateParams.goalId
      });
    };
  }
]);
