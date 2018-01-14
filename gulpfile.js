/*
*
*			

            v2.0:  now has postCSS!
                -autoprefixer
                -variables
                -nesting

            v2.1:  -cssInject
                    -inline comment stripper

            v2.2: -mixins for easy media queries!

            v3.0  -build tasks added 
                  1)create dist folder in root
                  2) add the below snippets to index.html
                  3) run "gulp build"
                  4) run "gulp previewDist" to view dist version of site!

                  -must use these in index.html to let usemin know what to work on

                  <!-- build:css /assets/styles/styles.css -->
	                <link rel="stylesheet" href="./temp/styles/styles.css">
                  <!-- endbuild -->

                  and

                  <!-- build:js /assets/scripts/app.js -->
                  <script src="./assets/scripts/app.js"></script>
                  <!-- endbuild -->
                
*
*/

var gulp = require("gulp");
var watch = require("gulp-watch");
var browserSync = require("browser-sync").create();
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssvars = require("postcss-simple-vars");
var nested = require("postcss-nested");
var postCSS_InlineComment = require("postcss-inline-comment");
var mixins = require("postcss-mixins");
var imagemin = require("gulp-imagemin");
var del = require("del");
var usemin = require("gulp-usemin");
var rev = require("gulp-rev");
var cssnano = require("gulp-cssnano");
var uglify = require("gulp-uglify");

gulp.task("styles", function() {
  return gulp
    .src("./app/assets/styles/styles.css")
    .pipe(
      postcss([postCSS_InlineComment, mixins, cssvars, nested, autoprefixer])
    )
    .on("error", function(errorInfo) {
      console.log(errorInfo.toString());
      this.emit("end");
    })
    .pipe(gulp.dest("./app/temp/styles"));
});

gulp.task("shlide-styles", function() {
  return gulp
    .src("./app/assets/styles/shlide.css")
    .pipe(
      postcss([postCSS_InlineComment, mixins, cssvars, nested, autoprefixer])
    )
    .on("error", function(errorInfo) {
      console.log(errorInfo.toString());
      this.emit("end");
    })
    .pipe(gulp.dest("./app/temp/styles"));
});

//this uses the gulp-watch plugin - *****baseDir should point to where index.html lives!!!
gulp.task("watch", function() {
  browserSync.init({
    server: {
      baseDir: "./app"
    }
  });

  watch("./app/*", function() {
    browserSync.reload();
  });

  watch("./app/assets/scripts/*", function() {
    browserSync.reload();
  });

  watch("./app/assets/styles/**/*.css", function() {
    gulp.start("styles");
    browserSync.reload();
  });

  watch("./app/assets/styles/**/shlide.css", function() {
    gulp.start("shlide-styles");
    browserSync.reload();
  });

});

/*
  BUILD TASKS

  *VERY IMPORTANT*  The task "copyGeneralFiles" may need to be adjusted
  based on folder structure!  This task will copy all of the other items needed
  besides the things being compressed/minified (images, css, and main js file)
*/

gulp.task("copyGeneralFiles", ["deleteDistFolder"], function() {
  var pathsToCopy = [
    "./app/**/*",
    "!./app/index.html",
    "!./app/assets/images/**",
    "!./app/assets/styles/**",
    "!./app/assets/scripts/app.js",
    "!./app/temp",
    "!./app/temp/**"
  ];

  return gulp.src(pathsToCopy).pipe(gulp.dest("./dist"));
});

gulp.task("optimizeImages", ["deleteDistFolder"], function() {
  return gulp
    .src(["./app/assets/images/**/*"])
    .pipe(
      imagemin({
        progressive: true,
        interlaced: true,
        multipass: true
      })
    )
    .pipe(gulp.dest("./dist/assets/images"));
});

gulp.task("deleteDistFolder", function() {
  return del("./dist");
});

//usemin compresses css/js and does revision (cache buster)
gulp.task("usemin", ["deleteDistFolder", "styles"], function() {
  return gulp
    .src("./app/index.html")
    .pipe(
      usemin({
        css: [
          function() {
            return rev();
          },
          function() {
            return cssnano();
          }
        ],
        js: [
          function() {
            return rev();
          },
          function() {
            return uglify();
          }
        ]
      })
    )
    .pipe(gulp.dest("./dist"));
});

gulp.task("build", [
  "deleteDistFolder",
  "copyGeneralFiles",
  "optimizeImages",
  "usemin"
]);

gulp.task("previewDist", function() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
});
