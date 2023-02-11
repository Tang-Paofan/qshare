const express = require("express");
const bodyParser = require("body-parser");
var path = require("path")
var multer  = require('multer');
var fs = require("fs");
const app = express();
const mysql = require('./config/db')

// CORS跨域
app.use((req, res, next) => {
//判断路径
  if(req.path !== '/' && !req.path.includes('.')){
    res.set({
      'Access-Control-Allow-Credentials': true, //允许后端发送cookie
      'Access-Control-Allow-Origin': req.headers.origin || '*', //任意域名都可以访问,或者基于我请求头里面的域
      'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type', //设置请求头格式和类型
      'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',//允许支持的请求方式
      'Content-Type': 'application/json; charset=utf-8' || 'multipart/form-data'//默认与允许的文本格式json和编码格式
    })
  }
  req.method === 'OPTIONS' ? res.status(204).end() : next()
})

// 数据库连接
global.conn = mysql.connect()

// 使用body-parser中间件
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// 设置静态目录 第一个参数为虚拟的文件前缀，实际上文件系统中不存在
// 可以用public做为前缀来加载static文件夹下的文件了
app.use('/public', express.static(path.join(__dirname, './static')));
 
// 发送请求
const userApi = require("./api/userApi")
const alipayApi = require("./api/alipayApi")
const shopApi = require("./api/shopApi")
const businessApi = require("./api/businessApi")
app.use("/api/user", userApi);
app.use("/api/alipay", alipayApi);
app.use("/api/shop", shopApi);
app.use("/api/business", businessApi);

app.listen(5000, () => console.log(`服务端已启动===> 5000`))