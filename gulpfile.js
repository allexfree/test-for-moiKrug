'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    srcmap = require('gulp-sourcemaps'),
    plumber = require('gulp-plumber'),
    postcss = require('gulp-postcss'),
    prefixer = require('autoprefixer'),
    postfocus = require('postcss-focus'),
    cssnano = require('cssnano'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    images = require('gulp-imagemin'),
    jpegrecompress = require('imagemin-jpeg-recompress'),
    svgo = require('gulp-svgo'),
    pngmin = require('gulp-pngquant'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    replace = require('gulp-replace'),
    browserSync = require('browser-sync').create();

gulp.task('serve', ['jpgmin', 'pngmin', 'svgo', 'jsLibsMin', 'cssLibsMin', 'style', 'watch'], function() {
  browserSync.init({
    server: 'src/'
  })
});

gulp.task('jpgmin', function() {
  return gulp.src('src/img/**/*.jpg')
    .pipe(images(
      jpegrecompress({
        progressive: true,
        max: 80,
        min: 70
      })
    ))
    .pipe(gulp.dest('src/img'));
});

gulp.task('pngmin', function() {
  return gulp.src('src/img/**/*.png')
    .pipe(pngmin({
      quality: '65-80'
    }))
    .pipe(gulp.dest('src/img'));
})

gulp.task('svgo', function() {
  return gulp.src('src/img/**/*.svg')
    .pipe(svgo())
    .pipe(gulp.dest('src/img'));
})

gulp.task('cssLibsMin', function() {
  return gulp.src([
    'src/libs/**/**/{*.scss, *.sass}'
  ])
    .pipe(sass())
    .pipe(concat('libs.css'))
    .pipe(postcss([prefixer, cssnano]))
    .pipe(rename('libs.min.css'))
    .pipe(gulp.dest('src/libs'))
})

gulp.task('jsLibsMin', function() {
  return gulp.src([
    'src/libs/**/**/*.js',
  ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('src/libs'));
});

gulp.task('style', function() {
  if (gulp.src === 'src/sass/**/*.sass') {
    gulp.src('src/sass/**/*.sass')
    .pipe(plumber())
    .pipe(sass({
      includePaths: require('node-normalize-scss').includePaths
    }).on('error', notify.onError()))
    .pipe(concat('style.css'))
    .pipe(srcmap.init())
    .pipe(postcss([prefixer, postfocus, cssnano]))
    .pipe(srcmap.write())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
  } else {
    gulp.src('src/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass({
      includePaths: require('node-normalize-scss').includePaths
    }).on('error', notify.onError()))
    .pipe(concat('style.css'))
    .pipe(srcmap.init())
    .pipe(postcss([prefixer, postfocus, cssnano]))
    .pipe(srcmap.write())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
  }
});

gulp.task('watch', function() {
  if (gulp.watch === 'src/sass/**/{*.sass') {
    gulp.watch('src/sass/**/*.sass', ['style']);
  } else {
    gulp.watch('src/scss/**/*.scss', ['style']);
  }
  gulp.watch('src/*.html').on('change', browserSync.reload);
  gulp.watch('src/js/*.js').on('change', browserSync.reload);
});

gulp.task('clean', function() {
  return del.sync('build');
});

gulp.task('buildImg', function() {
  gulp.src(['src/img/**/*'])
    .pipe(gulp.dest('dist/img'));
});

gulp.task('buildFont', function() {
  gulp.src(['src/fonts/**/*'])
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('buildHtml', function() {
  gulp.src(['src/*.html'])
    .pipe(replace('<script src="js/common.js"></script>', '<script src="js/common.min.js"></script>'))
    .pipe(replace('<link rel="stylesheet" href="libs/libs.min.css">', ''))
    .pipe(replace('<script src="libs/libs.min.js"></script>', ''))
    .pipe(gulp.dest('dist/'));
});

gulp.task('buildOther', function () {
  gulp.src(['src/*.*'])
    .pipe(gulp.dest('dist/'));
});

gulp.task('buildCss', function () {
  gulp.src([
    'src/libs/libs.min.css',
    'src/css/style.min.css'
  ])
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('dist/css'));
}),

gulp.task('buildJs', function () {
  gulp.src([
    'src/libs/libs.min.js',
    'src/js/common.js'
  ])
    .pipe(concat('common.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('build', ['clean', 'buildImg', 'buildFont', 'buildHtml', 'buildOther', 'buildCss', 'buildJs']);

gulp.task('default', ['serve']);
