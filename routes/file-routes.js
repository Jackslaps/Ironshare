const express             = require('express');
const router              = express.Router();
const mongoose            = require('mongoose');
// const aws                 = require('aws-sdk')
// const uuid                = require('uuid');
const multer              = require('multer');
const GridFSStorage       = require('multer-gridfs-storage');
const Grid                = require('gridfs-stream');
const s3                  = require('multer-s3');
const path                = require('path');
//const fs                  = require('fs');
//const fileStream          = fs.createReadStream(file)
const crypto              = require('crypto');

const mongoURI = 'mongodb://localhost/ironshare';
const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true });

let gfs;

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
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
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
  console.log(req.file);
  res.json({file: req.file});
})

module.exports = router;




