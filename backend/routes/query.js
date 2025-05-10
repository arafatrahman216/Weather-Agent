const express = require('express');
const router = express.Router();
const {textQueryController} = require('../controller/queryController');
const multer = require('multer');

const storage =  multer.memoryStorage();

const upload = multer({ storage });


router.post('/text', textQueryController.query);

router.get('/history', textQueryController.getHistory);

router.post('/voice', upload.single('audio'), textQueryController.voiceQuery);

module.exports = router; 