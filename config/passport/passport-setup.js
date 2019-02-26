require('./local-strategy');
const passport = require('passport');
const User = require('../../models/user-model');
const flash = require('connect-flash')


passport.serializeUser((user, cb) => { // cb stands for callback
  cb(null, user._id); // null == no errors, all good
});

passport.deserializeUser((userId, cb) => {  // deserializeUser => retrieve User's data from the database
  User.findById(userId)                     // This function gets called every time we request for a user
    .then(user => {                         // every time we need req.user
      cb(null, user);
    })
    .catch(error => cb(error));
})

function passportBasicSetup(app) {
  //Passport super power is here:
  app.use(passport.initialize()); // This line fires off the passport package
  app.use(passport.session());    // This line connects passport to the session

  //To activate flash messages:
  app.use(flash());

  app.use((req, res, next) => {
    res.locals.messages = req.flash();

    if(req.user) {
      res.locals.currentUser = req.user; //This like makes currentUser available in all sessions
    }

    next()
  })
}

module.exports = passportBasicSetup;