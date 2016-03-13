'use strict';

describe('Goals E2E Tests:', function () {
  describe('Test goals page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/goals');
      expect(element.all(by.repeater('goal in goals')).count()).toEqual(0);
    });
  });
});
