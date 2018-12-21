var express = require('express');
var router = express.Router();

// 新增 API，链接数据库
var api = require('./api.js');

const verifyToken = require('./verify-token.js');


/* GET Home Page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My-Express' });
});

// 测试 API
router.get('/api/test', api.test);

// router.post('/api/addtest', api.addtest);

// 验证是否为正确的 token ，再进行提交
router.route('/api/addtest').all(verifyToken).post(api.addtest);

router.get('/api/deletest', api.deletest);

// 登录模块
router.post('/api/login', api.login);


module.exports = router;
