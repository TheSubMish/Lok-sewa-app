const passport = require("passport");

function postLog(req, res, User) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })

    req.login(user, (err) => {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/");
            });
        }
    });
}

exports.postLog = postLog;