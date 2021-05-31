const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register', authController.register );
 
router.post('/login', authController.login);

router.post('/adminlogin', authController.adminlogin);

router.post('/addbook', authController.addbook);

module.exports = router;