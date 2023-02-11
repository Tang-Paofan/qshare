const mysql = require("mysql");

const mysqlConf  = {
  // port: 5000, // express 服务启动端口
  // /* 数据库相关配置 */
  // conn: {
  //   host: '121.5.23.249', // 主机名
  //   port: 3306,        // MySQL 默认端口为 3306
  //   user: 'root',          // 使用 root 用户登入 MySQL
  //   password: 'Zzl508626', // MySQL 密码，用你自己的
  //   database: 'qshare', // 使用数据库
  //   dateStrings: true
  // }
  host: '121.5.23.249', // 主机名
    port: 3306,        // MySQL 默认端口为 3306
    user: 'root',          // 使用 root 用户登入 MySQL
    password: 'Zzl508626', // MySQL 密码，用你自己的
    database: 'qshare', // 使用数据库
    dateStrings: true
}

// 用于保存数据连接实例
let conn = null;
let pingInterval;

// 如果数据连接出错，则重新连接
function handleError(err) {
    logger.info(err.stack || err);
    connect();
}

// 建立数据库连接
function connect() {
    if (conn !== null) {
        conn.destroy();
        conn = null;
    }

    conn = mysql.createConnection(mysqlConf);
    conn.connect(function (err) {
        if (err) {
            logger.info("error when connecting to conn,reConnecting after 2 seconds:", err);
            setTimeout(connect, 2000);
        }
    });
    conn.on("error", handleError);

    // 每两个小时ping一次数据库，保持数据库连接状态
    clearInterval(pingInterval);
    pingInterval = setInterval(() => {
        console.log('ping...');
        conn.ping((err) => {
            if (err) {
                console.log('ping error: ' + JSON.stringify(err));
            }
        });
    }, 7200000);
    return conn
}

module.exports = {
  connect
}