# 使用Node.js+Express+MongoDB 建站实例

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

`db.collection is not a function错误` 就是由于版本不同造成的，因为我下载了 3.0 版本，可从 [这里](http://mongodb.github.io/node-mongodb-native/3.0/api/) 对照解决


