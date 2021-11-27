var gulp = require("gulp");
var sass = require('gulp-sass')(require('sass'));


// Specific Task
function gulpSass() {
    return gulp
    .src(['src/scss/*.scss'])
    .pipe(sass())
    .pipe(gulp.dest('./src'));
}
gulp.task(gulpSass);

// Run multiple tasks
gulp.task('start', gulp.series(gulpSass));