const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');

const {parseTextFromHTML, parseAttributeFromHTML, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:id/update', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  describe('GET', () => {
    it('Should redirect to home if the item not exist', async () => {
      const itemId = 'non-existing-item';

      const response = await request(app)
      .get(`/items/${itemId}/update`);

      assert.equal(response.status, 302);
      assert.equal(response.headers.location, '/');
    }); 
    
    it('Should render the item if the item exist', async () => {
      const item = await seedItemToDatabase();
      const getValueFromHTML = parseAttributeFromHTML('value');
      const response = await request(app)
        .get(`/items/${item._id}/update`);
      
      assert.equal(response.status, 200);
      assert.include(getValueFromHTML(response.text, '#title-input'), item.title);
      assert.include(getValueFromHTML(response.text, '#description-input'), item.description);
      assert.include(getValueFromHTML(response.text, '#imageUrl-input'), item.imageUrl);
    });  
  });
});
