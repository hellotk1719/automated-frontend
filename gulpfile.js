const { dest, series, src, watch } = require('gulp');
const sass = require('gulp-sass');

function sassTranspile(cb) {

    return src('src/scss/**/*.scss')
        .pipe(sass({ outputStyle : 'expanded' }))
        .pipe(dest('src/assets/css'));

    cb();

}

function watchFiles(cb) {

    watch('src/scss/**/*.scss', series(sassTranspile));

    cb();

}

exports.default = series(watchFiles);
