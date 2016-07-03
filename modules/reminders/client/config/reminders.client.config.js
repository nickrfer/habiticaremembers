(function () {
  'use strict';

  angular
    .module('reminders')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Reminders',
      state: 'reminders',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'reminders', {
      title: 'List Reminders',
      state: 'reminders.list',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'reminders', {
      title: 'Create Reminder',
      state: 'reminders.create',
      roles: ['admin']
    });
  }
})();
