const express = require('express');
const router = express.Router();

// utils
const CryptoUtil = require('../utils/CryptoUtil');
const JwtUtil = require('../utils/JwtUtil');

// daos
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const CustomerDAO = require('../models/CustomerDAO');


// ================= CATEGORY =================
router.get('/categories', async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});


// ================= PRODUCT =================

// lấy product mới
router.get('/products/new', async function (req, res) {
  const products = await ProductDAO.selectTopNew(3);
  res.json(products);
});

// lấy product hot
router.get('/products/hot', async function (req, res) {
  const products = await ProductDAO.selectTopHot(3);
  res.json(products);
});

// lấy product theo category
router.get('/products/category/:cid', async function (req, res) {
  const _cid = req.params.cid;
  const products = await ProductDAO.selectByCatID(_cid);
  res.json(products);
});

// tìm product theo keyword
router.get('/products/search/:keyword', async function (req, res) {
  const keyword = req.params.keyword;
  const products = await ProductDAO.selectByKeyword(keyword);
  res.json(products);
});

// lấy tất cả product
router.get('/products', async function (req, res) {
  const products = await ProductDAO.selectAll();
  res.json(products);
});

// lấy product theo id
router.get('/products/:id', async function (req, res) {
  const _id = req.params.id;
  const product = await ProductDAO.selectByID(_id);
  res.json(product);
});


// ================= CUSTOMER =================

// signup
router.post('/signup', async function (req, res) {
  try {

    const { username, password, name, phone, email } = req.body;

    const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);

    if (dbCust) {
      return res.json({
        success: false,
        message: 'Username or email already exists'
      });
    }

    const now = new Date().getTime();
    const token = CryptoUtil.md5(now.toString());

    const newCust = {
      username,
      password,
      name,
      phone,
      email,
      active: 0,
      token
    };

    const result = await CustomerDAO.insert(newCust);

    res.json({
      success: true,
      message: "Signup success",
      customer: result
    });

  } catch (err) {

    console.error("Signup error:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
});


// ================= ACTIVE ACCOUNT =================
router.post('/active', async function (req, res) {

  const _id = req.body.id;
  const token = req.body.token;

  const result = await CustomerDAO.active(_id, token, 1);

  res.json(result);

});


// ================= LOGIN =================
router.post('/login', async function (req, res) {

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {

    const customer = await CustomerDAO.selectByUsernameAndPassword(username, password);

    if (customer) {

      if (customer.active === 1) {

        const token = JwtUtil.genToken();

        res.json({
          success: true,
          message: 'Authentication successful',
          token: token,
          customer: customer
        });

      } else {

        res.json({
          success: false,
          message: 'Account is deactive'
        });

      }

    } else {

      res.json({
        success: false,
        message: 'Incorrect username or password'
      });

    }

  } else {

    res.json({
      success: false,
      message: 'Please input username and password'
    });

  }

});


// ================= CHECK TOKEN =================
router.get('/token', JwtUtil.checkToken, function (req, res) {

  const token = req.headers['x-access-token'] || req.headers['authorization'];

  res.json({
    success: true,
    message: 'Token is valid',
    token: token
  });

});


// ================= UPDATE PROFILE =================
router.put('/customers/:id', JwtUtil.checkToken, async function (req, res) {

  const _id = req.params.id;

  const customer = {
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email
  };

  const result = await CustomerDAO.update(_id, customer);

  res.json(result);

});


module.exports = router;