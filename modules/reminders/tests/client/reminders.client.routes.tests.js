(function () {
  'use strict';

  describe('Reminders Route Tests', function () {
    // Initialize global variables
    var $scope,
      RemindersService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _RemindersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      RemindersService = _RemindersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('reminders');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/reminders');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          RemindersController,
          mockReminder;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('reminders.view');
          $templateCache.put('modules/reminders/client/views/view-reminder.client.view.html', '');

          // create mock Reminder
          mockReminder = new RemindersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Reminder Name'
          });

          //Initialize Controller
          RemindersController = $controller('RemindersController as vm', {
            $scope: $scope,
            reminderResolve: mockReminder
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:reminderId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.reminderResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            reminderId: 1
          })).toEqual('/reminders/1');
        }));

        it('should attach an Reminder to the controller scope', function () {
          expect($scope.vm.reminder._id).toBe(mockReminder._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/reminders/client/views/view-reminder.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          RemindersController,
          mockReminder;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('reminders.create');
          $templateCache.put('modules/reminders/client/views/form-reminder.client.view.html', '');

          // create mock Reminder
          mockReminder = new RemindersService();

          //Initialize Controller
          RemindersController = $controller('RemindersController as vm', {
            $scope: $scope,
            reminderResolve: mockReminder
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.reminderResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/reminders/create');
        }));

        it('should attach an Reminder to the controller scope', function () {
          expect($scope.vm.reminder._id).toBe(mockReminder._id);
          expect($scope.vm.reminder._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/reminders/client/views/form-reminder.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          RemindersController,
          mockReminder;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('reminders.edit');
          $templateCache.put('modules/reminders/client/views/form-reminder.client.view.html', '');

          // create mock Reminder
          mockReminder = new RemindersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Reminder Name'
          });

          //Initialize Controller
          RemindersController = $controller('RemindersController as vm', {
            $scope: $scope,
            reminderResolve: mockReminder
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:reminderId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.reminderResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            reminderId: 1
          })).toEqual('/reminders/1/edit');
        }));

        it('should attach an Reminder to the controller scope', function () {
          expect($scope.vm.reminder._id).toBe(mockReminder._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/reminders/client/views/form-reminder.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
