const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const webpack = require('webpack-stream');
const mergeStream = require('merge-stream');
const webpackConfig = require('./webpack.config.js');

const options = {
  dest: {
    webextensions: 'webextensions/app/player',
    safari: 'safari.safariextension/app/player',
    widget: 'widget/app',
  },
};

function build(target, {
  player = 'node_modules/vlibras/src/target/**/*',
  script = 'plugin/index.js',
  template = 'plugin/index.html',
} = {}) {
  const destPath = options.dest[target];

  const webpackCfg = target === 'widget' ? webpackConfig.widgetWebpackConfig : webpackConfig.pluginWebpackConfig;

  const playerSrc = gulp.src(player).pipe(gulp.dest(`${destPath}/target`));
  const scriptSrc = gulp.src(script).pipe(webpack(webpackCfg))
    .pipe(gulp.dest(destPath));
  const templateSrc = gulp.src(template).pipe(gulp.dest(destPath));
  const assetsPluginSrc = gulp.src('assets/*', { cwd: 'plugin', base: 'plugin' })
    .pipe(gulp.dest(destPath));
  const assetsTargetSrc = gulp.src('assets/*', { cwd: target, base: target })
    .pipe(gulp.dest(destPath));

  return mergeStream(
    playerSrc,
    scriptSrc,
    templateSrc,
    assetsPluginSrc,
    assetsTargetSrc,
  );
}

gulp.task('build:webextensions', () => build('webextensions'));

gulp.task('build:widget', () => build('widget', {
  script: 'widget/src/index.js',
  template: 'widget/src/index.html',
}));

gulp.task('build:safari', () => build('safari'));

gulp.task('build', gulp.series('build:webextensions', 'build:safari', 'build:widget'));

gulp.task('run:widget', (done) => nodemon({
  script: 'widget/server.js',
  ext: 'html js scss css',
  watch: ['plugin', 'widget/src', 'widget/assets'],
  tasks: ['build:widget'],
  done,
}));
