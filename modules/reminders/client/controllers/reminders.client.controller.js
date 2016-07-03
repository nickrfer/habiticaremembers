(function () {
  'use strict';

  // Reminders controller
  angular
    .module('reminders')
    .controller('RemindersController', RemindersController);

  RemindersController.$inject = ['$scope', '$state', 'Authentication', 'reminderResolve'];

  function RemindersController ($scope, $state, Authentication, reminder) {
    var vm = this;

    vm.authentication = Authentication;
    vm.reminder = reminder;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Reminder
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.reminder.$remove($state.go('reminders.list'));
      }
    }

    // Save Reminder
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.reminderForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.reminder._id) {
        vm.reminder.$update(successCallback, errorCallback);
      } else {
        vm.reminder.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('reminders.view', {
          reminderId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
