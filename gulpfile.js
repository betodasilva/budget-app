const gulp = require('gulp'),
      sass = require('gulp-sass'),
      rename = require('gulp-rename'),
      browserSync = require('browser-sync').create();

const src = {
    css: {
        dir: 'src/sass/',
        file: 'main.scss',
    }
    
}

gulp.task('minify', function(){
    gulp.src( src.css.dir + src.css.file  )
    .pipe(sass()).on( 'error', sass.logError)
    .pipe(rename('style.css'))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream());
});

gulp.task('sass-watch', ['minify'], browserSync.reload());

gulp.task('watch', function(){
    browserSync.init({
        server: "./"
    });
    gulp.watch('*.html').on('change', browserSync.reload);
    gulp.watch(src.css.dir + '*.scss', ['minify']);
});

gulp.task('default', ['minify', 'watch']);