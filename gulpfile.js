const gulp = require('gulp');
const webpack = require('webpack-stream');
// const exec = require('gulp-exec');
const exec = require('child_process').exec;

const webpackConfig = require('./webpack.config.js');

const options = {
  dest: {
    chrome: 'chrome/app/player',
    firefox: 'webextensions/app/player',
    safari: 'safari.safariextension/app/player',
  },
};

function build(target, playerTarget) {
  const destPath = options.dest[target];

  gulp.src(playerTarget || 'node_modules/vlibras/src/target/**/*')
    .pipe(gulp.dest(destPath + '/target'));

  gulp.src('plugin/index.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(destPath));

  gulp.src(['index.html', 'assets/*'], { cwd: 'plugin', base: 'plugin' })
    .pipe(gulp.dest(destPath));
}

gulp.task('build:chrome', () => {
  build('chrome');
});

gulp.task('build:firefox', () => {
  build('firefox');
});

gulp.task('build:safari', () => {
  build('safari', 'plugin/targets/datacache-off/**/*');
});

gulp.task('build', ['build:chrome', 'build:firefox', 'build:safari']);
