const { dest, parallel, series, src, watch } = require('gulp');

const dateFormat = require('dateformat');
const now = new Date();
const distDate = dateFormat(now, "yyyymmddHHMMss");

const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

function serve(done) {

    browserSync.init({
        server: {
            baseDir: "./src/"
        },
        port: 80
    });

    done();

}

function cssMinify(cb) {

    return src('src/assets/css/**/*.css')
        .pipe(cleanCSS({ compatibility : 'ie8' }))
        .pipe(dest('dist/' + distDate + '/assets/css'));

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

function watchFiles(cb) {

    watch('src/scss/**/*.scss', series(sassTranspile));
    watch(['src/**/*', '!src/scss/**/*']).on("change", reload);

    cb();

}

exports.dist = series(
    parallel(cssMinify)
);
exports.default = series(serve, watchFiles);
