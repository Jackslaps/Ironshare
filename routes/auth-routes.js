const express = require("express");
const router = express.Router();
const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

router.get('/login', (req, res, next) => {
    res.render('auth/login');
})

router.post('/email-auth', (req, res, next) => {
  const userEmail = req.body.email;

  if(userEmail == "") {
    res.render('auth/login', {errorMessage: "Please enter an email"})
  }

  User.findOne({email: userEmail})
  .then(user => {
    if(!user) {
      res.render('auth/login', {errorMessage: "You are not approved to enter this site"})
    }
    else if(user.password === undefined) {
      res.render('auth/login', {errorMessage: "Create your password", newUser: true, email: userEmail})
    }
    else {
      res.render('auth/login', {errorMessage: "Enter password", existingUser: true, email: userEmail})
    }
  })
})

router.post('/login', (req, res, next) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    User.findOne({email: userEmail})
    .then(user => {
        if(bcrypt.compareSync(userPassword, user.password)) {
          res.render('directory-select');
        }
        else {
            res.render('auth/login', {errorMessage: "Incorrect password"});
        }
    })
    .catch()
})

router.post('/signup', (req, res, next) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(userPassword, salt);

  if(userEmail == "" || userPassword == "") {
      res.render('auth/create-user', {errorMessage: "Please provide both email and password to create an account"});
      return;
  };

  User.updateOne({email: userEmail}, {
      //name: userName,
      email: userEmail,   
      password: hashPass,
      role: 'User',
      canView: true
    })
    .then(newUser => {
        res.render('directory-select');
    })
  .catch(error => console.log("Error while checking if user exists: ", error));
})

router.get('/create-account', (req, res, next) => {
  res.render('auth/create-account');
})

router.post('/new-arrival', (req, res, next) => {
  const userEmail = req.body.email;
  const userReason = req.body.reason;

  if(userEmail == "" || userReason == "") {
    res.render('auth/new-arrival', {errorMessage: "Please provide both your email and your relation to IronHack"});
    return;
  };
})

router.get('/logout', (req, res, next) => {
    req.session.destroy(error => {
        console.log('Error while logging out: ', error);
        res.redirect('/login');
    })
})

module.exports = router;