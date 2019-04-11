var express = require('express');
var router = express.Router();
var db = require('./db.js');

router.post('/selectAll', function (req, res, next) {
    var page = req.body.page;
    var sql= 'select s.id,s.name,s.age,s.gender,c.courseName from student s left join course c on s.courseId=c.id';
    db.joinTable('student', sql, page, (err, result, allCount, allPage) => {
        if (err) {
            res.status(200).json({
                "status": false,
                "msg": err,
                "data": []
            });
        }
        res.status(200).json({
            "status": true,
            "msg": "OK",
            "allCount": allCount,
            "allPage": allPage,
            "page": req.body.page,
            "data": result
        });
    });
});

router.post('/insert', function (req, res, next) {
    let name = req.body.name;
    let age = req.body.age;
    let gender = req.body.gender;
    let courseId = req.body.courseId;
    let saveData = { "name": name, "age": age, "gender": gender, "courseId":courseId }
    db.insertData('student', saveData, (err, result) => {
        if (err) {
            res.status(200).json({
                "status": false,
                "msg": err,
                "data": []
            });
        }
        res.status(200).json({
            "status": true,
            "msg": "OK",
            "data": "success"
        });
    });
});

router.post('/update', function (req, res, next) {
    let _where = { "id": req.body.id };
    let _set = { "name": req.body.name, "age": req.body.age, "gender": req.body.gender, "courseId":req.body.courseId }
    db.updateData('student', _set, _where, (err, result) => {
        if (err) {
            res.status(200).json({
                "status": false,
                "msg": err,
                "data": []
            });
        }
        res.status(200).json({
            "status": true,
            "msg": "OK",
            "data": "success"
        });
    });
});

router.post('/delete', function (req, res, next) {
    let _where = { id: req.body.id };
    db.deleteData("student", _where, (err, result) => {
        if (err) {
            res.status(200).json({
                "status": false,
                "msg": err,
                "data": []
            });
        }
        res.status(200).json({
            "status": true,
            "msg": "OK",
            "data": "success"
        });
    });
});

router.post('/searchCou', function(req, res, next) {
    var sql = 'select id,courseName from course';
    db.selectOther(sql, (err,result) =>{
        if (err) {
            res.status(200).json({
                "status": false,
                "msg": err,
                "data": []
            });
        }
        res.status(200).json({
            "status": true,
            "msg": "OK",
            "data": result
        });
    });
})

module.exports = router;