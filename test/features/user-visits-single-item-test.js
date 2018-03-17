const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User navigates to create page', () => {
  describe('add a new item', () => {
    it('item should be displayed after the creation', () => {
      const {title, description, imageUrl} = buildItemObject();

      browser.url('/items/create');
      browser.setValue('#title-input', title);
      browser.setValue('#description-input', description);
      browser.setValue('#imageUrl-input', imageUrl);
      browser.click('#submit-button');
      browser.click('.item-card a');

      assert.include(browser.getText('body'), description);
    });
  });
});

