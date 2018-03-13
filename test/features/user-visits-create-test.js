const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User visits the create page', () => {
  describe('posts a new item', () => {
    it('is rendered', () => {
      const {title, description, imageUrl} = buildItemObject();
      browser.url('/create.html');
      
      browser.setValue('#title-input', title);
      browser.setValue('#description-input', description);
      browser.setValue('#imageUrl-input', imageUrl);
      browser.click('#submit-button');

      assert.include(browser.getText('body'), title);
      assert.include(browser.getAttribute('body img', 'src'), imageUrl);
    });
  });
});
