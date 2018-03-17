const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Item = require('../../models/item');

const {parseTextFromHTML, buildItemObject} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

const findImageElementBySource = (htmlAsString, src) => {
  const image = jsdom(htmlAsString).querySelector(`img[src="${src}"]`);
  if (image !== null) {
    return image;
  } else {
    throw new Error(`Image with src "${src}" not found in HTML string`);
  }
};

describe('Server path: /items/create', () => {
  const itemToCreate = buildItemObject();

  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  describe('GET', () => {
    it('request that renders empty input fields', async () => {
      const response =  await request(app).get('/items/create');

      assert.include(parseTextFromHTML(response.text, '#title-input'), '');
      assert.include(parseTextFromHTML(response.text, '#imageUrl-input'), '');
      assert.include(parseTextFromHTML(response.text, '#description-input'), '');
    });
  });

  describe('POST', ()=> {
    it('create ans saves a new item', async ()=> {
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreate);
      const createdItem = await Item.findOne(itemToCreate);

      assert.isOk(createdItem, 'Item was not created successfully in the database');
    });

    it('should redirect to home after the creation of a item', async () => {
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreate);
      
      assert.equal(response.status, 302);
      assert.equal(response.headers.location, '/');
    });

    it('request with no title should display an error message', async () => {      
      itemToCreate.title = null;
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreate);
      
      const items = await Item.find({});

      assert.equal(items.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

    it('request with no description should display an error message', async () => {      
      itemToCreate.description = null;
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreate);
      
      const items = await Item.find({});

      assert.equal(items.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

    it('request with no title should display an error message', async () => {      
      itemToCreate.title = null;
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreate);
      
      const items = await Item.find({});

      assert.equal(items.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });
  });
});
