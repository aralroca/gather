const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User visits the create page', () => {
  describe('before post', () => {
    it('button should contain the text "Add new item"', () => {
      const expectedText = 'Add new item';
      browser.url('/items/create');
      assert.include(browser.getText('#submit-button'), expectedText);
    });

    it('title input should have a maxlength of 50', () => {
      const maxlength = 50;
      browser.url('/items/create');
      assert.equal(
        browser.getAttribute('#title-input', 'maxlength'),
        maxlength
      );
    });

    it('placeholders should be rendered', () => {
      const titlePlaceholder = 'Write a title';
      const descriptionPlaceholder = 'Write a description';
      const imageUrlPlaceholder = 'Write an image url';

      browser.url('/items/create');

      assert.include(
        browser.getAttribute('#title-input', 'placeholder'),
        titlePlaceholder
      );
      assert.include(
        browser.getAttribute('#description-input', 'placeholder'), 
        descriptionPlaceholder
      );
      assert.include(
        browser.getAttribute('#imageUrl-input', 'placeholder'), 
        imageUrlPlaceholder
      );
    });
  });

  describe('posts a new item', () => {
    it('is rendered', () => {
      const {title, description, imageUrl} = buildItemObject();
      browser.url('/items/create');

      browser.setValue('#title-input', title);
      browser.setValue('#description-input', description);
      browser.setValue('#imageUrl-input', imageUrl);
      browser.click('#submit-button');

      assert.include(browser.getText('body'), title);
      assert.include(browser.getAttribute('body img', 'src'), imageUrl);
    });
  });
});
