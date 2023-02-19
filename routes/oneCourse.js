function getCourse(req,res,Course){
    let courseName = req.params.courseName;
    Course.findOne({ courseTitle: courseName }, (err, courses) => {
        if (!err) {
            res.render("oneCourse", {
                pageTitle: courses.courseTitle, 
                islog: "Log-Out",
                course: courses,
                score: 0
            });
            console.log(courses.course)
        }
    });
}

exports.getCourse = getCourse;

function course(req, res, Course) {
    let courseName = req.params.courseName;
    let score = 0;
    Course.findOne({ courseTitle: courseName }, (err, found) => {
        if(!err){
            for(let i=0;i<found.question.length;i++){
                if (req.body["option" + i] === found.corAns[i]) {
                    console.log(found.options[i]);
                    score++;
                }
            }
            res.render("oneCourse",{pageTitle: found.courseTitle, islog: "Log-Out",course: found, score: score });
        } else {
            console.log(err);
        }
    });
}

exports.course = course;