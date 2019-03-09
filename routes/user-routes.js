const express = require("express");
const router = express.Router();
const User = require("../models/user-model");

router.post('/admin-create-user', (req, res, next) => {
  const { email, role } = req.body;

  if(email === "" || role === "") {
    res.redirect('auth/admin', {errorMessage: "Please submit all values correctly"});
    return;
  }

  User.create({
    email,
    role,
    canView: true
  })
  .then(newUser => {
    res.render('auth/admin');
  })
})

module.exports = router;