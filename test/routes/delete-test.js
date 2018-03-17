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

      await request(app).post(`/items/${item._id}/delete`);
      const response = await request(app).get('/');
      
      assert.notInclude(response.text, `item-${item._id}`);
    }); 
    
    it('Should not remove the item if is different :id', async () => {
      const item = await seedItemToDatabase();
 
      await request(app).post('/items/_incorrectId_/delete');
      const response = await request(app).get('/');
      
      assert.include(response.text, `item-${item._id}`);
    });  

    it('Should redirect to home after removing', async () => {
      const item = await seedItemToDatabase();
      const response = await request(app)
      .post(`/items/${item._id}/delete`);
      
      assert.equal(response.status, 302);
      assert.equal(response.headers.location, '/');
    });
    
    it('Should redirect to home if not remove any item', async () => {
      const response = await request(app)
      .post(`/items/_incorrectId_/delete`);
      
      assert.equal(response.status, 302);
      assert.equal(response.headers.location, '/');
    }); 
  });
});
