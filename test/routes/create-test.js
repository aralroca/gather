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
    it('create a new item', async ()=> {
      const {title, description, imageUrl} = buildItemObject();
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send({title, description, imageUrl} );

      assert.include(parseTextFromHTML(response.text, '.item-title'), title);
      const imageElement = findImageElementBySource(response.text, imageUrl);
      assert.equal(imageElement.src, imageUrl);
    });
  });
});
