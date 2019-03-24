const { dest, series, src, watch } = require('gulp');

const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

function serve(done) {

    browserSync.init({
        server: {
            baseDir: "./src/"
        },
        port: 80
    });

    done();

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

exports.default = series(serve, watchFiles);
