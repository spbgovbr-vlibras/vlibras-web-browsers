const gulp = require('gulp');
const webpack = require('webpack-stream');

const webpackConfig = require('./webpack.config.js');

const options = {
  dest: {
    webextensions: 'webextensions/app/player',
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

gulp.task('build:webextensions', () => {
  build('webextensions');
});

gulp.task('build:safari', () => {
  build('safari');
});

gulp.task('build', ['build:webextensions', 'build:safari']);
