"use strict";
let gulp = require("gulp");
let gutil = require("gulp-util");
let gulpif = require("gulp-if");
let cssmin = require("gulp-cssmin");
let sass = require("gulp-sass");
let concat = require("gulp-concat");
let plumber = require("gulp-plumber");
let buffer = require("vinyl-buffer");
let source = require("vinyl-source-stream");
let babelify = require("babelify");
let browserify = require("browserify");
let resolutions = require("browserify-resolutions");
let watchify = require("watchify");
let uglify = require("gulp-uglify");
let sourcemaps = require("gulp-sourcemaps");

let production = process.env.NODE_ENV === "production";

let dependencies = [
  "react",
  "react-dom",
  "d3",
  "socket.io",
  "react-faux-dom"
];

// Copy index.html and favicon.ico to dist
gulp.task("copy-base", function() {
    return gulp.src(["src/client/index.html", "src/client/favicon.ico"])
    .pipe(gulp.dest("dist/public"));
});

gulp.task("watch-base", function() {
  gulp.watch("src/client/index.html", ["copy-base"]);
});

// Bundle server and place in dist directory
gulp.task("server-dist", function() {
    return gulp.src ("src/server/*.js")
    .pipe (gulp.dest("dist"));
});

gulp.task("watch-server", function() {
  gulp.watch("src/server/*.js", ["server-dist"]);
});

// Combine all JS libraries into a single file for fewer HTTP requests.
gulp.task("vendor", function() {
  return gulp.src([
  ]).pipe(concat("vendor.js"))
    .pipe(gulpif(production, uglify({ mangle: false })))
    .pipe(gulp.dest("dist/public/js"));
});

// Compile third-party dependencies separately for faster performance.
gulp.task("browserify-vendor", function() {
  return browserify()
    .require(dependencies)
    .plugin(resolutions, "*")
    .bundle()
    .pipe(source("vendor.bundle.js"))
    .pipe(buffer())
    .pipe(gulpif(production, uglify({ mangle: false })))
    .pipe(gulp.dest("dist/public/js"));
});

// Compile only project files, excluding all third-party dependencies.
gulp.task("browserify", ["browserify-vendor"], function() {
  return browserify({ entries: "src/client/components/App.jsx", debug: true })
    .external(dependencies)
    .plugin(resolutions, "*")
    .transform(babelify, { presets: ["es2015", "react"] })
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(gulpif(production, uglify({ mangle: false })))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/public/js"));
});

// Same as browserify task, but will also watch for changes and re-compile.
gulp.task("browserify-watch", ["browserify-vendor"], function() {
  let bundler = watchify(browserify({ entries: "src/client/components/App.jsx", debug: true }, watchify.args));
  bundler.external(dependencies);
  bundler.transform(babelify, { presets: ["es2015", "react"] });
  bundler.on("update", rebundle);
  return rebundle();

  function rebundle() {
    let start = Date.now();
    return bundler.bundle()
      .on("error", function(err) {
        gutil.log(gutil.colors.red(err.toString()));
      })
      .on("end", function() {
        gutil.log(gutil.colors.green("Finished rebundling in", (Date.now() - start) + "ms."));
      })
      .pipe(source("bundle.js"))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("dist/public/js/"));
  }
});

// Compile Sass stylesheets.
gulp.task("styles", function() {
  return gulp.src("src/client/css/main.sass")
    .pipe(plumber())
    .pipe(sass())
    //.pipe(autoprefixer())
    .pipe(gulpif(production, cssmin()))
    .pipe(gulp.dest("dist/public/css"));
});

gulp.task("watch-sass", function() {
  gulp.watch("src/client/css/main.sass", ["styles"]);
});

gulp.task("default", ["copy-base", "server-dist", "styles", "vendor",
  "watch-base", "watch-server", "browserify-watch", "watch-sass"]);
gulp.task("build", ["copy-base", "server-dist", "styles", "vendor", "browserify"]);
