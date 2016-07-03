'use strict';

describe('Reminders E2E Tests:', function () {
  describe('Test Reminders page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/reminders');
      expect(element.all(by.repeater('reminder in reminders')).count()).toEqual(0);
    });
  });
});
