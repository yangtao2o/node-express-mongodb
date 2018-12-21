const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  let token = req.cookies.token
  let user = req.cookies.user
  let id = req.cookies.id
  console.log('---jwt---');
  if(token) {
    // 与加密时使用同样的方法对 token 进行加密
    jwt.verify(token, 'secret', function(err, decoded) {
      // token 正确则继续执行下一个方法，否则清空
      if(!err && decoded.user === user && decoded.id === id) {
        req.decoded = decoded
        next()
      } else {
        res.cookie('token', '', { maxAge: 0 })
        res.cookie('user', '', { maxAge: 0 })
        res.cookie('id', '', { maxAge: 0 })

        return res.json({
          'code': 401,
          'message': '登录失败'
        })
      }
    })
  } else {
    return res.json({
      'code': 401,
      'message': '登录失败'
    })
  }
}