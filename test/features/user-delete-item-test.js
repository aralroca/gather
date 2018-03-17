const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User delete an item', () => {
  describe('existing item', () => {
    it('should remove the item and render without this item', () => {
      const {title, description, imageUrl} = buildItemObject();

      browser.url('/items/create');
      browser.setValue('#title-input', title);
      browser.setValue('#description-input', description);
      browser.setValue('#imageUrl-input', imageUrl);
      browser.click('#submit-button');

      browser.submitForm('.delete-form');

      assert.notInclude(browser.getText('body'), title);
      assert.notInclude(browser.getAttribute('body img', 'src'), imageUrl);
    });
  });
});
