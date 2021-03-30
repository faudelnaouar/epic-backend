const express = require('express');
const router = express.Router();
const bycrypt = require('bcryptjs');
const passport = require('passport');
const nodemailer = require('nodemailer');


//User model
const User = require('../models/User');
// const SubUser = require('../models/SubUser');
const { session } = require('passport');
const e = require('express');

// test register
router.post('/registerr', function(req,res,next){
  User.create(req.body).then(function(user){
    console.log('user:', req);
  
       res.send(user);
    
     
  }).catch(next);
});

// confirm user
router.post('/confirm', (req, res, next) => {
  const email = req.body.email;
  User.findOne({ email: email })
  .then(user => {
      user.confirmed = true;
      if(user) {
        User.findByIdAndUpdate(user._id, user, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else res.send({ message: "user confirmed." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial "
      });
    });
      }
}); 
});

// get all users
router.get('/all', (req, res, next) => {
  User.find({}).then(function(users){
    res.send(users);
}).catch(next);
});


//Login page
router.get('/login', (req, res) => res.render('login'));

//Register page
router.get('/register', (req, res) => res.render('register'));

//Register Handle
router.post('/register', (req, res) => {
const { name, email, password, password2 } = req.body;
let errors = [];
//Check required fields
if(!name || !email || !password || !password2) {
    errors.push({ msg: 'please fill in all fields!'});
}

//Check password match
if(password !== password2 ) {
    errors.push({ msg: 'Passwords do not match!'});
}

//Check pass length
if(password.length < 6) {
errors.push({ msg: 'Password should be at least 6 characters!' });
}

if(errors.length > 0) {
 res.render('register', {
    errors,
    name,
    email,
    password,
    password2
 });
} else {
//Validation passed
User.findOne({ email: email })
 .then(user => {
     if(user) {
          //User exists
           errors.push({ msg: 'Email is already registered!'});
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
         });
     } else {
        const newUser = new User({
            name,
            email,
            password
        });

       //Hash password
        bycrypt.genSalt(10, (err, salt) => bycrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            //Set password to hashed
            newUser.password = hash;
            //Save user
            newUser.save()
              .then(user => {
                  req.flash('success_msg', 'You are registered and you can Log in');
                  res.redirect('/users/login');
              })
               .catch(err => console.log(err));

        }))

     }
 });

}

});

// Login Handle
router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    const user = req.user;
    user.password = null;
    res.json({message:"Success", user: user});
  });

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});


router.get('/add_user', (req, res) => res.render('add_user'));

router.post('/add_user', (req, res) => {
    const { email, password } = req.body;
    let errors = [];
    
    //Check required fields
    if( !email ) {
        errors.push({ msg: 'please fill in all fields!'});
    }

    if(errors.length > 0) {
      res.render('add_user', {
         errors,
         email,
         password
      });
     } else {
    User.findOne({ email: email })
 .then(user => {
     if(user) {
          //User exists
           errors.push({ msg: 'Email is already registered!'});
          res.render('add_user', {
            errors,
            email,
            password     
         });
     } else {
        const newUser = new User({
            email,
            userType:"subUser",
            password
        });

        bycrypt.genSalt(10, (err, salt) => bycrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) throw err;
          //Set password to hashed
          newUser.password = hash;

        newUser.save()
              .then(user => {
                res.json({message: 'successfully registred'});
                sendMail(email);
              })
               .catch(err => console.log(err));
              }))
    }
  });

} 
     
});

router.get('/login_sub', (req, res) => res.render('login_sub'));

// Mail
function sendMail(mailToSent) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'masterdaruom@gmail.com', // TODO: your gmail account
        pass: 'mouradDaruom7/'  // TODO: your gmail password
    }
 });

 // Step 2

 const url = `http://localhost:4200/confirm?mail=` + mailToSent;

 const mailOptions = {
  from: 'masterdaruom@gmail.com',
  to: mailToSent,
  subject: 'EPIC mail confirmation',
  text: 'Bonjour, veuillez confirmer votre compte en cliquant sur ce lien :' + url
 };

 transporter.sendMail(mailOptions, function(error, info){
  if (error) {
  res.json('error :' + error);
  } else {
    res.json('email sent' + info.response)
  }
 });

}

router.post('/login_sub', (req, res, next) => {

    passport.authenticate('local', {
    successRedirect: '/createpassword',
    failureRedirect: '/users/login_sub',
    failureFlash: true
  })(req, res, next);
  
});

router.get('/createpassword', (req, res) => res.render('createPassword'));

router.post('/createpassword', (req, res, next) => {
  const { password, password2 } = req.body;
  let errors = [];

  if(password !== password2 ) {
    errors.push({ msg: 'Passwords do not match!'});
}

if(errors.length > 0) {
  res.render('createpassword', {
     errors,
     password,
     password2
  });
 } else {
   User.findOne({'email': req.user.email}) 
   .then(user => {
    /*if(user) {
         //User exists
          errors.push({ msg: 'Email is already registered!'});
         res.render('createPassword', {
           errors,
           password,
           password2
        });
    } else {*/
      /* const newUser = new User({
           name,
           email,
           password
       });*/
       
      //Hash password
      bycrypt.genSalt(10, (err, salt) => bycrypt.hash(req.body.password, salt, (err, hash) => {
        if(err) throw err;
        //Set password to hashed
        user.password = hash;

        user.save()
        .then(user => {
            req.flash('success_msg', 'You are registered and you can Log in');
            res.redirect('/welcomesub');
        })
         .catch(err => console.log(err));
      }))
          
   

 //}

});
 
}

console.log(req.user.password);
  /*const user = new User();

 const newpwd = req.body.password;

 user.password = newpwd;

  console.log(user.password);*/
});

module.exports = router;