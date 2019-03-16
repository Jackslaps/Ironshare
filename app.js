require('dotenv').config();

const bodyParser     = require('body-parser');
const cookieParser   = require('cookie-parser');
const mongoose       = require('mongoose');
const express        = require('express');
const favicon        = require('serve-favicon');
const hbs            = require('hbs');
const logger         = require('morgan');
const path           = require('path');
const methodOverride = require('method-override');
const session        = require('express-session');
const MongoStore     = require('connect-mongo')(session);

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


// default value for title local
app.locals.title = '「Ｉ　Ｒ　Ｏ　Ｎ 　Ｓ　Ｈ　Ａ　Ｒ　Ｅ」';

//Handlebar Helpers
hbs.registerHelper('if_eq', function(a, b, opts) {
  if (a == b) {
      return opts.fn(this);
  } else {
      return opts.inverse(this);
  }
});

//Session creation - User persistence
app.use(session({
  secret: '_secret_', 
  cookie: { maxAge: 60 * 60 * 1000 }, 
  saveUninitialized: false, 
  resave: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

app.use((req, res, next) => {
  if(!req.session.user) {  
    next()
    return;
  }

  let admin = false;
  let canView = false;

  if(req.session.user.role === "admin") { admin = true};
  if(req.session.user.canView === true) { canView = true};

  req.session.user.role === 'guest' ? res.locals.guest = true : res.locals.guest = false
  
  res.locals.currentUser = req.session.user;
  res.locals.admin = admin;
  res.locals.canView = canView;
  next()
})

//Routes
const index = require('./routes/index');
app.use('/', index);

app.use('/', require('./routes/auth-routes'));

app.use('/', require('./routes/user-routes'));

app.use('/', require('./routes/file-routes'));

module.exports = app;

