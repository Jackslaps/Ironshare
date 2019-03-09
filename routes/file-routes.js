const File                = require('../models/file-model');
const express             = require('express');
const router              = express.Router();
const mongoose            = require('mongoose');
// const aws                 = require('aws-sdk')
// const uuid                = require('uuid');
const multer              = require('multer');
const GridFSStorage       = require('multer-gridfs-storage');
const Grid                = require('gridfs-stream');
//const s3                  = require('multer-s3');
const path                = require('path');
//const fs                  = require('fs');
//const fileStream          = fs.createReadStream(file)
const crypto              = require('crypto');

const mongoURI = process.env.MONGODB_URI;
const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true });

let gfs;
let fileInfo;

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
})

//Create storage engine
const storage = new GridFSStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        filename = buf.toString('hex') + path.extname(file.originalname);
        fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

router.get('/upload', (req, res, next) => {
  res.render('upload');
})

router.post('/upload', upload.single('file'), (req, res, next) => {
  File.create({
    title: req.body.title,
    author: req.body.author,
    series: req.body.series,
    language: req.body.language,
    description: req.body.description,
    isCopyright: req.body.isCopyright,
  })
  .then(newFile => {
    console.log("before save: ", newFile)
    newFile.filename = fileInfo.filename
    newFile.save()
      .then(updatedFile => {
        console.log("Updated file:", updatedFile)
      })
  })
  res.redirect('directory-select');
})

router.get('/files', (req, res, next) => {
  gfs.files.find().toArray((err, files) => {
    if(!files || files.length === 0) {
      return res.status(404).json({
        err: "No files exist"
      })
    }

    return res.json(files);
  })
})

router.get('/files/:filename', (req, res, next) => {
  gfs.files.findOne({filename: req.params.filename}, (err, file) => {
    if(!file || file.length === 0) {
      return res.status(404).json({
        err: "File doesn't exist"
      })
    }

    return res.json(file);
  })
})

router.get('/download/:filename', (req, res, next) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "File doesn't exist"
      });
    }
    // File exists
    res.set('Content-Type', file.contentType);
    res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');
    // streaming from gridfs
    const readstream = gfs.createReadStream({
      filename: req.params.filename
    });
    //error handling, e.g. file does not exist
    readstream.on('error', function (err) {
      console.log('An error occurred!', err);
      throw err;
    });
    readstream.pipe(res);
  });
});

router.get('/directory-select', (req, res, next) => {
  File.find()
  .then(allFiles => {
    res.render('directory-select', {filesFromDB: allFiles})
  })
})

module.exports = router;




