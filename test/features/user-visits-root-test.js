const {assert} = require('chai');

describe('User visits root', () => {
  describe('without existing items', () => {
    it('starts blank', () => {
      browser.url('/');
      assert.equal(browser.getText('#items-container'), '');
    });
  });

  describe('clicking on a link to navigate', () => {
    it('to create.html from root', () => {
      browser.url('/');
      browser.click('a[href="/items/create"]');
      assert.include(browser.getText('body'), 'Create');
    });
  });
});
