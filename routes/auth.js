const express = require('express');
const authController = require('../controllers/auth');
const passport = require("passport");



const router = express.Router();

router.post('/register', authController.register );
 
router.post('/login', authController.login);

router.post('/adminlogin', authController.adminlogin);

router.post('/addbook', authController.addbook);

router.post('/bookrequest', authController.bookrequest);

router.post('/approverequest', authController.approverequest);



router.post('/returnbook', authController.returnbook);

router.post('/denyrequest', authController.denyrequest);

router.get(
    "/current",
    (req, res, next) => {
      res.json({
        id: "GSDfgds",
        isLoggedIn:req.session.user
      });
    }
  );


module.exports = router;


