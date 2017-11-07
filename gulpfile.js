#!/usr/bin/env node

var argv = require('yargs').argv;

process.env.NODE_ENV = argv.env || process.env.NODE_ENV || 'production';

var gulp        = require('gulp');
var gulpif      = require('gulp-if');
var gutil       = require('gulp-util');
var concat      = require('gulp-concat');
var cssNano     = require('gulp-cssnano');
var spritesmith = require('gulp.spritesmith');
var sass        = require('gulp-sass');
var uglify      = require('gulp-uglify');
var jade        = require('gulp-jade');
var livereload  = require('gulp-livereload');
var autoprefixer = require('gulp-autoprefixer');
var merge      = require('merge-stream');

var path = {
  'public': {
    root: 'www',
    styles: 'www/css',
    scripts: 'www/js',
    images: 'www/images',
    sprite: 'www/css/',
    fonts: 'www/fonts'
  },
  app: {
    root: 'app',
    styles: 'app/styles/*.sass',
    scripts: 'app/scripts/**/*.js',
    sprite: 'app/styles/sprite/*.png',
    images: 'app/images/**/*.*',
    fonts: 'app/fonts/**/*.*',
    templates: 'app/*.jade'
  }
};

function isUglify() {
  return ['production', 'testing'].indexOf(process.env.NODE_ENV) > -1;
}

gulp.task('default', [
  'scripts',
  'styles',
  'fonts',
  'images',
  'templates',
  'vendor-scripts',
  'vendor-css',
  'vendor-fonts'
]);

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(path.app.scripts, ['scripts']);
  gulp.watch([path.app.styles, path.app.sprite], ['styles']);
  gulp.watch(path.app.images, ['images']);
  gulp.watch(path.app.templates, ['templates']);
  gulp.watch(path.app.fonts, ['fonts']);
});

/**
 * build scripts
 */
gulp.task('scripts', function(done) {
  gulp.src(path.app.scripts)
    //.pipe(gulpif(isUglify(), uglify()))
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest(path.public.scripts))
    .on('error', function(err){
      throw new gutil.PluginError('scripts', err);
    })
    .on('end', done);
});
/**
 * build vendor scripts
 */
gulp.task('vendor-scripts', function(done) {
  gulp.src([
      './node_modules/jquery/dist/jquery.js',
      './node_modules/slick-carousel/slick/slick.js',
      './node_modules/bootstrap/dist/js/bootstrap.js'
    ])
    //.pipe(uglify())
    .pipe(concat('vendor.bundle.js'))
    .pipe(gulp.dest(path.public.scripts))
    .on('error', function(err){
      throw new gutil.PluginError('vendor scripts', err);
    })
    .on('end', done);
});

/**
 * build sprite
 */
gulp.task('sprite', function (done) {
  var spriteData =
        gulp.src(path.app.sprite)
          .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: '_sprite.sass',
            algorithm: 'binary-tree',
            padding: 5
          }));
  return  merge(
    spriteData.css.pipe(gulp.dest('app/styles/')),
    spriteData.img.pipe(gulp.dest('www/css/'))
  );
});

/**
 * build styles
 */
gulp.task('styles', ['sprite'], function(done) {
  gulp.src(path.app.styles)
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(autoprefixer())
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest(path.public.styles))
    .on('error', sass.logError)
    .on('end', done);
});

/**
 * build vendor css
 */
gulp.task('vendor-css', function(done) {
  gulp.src([
      './node_modules/bootstrap/dist/css/bootstrap.css',
      './node_modules/slick-carousel/slick/slick.css'
    ])
    .pipe(cssNano())
    .pipe(concat('vendor.bundle.css'))
    .pipe(gulp.dest(path.public.styles))
    .on('error', function(err){
      throw new gutil.PluginError('vendor-css', err);
    })
    .on('end', done);
});
/**
 * build fonts
 */
gulp.task('fonts', function(done) {
  gulp.src(path.app.fonts)
    .pipe(gulp.dest(path.public.fonts))
    .on('error', function(err){
      throw new gutil.PluginError('fonts', err);
    })
    .on('end', done);
});

/**
 * build vendor fonts
 */
gulp.task('vendor-fonts', function(done) {
  gulp.src('./node_modules/bootstrap/fonts/*.*')
    .pipe(gulp.dest(path.public.fonts))
    .on('error', function(err){
      throw new gutil.PluginError('vendor fonts', err);
    })
    .on('end', done);
});

/**
 * build images
 */
gulp.task('images', function(done) {
  gulp.src(path.app.images)
    .pipe(gulp.dest(path.public.images))
    .on('error', function(err){
      throw new gutil.PluginError('images', err);
    })
    .on('end', done);
});

/**
 * build templates
 */
gulp.task('templates', function(done) {
  gulp.src(path.app.templates)
    .pipe(jade({
      pretty: !isUglify()
    }))
    .pipe(gulp.dest(path.public.root))
    .on('error', function(err){
      throw new gutil.PluginError('templates', err);
    })
    .on('end', done);
});


