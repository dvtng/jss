var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('default', ['compress']);

gulp.task('compress', function() {
	gulp.src('jss.js')
	    .pipe(uglify())
	    .pipe(rename('jss.min.js'))
	    .pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
	gulp.watch('jss.js', ['compress']);
});