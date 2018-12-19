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