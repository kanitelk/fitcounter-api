const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const VerifyToken = require('../auth/VerifyToken');
const User = require('../models/User');
const Product = require('../models/Product');
const Note = require('../models/Note');
const config = require('../config');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/register', function (req, res) {

  const hashedPassword = bcrypt.hashSync(req.body.password, 8);

  User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  },
    function (err, user) {
      if (err) return res.status(500).send("There was a problem registering the user.")
      // create a token
      let token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).send({ auth: true, token: token });
    });
});

//CREATE PRODUCT
router.post('/product', function (req, res) {

  Product.create({
    name: req.body.name,
    kcal: req.body.kcal,
  },
    function (err, product) {
      if (err) return res.status(500).send("There was a problem creating the product.")
      res.status(200).send(product);
    });
});

//CREATE NOTE
router.post('/note', VerifyToken, function (req, res) {

  Note.create({
    product: req.body.product,
    user: req.userId,
    mass: +(req.body.mass),
  },
    function (err, note) {
      if (err) return res.status(500).send(err)
      res.status(200).send(note);
    });
});

router.get('/me', VerifyToken, function (req, res, next) {
  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");

    res.status(200).send(user);
  });
});

router.post('/login', function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');
    let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    let token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
  });
});

router.get('/logout', function (req, res) {
  res.status(200).send({ auth: false, token: null });
});

module.exports = router;