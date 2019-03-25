const { dest, parallel, series, src, watch } = require('gulp');

const dateFormat = require('dateformat');
const now = new Date();
const distDate = dateFormat(now, "yyyymmddHHMMss");

const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const fileinclude = require('gulp-file-include');

const pipeline = require('readable-stream').pipeline;

const htmlmin = require('gulp-htmlmin');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

const uglify = require('gulp-uglify');

function serve(done) {

    browserSync.init({
        server: {
            baseDir: "./src/"
        },
        port: 80
    });

    done();

}

function fileInclude(cb) {

    return src(['src/templates/**/*.html', '!src/templates/common/**/*'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest('src'));

    cb();

}

function htmlMinify(cb) {

    return src(['src/**/*.html', '!src/templates/**/*'])
        .pipe(dest('dist/' + distDate));

    cb();

}

function sassTranspile(cb) {

    return src('src/scss/**/*.scss')
        .pipe(sass({ outputStyle : 'expanded' }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(dest('src/assets/css'));

    cb();

}

function cssMinify(cb) {

    return src('src/assets/css/**/*.css')
        .pipe(cleanCSS({ compatibility : 'ie8' }))
        .pipe(dest('dist/' + distDate + '/assets/css'));

    cb();

}

function jsMinify(cb) {

    return pipeline(
        src('src/assets/js/**/*.js'),
        uglify(),
        dest('dist/' + distDate + '/assets/js')
    );

    cb();

}

function imgMinify(cb) {

    return src('src/assets/img/**/*')
        .pipe(dest('dist/' + distDate + '/assets/img'));

    cb();

}

function watchFiles(cb) {

    watch(['src/**/*', '!src/scss/**/*']).on("change", reload);
    watch('src/scss/**/*.scss', series(sassTranspile));
    watch('src/templates/**/*.html', series(fileInclude));

    cb();

}

exports.dist = series(
    parallel(
        cssMinify,
        jsMinify,
        htmlMinify,
        imgMinify
    )
);
exports.default = series(serve, watchFiles);
