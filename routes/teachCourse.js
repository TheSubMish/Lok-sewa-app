const mongoose = require("mongoose");

function course(req, res, Course) {
    const course = new Course({
        courseTitle: req.body.courseTitle,
        course: req.body.courseBody,
        question: req.body.question,
        options: [
            option1 = req.body.option1,
            option2 = req.body.option2,
            option3 = req.body.option3,
            option4 = req.body.option4
        ],
        corAns: req.body.corAns
    });

    course.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/teachCourse");
        }
    });
}

exports.course = course;