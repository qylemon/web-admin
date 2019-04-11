var express = require('express');
var router = express.Router();
var db = require('./db.js');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function (req, res, next) {
  let username = { username: req.body.username };
  let password = req.body.password;
  db.findOne('user', username, (err, result) => {
    if (err) {
      res.status(200).json({
        "status": false,
        "msg": err,
        "data": []
      });
    }
    let tt = result.length;
    if (tt == 0) {
      // null user
      res.status(200).json({
        "status": false,
        "msg": "抱歉，系统中并无该用户，如有需要，请向管理员申请",
        "data": []
      });
    } else if (password != result[0].password) {
      res.status(200).json({
        "status": false,
        "msg": "密码不正确",
        "data": []
      });
    } else {
      req.session.username = req.body.username; //存session
      req.session.password = password;
      res.status(200).json({
        "status": true,
        "msg": "登录成功",
        "data": result.username
      });
    }
  });
});

router.post('/logout', function (req, res, next) {
  req.session.username = ""; //清空session
  req.session.password = "";
  res.status(200).json({
    "status": true,
    "msg": "登出成功",
    "data": []
  });
});

router.post('/selectAll', function (req, res, next) {
  var page = req.body.page;
  db.selectAll('user', page, (err, result, allCount, allPage) => {
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

router.post('/search',function(req,res,next){
  page = req.body.page;
  where = req.body.data;
  console.log(where);
  db.search('user', page, where, (err, result, allCount, allPage)=>{
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
  let username = req.body.username;
  let phone = req.body.phone;
  let password = req.body.password; 
  let saveData = {"username":username,"phone":phone,"password":password}
  db.insertData('user',saveData, (err,result)=>{
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
  let _set = {username:req.body.username,phone:req.body.phone,password:req.body.password}
  db.updateData('user', _set, _where, (err,result)=>{
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
  db.deleteData("user",_where,(err,result)=>{
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
