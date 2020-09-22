global.config = require("./config.json");
require("./data-access-layer/dal");
const path = require('path')
const morgan = require('morgan');
const express = require("express");
const cors = require("cors");
const userController = require('./controllers/user-controller');
const categoriesController = require('./controllers/categories-controller');
const productsController = require('./controllers/products-controller');
const cartController = require('./controllers/cart-controller');
const orderController = require('./controllers/order-controller');

const app = express();


app.use(morgan('dev'));
app.use(express.json({ extended: false }));
app.use(cors());
app.use("/images", express.static(path.join("./images")));

app.use('/api/users',userController);
app.use('/api/categories',categoriesController);
app.use('/api/products',productsController);
app.use('/api/cart',cartController);
app.use('/api/orders',orderController);




const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
