const gulp = require('gulp');
const webpack = require('webpack-stream');
// const exec = require('gulp-exec');
const exec = require('child_process').exec;

const webpackConfig = require('./webpack.config.js');

const options = {
  dest: {
    chrome: 'chrome/app/player',
    firefox: 'firefox/data/player',
    safari: 'safari.safariextension/app/player'
  }
};


// BUILD

function build(target, player_target) {
  const destPath = options.dest[target];

  gulp.src(player_target || 'node_modules/vlibras/src/target/**/*')
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
  build('safari', 'plugin/targets/datacache-off/**/*');
});

gulp.task('build', ['build:chrome', 'build:firefox', 'build:safari']);


// GEN

gulp.task('gen:firefox', function () {
  exec('cd firefox & jpm xpi', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    console.log(err);
  });
});

gulp.task('gen', ['gen:firefox']);