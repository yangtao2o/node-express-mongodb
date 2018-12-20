## Express初始化

文档：[Express应用程序生成器](http://www.expressjs.com.cn/starter/generator.html)
```bash
I:\learning-dev>npm install -g express
+ express@4.16.4
added 21 packages, removed 19 packages and updated 27 packages in 5.461s

# 安装 Express 应用程序生成器
I:\learning-dev>npm install -g express-generator

# 本目录下创建以 ejs 模板引擎为主，并添加 .gitignore
I:\learning-dev\node-express-mongodb>express -e --git

  warning: option `--ejs' has been renamed to `--view=ejs'

destination is not empty, continue? [y/N] y

   create : public\
   create : public\javascripts\
   create : public\images\
   create : public\stylesheets\
   create : public\stylesheets\style.css
   create : routes\
   create : routes\index.js
   create : routes\users.js
   create : views\
   create : views\error.ejs
   create : views\index.ejs
   create : .gitignore
   create : app.js
   create : package.json
   create : bin\
   create : bin\www

   install dependencies:
     > npm install

   run the app:
     > SET DEBUG=node-express-mongodb:* & npm start
```
然后安装所有依赖包：
```bash
npm install
```
启动运行：
```bash
# windows
set DEBUG=myapp:* & npm start

# MacOS / linux
DEBUG=myapp:* npm start

```
运行：http://localhost:3000/

另：开发环境中，不想每次改完代码都要重启服务器，可安装 [supervisor](https://www.npmjs.com/package/supervisor) 工具，实现代码修改和自启动
```bash
npm install supervisor -g

# express 4.x运行 supervisor bin/www就可以了（更早版本使用 supervisor app.js）
supervisor bin/www
```

## 实现 GET 和 POST 的 Ajax 请求
安装 [MongoDB](http://www.runoob.com/mongodb/mongodb-window-install.html) 模块

命令行下运行 MongoDB 服务器
```bash
# 创建数据目录，存放数据： e.g. D:\mongodb-data/db
# 在 bin 目录下运行： mongod --dbpath D:\mongodb-data/db
Administrator@ASUS-PC D:\Program Files\MongoDB\Server\4.0\bin
$ mongod --dbpath D:\mongodb-data/db

# 默认访问： http://localhost:27017/

# 连接成功提示如下：
# It looks like you are trying to access MongoDB over HTTP on the native driver port.
```

```bash
npm install mongodb --save
```
[Node.js的Mongodb使用](https://www.cnblogs.com/lovecc/p/6022623.html)

ps: 注意 mongodb 的版本，每个版本的配置有所不同，比如：

`db.collection is not a function错误` 就是由于 mongodb 版本不同造成的，我下载了 3.0 版本，可从 [这里](http://mongodb.github.io/node-mongodb-native/3.0/api/) 对照解决


#### 修改 `/routes/index.js`，新增接口
```javascript
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

router.get('/api/deletest', api.deletest);

module.exports = router;
```

#### 新增 `/routes/api.js`
PS: 删除虽然提示 200 ，但是数据库还存在，目前还未解决
```javascript
const db = require('./db.js')

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
```
#### 新增 `/routes/db.js` (封装了对数据库的增删查改的函数)
```javascript
const MongoClient = require('mongodb').MongoClient
const settings = require('./settings')
const dbName = settings.nickname

// 连接数据库，没有则自动创建
function _connectDB(callback) {
  let url = settings.dbUrl
  MongoClient.connect(url, function (err, client) {
    if(err) {
      callback(err, null);
      return
    }
    // 链接成功执行回调
    callback(err, client)
  })
}

// 插入数据
exports.insertOne = function(collectionName, json, callback) {
  _connectDB(function(err, client) {
    client.db(dbName).collection(collectionName).insertOne(json, function(err, results) {
      if(err) {
        callback(err, null);
        client.close()
        return
      }
      callback(err, results)
      client.close()
    })
  })
}

// 查找数据
exports.find = function (collectionName, queryJson, callback) {
  _connectDB(function(err, client) {
    let json = queryJson.query || {},
      limit = Number(queryJson.limit) || 0,
      count = Number(queryJson.page) - 1,
      sort = queryJson.sort || {}

    // 页数为 0 或 1 都显示前 limit 条数据
    if(count <= 0) {
      count = 0
    } else {
      count = count * limit
    }

    let cursor = client.db(dbName).collection(collectionName).find(json).limit(limit).skip(count).sort(sort)

    cursor.toArray(function(err, results) {
      if(err) {
        callback(err, null),
        client.close()
        return
      }
      callback(err, results)
      client.close()
    })
  })
}

// 删除数据
exports.deleteOne = function(collectionName, json, callback) {
  _connectDB(function(err, client) {
    client.db(dbName).collection(collectionName).deleteOne(json, function(err, results) {
      if(err) {
        callback(err, null)
        client.close()
        return
      }
      callback(err, results)
      client.close()
    })
  })
}
exports.deleteMany = function(collectionName, json, callback) {
  _connectDB(function(err, client) {
    client.db(dbName).collection(collectionName).deleteMany(json, function(err, results) {
      if(err) {
        callback(err, null)
        client.close()
        return
      }
      callback(err, results)
      client.close()
    })
  })
}

// 修改数据
exports.updateMany = function(collectionName, jsonOld, jsonNew, callback) {
  _connectDB(function(err, client) {
    client.db(dbName).collection(collectionName).updateMany(
      jsonOld, {
        $set: jsonNew,
        $currentDate: { 'lastModified': false }
      },
      function(err, results) {
        if(err) {
          callback(err, null)
          client.close()
          return
        }
        callback(err, results)
        db.close()
      }
    )
  })
}

```
#### 新增 `/routes/settings.js` (MongoDB 数据库相关配置)
```javascript
let nickname = 'myproject1'
module.exports = {
  dbUrl: 'mongodb://localhost:27017/myproject1',
  nickname: nickname
}
```
#### 修改 `/views/index.ejs`
```html
<!DOCTYPE html>
<html>
  <head>
    <title><%= title %></title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
    <script src="https://cdn.bootcss.com/jquery/3.0.0/jquery.min.js"></script>
  </head>
  <body>
    <h1><%= title %></h1>
    <p>Welcome to <%= title %></p>

    <div class="post">
      <input type="text" class="title" placeholder="请输入标题">
      <input type="text" class="content" placeholder="请输入内容">
      <button id="submitBtn">提交</button>
    </div>

    <div id="dataList"></div>

    <script>
      $(function() {
        getList();

        $('#submitBtn').click(function() {
          var $title = $('.title').val(), 
            $content = $('.content').val();
          if(!$title) {
            alert('请填写标题');
            return false;
          }
          if(!$content) {
            alert('请填写内容');
            return false;
          }

          $.post('/api/addtest', {
            title: $title,
            content: $content
          }, function(data) {
            console.log('------addtest', data);
            if(data.code === 200) {
              alert('提交成功');
              getList();
            } else {
              alert('提交失败');
            }
          });
        })

      })
      function getList() {
        $.get('/api/test', {}, function(data) {
          console.log('---data', data)
          if(data.code === 200) {
            var html = '', list = data.result;
            for(var i = 0; i < list.length; i++) {
              html += '<div class="item" data-id="' + list[i]._id + '"><div>这是第' + (i+1) + '条数据：标题为 <span class="title">' + list[i].title + '</span>，内容为 <span class="content">' + list[i].content + '</span></div><button class="dele">删除</button><button class="change">修改</button><hr></div>'
            }
            $('#dataList').empty().append(html);
            deleList();
          }
        })
      }

      function deleList() {
        $('#dataList').find('.dele').click(function() {
          var title = $(this).parents('.item').find('.title').text();
          console.log('title', title);
          $.get('/api/deletest', {
            title: title
          }, function(data) {
            console.log('---Delete---', data);
            if(data.code === 200) {
              $(this).parents('.item').remove();
              alert('删除成功');
            }
          })
        })
      }
    </script>
  </body>
</html>
```