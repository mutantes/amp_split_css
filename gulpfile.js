const gulp = require("gulp"),
  sass = require("gulp-sass"),
  concat = require("gulp-concat"),
  cleanCSS = require("gulp-clean-css"),
  size = require("gulp-size"),
  gulpif = require("gulp-if"),
  log = require("fancy-log"),
  col = require("ansi-colors"),
  watch = require("gulp-watch");

let build = (directory = "content") => {
  const fileSize = size();
  const maxSize = 500;

  return gulp
    .src(["./src/common/**/*.scss", `./src/${directory}/**/*.scss`])
    .pipe(concat(`${directory}.min.scss`))
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS())
    .pipe(fileSize)
    .pipe(gulp.dest("./dist/"))
    .on("end", () => {
      fileSize.size < maxSize
        ? log.info(
            col.black.bgGreen.bold(
              ` ${fileSize.prettySize} : Tamaño de archivo correcto ✔ `
            )
          )
        : log.warn(
            col.black.bold.bgYellow(
              ` ${fileSize.prettySize} : Archivo demasiado grande ✘ `
            )
          );
    });
};

gulp.task("content", () => build("content"));
gulp.task("cards", () => build("cards"));

gulp.task("watch", () => {
  gulp.watch(["src/cards/**/*.scss"], ["cards"]);
  gulp.watch(["src/content/**/*.scss"], ["content"]);
  gulp.watch(["src/common/**/*.scss"], ["cards", "content"]);
});
