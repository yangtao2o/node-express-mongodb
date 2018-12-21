## 登录模块
### 初始化
安装 token 相关工具，用于登录验证：
```bash
npm install jsonwebtoken --save
```
[Node JWT/jsonwebtoken 使用与原理分析](https://www.jianshu.com/p/a7882080c541)

报错：
```
POST /api/login 500 25.733 ms - 1139
(node:26228) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
```

解决：根据提示，修改 `db.js`
```
// 连接数据库，没有则自动创建
function _connectDB(callback) {
  let url = settings.dbUrl
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) { })
}
```
虽然警告没有了，但依然报 500

在 `/routes/db.js` 中添加查找方法：
```javascript
// 查找单个数据
exports.findOne = function(collectionName, queryJson, callback) {
  _connectDB(function(err, client) {
    client.db(dbName).collection(collectionName).findOne(queryJson, function(err, results) {
      if(err) {
        callback(err, null)
        db.close()
        return
      }
      callback(err, results)
      db.close()
    })
  })
}
```
修改 `/routes/settings.js`
```javascript
let nickname = 'myproject1'
let md5 = require('./md5.js')
let user = 'test'
// 密码加密
let pwd = md5('test')

module.exports = {
  dbUrl: 'mongodb://localhost:27017/myproject1',
  nickname: nickname,
  user: user,
  pwd: pwd
}
```

新增 `/routes/md5.js`
```javascript
let crypto = require('crypto')

module.exports = function(content) {
  let md5 = crypto.createHash('md5')
  let newContent = md5.update(content).digest('base64')
  
  return newContent
}
```

在 `/routes/index.js` 中添加接口
```javascript
// 登录模块
router.post('/api/login', api.login);
```

在 `/routes/api.js` 中添加
```javascript
const jwt = require('jsonwebtoken')

// 登录
exports.login = function(req, res, next) {
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
```

新增 `/routes/verify-token.js` 进行验证
```javascript
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  let token = req.cookies.token
  let user = req.cookies.user
  let id = req.cookies.id
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
```

修改 `/routes/index.js`
```javascript
const verifyToken = require('./verify-token.js');
// 验证是否为正确的 token，再进行提交
router.route('/api/addtest').all(verifyToken).post(api.addtest);
```
此时，因为没有进行登录，所以提交test会失败，只需要在/views/index.ejs中加入以下代码：
```javascript
// login Status Test
$.post('/api/login', {
  user: 'test',
  pwd: 'test'
}, function(data) {
  console.log('---logon---', data)
})

```
刷新浏览器，报500（`POST /api/login 500 3.968 ms - 1139`），还在研究中...
