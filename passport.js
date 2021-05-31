const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mysql = require("mysql");
// const User = mysql.model("users");
// const keys = require("../config/keys");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey:  'mysupersecretpassword'
};

module.exports = passport => {
  passport.use(
    new JwtStrategy(jwtOptions, (jwt_payload, done) => {
      console.log(jwt_payload);
    //   return done(null, jwt_payload)




      db.query('Select * FROM users WHERE email = ?',['zainul.niaz@gmail.com'], async(error, results) => {
        console.log(results);
        if(!results || !(await bcrypt.compare(password, results[0].password))   ){
         res.status(401).render('adminlogin', {
             message: 'Incorrect Credentials'
         })
        } else {
            // const id = results[0].id;
       
            if (results) {
                return done(null, results);
              }
              return done(null, false);
            // const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
            //     expiresIn: process.env.JWT_EXPIRES_IN
            // });

            // console.log("The token is: "+ token);

            // const cookieOptions = {
            //     expires: new Date(
            //         Date.now() + process.env.JWT_COOKIE_EXPIRES*24*60*60*1000
            //     ),
            //     httpOnly: true
            // }
            // console.log("admin login method");
            // res.cookie('jwt', token, cookieOptions);
            // res.status(200).redirect("/adminhome");
        }
    } )
    //   User.findById(jwt_payload.id)
    //     .then(user => {
    //       if (user) {
    //         return done(null, user);
    //       }
    //       return done(null, false);
    //     })
    //     .catch(err => console.log(err));
    })
  );
};
``;