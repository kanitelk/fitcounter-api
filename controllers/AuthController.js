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


//REGISTER USER
router.post('/register', function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (user) return res.status(500).send('User with this e-mail already registered');
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
});


//LOGIN USER
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

//LOGOUT USER
router.get('/logout', function (req, res) {
  res.status(200).send({ auth: false, token: null });
});

//GET USER INFO
router.get('/me', VerifyToken, function (req, res, next) {
  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");

    res.status(200).send(user);
  });
});

//UPDATE USER
router.post('/update', VerifyToken, function (req, res) {
  User.findOneAndUpdate({ _id: req.userId }, {
    name: req.body.name || User.name,
    email: req.body.email || User.email,
    password: bcrypt.hashSync(req.body.password, 8) || User.password,
    age: req.body.age || User.age,
    weight: req.body.weight || User.weight,
    height: req.body.height || User.height,
    goal: req.body.goal || User.goal,
  },
    function (err, user) {
      if (err) return res.status(500).send('Error on the server.');
      res.status(200).send(user);
    });
});

module.exports = router;