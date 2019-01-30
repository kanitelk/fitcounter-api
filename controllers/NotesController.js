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
    eatType: req.body.eatType
  },
    function (err, note) {
      if (err) return res.status(500).send(err)
      res.status(200).send(note);
    });
});

//EDIT NOTE
router.post('/edit', VerifyToken, function (req, res) {

  Note.findOneAndUpdate({
    _id: req.body.id,
    user: req.userId,
  }, {
      mass: req.body.mass || Note.mass,
      date: new Deate(req.body.date) || Note.date,
      eatType: req.body.eatType || Note.eatType
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

//DELETE NOTE
router.delete('/delete', VerifyToken, function (req, res) {

  Note.findOneAndDelete({
    user: req.userId,
    _id: req.body.noteId
  },
    function (err, note) {
      if (err) return res.status(500).send(err)
      res.status(200).send(note);
    });
});

//DELETE NOTES BY DATE
router.delete('/deleteAll', VerifyToken, function (req, res) {

  let start = new Date(req.body.start);
  let end = new Date(req.body.end);
  let eatType = req.body.eatType;

  Note.remove({
    user: req.userId,
    date: { $gte: start, $lt: end },
  },
    function (err, notes) {
      if (err) return res.status(500).send(err)
      res.status(200).send(notes);
    });
});