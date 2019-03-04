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
router.post('/add', VerifyToken, (req, res) => {
  let kcal, proteins, fats;

  Product.find({ _id: req.body.product }, (err, product) => {
    if (err) return res.status(500).send({error: err});
    kcal = Math.round(product.kcal * ((+(req.body.mass)) / 100));
    proteins = Math.round(product.proteins * ((+(req.body.mass)) / 100));
    fats = Math.round(product.fats * ((+(req.body.mass)) / 100));
  })

  Note.create({
    product: req.body.product,
    user: req.userId,
    mass: +(req.body.mass),
    kcal: kcal,
    proteins: proteins,
    fats: fats,
    eatType: req.body.eatType,
    date: new Date(req.body.date)
  },
    (err, note) => {
      if (err) return res.status(500).send({error: err});
      res.status(200).send(note);
    });
});

//UPDATE NOTE
router.post('/update', VerifyToken, (req, res) => {
  let kcal, proteins, fats;

  Product.find({ _id: req.body.product }, (err, product) => {
    if (err) return res.status(500).send({error: err});
    kcal = Math.round(product.kcal * ((+(req.body.mass)) / 100));
    proteins = Math.round(product.proteins * ((+(req.body.mass)) / 100));
    fats = Math.round(product.fats * ((+(req.body.mass)) / 100));
  })

  Note.findOneAndUpdate({
    _id: req.body.id,
    user: req.userId,
  }, {
      product: req.body.product,
      mass: req.body.mass || Note.mass,
      kcal: kcal,
      proteins: proteins,
      fats: fats,
      date: new Deate(req.body.date) || Note.date,
      eatType: req.body.eatType || Note.eatType
    },
    (err, note) => {
      if (err) return res.status(500).send({error: err})
      res.status(200).send(note);
    });
});

//GET NOTES BY DATE
router.post('/get', VerifyToken, (req, res) => {

  let start = new Date(req.body.start);
  let end = new Date(req.body.end);

  Note.find({
    user: req.userId,
    date: { $gte: start, $lt: end }
  },
    (err, notes) => {
      if (err) return res.status(500).send({error: err})
      res.status(200).send(notes);
    });
});

//DELETE NOTE
router.delete('/delete', VerifyToken, (req, res) => {

  Note.findOneAndDelete({
    user: req.userId,
    _id: req.body.id
  },
    (err, note) => {
      if (err) return res.status(500).send({error: err})
      res.status(200).send(note);
    });
});

//DELETE NOTES BY DATE
router.delete('/deleteAll', VerifyToken, (req, res) => {

  let start = new Date(req.body.start);
  let end = new Date(req.body.end);
  let eatType = req.body.eatType;

  Note.remove({
    user: req.userId,
    date: { $gte: start, $lt: end },
  },
    (err, notes) => {
      if (err) return res.status(500).send({error: err})
      res.status(200).send(notes);
    });
});