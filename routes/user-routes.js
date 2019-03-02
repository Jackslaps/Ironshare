const express = require("express");
const router = express.Router();
const User = require("../models/user-model");

router.get('/admin', (req, res, next) => {
  res.render('auth/admin');
})

module.exports = router;