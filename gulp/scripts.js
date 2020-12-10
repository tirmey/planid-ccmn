const gulp = require("gulp"),
			babel = require('gulp-babel'),
			//uglify = require('gulp-uglify-es').default,
			uglify = require('gulp-terser'),
			newer = require('gulp-newer'),
			rename = require("gulp-rename");

//scripts manipulation
gulp.task("minifyJs", () => {
	return gulp.src('./public/scripts/**/*.js')
		.pipe(newer({
			dest: "./public/dist/scripts/",
			ext: ".min.js"
		}))
		.pipe(newer({
			dest: "./public/dist/scripts/planidsVersions/",
			ext: ".min.js"
		}))
		/* habilitar o uglify para produção, comentar em desenvolvimento */
		//.pipe(uglify())
		.pipe(rename(function (path) {
			path.extname = ".min.js";
		}))
		.pipe(gulp.dest("./public/dist/scripts"));
});

