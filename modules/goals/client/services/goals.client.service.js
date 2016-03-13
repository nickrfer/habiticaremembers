'use strict';

//Goals service used for communicating with the goals REST endpoints
angular.module('goals').factory('Goals', ['$resource',
  function ($resource) {
    return $resource('api/goals/:goalId', {
      goalId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
