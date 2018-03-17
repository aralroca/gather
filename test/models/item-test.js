const Item = require('../../models/item');
const {assert} = require('chai');
const {mongoose, databaseUrl, options} = require('../../database');

describe('Model: Item', () => {
  beforeEach(async () => {
    await mongoose.connect(databaseUrl, options);
    await mongoose.connection.db.dropDatabase();
  });

  afterEach(async () => {
    await mongoose.disconnect();
  });

  describe('title field', () => {
    it('should be a String', () => {
      const title = 30;
      const item = new Item({ title });

      assert.strictEqual(item.title, title.toString());
    });

    it('should be required', () => {
      const item = new Item({});
      item.validateSync();
      assert.strictEqual(item.errors.title.message, 'Path `title` is required.');   
    });
  });

  describe('description field', () => {
    it('should be a String', () => {
      const description = 30;
      const item = new Item({ description });

      assert.strictEqual(item.description, description.toString());
    });

    it('should be required', () => {
      const item = new Item({});
      item.validateSync();
      assert.strictEqual(item.errors.description.message, 'Path `description` is required.');   
    });
  });

  describe('imageUrl field', () => {
    it('should be a String', () => {
      const imageUrl = 30;
      const item = new Item({ imageUrl });

      assert.strictEqual(item.imageUrl, imageUrl.toString());
    });

    it('should be required', () => {
      const item = new Item({});
      item.validateSync();
      assert.strictEqual(item.errors.imageUrl.message, 'Path `imageUrl` is required.');   
    });
  });
});
