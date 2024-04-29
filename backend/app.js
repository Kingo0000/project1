const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');
const orderRouter = require('./routes/orders')
const usersRouter = require('./routes/users')
const indexRouter = require('./routes/index');
const productRouter = require('./routes/products');
const updateRouter = require('./routes/updateusers');
const knexConfig = require('./database');
const knex = require('knex')(knexConfig['development']);
knex.raw('SELECT 1')
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((error) => {
    console.error('Error connecting to database:', error.message);
});


var app = express();


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    req.db = knex;
    next();
});

app.use('/orders', orderRouter);
app.use('/users', usersRouter);
app.use('/', indexRouter);
app.use('/products', productRouter);
app.use("/updateUserDetails", updateRouter);

module.exports = app;
