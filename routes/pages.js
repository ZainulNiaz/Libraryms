const express = require('express');
const ejs = require("ejs");
const router = express.Router();



const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});




router.get('/', (req, res) => {
    res.render('index');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/adminlogin', (req, res) => {
    res.render('adminlogin');
});


router.get('/clienthome', (req, res) => {
    // res.render('clienthome');
    
    
    var sql='SELECT * FROM users';
    db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('clienthome.ejs', { title: 'User List', userData: data});
  });



});




module.exports = router;