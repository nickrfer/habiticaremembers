(function () {
	'use strict';

	angular
	.module('tasks')
	.controller('TasksListController', TasksListController);

	TasksListController.$inject = ['TasksService'];

	function TasksListController(TasksService) {
		var vm = this;

		TasksService.UserTask.get(function(data) {
		    vm.tasks = data.data;
		    console.log(vm.tasks);
		}, function(error) {
		    console.log(error);
		});
	}
})();
