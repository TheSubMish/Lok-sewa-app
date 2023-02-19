require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const login = require("./routes/login.js");
const regis = require("./routes/register.js");
const teachCourse = require("./routes/teachCourse.js");
const oneCourse = require("./routes/oneCourse.js");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: "Our litrle secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: String,
    googleId: String
}, {
    timestamps: true
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

const courseSchema = new mongoose.Schema({
    courseTitle: String,
    course: String,
    question: Array,
    options: [
        option1 = Array,
        option2 = Array,
        option3 = Array,
        option4 = Array
    ],
    corAns: Array
}, {
    timestamps: true
});

const Course = new mongoose.model("Course", courseSchema);

passport.use(User.createStrategy());
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://nepalpadhcha.onrender.com/auth/google/course"
},
    function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ username: profile.emails[0].value, googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

app.get("/", (req, res) => {
    //if(req.isAuthenticated()){
        res.render("index",{pageTitle: "Home", islog: "Log-Out"})
    //} else {
      //  res.render("index",{pageTitle: "Home", islog: "Log-In"})
    //}
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/course",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
        res.redirect("/courses");
    }
);

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    regis.regisUser(req, res, User);
})

app.get("/Log-In", (req, res) => {
    res.render("login")
});

app.post("/Log-In", (req, res) => {
    login.postLog(req, res, User);
});

app.get("/Log-Out",(req,res)=>{
    req.logout(function(err) {
        if (err) {
            console.log(err);
        }
    });
    res.render("index",{pageTitle: "Home", islog: "Log-In"});
});

// for teacher to include course 
app.get("/teachcourse", (req, res) => {
    res.render("teachCourse");
});

app.post("/teachCourse", (req, res) => {
    teachCourse.course(req, res, Course);
});

// show all courses 
app.get("/courses", (req, res) => {
    //if (req.isAuthenticated()) {
        Course.find({}, (err, foundCourse) => {
            if (!err) {
                res.render("course", { pageTitle: "Courses", islog: "Log-Out", courses: foundCourse });
            }
        });
    //} else {
      //  res.redirect("/Log-In");
    //}
});

// show individual course 
app.get("/courses/:courseName", (req, res) => {
    //if(req.isAuthenticated()){
        oneCourse.getCourse(req, res, Course);
    //} else {
      //  res.redirect("/Log-In")
    //}
});

app.post("/courses/:courseName", (req, res) => {
    oneCourse.course(req, res, Course);
});

app.get("/contact", (req, res) => {
    //if(req.isAuthenticated()){
        res.render("contact",{pageTitle: "Contact", islog: "Log-Out"})
    //} else {
      //  res.render("contact",{pageTitle: "Contact", islog: "Log-In"})
    //}
})

app.listen(3000, () => {
    console.log("Server running at port 3000");
});
