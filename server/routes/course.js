var express = require('express');
var router = express.Router();
var db = require('./db.js');

router.post('/selectAll', function (req, res, next) {
    var page = req.body.page;
    db.selectAll('course', page, (err, result, allCount, allPage) => {
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
  
  router.post('/insert', function(req,res,next){
    let courseName = req.body.courseName;
    let details = req.body.details;
    let status = req.body.status; 
    let saveData = {"courseName":courseName,"details":details,"status":status}
    db.insertData('course',saveData, (err,result)=>{
      if(err){
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
  
  router.post('/update', function(req,res,next){
    let _where = {"id":req.body.id};
    let _set = {"courseName":req.body.courseName,"details":req.body.details,"status":req.body.status}
    db.updateData('course', _set, _where, (err,result)=>{
      if(err){
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
  
  router.post('/delete',function(req,res,next){
    let _where = {id:req.body.id};
    db.deleteData("course",_where,(err,result)=>{
      if(err){
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
  
  module.exports = router;