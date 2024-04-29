
const express = require('express');
const router = express.Router();

router.post('/', async function(req, res) {
  try {
    console.log('Form data:', req.body);

    const product = req.body;
    const image = req.files && req.files.image ? req.files.image.data : null; 
    const type = product.type;
    const name = product.name;
    const description = product.description;
    const price = product.price;
    const quantity = product.quantity;

    console.log('Type:', type);
    console.log('Name:', name);
    console.log('Description:', description);
    console.log('Price:', price);
    console.log('Quantity:', quantity);

    await req.db('products').insert({
      type,
      name,
      description,
      image,
      price,
      available_quantity: quantity
    });

    product.type = '';
    product.name = '';
    product.description = '';
    product.price = '';
    product.quantity = '';

    res.send(`<script>alert("Data inputted successfully!");</script>`);
    res.send('Form submitted successfully!');
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).send('Error submitting form.');
  }
});

router.get('/', async function(req, res) {
  try {
    const products = await req.db('products').select('*');

    res.json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).send('Error getting products.');
  }
});

router.get('/sparkling', async function(req, res) {
  try {
    const products = await req.db('products').where('type', 'sparkling');

    res.json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).send('Error getting products.');
  }
});

router.get('/flavored', async function(req, res) {
  try {
    const products = await req.db('products').where('type', 'flavored');

    res.json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).send('Error getting products.');
  }
});

router.get('/:id', async function(req, res) {
  try {
    const { id } = req.params;
    const products = await req.db('products').where('id', id).first();

    res.json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).send('Error getting products.');
  }
});



module.exports = router;
