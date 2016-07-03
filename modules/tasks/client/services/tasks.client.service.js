//Tasks service used to communicate Tasks REST endpoints
(function () {
  'use strict';

  var userTaskApiUrl = 'https://habitica.com/api/v3/tasks/user';
  var exportAvatar = 'https://habitica.com/export/avatar-:uuid.png';
  var updateTaskApiUrl = 'https://habitica.com/api/v3/task/:taskId';
  var notificationIcon = 'http://iwatchgameofthrones.net/wp-content/uploads/2015/05/north-remembers-stark-black-tshirt.jpg';

  angular
  .module('tasks')
  .factory('TasksService', TasksService);

  TasksService.$inject = ['$resource', 'Authentication'];

  function TasksService($resource, Authentication) {
    return {
      UserTask: $resource(userTaskApiUrl, {}, {
        get: {
          method: 'GET',
          headers: { 'x-api-user': Authentication.user.habiticaUserId,
            'x-api-key': Authentication.user.habiticaApiKey
          }
        }
      }),
      UpdateTask: $resource(updateTaskApiUrl, {taskId: '@id'}, {
        update: {
          method: 'PUT'
        }
      })
    };
  }
})();
