const passport = require("passport");

function regisUser(req, res, User) {
    User.register({ username: req.body.username }, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/");
            });
        }
    });
}

exports.regisUser = regisUser;