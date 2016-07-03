(function () {
	'use strict';
	var notificationIcon = 'modules/core/client/img/brand/logo.png';

	angular
	.module('reminders')
	.controller('RemindersListController', RemindersListController);

	RemindersListController.$inject = ['TasksService', '$scope'];

	function RemindersListController(TasksService, $scope) {
		var vm = this;

		TasksService.UserTask.get(function(data) {
			vm.tasksWithReminders = $scope.getTaskWithReminders(data.data);
			console.log(vm.tasksWithReminders);
		}, function(error) {
			console.log(error);
		});

		$scope.getTaskWithReminders = function(tasks) {
			var tasksWithReminders = [];
			tasks.forEach(function(task) {
				if (task.reminders.length > 0) {
					tasksWithReminders.push(task);
					$scope.createReminders(task);
				}
			});
			return tasksWithReminders;
		};

		$scope.createReminders = function(task) {
			console.log("init createReminders");

			task.reminders.forEach(function(reminder) {
				console.log("loop createReminders");
				var reminderDate = new Date(reminder.time);
				var currentDate = new Date();
				console.log(reminderDate);
				reminder.isCurrent = reminderDate > currentDate;

				if (reminder.isCurrent) {
					task.hasNotification = true;

					if(! ('Notification' in window) ){
						toaster.pop('error', "", 'Web Notification not supported');
						return;
					}   

					console.log(Math.abs(reminderDate - currentDate));
					console.log('Scheduling desktop reminder for ' + task.text + ' - ' + reminder.time);

					Notification.requestPermission(function(permission){
						setTimeout(function(){
							var notification = new Notification(task.type, {body:task.text,icon:notificationIcon, dir:'auto'});
							reminder.isCurrent = false;
						},Math.abs(reminderDate - currentDate));
					});
				}
			});
		}
	}
})();
