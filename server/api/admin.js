const express = require('express');
const router = express.Router();

const JwtUtil = require('../utils/JwtUtil');
const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');

// ===================== LOGIN =====================
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    const admin = await AdminDAO.selectByUsernameAndPassword(
      username,
      password
    );

    if (admin) {
      const token = JwtUtil.genToken(username, password);
      res.json({
        success: true,
        message: 'Authentication successful',
        token: token
      });
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

// ===================== TOKEN =====================
router.get('/token', JwtUtil.checkToken, (req, res) => {
  const token =
    req.headers['x-access-token'] || req.headers['authorization'];

  res.json({
    success: true,
    message: 'Token is valid',
    token: token
  });
});

// ===================== CATEGORY =====================
router.get('/categories', JwtUtil.checkToken, async (req, res) => {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

router.post('/categories', JwtUtil.checkToken, async (req, res) => {
  const category = { name: req.body.name };
  const result = await CategoryDAO.insert(category);
  res.json(result);
});

router.put('/categories/:id', JwtUtil.checkToken, async (req, res) => {
  const category = {
    _id: req.params.id,
    name: req.body.name
  };
  const result = await CategoryDAO.update(category);
  res.json(result);
});

router.delete('/categories/:id', JwtUtil.checkToken, async (req, res) => {
  const result = await CategoryDAO.delete(req.params.id);
  res.json(result);
});

// ===================== PRODUCT =====================
router.get('/products', JwtUtil.checkToken, async (req, res) => {
  let products = await ProductDAO.selectAll();

  const sizePage = 4;
  const noPages = Math.ceil(products.length / sizePage);

  let curPage = req.query.page ? parseInt(req.query.page) : 1;
  const offset = (curPage - 1) * sizePage;

  products = products.slice(offset, offset + sizePage);

  res.json({
    products: products,
    noPages: noPages,
    curPage: curPage
  });
});

router.post('/products', JwtUtil.checkToken, async (req, res) => {
  const { name, price, category: cid, image } = req.body;
  const now = new Date().getTime();

  const category = await CategoryDAO.selectByID(cid);

  const product = {
    name: name,
    price: price,
    image: image,
    cdate: now,
    category: category
  };

  const result = await ProductDAO.insert(product);
  res.json(result);
});

router.put('/products/:id', JwtUtil.checkToken, async (req, res) => {
  const { name, price, category: cid, image } = req.body;
  const _id = req.params.id;

  const category = await CategoryDAO.selectByID(cid);

  const product = {
    _id: _id,
    name: name,
    price: price,
    image: image,
    category: category
  };

  const result = await ProductDAO.update(product);
  res.json(result);
});

router.delete('/products/:id', JwtUtil.checkToken, async (req, res) => {
  const result = await ProductDAO.delete(req.params.id);
  res.json(result);
});

module.exports = router;
