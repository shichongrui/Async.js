var gulp = require("gulp"),
    uglify = require("gulp-uglifyjs");

gulp.task("minifyjs", function () {
    gulp.src("./threading.js")
        .pipe(uglify("threading.min.js", {
            outSourceMap: true
        }))
        .pipe(gulp.dest("./"));
});

gulp.task("default", ["minifyjs"])