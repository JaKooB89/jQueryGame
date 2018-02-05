const gulp = require('gulp')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')

gulp.task('styles', function () {
  const processors = [
    autoprefixer({browsers:['last 5 version']})
  ]
  return gulp.src('css/main.min.css')
  .pipe(postcss(processors))
  .pipe(gulp.dest('css'))
})

gulp.task('watch', function () {
  gulp.watch('css/main.min.css', ['styles'])
})
