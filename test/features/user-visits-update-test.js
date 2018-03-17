const {assert} = require('chai');
const {buildItemObject, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

const {title, description, imageUrl} = buildItemObject();

const navigateToUpdate = () => {
  browser.url('/items/create');
  browser.setValue('#title-input', title);
  browser.setValue('#description-input', description);
  browser.setValue('#imageUrl-input', imageUrl);
  browser.click('#submit-button');
  browser.click('.item-card a');
  browser.click('#update-button');
};

describe('User visits the update page', () => {
  describe('before update an item', () => {
    it('title input should have a maxlength of 50', () => {
      const maxlength = 50;
      navigateToUpdate();
      assert.equal(
        browser.getAttribute('#title-input', 'maxlength'),
        maxlength,
      );
    });

    it('placeholders should be rendered', () => {
        const titlePlaceholder = 'Write a title';
        const descriptionPlaceholder = 'Write a description';
        const imageUrlPlaceholder = 'Write an image url';

        navigateToUpdate();

        assert.include(
          browser.getAttribute('#title-input', 'placeholder'),
          titlePlaceholder,
        );
        assert.include(
          browser.getAttribute('#description-input', 'placeholder'), 
          descriptionPlaceholder,
        );
        assert.include(
          browser.getAttribute('#imageUrl-input', 'placeholder'), 
          imageUrlPlaceholder,
        );
    });
    it('title, description and imageUrl are rendered', () => {
        navigateToUpdate();

        assert.strictEqual(
          browser.getValue('#title-input'),
          title,
        );
        assert.strictEqual(
          browser.getValue('#description-input'),
          description,
        );
        assert.strictEqual(
          browser.getValue('#imageUrl-input'),
          imageUrl,
        );
    });
  });
  
  describe('update an item', () => {
    it('is rendered the new item instead the old', () => {
      const newTitle = 'new title';
      const newDescription = 'new description';
      const newImageUrl = 'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg';

      navigateToUpdate();

      browser.setValue('#title-input', newTitle);
      browser.setValue('#description-input', newDescription);
      browser.setValue('#imageUrl-input', newImageUrl);
      browser.click('#submit-button');

      assert.include(browser.getText('body'), newTitle);
      assert.include(browser.getAttribute('body img', 'src'), newImageUrl);

      assert.notInclude(browser.getText('body'), title);
      assert.notInclude(browser.getAttribute('body img', 'src'), imageUrl);
    });
  });
});
