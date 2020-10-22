let project_folder = "build";
let source_folder = "#src";

let path = {
    build: {
        fonts: project_folder + "/fonts/",
        img: project_folder + "/img",
        html: project_folder + "/",
        js: project_folder + "/",
        php: project_folder + "/php/",
        css: project_folder + "/",
    },

    src: {
        fonts: source_folder + "/fonts/*.{ttf,eot,woff,woff2,svg}",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}", 
        jade: source_folder + "/*.jade",
        js: source_folder + "/js/script.js",
        php: source_folder + "/php/",
        sass: source_folder + "/sass/style.sass",
    },

    watch: {
        fonts: source_folder + "/fonts/*.{ttf,eot,woff,woff2,svg}",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        js: source_folder + "/js/**/*.js",
        php: source_folder + "/php/**/*.php",
        sass: source_folder + "/sass/**/*.sass",
        jade: source_folder + "/**/*.jade",
    },

    clean: "./" + project_folder + "/index.html"

}

let {src, dest} = require("gulp"),
    gulp  = require("gulp"),
    browsersync = require("browser-sync").create(),
    del = require("del"),
	fileInclude = require('gulp-file-include'),
    sass = require("gulp-sass"),
    jadeToHTML = require("gulp-jade"),
    rename = require("gulp-rename"),
    autoprefixer = require("gulp-autoprefixer"),
    groupMediaQueries = require('gulp-group-css-media-queries'),
    cssmin = require("gulp-cssnano"),
    uglify = require('gulp-uglify-es').default,
    imageMin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    webpHTML = require('gulp-webp-html'),
    webpCSS = require('gulp-webp-css');


function browserSync() {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false,
        logPrefix: "Frontend_akolol40",
        tunnel: true
    })
}

function clean() {
    return del(path.clean);
}

function watchFiles() {
    gulp.watch([path.watch.jade], jade);
    gulp.watch([path.watch.sass], sassCompiler);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
    gulp.watch([path.watch.fonts], fonts);
}

function jade() {
    return src(path.src.jade)
        .pipe(jadeToHTML())
        .pipe(
			rename({
			    extname: '.html'
			})
		)
        //.pipe(webpHTML())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function sassCompiler() {
    return src(path.src.sass)
        .pipe(
            sass({
                outputStyle: "compressed"
            })
        )
        .pipe(
			autoprefixer({
				overrideBrowserslist: ['last 5 versions'],
				cascade: true
			})
        )
        //.pipe(webpCSS())
        .pipe(groupMediaQueries())
        .pipe(cssmin())
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(fileInclude())
        .pipe(uglify())
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function images() {
    return src(path.src.img)
        // .pipe(
        //     webp({
        //         quality: 70
        //     })
        // )
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(
            imageMin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                interlaced: true,
                optimizationLevel: 3 // 0 to 7
            })
        ) 
        
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function fonts() {
	return src(path.src.fonts)
        .pipe(dest(path.build.fonts))
        .pipe(browsersync.stream())
}
let build = gulp.series(clean, gulp.parallel(jade, sassCompiler, js, images));
let watch = gulp.parallel(build, watchFiles, browserSync);


exports.images = images;
exports.js = js;
exports.sassCompiler = sassCompiler;
exports.jade = jade;
exports.build = build;
exports.watch = watch;
exports.default = watch;