const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:id/delete', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  describe('POST', () => {
    it('Should remove the item by :id', async () => {
      const item = await seedItemToDatabase();
      const response = await request(app)
      .post(`/items/${item._id}/delete`);
      
      assert.notInclude(parseTextFromHTML(response.text, 'body'), `#item-${item._id}`);
    });  
  });
});
