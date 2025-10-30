const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { products, customers, orders, addOrder } = require('./data/fakeData');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Home page for customers
app.get('/', (req, res) => {
  // pass categories so the view can render the category menu
  const { products: prods, categories } = require('./data/fakeData');
  res.render('customer', { products: prods, categories });
});

// Customer info page
app.get('/customer-info', (req, res) => {
  res.render('customerInfo');
});

// Cart page
app.get('/cart', (req, res) => {
  res.render('cart');
});

// Agency dashboard
app.get('/agency', (req, res) => {
  res.render('agency', { products, orders });
});

// API endpoints
app.get('/api/products', (req, res) => {
  res.json(products);
});
app.get('/api/customers', (req, res) => {
  res.json(customers);
});
app.get('/api/orders', (req, res) => {
  res.json(orders);
});
app.post('/api/orders', (req, res) => {
  const order = addOrder(req.body);
  res.json(order);
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
