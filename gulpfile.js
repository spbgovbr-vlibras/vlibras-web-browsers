var gulp = require('gulp');
var webpack = require('webpack-stream');

var webpackConfig = require('./webpack.config.js');

var options = {
  dest: {
    chrome: 'chrome/app/player',
    firefox: 'firefox/data/player',
    safari: 'safari.safariextension/app/player'
  }
};

function build(target) {
  var destPath = options.dest[target];

  gulp.src('node_modules/vlibras/src/target/**/*')
    .pipe(gulp.dest(destPath + '/target'));

  gulp.src('plugin/index.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(destPath));

  gulp.src(['index.html', 'assets/*'], {cwd: 'plugin', base: 'plugin'})
    .pipe(gulp.dest(destPath));
}

gulp.task('build:chrome', function () {
  build('chrome');
});

gulp.task('build:firefox', function () {
  build('firefox');
});

gulp.task('build:safari', function () {
  build('safari');
});

gulp.task('build', ['build:chrome', 'build:firefox', 'build:safari']);
