const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const VerifyToken = require("../auth/VerifyToken");
const User = require("../models/User");
const Product = require("../models/Product");
const Note = require("../models/Note");
const config = require("../config");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//CREATE PRODUCT
router.post("/add", (req, res) => {
  Product.create(
    {
      name: req.body.name,
      kcal: req.body.kcal,
      proteins: req.body.proteins,
      fats: req.body.fats,
      carboh: req.body.carboh,
      image: req.body.image,
      description: req.body.description
    },
    (err, product) => {
      if (err)
        return res
          .status(200)
          .send("There was a problem creating the product.");
      res.status(200).send(product);
    }
  );
});

//UPDATE PRODUCT
router.post("/update", (req, res) => {
  Product.findOneAndUpdate(
    {
      _id: req.body.id
    },
    {
      name: req.body.name || Product.name,
      kcal: req.body.kcal || Product.kcal,
      proteins: req.body.proteins || Product.proteins,
      fats: req.body.fats || Product.fats,
      carboh: req.body.carboh || Product.carboh,
      image: req.body.image || Product.image,
      description: req.body.description || Product.description
    },
    (err, product) => {
      if (err)
        return res
          .status(200)
          .send("There was a problem updating the product.");
      res.status(200).send(product);
    }
  );
});

//GET ALL PRODUCTS
router.get("/getAll", (req, res) => {
  Product.find({}, (err, products) => {
    if (err)
      return res
        .status(200)
        .send({ error: "There was a problem getting the products" });
    res.status(200).send(products);
  });
});

//FIND PRODUCTS
router.get("/find", (req, res) => {
  Product.find(
    { name: { $regex: req.body.name, $options: "i" } },
    (err, products) => {
      if (err)
        return res
          .status(200)
          .send({ error: "There was a problem getting the products" });
      res.status(200).send(products);
    }
  );
});

module.exports = router;
