const express = require('express');
const router = express.Router();
const bycrypt = require('bcryptjs');
const passport = require('passport');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');


//User model
const User = require('../models/User');
const File = require('../models/File');
//const SubUser = require('../models/SubUser');
const { session } = require('passport');

var storage = multer.diskStorage({
    destination:function(req, file, cb) {
      cb(null, 'uploads');
    },
    filename:function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  var upload = multer({
    storage:storage
  });
  

router.get('/upload', (req, res) => res.render('upload'));

router.post('/upload', upload.single('myFile'), (req, res, next) => {

    const file = req.file;
    let errors = [];

    if(!file) {
        errors.push({ msg: 'please fill in all fields!'});
    }

    if(errors.length > 0) {
        res.render('upload', {
           errors
        });
       } else {

        const newFile = new File({
            nameFile : req.file.originalname,
            emailUser : req.user.email,
            size : req.file.size
        });

        newFile.save()
        .then(file => {
            req.flash('success_msg', 'You are registered and you can Log in');
            res.redirect('/welcomesub');
        })
         .catch(err => console.log(err));
       }

});


router.get('/showfiles', (req, res, next) => {

  File.find({}, function(err, files) {
    if (err) throw err;
    // object of all the users
    res.render('showFiles',{files:files});
  });
});

router.post('/delete', function(req, res, next) {

  var id = req.body.id;
 
  File.deleteOne({"_id": objectId(id)}, function(err, result) {
    assert.equal(null, err);
    console.log('Item deleted');

  });
}); 



module.exports = router;