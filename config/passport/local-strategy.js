const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../../models/user-model');

passport.use(new LocalStrategy({
  usernameField: 'email'                    //This step we take because we don't use a username but an email to register
}, (email, password, next) => {             //If we use a username instead, we dont have to put this object: {usernameField: 'email'}
  User.findOne({email})
    .then(userFromDB => {
      if(!userFromDB) {
        return next(null, false, {message: "Incorrect email"});
      }
      if(userFromDB.password) {
        if(!bcrypt.compareSync(password, userFromDB.password)) {
          return next(null, false, {message: "Incorrect password"})
        }
      } 
      else {
        return next(null, false, {message: "This email is used by a social media account"});
      }
      return next(null, userFromDB)  
    })
    .catch(error => next(error))
  }
))