/**
 * Created by Administrator on 2017/4/6.
 */
//gulp的任务帮我们完成机械化、重复性的工作
'use strict'
//此处代码都是由node执行
//载入gulp模块
var gulp = require('gulp');
var less = require('gulp-less');
var cssnano = require('gulp-cssnano');

//注册一个任务
gulp.task('copy',function(){
    gulp.src('src/index.html')
        .pipe(gulp.dest('dist/'))  //将此处需要的操作传递进去
});

gulp.task('dist',function(){
    gulp.watch('src/index.html',['copy']); //监视这个文件，有修改立马复制过去
    gulp.watch('src/styles/*.less',['style']); //监视这个文件，有修改立马复制过去
});

//css合并 压缩
gulp.task('style',function(){
    gulp.src(['src/styles/*.less','!src/styles/_*.less'])  //!用来排除
        .pipe(less())      //less文件转成css
        .pipe(cssnano())       //压缩css文件
        .pipe(gulp.dest('dist/css/'))
        .pipe(browserSync.reload({
            stream:true
        }));  //通知浏览器刷新
});

//js合并 压缩混淆
var concat = require('gulp-concat');  //文件合并
var uglify = require('gulp-uglify');  //压缩混淆
gulp.task('script',function(){
    gulp.src('src/scripts/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(browserSync.reload({
            stream:true
        }));  //通知浏览器刷新
});

//图片复制
gulp.task('image',function(){
    gulp.src('src/images/*.*')
        .pipe(gulp.dest('dist/images/'))
        .pipe(browserSync.reload({
            stream:true
        }));  //通知浏览器刷新
})

//html压缩
var htmlmin = require('gulp-htmlmin');
gulp.task('html',function(){
    gulp.src('src/*.html')
        .pipe(htmlmin({
            collapseWhitespace:true,
            removeComments:true
        }))  //collapseWhitespace去掉空白 removeComments去掉注释
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload(
            {
                stream:true
            }
        ));  //通知浏览器刷新
})
var browserSync = require('browser-Sync');
//var browserSync = require('browser-Sync').create();
//static server
gulp.task('serve',function(){
    browserSync({
        server:{
            baseDir:['dist']
        },
    },function(err,bs){
        console.log(bs.options.getIn(["urls","local"]))
    })
    /*browserSync.init({
        server:{
            baseDir:"./"
        }
    })*/
    //所有*.less文件发生变化则执行'style'

    gulp.watch('src/styles/*.less',['style']);
    gulp.watch('src/scripts/*.js',['script']);
    gulp.watch('src/images/*.*',['image']);
    gulp.watch('src/*.html',['html']);
})

