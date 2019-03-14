const express = require("express");
const router = express.Router();
const User = require("../models/user-model");

//Display admin page
router.get('/admin', (req, res, next) => {
  User.find()
  .then(allUsers => {
    let guests = allUsers.filter(guest => {
      return guest.role === "guest"
    })
    console.log(allUsers)
    res.render('auth/admin', {usersFromDB: allUsers, unapprovedFromDB: guests})
  })
})

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
    res.redirect('/admin');
  })
})

router.get('/admin/delete-user/:userId', (req, res, next) => {
  console.log("Deleting user:", req.params.userId)
  User.findByIdAndRemove(req.params.userId)
    .then(() => {
      res.redirect('/admin')
    })
})

router.post('/admin/change-role/:userId', (req, res, next) => {
  let updatedInfo = {
    role: req.body.changeRole,
  }
  
  if(req.body.canView) {
    updatedInfo.canView = true;
  }

  console.log("updated info:", updatedInfo)

  User.findByIdAndUpdate(req.params.userId, updatedInfo)
  .then( () => {
    res.redirect('/admin');
  })
})

module.exports = router;