const gulp = require("gulp"), 
browserSync = require('browser-sync'),
reload = browserSync.reload,
nodemon = require('gulp-nodemon');   


////////////////////////////////////      
////////// INITIALIZATION //////////      
//////////////////////////////////// 

gulp.task('nodemon', function (cb) {
    var called = false;
    return nodemon({
        script: 'app.js',
        ignore: [
            'gulpfile.js',
            'node_modules/'
        ]
    })
    .on('start', function () {
        if (!called) {
            called = true;
            cb();
        }
    })
    .on('restart', function () {
        setTimeout(function () {
            reload({ stream: false });
        }, 3000);
    });
});

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync({
        proxy: "localhost:3000",  // a porta local, definida no arquivo app.js
        port: 5000,  // nova porta, onde o browser-sync atuará, implementando o hot-reload quando há atualização de código
        notify: true
    });
});

gulp.task("default",['browser-sync'] , () => {
    gulp.start("watch");
    gulp.start("cssInject");
    gulp.watch(['./public/scripts/*.js'], reload);
    gulp.watch(['./views/**/*.hbs'], reload);
});