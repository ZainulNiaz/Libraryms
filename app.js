const express = require('express');
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');





dotenv.config({ path: './.env'})

const app = express();
app.use(session({
    secret: 'mysupersecretpassword',
  }))
  

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname , './public')
app.use(express.static(publicDirectory));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: true}));
// Parse json bodies (as sent by API clients)
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'hbs');



db.connect((error) => {
    if(error){
        console.log(error)
    } else{
        console.log("mysql connected...")
    }
} )

//Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth' , require('./routes/auth'));


app.listen(5000, () => {
    console.log("Server started on port 5000");
});
