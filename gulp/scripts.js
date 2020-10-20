const gulp = require("gulp"),
			babel = require('gulp-babel'),
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
		/* o uglify (abaixo) minifica o código para produção. Sugiro mantê-lo comentado em desenvolvimento, para facilitar o debug da aplicação */
		//.pipe(uglify())
		.pipe(rename(function (path) {
			path.extname = ".min.js";
		}))
		.pipe(gulp.dest("./public/dist/scripts"));
});

