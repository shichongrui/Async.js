var gulp = require("gulp"),
    uglify = require("gulp-uglifyjs");

gulp.task("minifyjs", function () {
    gulp.src("./async.js")
        .pipe(uglify("async.min.js", {
            outSourceMap: true
        }))
        .pipe(gulp.dest("./"));
});

gulp.task("default", ["minifyjs"])