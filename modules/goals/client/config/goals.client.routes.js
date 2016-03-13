'use strict';

// Setting up route
angular.module('goals').config(['$stateProvider',
    function ($stateProvider) {
        // Goals state routing
        $stateProvider.state('goals', {
           abstract: true,
           url: '/goals',
           template: '<ui-view />' 
        })
        .state('goals.list', {
            url: '',
            templateUrl: 'modules/goals/client/views/list-goals.client.view.html'  
        })
        .state('goals.create', {
            url: '/create',
            templateUrl: 'modules/goals/client/views/create-goal.client.view.html',
            date: {
                roles: ['user', 'admin']
            }
        })
        .state('goals.edit', {
            url: '/:goalId/edit',
            templateUrl: 'modules/goals/client/views/edit-goal.client.view.html',
            data: {
                roles: ['user', 'admin']
            }
      });
    }
]);