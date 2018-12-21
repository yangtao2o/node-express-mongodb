const db = require('./db.js')
const jwt = require('jsonwebtoken')

exports.test = function (req, res, next) {
  db.find('mytest', { 'query': {} }, function(err, result) {
    if(err) {
      return res.json({
        'code': 404,
        'message': '数据查询失败',
        'result': []
      })
    }
    return res.json({
      'code': 200,
      'message': '数据获取成功',
      'result': result,
      'total': result.length
    })
  })
}

exports.addtest = function (req, res, next) {
  let newData = {
    'title': req.body.title,
    'content': req.body.content
  };

  // 插入数据库
  db.insertOne('mytest', newData, function(err, result) {
    if(err) {
      return res.json({
        'code': 401,
        'message': 'test新增失败'
      })
    }
    return res.json({
      'code': 200,
      'message': 'test新增成功'
    })
  })
}

exports.deletest = function(req, res, next) {
  let newData = {
    'title': req.body.title
  };
  // 删除
  db.deleteOne('mytest', newData, function(err, result) {
    console.log('mytest');
    if(err) {
      return res.json({
        'code': 401,
        'message': 'test删除失败'
      })
    }
    return res.json({
      'code': 200,
      'message': 'test删除成功'
    })
  })
}

// 登录
exports.login = function(req, res, next) {
  console.log('---login---',req.body.user,req.body.user);
  let user = req.body.user,
    pwd = md5(req.body.pwd);
  // 根据用户名查询数据库中是否含有该用户
  db.findOne('users', { 'user': user }, function(err, result) {
    console.log('---userssss---');
    if(err) {
      return res.json({
        'code': 500,
        'message': '服务器出错了'
      })
    }

    if(!result || result.length === 0) {
      return res.json({
        'code': 401,
        'message': '查无此人'
      })
    }

    let dbPassword = result.pwd
    let id = result._id
    let expires = 60 * 60 * 24 * 30

    // 根据查询到的 id、user 按照一定的加密方式生成 token
    // 并缓存在 cookie 中，后期当用户使用别的接口时，可以通过 req.cookie.token 获取 token
    // 再根据该用户的 id 和 user 利用同样的方法加密得到对应的 user 和 id
    // 将新旧数据对比即可知道该 token 是否为正确登录的 token

    if(dbPassword === pwd) {

      let token = jwt.sign({ id, user }, 'secret', { expiresIn: expires })

      res.cookie('token', token, { maxAge: expires })
      res.cookie('id', id, { maxAge: expires})
      res.cookie('user', user, { maxAge: expires })

      return res.json({
        'code': 200,
        'message': '登录成功'
      })
    } else {
      return res.json({
        'code': 401,
        'message': '密码错误'
      })
    }
  })

}