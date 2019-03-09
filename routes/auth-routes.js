const express = require("express");
const router = express.Router();
const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

//Display admin page
router.get('/admin', (req, res, next) => {
  res.render('auth/admin');
})

//Display login page
router.get('/login', (req, res, next) => {
    res.render('auth/login');
})

//Login Procedure: Initial step to check if email exists on DB
router.post('/email-auth', (req, res, next) => {
  const userEmail = req.body.email;

  if(userEmail == "") {
    res.render('auth/login', {errorMessage: "Please enter an email"})
  }

//Login Procedure: 'Engine' that determines if the user has logged in for the first time or not and if user is authorized
  User.findOne({email: userEmail})
  .then(user => {
    if(!user || user.role === 'guest') {
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

//Login Procedure: For people who log in after their initial log in
router.post('/login', (req, res, next) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    User.findOne({email: userEmail})
    .then(user => {
        if(bcrypt.compareSync(userPassword, user.password)) {
          console.log("Before init: ", req.session)
          req.session.user = user;
          console.log("After init: ", req.session)
          res.redirect('directory-select');
        }
        else {
            res.render('auth/login', {errorMessage: "Incorrect password"});
        }
    })
    .catch()
})

//Login Procedure: For people who are approved and are logging in for the first time
router.post('/signup', (req, res, next) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(userPassword, salt);

  if(userEmail == "" || userPassword == "") {
      res.render('auth/create-user', {errorMessage: "Please provide both email and password to create an account"});
      return;
  };

  User.findOne({email: userEmail})
    .then(newUser => {
        let role = 'user';

        if(newUser.role === 'admin') { role = 'admin'};

        newUser.password = hashPass;
        newUser.canView = true;
        newUser.role = role;
        newUser.save()

        .then(updatedUser => {
          req.session.user = updatedUser;
          res.redirect('directory-select')
        }) 
    })
  .catch(error => console.log("Error while checking if user exists: ", error));
})

//Display account request page
router.get('/create-account', (req, res, next) => {
  res.render('auth/create-account');
})

//Approval procedure: Sends email and relation to DB for later admin approval
router.post('/create-account', (req, res, next) => {
  const {email, relation} = req.body;

  if(email == "" || relation == "") {
    res.redirect('auth/create-account', {errorMessage: "Please provide both your email and your relation to the server admin"});
    return;
  };

  User.create({
    email,
    relation,
  })
  .then(newUser => {
    res.redirect('/');
  })
})

//Logs the user out
router.get('/logout', (req, res, next) => {
    req.session.destroy(error => {
      console.log('Error while logging out: ', error);
      res.redirect('/');
    })
})

module.exports = router;