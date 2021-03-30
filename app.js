const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost:27017/epic', {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;

db.on('error', (err) => {
console.log(err)
});

db.once('open', () => {
console.log('Database Connected!!!')
});



const app = express();

//Passport config
require('./config/passport')(passport);

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//BodyParser
// app.use(express.urlencoded({ extended: false }));
// parse application/x-www-form-urlencoded

// cross origin 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// parse application/json
app.use(bodyParser.json())

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

  //Passport Middleware
  app.use(passport.initialize());
  app.use(passport.session());

// Connect flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    next();
});


//Routes

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/files', require('./routes/files'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server start on port ${PORT}`));