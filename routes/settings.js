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