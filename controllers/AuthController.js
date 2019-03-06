const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const VerifyToken = require("../auth/VerifyToken");
const User = require("../models/User");
const config = require("../config");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//REGISTER USER
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user)
      return res
        .status(200)
        .send({ error: "User with this e-mail already registered" });
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create(
      {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      },
      (err, user) => {
        if (err) {
          console.log(err);
          return res
            .status(200)
            .send({ error: "There was a problem registering the user" });
        }
        // create a token
        let token = jwt.sign({ id: user._id }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
      }
    );
  });
});

//LOGIN USER
router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(200).send({ error: "Error on the server" });
    }
    if (!user) {
      console.log(err);
      return res.status(200).send({ error: "No user found" });
    }
    let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(200).send({ auth: false, token: null });
    }
    let token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
  });
});

//LOGOUT USER
router.get("/logout", (req, res) => {
  res.status(200).send({ auth: false, token: null });
});

//GET USER INFO
router.get("/me", VerifyToken, (req, res, next) => {
  User.findById(req.userId, { password: 0 }, (err, user) => {
    if (err)
      return res
        .status(200)
        .send({ error: "There was a problem finding the user" });
    if (!user) return res.status(404).send({ error: "No user found" });

    res.status(200).send(user);
  });
});

//UPDATE USER
router.post("/update", VerifyToken, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.userId },
    {
      name: req.body.name || User.name,
      email: req.body.email || User.email,
      password: bcrypt.hashSync(req.body.password, 8) || User.password,
      age: req.body.age || User.age,
      weight: req.body.weight || User.weight,
      height: req.body.height || User.height,
      goal: req.body.goal || User.goal
    },
    (err, user) => {
      if (err) return res.status(200).send({ error: "Error on the server" });
      res.status(200).send(user);
    }
  );
});

module.exports = router;
