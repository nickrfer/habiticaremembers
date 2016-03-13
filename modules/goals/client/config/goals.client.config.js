'use strict';

// Configuring the Goals module
angular.module('goals').run(['Menus',
    function(Menus) {
        // Add the goals dropdown item
        Menus.addMenuItem('topbar', {
           title: 'Goals',
           state: 'goals',
           type: 'dropdown',
           roles: ['user'] 
        });  
        
        // Add the dropdown list item
        Menus.addSubMenuItem('topbar', 'goals', {
           title: 'Goals',
           state: 'goals.list' 
        });
        
        // Add the dropdown create item
        Menus.addSubMenuItem('topbar', 'goals', {
        title: 'Create Goals',
        state: 'goals.create',
        roles: ['user', 'admin']
        });
        
    }
]);