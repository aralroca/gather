const router = require('express').Router();

const Item = require('../models/item');

router.get('/', async (req, res, next) => {
  const items = await Item.find({});
  res.render('index', {items});
});

router.get('/items/create', (req, res, next) => {
  res.render('create');
});

router.post('/items/create', async (req, res, next) => {
  const { title, description, imageUrl } = req.body;
  const newItem = new Item({ title, description, imageUrl });

  newItem.validateSync();

  if(newItem.errors) {
    res.status(400).render('create', {newItem});
  } else {
    await newItem.save();
    res.redirect('/');
  }
});

router.get('/items/:itemId', async (req, res, next) => {
  const item = await Item.findById(req.params.itemId);

  if(item.errors){
    res.redirect('/');
  } else {
    res.render('single', {item});
  }
});

router.post('/items/:itemId/delete', async (req, res, next) => {
  await Item.remove({ _id: req.params.itemId });
  res.redirect('/');
});

router.get('/items/:itemId/update', async (req, res, next) => {
  try {
    const item = await Item.findOne({ _id: req.params.itemId });
    res.render('update', {item});
  } catch(e){
    res.redirect('/');
  }
});

module.exports = router;
