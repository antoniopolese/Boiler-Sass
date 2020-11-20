'use strict';

// Assign packages from the folder "node_modules"
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var del = require('del');
var runSequence = require('run-sequence');
var autoprefixer  = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');


// Sass compile
gulp.task('sass', function(){
    return gulp.src('app/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(autoprefixer({browsers: ['last 3 versions']}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Watch files
gulp.task('watch', ['browserSync'], function (){
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

// Live refresh
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    })
});

// Build dist
gulp.task('useref', function(){
    return gulp.src('app/*.html')
        .pipe(useref())
        // Minifies only JS file
        .pipe(gulpIf('*.js', uglify()))
        // Minifies only CSS file
        .pipe(gulpIf('*.css', cssnano()))
        // Create dist
        .pipe(gulp.dest('dist'))
});

// Clean dist
gulp.task('clean:dist', function() {
    return del.sync('dist');
});

// Grouping task for build
gulp.task('build', function (callback) {
    runSequence(
        'clean:dist',
        ['sass', 'useref'],
        callback
    )
});

// Grouping task for run app
gulp.task('default', function (callback) {
    runSequence(['sass','browserSync', 'watch'],
        callback
    )
});