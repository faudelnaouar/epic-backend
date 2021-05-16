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
const { callbackPromise } = require('nodemailer/lib/shared');

const  storage = multer.diskStorage({
    destination:function(req, file, cb) {
      cb(null, 'uploads');
    },
    filename:function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  const maxSize = 2 * 1024 * 1024;

  let upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
  }).single("file");

router.get('/upload', (req, res) => res.render('upload'));

router.post('/upload/:id', upload, async (req, res, next) => {
  console.log('file :', req.params);
   
    const file = req.file;
    let errors = [];

    if(!file) {
        errors.json({ msg: 'please fill in all fields!'});
    }

    if(errors.length > 0) {
        res.render('upload', {
           errors
        });
       } else {

        const newFile = new File({
            oroginalName : req.file.originalname,
            size : req.file.size,
            fileName: req.file.filename,
            userId: req.params.id
        });

        newFile.save()
        .then(file => {
           res.json({message: 'File successfully saved', file: file})
        })
         .catch(err => console.log(err));
       }

});


router.get('/showfiles', (req, res, next) => {

  File.find({}, function(err, files) {
    if (err) throw err;
    // object of all the users
    res.json({files:files});
  });
});

router.post('/delete', function(req, res, next) {

  var id = req.body.id;
 
  File.deleteOne({"_id":id}, function(err, result) {
   
    res.json({message: 'file successfully deleted'});

  });
}); 



module.exports = router;