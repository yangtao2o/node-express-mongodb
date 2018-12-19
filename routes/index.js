var express = require('express');
var router = express.Router();

// 新增 API，链接数据库
var api = require('./api.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My-Express' });
});

// 测试 API
router.get('/api/test', api.test);

router.post('/api/addtest', api.addtest);

module.exports = router;
