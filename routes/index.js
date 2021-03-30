const express = require('express');
const router = express.Router();
const { ensureAuthenticated} = require('../config/auth');

// Welcome page
router.get('/', (req, res) => res.render('welcome'));
// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => 
  res.render('dashboard', {
    name: req.user.name
}));

// Welcome SubUser
router.get('/welcomesub', ensureAuthenticated, (req, res) => 
  res.render('welcomesub', {
    email: req.user.email
}));

router.get('/createpassword', ensureAuthenticated, (req, res) => 
  res.render('createPassword', {
    email: req.user.email
}));

router.get('/upload', ensureAuthenticated, (req, res) => 
  res.render('upload' , {
    email: req.user.email
  }));

  router.get('/showfiles', ensureAuthenticated, (req, res) => 
  res.render('showFiles' , {
    email: req.user.email
  }));

module.exports = router;