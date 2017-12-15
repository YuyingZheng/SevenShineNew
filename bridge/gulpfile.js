var gulp = require('gulp'),
		merge = require('merge-stream'),
		newer = require('gulp-newer'),
		clean = require('gulp-clean'),
		rename = require("gulp-rename"),
		sequence = require('gulp-sequence'),
		sourcemaps = require('gulp-sourcemaps'),
		browserSync = require('browser-sync'),
		//html
		fileinclude = require('gulp-file-include'),
		htmlbeautify = require('gulp-html-beautify'),
		//css 
		bulkSass = require('gulp-sass-bulk-import'),
		sass = require('gulp-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		csscomb = require('gulp-csscomb'),
		gcmq = require('gulp-group-css-media-queries'),
		cssnano = require('gulp-cssnano'),
		//image
		imagemin = require('gulp-imagemin'),
		//icon
		svgstore = require('gulp-svgstore'),
		svgmin = require('gulp-svgmin'),
		path = require('path');


//========================================================================================================//
//                                            Html task
//========================================================================================================//

var PageHtmlSrc = '../src/*.shtml',
    PageHtmlDst = '../dist/pages/',
    BuildPageDst = '../dist/',
    IncHtmlSrc = '../src/includes/**/*.shtml',
    IncHtmlDst = '../dist/includes/';


gulp.task('html', function(callback) {
	sequence('copy-html', 'build-html')(callback)
});

gulp.task('copy-html', function() {
	var copyPageHtml = gulp.src(PageHtmlSrc)
		.pipe(newer(PageHtmlDst))
		.pipe(gulp.dest(PageHtmlDst));

	var copyIncHtml = gulp.src(IncHtmlSrc)
		.pipe(newer(IncHtmlDst))
		.pipe(gulp.dest(IncHtmlDst));

	return merge(copyPageHtml, copyIncHtml);
});

gulp.task('build-html', function() {
	return gulp.src(PageHtmlSrc)
		.pipe(fileinclude({
	    prefix: '@@',
	    basepath: '@file'
    }))
    .pipe(htmlbeautify())
    .pipe(rename({
			extname: ".html"
		}))
    .pipe(gulp.dest(BuildPageDst));
});


//========================================================================================================//
//                                            Css task
//========================================================================================================//

var CssSrc = '../src/sass/app.scss',
    CssDst = '../dist/css/',
    AppCssDstFile = '../dist/css/app.css';


//Use the 'gulp-sequence' instand of gulp default serial tasks ['css-comb', 'sass', 'css-minify'],
//To make sure one task finished then another task start. 
//The gulp default serial tasks ['css-comb', 'sass', 'css-minify'], the 3 tasks will not start in a queue.
//It just make sure all of the 3 tasks finished then start the 'css' task.

// *Note*
// The css-comb plugin will make @font-face{src: ulr...; src: url...,url...,url...,..;} the 2 kind of "src"
// in reverse order resulting in "@font-face" will be not working.
// So you had better write them in reverse order in the '_02_fonts.scss' file before, then the css-comb plugin 
// will make them in reverse order again. At last, we get the correct order.


gulp.task('css', function(callback) {
	sequence('sass', 'css-minify')(callback)
	//sequence('css-comb', 'sass', 'css-minify')(callback)
});

gulp.task('sass', function() {
	return gulp.src(CssSrc)
		.pipe(bulkSass())
		.pipe(sourcemaps.init())
		.pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
		.pipe(autoprefixer({
      browsers: ['last 2 versions', 'Android >= 4.0']
    }))
    .pipe(csscomb())
		.pipe(sourcemaps.write('./'))
  	.pipe(gulp.dest(CssDst));
});

gulp.task('css-minify', function() {
	return gulp.src(AppCssDstFile)
		.pipe(gcmq())
		.pipe(cssnano())
		.pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(CssDst));
});

//*Optional* There will be a problem ,the media query will not sort by the order.
//We use the bootstrap csscomb.json(in the root folder) instand of the plugin's default
//The gulp.src ['...','...'] will be put the files into a queue. So we needn't use the gulp-order plugin.
//
//var CombCssSrc = 
//{
//	['../src/sass/**/*.scss', '!../src/sass/app.scss'],
//	['!../src/sass/base/{_00_variables.scss,_01_mixins.scss,_02_fonts.scss}']
//}
//	  CombCssDst = '../src/sass/';
//
//gulp.task('css-comb', function() {
//	return gulp.src(CombCssSrc)
//		.pipe(csscomb())
//		.pipe(gulp.dest(CombCssDst));
//});


//========================================================================================================//
//                                            JS task
//========================================================================================================//

var JsSrc = '../src/js/**/*.js',
	  JsDst = '../dist/js/';


gulp.task('js', function() {
	return gulp.src(JsSrc)
		.pipe(newer(JsDst))
		.pipe(gulp.dest(JsDst));
});


//========================================================================================================//
//                                            Fonts task
//========================================================================================================//

var FontSrc = '../src/assets/fonts/*',
    FontDst = '../dist/assets/fonts/';


gulp.task('font', function() {
	return gulp.src(FontSrc)
		.pipe(newer(FontDst))
		.pipe(gulp.dest(FontDst));
});


//========================================================================================================//
//                                            Icons task
//========================================================================================================//

var IconSrc = '../src/assets/icons/*.svg',
	  IconDst = '../dist/assets/images/';


//We also need a js file named: svgxuse.min.js to support IE (9, 10, 11) to load the
//fetches external SVGs referenced in "<use>" elements.
//Add the code to the bottom of <body> , <script defer src="js/vendors/svgxuse.min.js"></script>

gulp.task('icon', function () {
  return gulp.src(IconSrc)
    .pipe(svgmin(function (file) {
    	var prefix = path.basename(file.relative, path.extname(file.relative));
        return {
          plugins: [{
            cleanupIDs: {
              prefix: prefix + '-',
              minify: true
            }
          }]
        }
    }))
    .pipe(rename({ prefix: 'icon-' }))
    .pipe(svgstore())
    .pipe(gulp.dest(IconDst));
});


//========================================================================================================//
//                                            Images task
//========================================================================================================//

var ImgSrc = '../src/assets/images/**/*.{png,jpg,gif,svg}',
    ImgDst = '../dist/assets/images/',
    UploadSrc = '../src/assets/uploads/**/*.{png,jpg,gif,svg}',
    UploadDst = '../dist/assets/uploads/';


gulp.task('image', function() {
	var copyImg = gulp.src(ImgSrc)
		.pipe(newer(ImgDst))
		.pipe(imagemin())
		.pipe(gulp.dest(ImgDst));

	var copyUpload = gulp.src(UploadSrc)
		.pipe(newer(UploadDst))
		.pipe(imagemin())
		.pipe(gulp.dest(UploadDst));

	return merge(copyImg, copyUpload);
});


//========================================================================================================//
//                                            Clean task
//========================================================================================================//

//You must list the folders,(you can't use this like ['../dist/'] or ['../dist/**/']; ) 
//Otherwise if you run the 'clean' task then sometimes there will be output an error warning.

var CleanFolder = ['../dist/{css,includes,js,pages,assets}/' ,'../dist/*.html'];


gulp.task('clean', function() {
	return gulp.src(CleanFolder, { read: false })
  	.pipe(clean({ force: true }));
});


//========================================================================================================//
//                                            Build task
//========================================================================================================//

gulp.task('build', function(callback) {
	sequence('html', 'css', 'js', 'font', 'icon', 'image')(callback)
});


//========================================================================================================//
//                                            Server task
//========================================================================================================//

var WatchHtmlFolders = ['../src/*.shtml', '../src/includes/**/*.shtml'],
    WatchCssFolders = '../src/sass/**/*.scss',
    WatchJsFolders = ['../src/js/*.js', '../src/js/vendors/*.js'],
    WatchFontFolders = '../src/assets/fonts/*',
	  WatchIconFolders = '../src/assets/icons/*.svg',
    WatchImageFolders = ['../src/assets/images/**/*.{png,jpg,gif,svg}', '../src/assets/uploads/**/*.{png,jpg,gif,svg}'],
	  serverFiles = '../dist/**/*.*';


gulp.task('server', function() {

	browserSync.init({  
    server: '../dist/',
    notify: false,
  }); 

  //watch html
	gulp.watch(WatchHtmlFolders, ['html']);

	//watch css 
	gulp.watch(WatchCssFolders, ['css']);

	//watch js 
	gulp.watch(WatchJsFolders, ['js']);

	//watch font
	gulp.watch(WatchFontFolders, ['font']);

	//watch icon
	gulp.watch(WatchIconFolders, ['icon']);

	//watch image
	gulp.watch(WatchImageFolders, ['image']);

	//watch dist folder 
	gulp.watch(serverFiles).on('change', browserSync.reload); 

});


//========================================================================================================//
//                                            Default task
//========================================================================================================//

//*Note*: If you add a new file to an empty folder (which is created before)
//then it will not make the 'watch' task working,
//You need to save the same type of file which is already created before then the 'watch' task will run.
//If you creat a new folder, please make sure it is already included into the (import or watch) path.

gulp.task('default', function(callback) {
	sequence('clean', 'build', 'server')(callback)
});