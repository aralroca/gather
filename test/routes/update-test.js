const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');
const Item = require('../../models/item');

const {parseTextFromHTML, parseAttributeFromHTML, seedItemToDatabase, buildItemObject} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:id/update', () => {
  const itemToCreate = buildItemObject();

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

  describe('POST', () => {
    it('save data of item', async () => {
      const oldItem = await seedItemToDatabase();
      const newItem = buildItemObject();

      const response = await request(app)
        .post(`/items/${oldItem._id}/update`)
        .type('form')
        .send(newItem);

      const updatedItem = await Item.findOne(newItem);
      assert.isOk(updatedItem, 'Item was not modified successfully in the database');
      assert.equal(updatedItem._id.toString(), oldItem._id.toString());
    });

    it('should not possible to update an empty title', async () => {
      const oldItem = await seedItemToDatabase();
      const newItem = buildItemObject();
      const getValueFromHTML = parseAttributeFromHTML('value');

      newItem.title = undefined;

      const response = await request(app)
        .post(`/items/${oldItem._id}/update`)
        .type('form')
        .send(newItem);
      
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

    it('should not possible to update an empty description', async () => {
      const oldItem = await seedItemToDatabase();
      const newItem = buildItemObject();
      const getValueFromHTML = parseAttributeFromHTML('value');

      newItem.description = undefined;

      const response = await request(app)
        .post(`/items/${oldItem._id}/update`)
        .type('form')
        .send(newItem);
      
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

    it('should not possible to update an empty imageUrl', async () => {
      const oldItem = await seedItemToDatabase();
      const newItem = buildItemObject();
      const getValueFromHTML = parseAttributeFromHTML('value');

      newItem.imageUrl = undefined;

      const response = await request(app)
        .post(`/items/${oldItem._id}/update`)
        .type('form')
        .send(newItem);
      
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

    it('should redirect to home after the mofication of the item', async () => {
      const oldItem = await seedItemToDatabase();
      const newItem = buildItemObject();
      const getValueFromHTML = parseAttributeFromHTML('value');

      const response = await request(app)
        .post(`/items/${oldItem._id}/update`)
        .type('form')
        .send(newItem);
      
      assert.equal(response.status, 302);
      assert.equal(response.headers.location, '/');
    });
  });
});
