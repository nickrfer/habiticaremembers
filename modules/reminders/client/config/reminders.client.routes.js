(function () {
  'use strict';

  angular
    .module('reminders')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('reminders', {
        abstract: true,
        url: '/reminders',
        template: '<ui-view/>'
      })
      .state('reminders.list', {
        url: '',
        templateUrl: 'modules/reminders/client/views/list-reminders.client.view.html',
        controller: 'RemindersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Reminders List'
        }
      })
      .state('reminders.create', {
        url: '/create',
        templateUrl: 'modules/reminders/client/views/form-reminder.client.view.html',
        controller: 'RemindersController',
        controllerAs: 'vm',
        resolve: {
          reminderResolve: newReminder
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Reminders Create'
        }
      })
      .state('reminders.edit', {
        url: '/:reminderId/edit',
        templateUrl: 'modules/reminders/client/views/form-reminder.client.view.html',
        controller: 'RemindersController',
        controllerAs: 'vm',
        resolve: {
          reminderResolve: getReminder
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Reminder {{ reminderResolve.name }}'
        }
      })
      .state('reminders.view', {
        url: '/:reminderId',
        templateUrl: 'modules/reminders/client/views/view-reminder.client.view.html',
        controller: 'RemindersController',
        controllerAs: 'vm',
        resolve: {
          reminderResolve: getReminder
        },
        data:{
          pageTitle: 'Reminder {{ articleResolve.name }}'
        }
      });
  }

  getReminder.$inject = ['$stateParams', 'RemindersService'];

  function getReminder($stateParams, RemindersService) {
    return RemindersService.get({
      reminderId: $stateParams.reminderId
    }).$promise;
  }

  newReminder.$inject = ['RemindersService'];

  function newReminder(RemindersService) {
    return new RemindersService();
  }
})();
