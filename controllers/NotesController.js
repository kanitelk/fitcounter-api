const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const VerifyToken = require('../auth/VerifyToken');
const User = require('../models/User');
const Product = require('../models/Product');
const Note = require('../models/Note');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

module.exports = router;

//ADD NOTE
router.post('/add', VerifyToken, function (req, res) {

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

//GET NOTES BY DATE
router.post('/get', VerifyToken, function (req, res) {

  let start = new Date(req.body.start);
  let end = new Date(req.body.end);

  Note.find({
    user: req.userId,
    date: { $gte: start, $lt: end }
  },
    function (err, notes) {
      if (err) return res.status(500).send(err)
      res.status(200).send(notes);
    });
});
