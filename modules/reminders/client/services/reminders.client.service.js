//Reminders service used to communicate Reminders REST endpoints
(function () {
  'use strict';

  angular
    .module('reminders')
    .factory('RemindersService', RemindersService);

  RemindersService.$inject = ['$resource'];

  function RemindersService($resource) {
    return $resource('api/reminders/:reminderId', {
      reminderId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
