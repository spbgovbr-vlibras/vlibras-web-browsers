const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const webpack = require('webpack-stream');

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

  gulp.src(player)
    .pipe(gulp.dest(destPath + '/target'));

  gulp.src(script)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(destPath));

  gulp.src(template)
    .pipe(gulp.dest(destPath));

  gulp.src('assets/*', { cwd: 'plugin', base: 'plugin' })
    .pipe(gulp.dest(destPath));

  gulp.src('assets/*', { cwd: target, base: target })
    .pipe(gulp.dest(destPath));
}

gulp.task('build:webextensions', () => {
  build('webextensions');
});

gulp.task('build:widget', () => {
  build('widget', {
    script: 'widget/src/index.js',
    template: 'widget/src/index.html',
  });
});

gulp.task('build:safari', () => {
  build('safari', { player: 'plugin/targets/datacache-off/**/*' });
});

gulp.task('build', ['build:webextensions', 'build:safari', 'build:widget']);

gulp.task('run:widget', (done) => {
  nodemon({
    script: 'widget/server.js',
    ext: 'html js scss css',
    watch: ['plugin', 'widget/src', 'widget/assets'],
    tasks: ['build:widget'],
    done,
  });
});
