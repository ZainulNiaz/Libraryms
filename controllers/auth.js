const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;
        
        if(!email || !password){
            return res.status(400).render('login', {
                message: 'Please provide an email and password'
            })
        }

        db.query('Select * FROM users WHERE email = ?',[email], async(error, results) => {
            console.log(results);
            if(!results || !(await bcrypt.compare(password, results[0].password))   ){
             res.status(401).render('login', {
                 message: 'Incorrect Credentials'
             })
            } else {
                req.session.isLoggedIn = true;
                req.session.user = results[0].id;
                const id = results[0].id;

                const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is: "+ token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES*24*60*60*1000
                    ),
                    httpOnly: true
                }
                console.log("client login method");
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/clienthome");
            }
        } )



    }
    catch(error){
        console.log(error);
    }
}


exports.adminlogin = async (req, res) => {
    try{
        const {email, password} = req.body;
        
        if(!email || !password){
            return res.status(400).render('adminlogin', {
                message: 'Please provide an email and password'
            })
        }

        db.query('Select * FROM users WHERE email = ?',[email], async(error, results) => {
            console.log(results);
            if(!results || !(await bcrypt.compare(password, results[0].password) || results[0].name!='admin')   ){
             res.status(401).render('adminlogin', {
                 message: 'Incorrect Credentials'
             })
            } else {
                const id = results[0].id;

                const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is: "+ token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES*24*60*60*1000
                    ),
                    httpOnly: true
                }
                console.log("admin login method");
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/adminhome");
            }
        } )



    }
    catch(error){
        console.log(error);
    }
}




exports.addbook = (req, res) => {
    console.log(req.body);

    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;
    // const passwordConfirm = req.body.passwordConfirm;

    const{title} = req.body;

    db.query('INSERT INTO books SET ? ', {title: title}, async (error, results)  => { 
        if(error){
            console.log(error);
        }
        else{
            console.log(results);
            
            var sql='SELECT * FROM books';
            db.query(sql, function (err, data, fields) 
            
            
            {
            if (err) throw err;
            return res.render('adminhome.ejs', { title: 'Book List', bookData: data, user: req.session.user});
          });
        


        }
    } )


    // res.send("Form Submitted");
}


exports.bookrequest = (req, res) => {
    console.log(req.body);

    try{
        const {bookid} = req.body;
        
        if(!bookid){
            return res.status(400).render('clienthome', {
                message: 'Please provide a book id'
            })
        }

        db.query('Select * FROM books WHERE bookid = ?',[bookid], async(error, results) => {
            console.log(results);
            if(!results ){
             res.status(401).render('clienthome', {
                 message: 'Incorrect ID'
             })
            } 
            
           else  if(results[0].bookuser!="admin" ){
                res.status(401).render('clienthome', {
                    message: 'Book lent already'
                })
               } 
            
            
            else {
                req.session.isLoggedIn = true;
                userid = req.session.user;
                console.log("userid " + userid);


                db.query("UPDATE books SET requestedby= ? WHERE bookid= ? ",[userid, bookid]  ,async (error)  => { 
                    if(error){
                        console.log(error);
                    }
                    else{
                        console.log(results);
                        
                        var sql='SELECT * FROM books';
                        db.query(sql, function (err, data, fields) 
                        
                        
                        {
                        if (err) throw err;
                        return res.render('clienthome.ejs', { title: 'Book List', bookData: data, user: req.session.user});
                      });
                    
            
            
                    }
                } )
            
                
                


                // res.status(200).redirect("/clienthome");
            }
        } )



    }
    catch(error){
        console.log(error);
    }







}




exports.approverequest = (req, res) => {
    console.log(req.body);
    console.log("approve request");
    const{bookid, userid} = req.body;


    
    db.query("UPDATE books SET bookuser= ? WHERE bookid= ? ",[userid, bookid]  ,async (error)  => { 
        if(error){
            console.log(error);
        }
        else{
            // console.log(results);
            
            var sql='SELECT * FROM books';
            db.query(sql, function (err, data, fields) 
            
            
            {
            if (err) throw err;
            return res.render('adminhome.ejs', { title: 'Book List', bookData: data, user: req.session.user});
          });
        


        }
    } )

    db.query("UPDATE books SET requestedby= ? WHERE bookid= ? ",[null, bookid]  ,async (error)  => { 
        if(error){
            console.log(error);
        }
        else{
            // console.log(results);
            
            var sql='SELECT * FROM books';
            db.query(sql, function (err, data, fields) 
            
            
            {
            if (err) throw err;
            return res.render('adminhome.ejs', { title: 'Book List', bookData: data});
          });
        


        }
    } )







}


exports.returnbook = (req, res) => {
    console.log(req.body);
    console.log("approve request");
    const{bookid, userid} = req.body;


    
    db.query("UPDATE books SET bookuser= ? WHERE bookid= ? ",["admin", bookid]  ,async (error)  => { 
        if(error){
            console.log(error);
        }
        else{
            // console.log(results);
            
            var sql='SELECT * FROM books';
            db.query(sql, function (err, data, fields) 
            
            
            {
            if (err) throw err;
            return res.render('clienthome.ejs', { title: 'Book List', bookData: data, user: req.session.user});
          });
        


        }
    } )

    db.query("UPDATE books SET requestedby= ? WHERE bookid= ? ",[null, bookid]  ,async (error)  => { 
        if(error){
            console.log(error);
        }
        else{
            // console.log(results);
            
            var sql='SELECT * FROM books';
            db.query(sql, function (err, data, fields) 
            
            
            {
            if (err) throw err;
            return res.render('adminhome.ejs', { title: 'Book List', bookData: data});
          });
        


        }
    } )







}


exports.denyrequest = (req, res) => {
    console.log(req.body);
    console.log("deny request");
    const{bookid, userid} = req.body;

    db.query("UPDATE books SET requestedby= ? WHERE bookid= ? ",[null, bookid]  ,async (error)  => { 
        if(error){
            console.log(error);
        }
        else{
            // console.log(results);
            
            var sql='SELECT * FROM books';
            db.query(sql, function (err, data, fields) 
            
            
            {
            if (err) throw err;
            return res.render('adminhome.ejs', { title: 'Book List', bookData: data, user: req.session.user});
          });
        


        }
    } )







}



exports.register = (req, res) => {
    console.log(req.body);

    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;
    // const passwordConfirm = req.body.passwordConfirm;

    const{name, email, password, passwordConfirm} = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) =>{
        if(error){
            console.log(error);
        }
        if(results.length > 0){
            return res.render('register', {
                message: 'That email is already in use'
            })
        }

        else if( password !== passwordConfirm){
            return res.render('register', {
                message: 'Passwords do not match'
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ? ', {name: name, email: email, password: hashedPassword}, () => { 
            if(error){
                console.log(error);
            }
            else{
                console.log(results);
                return res.render('register', {
                    message: 'User registered'
                })
            }
        } )
   


    });



    // res.send("Form Submitted");
}